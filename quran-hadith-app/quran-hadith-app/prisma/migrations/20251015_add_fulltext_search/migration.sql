-- Add full-text search columns and indexes for PostgreSQL

-- Add tsvector columns for full-text search on Ayahs
ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS search_vector_arabic tsvector;
ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS search_vector_english tsvector;

-- Add tsvector columns for Translations
ALTER TABLE translations ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Add tsvector columns for Hadiths
ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS search_vector_arabic tsvector;
ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS search_vector_english tsvector;

-- Add tsvector columns for Tafsir
ALTER TABLE tafsir_verses ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN indexes for fast full-text search
CREATE INDEX IF NOT EXISTS idx_ayahs_search_arabic ON ayahs USING GIN(search_vector_arabic);
CREATE INDEX IF NOT EXISTS idx_ayahs_search_english ON ayahs USING GIN(search_vector_english);
CREATE INDEX IF NOT EXISTS idx_translations_search ON translations USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_hadiths_search_arabic ON hadiths USING GIN(search_vector_arabic);
CREATE INDEX IF NOT EXISTS idx_hadiths_search_english ON hadiths USING GIN(search_vector_english);
CREATE INDEX IF NOT EXISTS idx_tafsir_search ON tafsir_verses USING GIN(search_vector);

-- Populate search vectors for Ayahs (Arabic)
UPDATE ayahs SET search_vector_arabic = to_tsvector('arabic', COALESCE("textArabic", '') || ' ' || COALESCE("textUthmani", ''));

-- Populate search vectors for Ayahs (English - from translations)
UPDATE ayahs SET search_vector_english = (
  SELECT to_tsvector('english', string_agg(t.text, ' '))
  FROM translations t
  WHERE t."ayahId" = ayahs.id
);

-- Populate search vectors for Translations
UPDATE translations SET search_vector = to_tsvector('english', COALESCE(text, ''));

-- Populate search vectors for Hadiths (Arabic)
UPDATE hadiths SET search_vector_arabic = to_tsvector('arabic', COALESCE("textArabic", ''));

-- Populate search vectors for Hadiths (English)
UPDATE hadiths SET search_vector_english = to_tsvector('english', COALESCE("textEnglish", ''));

-- Populate search vectors for Tafsir
UPDATE tafsir_verses SET search_vector = to_tsvector('english', COALESCE(text, ''));

-- Create triggers to auto-update search vectors on INSERT/UPDATE
CREATE OR REPLACE FUNCTION ayah_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector_arabic := to_tsvector('arabic', COALESCE(NEW."textArabic", '') || ' ' || COALESCE(NEW."textUthmani", ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER ayah_search_vector_trigger BEFORE INSERT OR UPDATE ON ayahs
FOR EACH ROW EXECUTE FUNCTION ayah_search_vector_update();

CREATE OR REPLACE FUNCTION translation_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.text, ''));
  -- Also update parent ayah's English search vector
  UPDATE ayahs SET search_vector_english = (
    SELECT to_tsvector('english', string_agg(t.text, ' '))
    FROM translations t
    WHERE t."ayahId" = NEW."ayahId"
  ) WHERE id = NEW."ayahId";
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER translation_search_vector_trigger BEFORE INSERT OR UPDATE ON translations
FOR EACH ROW EXECUTE FUNCTION translation_search_vector_update();

CREATE OR REPLACE FUNCTION hadith_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector_arabic := to_tsvector('arabic', COALESCE(NEW."textArabic", ''));
  NEW.search_vector_english := to_tsvector('english', COALESCE(NEW."textEnglish", ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER hadith_search_vector_trigger BEFORE INSERT OR UPDATE ON hadiths
FOR EACH ROW EXECUTE FUNCTION hadith_search_vector_update();

CREATE OR REPLACE FUNCTION tafsir_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.text, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tafsir_search_vector_trigger BEFORE INSERT OR UPDATE ON tafsir_verses
FOR EACH ROW EXECUTE FUNCTION tafsir_search_vector_update();

-- Add trigram extension for fuzzy search (handles typos)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram indexes for fuzzy Arabic search
CREATE INDEX IF NOT EXISTS idx_ayahs_arabic_trgm ON ayahs USING GIN("textArabic" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hadiths_arabic_trgm ON hadiths USING GIN("textArabic" gin_trgm_ops);

-- Add trigram indexes for fuzzy English search
CREATE INDEX IF NOT EXISTS idx_translations_text_trgm ON translations USING GIN(text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hadiths_english_trgm ON hadiths USING GIN("textEnglish" gin_trgm_ops);
