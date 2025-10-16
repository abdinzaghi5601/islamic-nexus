-- ============================================================================
-- PARTIAL INDEXES FOR FILTERED QUERIES
-- ============================================================================
-- Partial indexes are smaller and faster for queries with WHERE clauses
-- They index only rows that match specific conditions

-- ============================================================================
-- 1. MEMORIZATION GOALS - Active Goals Only
-- ============================================================================

-- Index for active memorization goals (most commonly queried)
CREATE INDEX IF NOT EXISTS idx_active_memorization_goals
  ON memorization_goals(user_id, status, target_date)
  WHERE status = 'active';

-- Index for completed goals (for statistics)
CREATE INDEX IF NOT EXISTS idx_completed_memorization_goals
  ON memorization_goals(user_id, updated_at)
  WHERE status = 'completed';

-- ============================================================================
-- 2. BOOKMARKS - Bookmarks with Notes
-- ============================================================================

-- Index for bookmarks that have notes (for "notes view")
CREATE INDEX IF NOT EXISTS idx_bookmarks_with_notes
  ON bookmarks(user_id, created_at DESC)
  WHERE note IS NOT NULL;

-- Index for hadith bookmarks with notes
CREATE INDEX IF NOT EXISTS idx_hadith_bookmarks_with_notes
  ON hadith_bookmarks(user_id, created_at DESC)
  WHERE note IS NOT NULL;

-- ============================================================================
-- 3. HADITHS - By Authenticity Grade
-- ============================================================================

-- Index for Sahih (authentic) hadiths - most commonly searched
CREATE INDEX IF NOT EXISTS idx_sahih_hadiths
  ON hadiths(book_id, chapter_id)
  WHERE grade = 'Sahih';

-- Index for Hasan (good) hadiths
CREATE INDEX IF NOT EXISTS idx_hasan_hadiths
  ON hadiths(book_id, chapter_id)
  WHERE grade = 'Hasan';

-- Index for weak hadiths (for research/academic purposes)
CREATE INDEX IF NOT EXISTS idx_weak_hadiths
  ON hadiths(book_id, chapter_id)
  WHERE grade IN ('Daif', 'Mawdu', 'Munkar');

-- ============================================================================
-- 4. AYAHS - Sajdah Verses
-- ============================================================================

-- Index for ayahs that require sajdah (prostration)
CREATE INDEX IF NOT EXISTS idx_sajdah_ayahs
  ON ayahs(surah_id, ayah_number)
  WHERE sajdah = true;

-- ============================================================================
-- 5. READING HISTORY - Recent Reads
-- ============================================================================

-- Index for recent reading history (last 30 days)
CREATE INDEX IF NOT EXISTS idx_recent_reading_history
  ON reading_history(user_id, read_at DESC)
  WHERE read_at > NOW() - INTERVAL '30 days';

-- ============================================================================
-- 6. MEMORIZATION REVIEWS - Upcoming Reviews
-- ============================================================================

-- Index for upcoming memorization reviews (next 7 days)
CREATE INDEX IF NOT EXISTS idx_upcoming_reviews
  ON memorization_reviews(user_id, next_review_date)
  WHERE next_review_date <= NOW() + INTERVAL '7 days'
    AND next_review_date >= NOW();

-- Index for overdue reviews
CREATE INDEX IF NOT EXISTS idx_overdue_reviews
  ON memorization_reviews(user_id, next_review_date DESC)
  WHERE next_review_date < NOW();

-- ============================================================================
-- 7. VOCABULARY ITEMS - High Mastery
-- ============================================================================

-- Index for vocabulary items needing review (low mastery)
CREATE INDEX IF NOT EXISTS idx_vocab_needs_review
  ON vocabulary_items(list_id, mastery, last_reviewed)
  WHERE mastery < 70;

-- Index for mastered vocabulary (high mastery)
CREATE INDEX IF NOT EXISTS idx_vocab_mastered
  ON vocabulary_items(list_id, mastery DESC)
  WHERE mastery >= 90;

-- ============================================================================
-- 8. BOOKS - Available PDFs
-- ============================================================================

-- Index for books with available PDFs (either URL or local path)
CREATE INDEX IF NOT EXISTS idx_books_with_pdf
  ON books(category, language, title)
  WHERE pdf_url IS NOT NULL OR pdf_path IS NOT NULL;

-- ============================================================================
-- BENEFITS OF PARTIAL INDEXES
-- ============================================================================
-- 1. Smaller index size (only indexes relevant rows)
-- 2. Faster queries (less data to scan)
-- 3. Better cache utilization
-- 4. Reduced maintenance overhead (updates to excluded rows don't touch index)
-- 5. Can create multiple indexes on same columns with different WHERE clauses

-- ============================================================================
-- USAGE NOTES
-- ============================================================================
-- Queries must match the WHERE clause of the partial index to use it
-- Example:
--   SELECT * FROM memorization_goals
--   WHERE user_id = '123' AND status = 'active'
--   ORDER BY target_date;
--   ^ Will use idx_active_memorization_goals

-- Check if partial index is being used:
-- EXPLAIN SELECT * FROM memorization_goals
-- WHERE user_id = '123' AND status = 'active';
