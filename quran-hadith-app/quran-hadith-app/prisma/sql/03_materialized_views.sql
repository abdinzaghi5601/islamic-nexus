-- ============================================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- ============================================================================
-- Materialized views cache expensive aggregations for fast read access
-- Refresh them periodically (daily/weekly) based on your needs

-- ============================================================================
-- 1. USER READING STATISTICS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS user_reading_stats AS
SELECT
  user_id,
  COUNT(DISTINCT surah_id) FILTER (WHERE surah_id IS NOT NULL) AS surahs_read,
  COUNT(DISTINCT ayah_id) FILTER (WHERE ayah_id IS NOT NULL) AS ayahs_read,
  COUNT(DISTINCT hadith_id) FILTER (WHERE hadith_id IS NOT NULL) AS hadiths_read,
  MAX(read_at) AS last_read_at,
  MIN(read_at) AS first_read_at,
  COUNT(*) AS total_reads,
  COUNT(DISTINCT DATE(read_at)) AS days_active
FROM reading_history
GROUP BY user_id;

-- Create unique index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_reading_stats_user_id
  ON user_reading_stats(user_id);

-- Add index for ranking users by activity
CREATE INDEX IF NOT EXISTS idx_user_reading_stats_activity
  ON user_reading_stats(total_reads DESC, days_active DESC);

-- ============================================================================
-- 2. USER MEMORIZATION PROGRESS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS user_memorization_progress AS
SELECT
  mg.user_id,
  COUNT(DISTINCT mg.id) AS total_goals,
  COUNT(DISTINCT mg.id) FILTER (WHERE mg.status = 'active') AS active_goals,
  COUNT(DISTINCT mg.id) FILTER (WHERE mg.status = 'completed') AS completed_goals,
  COUNT(DISTINCT ms.ayah_id) AS ayahs_practiced,
  SUM(ms.repetitions) AS total_repetitions,
  AVG(ms.confidence)::NUMERIC(10,2) AS avg_confidence,
  SUM(ms.duration) AS total_practice_minutes,
  MAX(ms.session_date) AS last_session_date,
  COUNT(DISTINCT mr.ayah_id) AS ayahs_in_review,
  COUNT(DISTINCT mr.ayah_id) FILTER (WHERE mr.next_review_date < NOW()) AS overdue_reviews
FROM memorization_goals mg
LEFT JOIN memorization_sessions ms ON mg.id = ms.goal_id
LEFT JOIN memorization_reviews mr ON mg.id = mr.goal_id
GROUP BY mg.user_id;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_memorization_progress_user_id
  ON user_memorization_progress(user_id);

-- ============================================================================
-- 3. USER VOCABULARY MASTERY
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS user_vocabulary_mastery AS
SELECT
  vl.user_id,
  COUNT(DISTINCT vl.id) AS total_lists,
  COUNT(DISTINCT vi.id) AS total_words,
  COUNT(DISTINCT vi.id) FILTER (WHERE vi.mastery >= 90) AS mastered_words,
  COUNT(DISTINCT vi.id) FILTER (WHERE vi.mastery >= 70 AND vi.mastery < 90) AS proficient_words,
  COUNT(DISTINCT vi.id) FILTER (WHERE vi.mastery < 70) AS learning_words,
  AVG(vi.mastery)::NUMERIC(10,2) AS avg_mastery,
  COUNT(DISTINCT vi.id) FILTER (WHERE vi.last_reviewed IS NOT NULL) AS reviewed_words,
  MAX(vi.last_reviewed) AS last_review_date,
  SUM(vi.review_count) AS total_reviews
FROM vocabulary_lists vl
LEFT JOIN vocabulary_items vi ON vl.id = vi.list_id
GROUP BY vl.user_id;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_vocabulary_mastery_user_id
  ON user_vocabulary_mastery(user_id);

-- ============================================================================
-- 4. USER LEARNING STREAK
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS user_learning_streaks AS
WITH daily_activity AS (
  SELECT
    user_id,
    DATE(date) AS activity_date,
    SUM(study_minutes) AS total_minutes,
    SUM(words_learned) AS words_learned,
    SUM(ayahs_memorized) AS ayahs_memorized
  FROM learning_progress
  GROUP BY user_id, DATE(date)
),
streaks AS (
  SELECT
    user_id,
    activity_date,
    activity_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date))::INTEGER AS streak_group
  FROM daily_activity
)
SELECT
  user_id,
  MAX(activity_date) AS last_activity_date,
  COUNT(*) AS current_streak_days,
  MIN(activity_date) AS streak_start_date
FROM streaks
WHERE streak_group = (
  SELECT MAX(streak_group)
  FROM streaks s2
  WHERE s2.user_id = streaks.user_id
)
GROUP BY user_id, streak_group;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_learning_streaks_user_id
  ON user_learning_streaks(user_id);

-- ============================================================================
-- 5. POPULAR CONTENT ANALYTICS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS popular_content_stats AS
SELECT
  'ayah' AS content_type,
  a.id AS content_id,
  a.surah_id,
  a.ayah_number,
  s.name_english AS surah_name,
  COUNT(DISTINCT b.user_id) AS bookmark_count,
  COUNT(DISTINCT rh.user_id) AS read_count,
  COUNT(DISTINCT n.user_id) AS note_count,
  (COUNT(DISTINCT b.user_id) * 3 +
   COUNT(DISTINCT rh.user_id) +
   COUNT(DISTINCT n.user_id) * 2) AS popularity_score
FROM ayahs a
JOIN surahs s ON a.surah_id = s.id
LEFT JOIN bookmarks b ON a.id = b.ayah_id
LEFT JOIN reading_history rh ON a.id = rh.ayah_id
LEFT JOIN notes n ON a.id = n.ayah_id
GROUP BY a.id, a.surah_id, a.ayah_number, s.name_english

UNION ALL

SELECT
  'hadith' AS content_type,
  h.id AS content_id,
  h.book_id AS surah_id,
  NULL AS ayah_number,
  hb.name AS surah_name,
  COUNT(DISTINCT hbm.user_id) AS bookmark_count,
  COUNT(DISTINCT rh.user_id) AS read_count,
  COUNT(DISTINCT n.user_id) AS note_count,
  (COUNT(DISTINCT hbm.user_id) * 3 +
   COUNT(DISTINCT rh.user_id) +
   COUNT(DISTINCT n.user_id) * 2) AS popularity_score
FROM hadiths h
JOIN hadith_books hb ON h.book_id = hb.id
LEFT JOIN hadith_bookmarks hbm ON h.id = hbm.hadith_id
LEFT JOIN reading_history rh ON h.id = rh.hadith_id
LEFT JOIN notes n ON h.id = n.hadith_id
GROUP BY h.id, h.book_id, hb.name;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_popular_content_stats_type_score
  ON popular_content_stats(content_type, popularity_score DESC);

CREATE INDEX IF NOT EXISTS idx_popular_content_stats_surah
  ON popular_content_stats(surah_id, popularity_score DESC)
  WHERE content_type = 'ayah';

-- ============================================================================
-- 6. HADITH BOOK STATISTICS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS hadith_book_stats AS
SELECT
  hb.id AS book_id,
  hb.name AS book_name,
  hb.author,
  COUNT(DISTINCT h.id) AS total_hadiths,
  COUNT(DISTINCT h.id) FILTER (WHERE h.grade = 'Sahih') AS sahih_count,
  COUNT(DISTINCT h.id) FILTER (WHERE h.grade = 'Hasan') AS hasan_count,
  COUNT(DISTINCT h.id) FILTER (WHERE h.grade IN ('Daif', 'Mawdu')) AS weak_count,
  COUNT(DISTINCT hc.id) AS chapter_count,
  COUNT(DISTINCT hbm.user_id) AS unique_bookmarkers,
  COUNT(hbm.id) AS total_bookmarks
FROM hadith_books hb
LEFT JOIN hadiths h ON hb.id = h.book_id
LEFT JOIN hadith_chapters hc ON hb.id = hc.book_id
LEFT JOIN hadith_bookmarks hbm ON h.id = hbm.hadith_id
GROUP BY hb.id, hb.name, hb.author;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_hadith_book_stats_book_id
  ON hadith_book_stats(book_id);

-- ============================================================================
-- REFRESH FUNCTIONS
-- ============================================================================

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_reading_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_memorization_progress;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_vocabulary_mastery;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_learning_streaks;
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_content_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY hadith_book_stats;

  RAISE NOTICE 'All materialized views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REFRESH SCHEDULE RECOMMENDATIONS
-- ============================================================================

-- Run this periodically via cron job or scheduled task:
-- SELECT refresh_all_analytics_views();

-- Suggested refresh frequency:
-- - user_reading_stats: Daily (after peak usage hours)
-- - user_memorization_progress: Daily
-- - user_vocabulary_mastery: Daily
-- - user_learning_streaks: Daily (crucial for streak tracking)
-- - popular_content_stats: Weekly
-- - hadith_book_stats: Weekly (data changes infrequently)

-- Example cron job (runs at 2 AM daily):
-- 0 2 * * * psql -U postgres -d your_database -c "SELECT refresh_all_analytics_views();"

-- For immediate refresh after data import:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY view_name;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

-- Get user's reading stats:
-- SELECT * FROM user_reading_stats WHERE user_id = 'user123';

-- Get top 10 most popular ayahs:
-- SELECT * FROM popular_content_stats
-- WHERE content_type = 'ayah'
-- ORDER BY popularity_score DESC
-- LIMIT 10;

-- Get user's memorization progress:
-- SELECT * FROM user_memorization_progress WHERE user_id = 'user123';

-- Check user's current learning streak:
-- SELECT current_streak_days, last_activity_date
-- FROM user_learning_streaks
-- WHERE user_id = 'user123';
