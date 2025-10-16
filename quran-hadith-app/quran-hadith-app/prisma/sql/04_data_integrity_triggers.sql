-- ============================================================================
-- DATABASE TRIGGERS FOR DATA INTEGRITY
-- ============================================================================
-- Automatic updates and validations to maintain data consistency

-- ============================================================================
-- 1. AUTO-UPDATE HADITH BOOK COUNTS
-- ============================================================================

-- Function to update total_hadiths count in hadith_books
CREATE OR REPLACE FUNCTION update_hadith_book_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for the affected book
  IF TG_OP = 'DELETE' THEN
    UPDATE hadith_books
    SET total_hadiths = (
      SELECT COUNT(*) FROM hadiths WHERE book_id = OLD.book_id
    )
    WHERE id = OLD.book_id;
    RETURN OLD;
  ELSE
    UPDATE hadith_books
    SET total_hadiths = (
      SELECT COUNT(*) FROM hadiths WHERE book_id = NEW.book_id
    )
    WHERE id = NEW.book_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for hadith inserts, updates, and deletes
DROP TRIGGER IF EXISTS hadith_count_trigger ON hadiths;
CREATE TRIGGER hadith_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON hadiths
  FOR EACH ROW
  EXECUTE FUNCTION update_hadith_book_count();

-- ============================================================================
-- 2. AUTO-UPDATE SURAH AYAH COUNTS
-- ============================================================================

-- Function to update number_of_ayahs count in surahs
CREATE OR REPLACE FUNCTION update_surah_ayah_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE surahs
    SET number_of_ayahs = (
      SELECT COUNT(*) FROM ayahs WHERE surah_id = OLD.surah_id
    )
    WHERE id = OLD.surah_id;
    RETURN OLD;
  ELSE
    UPDATE surahs
    SET number_of_ayahs = (
      SELECT COUNT(*) FROM ayahs WHERE surah_id = NEW.surah_id
    )
    WHERE id = NEW.surah_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (optional, as Quran data is static)
DROP TRIGGER IF EXISTS ayah_count_trigger ON ayahs;
CREATE TRIGGER ayah_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ayahs
  FOR EACH ROW
  EXECUTE FUNCTION update_surah_ayah_count();

-- ============================================================================
-- 3. AUTO-UPDATE TIMESTAMPS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables that have updated_at column
-- (Note: Prisma already handles this, but this is a backup)

-- Example for custom tables:
-- CREATE TRIGGER update_custom_table_updated_at
--   BEFORE UPDATE ON custom_table
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. VALIDATE AYAH NUMBER RANGES
-- ============================================================================

-- Function to validate ayah numbers are within valid range
CREATE OR REPLACE FUNCTION validate_ayah_number()
RETURNS TRIGGER AS $$
DECLARE
  surah_ayah_count INT;
BEGIN
  -- Get the number of ayahs for this surah
  SELECT number_of_ayahs INTO surah_ayah_count
  FROM surahs
  WHERE id = NEW.surah_id;

  -- Validate ayah number
  IF NEW.ayah_number < 1 OR NEW.ayah_number > surah_ayah_count THEN
    RAISE EXCEPTION 'Invalid ayah number % for surah %. Valid range: 1-%',
      NEW.ayah_number, NEW.surah_id, surah_ayah_count;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ayah validation
DROP TRIGGER IF EXISTS validate_ayah_number_trigger ON ayahs;
CREATE TRIGGER validate_ayah_number_trigger
  BEFORE INSERT OR UPDATE ON ayahs
  FOR EACH ROW
  EXECUTE FUNCTION validate_ayah_number();

-- ============================================================================
-- 5. AUTO-UPDATE MEMORIZATION GOAL STATUS
-- ============================================================================

-- Function to automatically update memorization goal status
CREATE OR REPLACE FUNCTION update_memorization_goal_status()
RETURNS TRIGGER AS $$
DECLARE
  goal_end_ayah_id INT;
  last_session_ayah_id INT;
BEGIN
  -- Get the end ayah of the goal
  SELECT end_ayah_id INTO goal_end_ayah_id
  FROM memorization_goals
  WHERE id = NEW.goal_id;

  -- Get the latest memorized ayah in this goal
  SELECT MAX(ayah_id) INTO last_session_ayah_id
  FROM memorization_sessions
  WHERE goal_id = NEW.goal_id
    AND confidence >= 4; -- High confidence threshold

  -- If reached the goal, mark as completed
  IF last_session_ayah_id >= goal_end_ayah_id THEN
    UPDATE memorization_goals
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = NEW.goal_id
      AND status = 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for memorization sessions
DROP TRIGGER IF EXISTS check_goal_completion_trigger ON memorization_sessions;
CREATE TRIGGER check_goal_completion_trigger
  AFTER INSERT OR UPDATE ON memorization_sessions
  FOR EACH ROW
  WHEN (NEW.goal_id IS NOT NULL)
  EXECUTE FUNCTION update_memorization_goal_status();

-- ============================================================================
-- 6. AUTO-UPDATE VOCABULARY MASTERY
-- ============================================================================

-- Function to update vocabulary mastery based on review performance
CREATE OR REPLACE FUNCTION update_vocabulary_mastery()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple mastery calculation: increment by 10 on each review
  -- Cap at 100
  NEW.mastery := LEAST(NEW.mastery + 10, 100);
  NEW.review_count := NEW.review_count + 1;
  NEW.last_reviewed := NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This is a simplified version. In practice, you'd use a more
-- sophisticated algorithm like spaced repetition (SuperMemo, Anki, etc.)

-- ============================================================================
-- 7. PREVENT DUPLICATE BOOKMARKS
-- ============================================================================

-- Function to prevent duplicate bookmarks (backup to unique constraint)
CREATE OR REPLACE FUNCTION prevent_duplicate_bookmarks()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookmarks
    WHERE user_id = NEW.user_id
      AND ayah_id = NEW.ayah_id
      AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Bookmark already exists for this ayah and user';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (optional, as unique constraint handles this)
-- DROP TRIGGER IF EXISTS prevent_duplicate_bookmarks_trigger ON bookmarks;
-- CREATE TRIGGER prevent_duplicate_bookmarks_trigger
--   BEFORE INSERT OR UPDATE ON bookmarks
--   FOR EACH ROW
--   EXECUTE FUNCTION prevent_duplicate_bookmarks();

-- ============================================================================
-- 8. AUTO-UPDATE LEARNING PROGRESS
-- ============================================================================

-- Function to automatically update daily learning progress
CREATE OR REPLACE FUNCTION update_daily_learning_progress()
RETURNS TRIGGER AS $$
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  -- Insert or update today's learning progress
  INSERT INTO learning_progress (user_id, date, ayahs_memorized)
  VALUES (NEW.user_id, today, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    ayahs_memorized = learning_progress.ayahs_memorized + 1,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for memorization sessions
DROP TRIGGER IF EXISTS update_learning_progress_trigger ON memorization_sessions;
CREATE TRIGGER update_learning_progress_trigger
  AFTER INSERT ON memorization_sessions
  FOR EACH ROW
  WHEN (NEW.confidence >= 4) -- Only count high-confidence sessions
  EXECUTE FUNCTION update_daily_learning_progress();

-- ============================================================================
-- 9. VALIDATE MEMORIZATION REVIEW DATES
-- ============================================================================

-- Function to validate review scheduling
CREATE OR REPLACE FUNCTION validate_review_dates()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure next_review_date is in the future
  IF NEW.next_review_date < NEW.review_date THEN
    RAISE EXCEPTION 'next_review_date must be after review_date';
  END IF;

  -- Validate ease_factor range (SuperMemo algorithm: 1.3 - 2.5)
  IF NEW.ease_factor < 1.3 OR NEW.ease_factor > 2.5 THEN
    RAISE EXCEPTION 'ease_factor must be between 1.3 and 2.5';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for memorization reviews
DROP TRIGGER IF EXISTS validate_review_dates_trigger ON memorization_reviews;
CREATE TRIGGER validate_review_dates_trigger
  BEFORE INSERT OR UPDATE ON memorization_reviews
  FOR EACH ROW
  EXECUTE FUNCTION validate_review_dates();

-- ============================================================================
-- 10. CASCADE CLEANUP FOR ORPHANED RECORDS
-- ============================================================================

-- Function to clean up orphaned reading history entries
CREATE OR REPLACE FUNCTION cleanup_orphaned_reading_history()
RETURNS void AS $$
BEGIN
  -- Delete reading history entries with no valid references
  DELETE FROM reading_history
  WHERE surah_id IS NULL
    AND ayah_id IS NULL
    AND hadith_id IS NULL;

  RAISE NOTICE 'Orphaned reading history entries cleaned up';
END;
$$ LANGUAGE plpgsql;

-- Run this periodically via cron job or maintenance window

-- ============================================================================
-- USAGE NOTES
-- ============================================================================

-- To temporarily disable a trigger:
-- ALTER TABLE table_name DISABLE TRIGGER trigger_name;

-- To re-enable:
-- ALTER TABLE table_name ENABLE TRIGGER trigger_name;

-- To disable all triggers on a table (use with caution):
-- ALTER TABLE table_name DISABLE TRIGGER ALL;

-- To view all triggers:
-- SELECT * FROM pg_trigger WHERE tgrelid = 'table_name'::regclass;

-- To drop a trigger:
-- DROP TRIGGER IF EXISTS trigger_name ON table_name;

-- ============================================================================
-- PERFORMANCE CONSIDERATIONS
-- ============================================================================

-- Triggers add overhead to INSERT/UPDATE/DELETE operations
-- Keep trigger functions lightweight and fast
-- Avoid expensive operations in triggers (complex queries, external calls)
-- Use AFTER triggers for logging/auditing
-- Use BEFORE triggers for validation/modification
-- Consider batching trigger operations for bulk imports
