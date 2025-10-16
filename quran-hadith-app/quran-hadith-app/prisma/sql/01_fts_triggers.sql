-- ============================================================================
-- FULL-TEXT SEARCH (FTS) SETUP
-- ============================================================================
-- This file sets up PostgreSQL full-text search for Ayahs, Hadiths, and Duas
-- Run this after migrating the schema with searchVector fields

-- ============================================================================
-- 1. AYAH FULL-TEXT SEARCH
-- ============================================================================

-- Create function to update ayah search vector
CREATE OR REPLACE FUNCTION update_ayah_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Combine Arabic and simplified text for search
  -- Use arabic configuration for better Arabic text handling
  NEW.search_vector :=
    setweight(to_tsvector('arabic', coalesce(NEW.text_arabic, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.text_simple, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS ayah_search_vector_update ON ayahs;
CREATE TRIGGER ayah_search_vector_update
  BEFORE INSERT OR UPDATE OF text_arabic, text_simple
  ON ayahs
  FOR EACH ROW
  EXECUTE FUNCTION update_ayah_search_vector();

-- Update existing rows
UPDATE ayahs SET text_arabic = text_arabic;

-- Create GIN index (if not created by Prisma)
CREATE INDEX IF NOT EXISTS idx_ayahs_search_vector ON ayahs USING GIN(search_vector);

-- ============================================================================
-- 2. HADITH FULL-TEXT SEARCH
-- ============================================================================

-- Create function to update hadith search vector
CREATE OR REPLACE FUNCTION update_hadith_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Combine Arabic and English text for search
  NEW.search_vector :=
    setweight(to_tsvector('arabic', coalesce(NEW.text_arabic, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.text_english, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS hadith_search_vector_update ON hadiths;
CREATE TRIGGER hadith_search_vector_update
  BEFORE INSERT OR UPDATE OF text_arabic, text_english
  ON hadiths
  FOR EACH ROW
  EXECUTE FUNCTION update_hadith_search_vector();

-- Update existing rows
UPDATE hadiths SET text_arabic = text_arabic;

-- Create GIN index (if not created by Prisma)
CREATE INDEX IF NOT EXISTS idx_hadiths_search_vector ON hadiths USING GIN(search_vector);

-- ============================================================================
-- 3. DUA FULL-TEXT SEARCH
-- ============================================================================

-- Create function to update dua search vector
CREATE OR REPLACE FUNCTION update_dua_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Combine Arabic, English, and title for search
  NEW.search_vector :=
    setweight(to_tsvector('arabic', coalesce(NEW.text_arabic, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.text_english, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS dua_search_vector_update ON duas;
CREATE TRIGGER dua_search_vector_update
  BEFORE INSERT OR UPDATE OF text_arabic, text_english, title
  ON duas
  FOR EACH ROW
  EXECUTE FUNCTION update_dua_search_vector();

-- Update existing rows
UPDATE duas SET text_arabic = text_arabic;

-- Create GIN index (if not created by Prisma)
CREATE INDEX IF NOT EXISTS idx_duas_search_vector ON duas USING GIN(search_vector);

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

-- Search Ayahs (Arabic or simplified text):
-- SELECT * FROM ayahs
-- WHERE search_vector @@ to_tsquery('arabic', 'الله');

-- Search Hadiths (Arabic or English):
-- SELECT * FROM hadiths
-- WHERE search_vector @@ to_tsquery('english', 'prayer & faith');

-- Search Duas with ranking:
-- SELECT *, ts_rank(search_vector, query) AS rank
-- FROM duas, to_tsquery('arabic', 'الله') query
-- WHERE search_vector @@ query
-- ORDER BY rank DESC;

-- Phrase search:
-- SELECT * FROM ayahs
-- WHERE search_vector @@ phraseto_tsquery('arabic', 'بسم الله الرحمن');

-- ============================================================================
-- PERFORMANCE NOTES
-- ============================================================================
-- - GIN indexes provide 10-100x faster searches than LIKE queries
-- - search_vector is automatically updated via triggers
-- - Use ts_rank() for relevance scoring
-- - Consider pg_trgm extension for fuzzy/typo-tolerant search
