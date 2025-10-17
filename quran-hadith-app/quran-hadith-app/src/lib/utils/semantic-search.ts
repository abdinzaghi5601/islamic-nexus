import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from './embeddings';

const prisma = new PrismaClient();

export interface SemanticSearchResult {
  id: number;
  type: 'ayah' | 'hadith';
  similarity: number;
  content: {
    textArabic: string;
    textEnglish: string;
    reference: string;
    [key: string]: any;
  };
}

/**
 * Semantic search for Ayahs using cosine similarity
 */
export async function searchAyahsSemantic(
  query: string,
  options: {
    language?: 'arabic' | 'english';
    similarityThreshold?: number;
    maxResults?: number;
    translatorId?: number;
  } = {}
): Promise<SemanticSearchResult[]> {
  const {
    language = 'english',
    similarityThreshold = 0.7,
    maxResults = 20,
    translatorId = 1,
  } = options;

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Call PostgreSQL function
  const results: any[] = await prisma.$queryRawUnsafe(
    `
    SELECT * FROM search_ayahs_semantic_jsonb(
      $1::jsonb,
      $2::text,
      $3::float,
      $4::int
    )
    `,
    JSON.stringify(queryEmbedding),
    language,
    similarityThreshold,
    maxResults
  );

  // Optimize: Bulk fetch all ayahs with related data in one query
  if (results.length === 0) {
    return [];
  }

  const ayahIds = results.map(r => r.id);
  const ayahs = await prisma.ayah.findMany({
    where: { id: { in: ayahIds } },
    include: {
      surah: true,
      translations: {
        where: { translatorId },
        take: 1,
      },
    },
  });

  // Create a map for quick lookup
  const ayahMap = new Map(ayahs.map(a => [a.id, a]));

  // Build enriched results maintaining similarity order
  const enriched: SemanticSearchResult[] = results
    .map(result => {
      const ayah = ayahMap.get(result.id);
      if (!ayah) return null;

      return {
        id: ayah.id,
        type: 'ayah' as const,
        similarity: result.similarity,
        content: {
          textArabic: ayah.textArabic,
          textEnglish: ayah.translations[0]?.text || '',
          reference: `${ayah.surah.nameEnglish} ${ayah.ayahNumber}`,
          surahNumber: ayah.surah.number,
          ayahNumber: ayah.ayahNumber,
          surahName: ayah.surah.nameEnglish,
          surahNameArabic: ayah.surah.nameArabic,
        },
      };
    })
    .filter((r): r is SemanticSearchResult => r !== null);

  return enriched;
}

/**
 * Semantic search for Hadiths
 */
export async function searchHadithsSemantic(
  query: string,
  options: {
    language?: 'arabic' | 'english';
    similarityThreshold?: number;
    maxResults?: number;
  } = {}
): Promise<SemanticSearchResult[]> {
  const {
    language = 'english',
    similarityThreshold = 0.7,
    maxResults = 20,
  } = options;

  const queryEmbedding = await generateEmbedding(query);

  const results: any[] = await prisma.$queryRawUnsafe(
    `
    SELECT * FROM search_hadiths_semantic_jsonb(
      $1::jsonb,
      $2::text,
      $3::float,
      $4::int
    )
    `,
    JSON.stringify(queryEmbedding),
    language,
    similarityThreshold,
    maxResults
  );

  // Optimize: Bulk fetch all hadiths with related data in one query
  if (results.length === 0) {
    return [];
  }

  const hadithIds = results.map(r => r.id);
  const hadiths = await prisma.hadith.findMany({
    where: { id: { in: hadithIds } },
    include: {
      book: true,
      chapter: true,
    },
  });

  // Create a map for quick lookup
  const hadithMap = new Map(hadiths.map(h => [h.id, h]));

  // Build enriched results maintaining similarity order
  const enriched: SemanticSearchResult[] = results
    .map(result => {
      const hadith = hadithMap.get(result.id);
      if (!hadith) return null;

      return {
        id: hadith.id,
        type: 'hadith' as const,
        similarity: result.similarity,
        content: {
          textArabic: hadith.textArabic,
          textEnglish: hadith.textEnglish,
          reference: `${hadith.book.name} ${hadith.hadithNumber}`,
          bookName: hadith.book.name,
          hadithNumber: hadith.hadithNumber,
          grade: hadith.grade,
          chapterName: hadith.chapter?.nameEnglish,
        },
      };
    })
    .filter((r): r is SemanticSearchResult => r !== null);

  return enriched;
}

/**
 * Unified semantic search across Ayahs and Hadiths
 */
export async function semanticSearchAll(
  query: string,
  options: {
    language?: 'arabic' | 'english';
    similarityThreshold?: number;
    maxResults?: number;
    types?: ('ayah' | 'hadith')[];
  } = {}
): Promise<SemanticSearchResult[]> {
  const {
    language = 'english',
    similarityThreshold = 0.7,
    maxResults = 20,
    types = ['ayah', 'hadith'],
  } = options;

  const results: SemanticSearchResult[] = [];

  if (types.includes('ayah')) {
    const ayahs = await searchAyahsSemantic(query, {
      language,
      similarityThreshold,
      maxResults: Math.floor(maxResults * 0.6), // 60% Ayahs
    });
    results.push(...ayahs);
  }

  if (types.includes('hadith')) {
    const hadiths = await searchHadithsSemantic(query, {
      language,
      similarityThreshold,
      maxResults: Math.floor(maxResults * 0.4), // 40% Hadiths
    });
    results.push(...hadiths);
  }

  // Sort by similarity
  results.sort((a, b) => b.similarity - a.similarity);

  return results.slice(0, maxResults);
}
