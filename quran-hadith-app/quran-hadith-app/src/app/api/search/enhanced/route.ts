// app/api/search/enhanced/route.ts
// Enhanced search using PostgreSQL full-text search with ranking

import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse, getPaginationParams } from '@/lib/api/helpers';

/**
 * GET /api/search/enhanced
 * Enhanced full-text search using PostgreSQL tsvector with ranking
 * Query params:
 *   - q: search query (required)
 *   - type: 'quran' | 'hadith' | 'dua' | 'all' (default: 'quran')
 *   - translator: translator ID (default: 1 for Yusuf Ali)
 *   - page: page number
 *   - limit: items per page
 *   - minRank: minimum ranking threshold (default: 0.01)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'quran';
    const translatorId = parseInt(searchParams.get('translator') || '1');
    const minRank = parseFloat(searchParams.get('minRank') || '0.01');
    const { page, limit, skip } = getPaginationParams(searchParams);

    if (!query || query.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters');
    }

    const results: any[] = [];
    let total = 0;

    // Process query for tsquery (remove special characters, handle phrases)
    const processedQuery = query
      .trim()
      .replace(/[^\w\s]/g, ' ') // Remove special chars
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => `${word}:*`) // Add prefix matching
      .join(' & '); // AND operator

    if (type === 'quran' || type === 'all') {
      // Full-text search in translations with ranking
      const quranResults = await prisma.$queryRaw<Array<any>>`
        SELECT
          t.id,
          t.text,
          t.ayah_id,
          a.ayah_number,
          a.text_arabic,
          a.number_in_quran,
          s.id as surah_id,
          s.number as surah_number,
          s.name_english,
          s.name_arabic,
          s.revelation_type,
          trans.id as translator_id,
          trans.name as translator_name,
          ts_rank(t.search_vector, to_tsquery('english', ${processedQuery})) as rank
        FROM translations t
        JOIN ayahs a ON t.ayah_id = a.id
        JOIN surahs s ON a.surah_id = s.id
        JOIN translators trans ON t.translator_id = trans.id
        WHERE
          t.translator_id = ${translatorId}
          AND t.search_vector @@ to_tsquery('english', ${processedQuery})
          AND ts_rank(t.search_vector, to_tsquery('english', ${processedQuery})) > ${minRank}
        ORDER BY rank DESC, a.number_in_quran ASC
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      // Get total count
      const countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM translations t
        WHERE
          t.translator_id = ${translatorId}
          AND t.search_vector @@ to_tsquery('english', ${processedQuery})
          AND ts_rank(t.search_vector, to_tsquery('english', ${processedQuery})) > ${minRank}
      `;

      total = Number(countResult[0]?.count || 0);

      // Fetch related tafsirs for each result
      const enhancedResults = await Promise.all(
        quranResults.map(async (result) => {
          // Get tafsirs for this ayah
          const tafsirs = await prisma.tafsirVerse.findMany({
            where: { ayahId: result.ayah_id },
            include: {
              tafsirBook: true,
            },
            take: 3,
          });

          // Get other translations for this ayah
          const otherTranslations = await prisma.translation.findMany({
            where: {
              ayahId: result.ayah_id,
              translatorId: { not: translatorId },
            },
            include: {
              translator: true,
            },
            take: 3,
          });

          return {
            type: 'ayah',
            id: result.ayah_id,
            text: result.text,
            textArabic: result.text_arabic,
            reference: `${result.name_english} ${result.surah_number}:${result.ayah_number}`,
            rank: Number(result.rank),
            surah: {
              id: result.surah_id,
              number: result.surah_number,
              nameEnglish: result.name_english,
              nameArabic: result.name_arabic,
              revelationType: result.revelation_type,
            },
            ayahNumber: result.ayah_number,
            numberInQuran: result.number_in_quran,
            translator: {
              id: result.translator_id,
              name: result.translator_name,
            },
            tafsirs: tafsirs.map(t => ({
              id: t.id,
              text: t.text.substring(0, 500) + (t.text.length > 500 ? '...' : ''),
              tafsirBook: t.tafsirBook.name,
              author: t.tafsirBook.authorName,
            })),
            otherTranslations: otherTranslations.map(t => ({
              id: t.id,
              text: t.text,
              translator: t.translator.name,
              language: t.translator.language,
            })),
          };
        })
      );

      results.push(...enhancedResults);
    }

    if (type === 'hadith' || type === 'all') {
      // Full-text search in hadiths with ranking
      const hadithResults = await prisma.$queryRaw<Array<any>>`
        SELECT
          h.id,
          h.text_english,
          h.text_arabic,
          h.hadith_number,
          h.grade,
          b.id as book_id,
          b.name as book_name,
          b.name_arabic as book_name_arabic,
          c.id as chapter_id,
          c.name_english as chapter_name,
          ts_rank(h.search_vector_english, to_tsquery('english', ${processedQuery})) as rank
        FROM hadiths h
        JOIN hadith_books b ON h.book_id = b.id
        LEFT JOIN hadith_chapters c ON h.chapter_id = c.id
        WHERE
          h.search_vector_english @@ to_tsquery('english', ${processedQuery})
          AND ts_rank(h.search_vector_english, to_tsquery('english', ${processedQuery})) > ${minRank}
        ORDER BY rank DESC
        LIMIT ${Math.floor(limit / 2)}
      `;

      results.push(
        ...hadithResults.map(result => ({
          type: 'hadith',
          id: result.id,
          text: result.text_english,
          textArabic: result.text_arabic,
          reference: `${result.book_name} ${result.hadith_number}`,
          rank: Number(result.rank),
          book: {
            id: result.book_id,
            name: result.book_name,
            nameArabic: result.book_name_arabic,
          },
          chapter: result.chapter_id ? {
            id: result.chapter_id,
            nameEnglish: result.chapter_name,
          } : null,
          hadithNumber: result.hadith_number,
          grade: result.grade,
        }))
      );
    }

    return successResponse({
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      query: {
        original: query,
        processed: processedQuery,
        type,
        translator: translatorId,
        minRank,
      },
    });
  } catch (error) {
    console.error('Enhanced search error:', error);
    return errorResponse('Search failed', 500);
  }
}
