-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns to Ayah table (1536 dimensions for OpenAI text-embedding-3-small)
ALTER TABLE ayahs
ADD COLUMN IF NOT EXISTS embedding_arabic vector(1536),
ADD COLUMN IF NOT EXISTS embedding_english vector(1536);

-- Add embedding column to Translation table
ALTER TABLE translations
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add embedding columns to Hadith table
ALTER TABLE hadiths
ADD COLUMN IF NOT EXISTS embedding_arabic vector(1536),
ADD COLUMN IF NOT EXISTS embedding_english vector(1536);

-- Add embedding column to TafsirVerse table
ALTER TABLE tafsir_verses
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create indexes for vector similarity search (using HNSW for better performance)
-- HNSW (Hierarchical Navigable Small World) provides fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_ayahs_embedding_arabic_hnsw
ON ayahs USING hnsw (embedding_arabic vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_ayahs_embedding_english_hnsw
ON ayahs USING hnsw (embedding_english vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_translations_embedding_hnsw
ON translations USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_hadiths_embedding_arabic_hnsw
ON hadiths USING hnsw (embedding_arabic vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_hadiths_embedding_english_hnsw
ON hadiths USING hnsw (embedding_english vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_tafsir_verses_embedding_hnsw
ON tafsir_verses USING hnsw (embedding vector_cosine_ops);

-- Create a helper function for semantic search with configurable similarity threshold
CREATE OR REPLACE FUNCTION search_ayahs_semantic(
  query_embedding vector(1536),
  search_language text DEFAULT 'english',
  similarity_threshold float DEFAULT 0.7,
  max_results int DEFAULT 20
)
RETURNS TABLE (
  id int,
  surah_id int,
  ayah_number int,
  number_in_quran int,
  text_arabic text,
  similarity float
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
      1 - (a.embedding_arabic <=> query_embedding) as similarity
    FROM ayahs a
    WHERE a.embedding_arabic IS NOT NULL
      AND (1 - (a.embedding_arabic <=> query_embedding)) > similarity_threshold
    ORDER BY a.embedding_arabic <=> query_embedding
    LIMIT max_results;
  ELSE
    RETURN QUERY
    SELECT
      a.id,
      a.surah_id,
      a.ayah_number,
      a.number_in_quran,
      a.text_arabic,
      1 - (a.embedding_english <=> query_embedding) as similarity
    FROM ayahs a
    WHERE a.embedding_english IS NOT NULL
      AND (1 - (a.embedding_english <=> query_embedding)) > similarity_threshold
    ORDER BY a.embedding_english <=> query_embedding
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a helper function for semantic hadith search
CREATE OR REPLACE FUNCTION search_hadiths_semantic(
  query_embedding vector(1536),
  search_language text DEFAULT 'english',
  similarity_threshold float DEFAULT 0.7,
  max_results int DEFAULT 20
)
RETURNS TABLE (
  id int,
  book_id int,
  hadith_number text,
  text_arabic text,
  text_english text,
  similarity float
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
      1 - (h.embedding_arabic <=> query_embedding) as similarity
    FROM hadiths h
    WHERE h.embedding_arabic IS NOT NULL
      AND (1 - (h.embedding_arabic <=> query_embedding)) > similarity_threshold
    ORDER BY h.embedding_arabic <=> query_embedding
    LIMIT max_results;
  ELSE
    RETURN QUERY
    SELECT
      h.id,
      h.book_id,
      h.hadith_number,
      h.text_arabic,
      h.text_english,
      1 - (h.embedding_english <=> query_embedding) as similarity
    FROM hadiths h
    WHERE h.embedding_english IS NOT NULL
      AND (1 - (h.embedding_english <=> query_embedding)) > similarity_threshold
    ORDER BY h.embedding_english <=> query_embedding
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comments explaining the vector search approach
COMMENT ON COLUMN ayahs.embedding_arabic IS 'OpenAI text-embedding-3-small vector (1536 dimensions) for Arabic text semantic search';
COMMENT ON COLUMN ayahs.embedding_english IS 'OpenAI text-embedding-3-small vector (1536 dimensions) for English translation semantic search';
COMMENT ON COLUMN translations.embedding IS 'OpenAI text-embedding-3-small vector (1536 dimensions) for translation text semantic search';
COMMENT ON COLUMN hadiths.embedding_arabic IS 'OpenAI text-embedding-3-small vector (1536 dimensions) for Arabic hadith text semantic search';
COMMENT ON COLUMN hadiths.embedding_english IS 'OpenAI text-embedding-3-small vector (1536 dimensions) for English hadith text semantic search';
COMMENT ON COLUMN tafsir_verses.embedding IS 'OpenAI text-embedding-3-small vector (1536 dimensions) for tafsir text semantic search';
