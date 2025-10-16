-- ============================================================================
-- PARTIAL INDEXES FOR FILTERED QUERIES (FIXED FOR CAMELCASE COLUMNS)
-- ============================================================================

-- 1. MEMORIZATION GOALS - Active Goals Only
CREATE INDEX IF NOT EXISTS idx_active_memorization_goals
  ON memorization_goals("userId", status, "targetDate")
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_completed_memorization_goals
  ON memorization_goals("userId", "updatedAt")
  WHERE status = 'completed';

-- 2. BOOKMARKS - Bookmarks with Notes
CREATE INDEX IF NOT EXISTS idx_bookmarks_with_notes
  ON bookmarks("userId", "createdAt" DESC)
  WHERE note IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_hadith_bookmarks_with_notes
  ON hadith_bookmarks("userId", "createdAt" DESC)
  WHERE note IS NOT NULL;

-- 3. HADITHS - By Authenticity Grade
CREATE INDEX IF NOT EXISTS idx_sahih_hadiths
  ON hadiths("bookId", "chapterId")
  WHERE grade = 'Sahih';

CREATE INDEX IF NOT EXISTS idx_hasan_hadiths
  ON hadiths("bookId", "chapterId")
  WHERE grade = 'Hasan';

CREATE INDEX IF NOT EXISTS idx_weak_hadiths
  ON hadiths("bookId", "chapterId")
  WHERE grade IN ('Daif', 'Mawdu', 'Munkar');

-- 4. AYAHS - Sajdah Verses
CREATE INDEX IF NOT EXISTS idx_sajdah_ayahs
  ON ayahs("surahId", "ayahNumber")
  WHERE sajdah = true;

-- 5. READING HISTORY - Recent Reads (last 30 days)
CREATE INDEX IF NOT EXISTS idx_recent_reading_history
  ON reading_history("userId", "readAt" DESC)
  WHERE "readAt" > NOW() - INTERVAL '30 days';

-- 6. MEMORIZATION REVIEWS - Upcoming Reviews (next 7 days)
CREATE INDEX IF NOT EXISTS idx_upcoming_reviews
  ON memorization_reviews("userId", "nextReviewDate")
  WHERE "nextReviewDate" <= NOW() + INTERVAL '7 days'
    AND "nextReviewDate" >= NOW();

CREATE INDEX IF NOT EXISTS idx_overdue_reviews
  ON memorization_reviews("userId", "nextReviewDate" DESC)
  WHERE "nextReviewDate" < NOW();

-- 7. VOCABULARY ITEMS - Needs Review (low mastery)
CREATE INDEX IF NOT EXISTS idx_vocab_needs_review
  ON vocabulary_items("listId", mastery, "lastReviewed")
  WHERE mastery < 70;

CREATE INDEX IF NOT EXISTS idx_vocab_mastered
  ON vocabulary_items("listId", mastery DESC)
  WHERE mastery >= 90;

-- 8. BOOKS - Available PDFs
CREATE INDEX IF NOT EXISTS idx_books_with_pdf
  ON books(category, language, title)
  WHERE "pdfUrl" IS NOT NULL OR "pdfPath" IS NOT NULL;
