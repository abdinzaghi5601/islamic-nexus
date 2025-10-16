-- Fix semantic search functions to use camelCase column names

-- Drop and recreate search_ayahs_semantic_jsonb function with correct column names
DROP FUNCTION IF EXISTS search_ayahs_semantic_jsonb(jsonb, text, float, int);

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
      a."surahId" as surah_id,
      a."ayahNumber" as ayah_number,
      a."numberInQuran" as number_in_quran,
      a."textArabic" as text_arabic,
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
      a."surahId" as surah_id,
      a."ayahNumber" as ayah_number,
      a."numberInQuran" as number_in_quran,
      a."textArabic" as text_arabic,
      cosine_similarity_jsonb(a.embedding_english_jsonb, query_embedding) as sim
    FROM ayahs a
    WHERE a.embedding_english_jsonb IS NOT NULL
      AND cosine_similarity_jsonb(a.embedding_english_jsonb, query_embedding) > similarity_threshold
    ORDER BY sim DESC
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate search_hadiths_semantic_jsonb function
DROP FUNCTION IF EXISTS search_hadiths_semantic_jsonb(jsonb, text, float, int);

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
      h."bookId" as book_id,
      h."hadithNumber" as hadith_number,
      h."textArabic" as text_arabic,
      h."textEnglish" as text_english,
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
      h."bookId" as book_id,
      h."hadithNumber" as hadith_number,
      h."textArabic" as text_arabic,
      h."textEnglish" as text_english,
      cosine_similarity_jsonb(h.embedding_english_jsonb, query_embedding) as sim
    FROM hadiths h
    WHERE h.embedding_english_jsonb IS NOT NULL
      AND cosine_similarity_jsonb(h.embedding_english_jsonb, query_embedding) > similarity_threshold
    ORDER BY sim DESC
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;
