-- Semantic Search using JSONB (works without pgvector extension)
-- This is a working solution while pgvector extension is being enabled

-- Add embedding columns as JSONB to store vector embeddings
ALTER TABLE ayahs
ADD COLUMN IF NOT EXISTS embedding_arabic_jsonb JSONB,
ADD COLUMN IF NOT EXISTS embedding_english_jsonb JSONB;

-- Add embedding column to Translation table
ALTER TABLE translations
ADD COLUMN IF NOT EXISTS embedding_jsonb JSONB;

-- Add embedding columns to Hadith table
ALTER TABLE hadiths
ADD COLUMN IF NOT EXISTS embedding_arabic_jsonb JSONB,
ADD COLUMN IF NOT EXISTS embedding_english_jsonb JSONB;

-- Add embedding column to TafsirVerse table
ALTER TABLE tafsir_verses
ADD COLUMN IF NOT EXISTS embedding_jsonb JSONB;

-- Create GIN indexes for JSONB embeddings (helps with filtering)
CREATE INDEX IF NOT EXISTS idx_ayahs_embedding_arabic_jsonb_gin
ON ayahs USING gin (embedding_arabic_jsonb);

CREATE INDEX IF NOT EXISTS idx_ayahs_embedding_english_jsonb_gin
ON ayahs USING gin (embedding_english_jsonb);

CREATE INDEX IF NOT EXISTS idx_translations_embedding_jsonb_gin
ON translations USING gin (embedding_jsonb);

CREATE INDEX IF NOT EXISTS idx_hadiths_embedding_arabic_jsonb_gin
ON hadiths USING gin (embedding_arabic_jsonb);

CREATE INDEX IF NOT EXISTS idx_hadiths_embedding_english_jsonb_gin
ON hadiths USING gin (embedding_english_jsonb);

CREATE INDEX IF NOT EXISTS idx_tafsir_verses_embedding_jsonb_gin
ON tafsir_verses USING gin (embedding_jsonb);

-- Create helper function to calculate cosine similarity from JSONB arrays
CREATE OR REPLACE FUNCTION cosine_similarity_jsonb(vec1 JSONB, vec2 JSONB)
RETURNS FLOAT AS $$
DECLARE
  dot_product FLOAT := 0;
  magnitude1 FLOAT := 0;
  magnitude2 FLOAT := 0;
  i INT;
  len INT;
  val1 FLOAT;
  val2 FLOAT;
BEGIN
  -- Get array length
  len := jsonb_array_length(vec1);

  IF len != jsonb_array_length(vec2) THEN
    RETURN NULL; -- Vectors must be same length
  END IF;

  -- Calculate dot product and magnitudes
  FOR i IN 0..len-1 LOOP
    val1 := (vec1->>i)::FLOAT;
    val2 := (vec2->>i)::FLOAT;
    dot_product := dot_product + (val1 * val2);
    magnitude1 := magnitude1 + (val1 * val1);
    magnitude2 := magnitude2 + (val2 * val2);
  END LOOP;

  -- Return cosine similarity
  IF magnitude1 = 0 OR magnitude2 = 0 THEN
    RETURN 0;
  END IF;

  RETURN dot_product / (sqrt(magnitude1) * sqrt(magnitude2));
END;
$$ LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE;

-- Create semantic search function for Ayahs
CREATE OR REPLACE FUNCTION search_ayahs_semantic_jsonb(
  query_embedding JSONB,
  search_language TEXT DEFAULT 'english',
  similarity_threshold FLOAT DEFAULT 0.7,
  max_results INT DEFAULT 20
)
RETURNS TABLE (
  id INT,
  surah_id INT,
  ayah_number INT,
  number_in_quran INT,
  text_arabic TEXT,
  similarity FLOAT
) AS $$
BEGIN
  IF search_language = 'arabic' THEN
    RETURN QUERY
    SELECT
      a.id,
      a.surah_id,
      a.ayah_number,
      a.number_in_quran,
      a.text_arabic,
      cosine_similarity_jsonb(a.embedding_arabic_jsonb, query_embedding) as sim
    FROM ayahs a
    WHERE a.embedding_arabic_jsonb IS NOT NULL
      AND cosine_similarity_jsonb(a.embedding_arabic_jsonb, query_embedding) > similarity_threshold
    ORDER BY sim DESC
    LIMIT max_results;
  ELSE
    RETURN QUERY
    SELECT
      a.id,
      a.surah_id,
      a.ayah_number,
      a.number_in_quran,
      a.text_arabic,
      cosine_similarity_jsonb(a.embedding_english_jsonb, query_embedding) as sim
    FROM ayahs a
    WHERE a.embedding_english_jsonb IS NOT NULL
      AND cosine_similarity_jsonb(a.embedding_english_jsonb, query_embedding) > similarity_threshold
    ORDER BY sim DESC
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create semantic search function for Hadiths
CREATE OR REPLACE FUNCTION search_hadiths_semantic_jsonb(
  query_embedding JSONB,
  search_language TEXT DEFAULT 'english',
  similarity_threshold FLOAT DEFAULT 0.7,
  max_results INT DEFAULT 20
)
RETURNS TABLE (
  id INT,
  book_id INT,
  hadith_number TEXT,
  text_arabic TEXT,
  text_english TEXT,
  similarity FLOAT
) AS $$
BEGIN
  IF search_language = 'arabic' THEN
    RETURN QUERY
    SELECT
      h.id,
      h.book_id,
      h.hadith_number,
      h.text_arabic,
      h.text_english,
      cosine_similarity_jsonb(h.embedding_arabic_jsonb, query_embedding) as sim
    FROM hadiths h
    WHERE h.embedding_arabic_jsonb IS NOT NULL
      AND cosine_similarity_jsonb(h.embedding_arabic_jsonb, query_embedding) > similarity_threshold
    ORDER BY sim DESC
    LIMIT max_results;
  ELSE
    RETURN QUERY
    SELECT
      h.id,
      h.book_id,
      h.hadith_number,
      h.text_arabic,
      h.text_english,
      cosine_similarity_jsonb(h.embedding_english_jsonb, query_embedding) as sim
    FROM hadiths h
    WHERE h.embedding_english_jsonb IS NOT NULL
      AND cosine_similarity_jsonb(h.embedding_english_jsonb, query_embedding) > similarity_threshold
    ORDER BY sim DESC
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON COLUMN ayahs.embedding_arabic_jsonb IS 'OpenAI text-embedding-3-small vector stored as JSONB array (1536 dimensions)';
COMMENT ON COLUMN ayahs.embedding_english_jsonb IS 'OpenAI text-embedding-3-small vector stored as JSONB array (1536 dimensions)';
COMMENT ON COLUMN translations.embedding_jsonb IS 'OpenAI text-embedding-3-small vector stored as JSONB array (1536 dimensions)';
COMMENT ON COLUMN hadiths.embedding_arabic_jsonb IS 'OpenAI text-embedding-3-small vector stored as JSONB array (1536 dimensions)';
COMMENT ON COLUMN hadiths.embedding_english_jsonb IS 'OpenAI text-embedding-3-small vector stored as JSONB array (1536 dimensions)';
COMMENT ON COLUMN tafsir_verses.embedding_jsonb IS 'OpenAI text-embedding-3-small vector stored as JSONB array (1536 dimensions)';

COMMENT ON FUNCTION cosine_similarity_jsonb IS 'Calculate cosine similarity between two JSONB vector arrays';
COMMENT ON FUNCTION search_ayahs_semantic_jsonb IS 'Semantic search for Ayahs using JSONB embeddings';
COMMENT ON FUNCTION search_hadiths_semantic_jsonb IS 'Semantic search for Hadiths using JSONB embeddings';
