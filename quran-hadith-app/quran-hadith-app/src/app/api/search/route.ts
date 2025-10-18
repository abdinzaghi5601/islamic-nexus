import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse, getPaginationParams, paginatedResponse } from '@/lib/api/helpers';
import { Prisma } from '@prisma/client';

/**
 * Sanitize search query for tsquery
 * Removes special characters and prepares for PostgreSQL full-text search
 */
function sanitizeSearchQuery(query: string): string {
  // Remove special regex/SQL characters
  return query
    .trim()
    .replace(/[&|!<>():']/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .join(' & '); // AND operator for all words
}

/**
 * GET /api/search
 * Search across Quran, Hadith, Duas, and Books using PostgreSQL full-text search
 * Query params:
 *   - q: search query (required)
 *   - type: 'quran' | 'hadith' | 'dua' | 'book' | 'all' (default: 'all')
 *   - page: page number
 *   - limit: items per page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const { page, limit, skip } = getPaginationParams(searchParams);

    if (!query || query.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters');
    }

    const sanitizedQuery = sanitizeSearchQuery(query.trim());
    const results: any[] = [];

    // Search Quran using full-text search
    if (type === 'all' || type === 'quran') {
      try {
        // Search in English translations using full-text search
        const quranResults = await prisma.$queryRaw<Array<any>>`
          SELECT DISTINCT ON (a.id)
            a.id,
            a."surahId",
            a."ayahNumber",
            a."textArabic",
            s.number as "surahNumber",
            s."nameEnglish" as "surahName",
            s."nameArabic" as "surahNameArabic",
            t.id as "translationId",
            t.text as "translationText",
            tr.name as "translatorName",
            ts_rank(t.search_vector, to_tsquery('english', ${sanitizedQuery})) as relevance
          FROM ayahs a
          INNER JOIN surahs s ON a."surahId" = s.id
          INNER JOIN translations t ON a.id = t."ayahId"
          INNER JOIN translators tr ON t."translatorId" = tr.id
          WHERE t.search_vector @@ to_tsquery('english', ${sanitizedQuery})
          ORDER BY a.id, relevance DESC
          LIMIT ${limit}
          OFFSET ${type === 'quran' ? skip : 0}
        `;

        // Search in Tafsir using full-text search
        const tafsirResults = await prisma.$queryRaw<Array<any>>`
          SELECT DISTINCT
            a.id as "ayahId",
            a."textArabic",
            a."ayahNumber",
            s.number as "surahNumber",
            s."nameEnglish" as "surahName",
            tv.id as "tafsirId",
            tv.text as "tafsirText",
            tb.name as "tafsirBookName",
            tb."authorName" as "tafsirAuthor",
            ts_rank(tv.search_vector, to_tsquery('english', ${sanitizedQuery})) as relevance
          FROM tafsir_verses tv
          INNER JOIN ayahs a ON tv."ayahId" = a.id
          INNER JOIN surahs s ON a."surahId" = s.id
          INNER JOIN tafsir_books tb ON tv."tafsirBookId" = tb.id
          WHERE tv.search_vector @@ to_tsquery('english', ${sanitizedQuery})
          ORDER BY relevance DESC
          LIMIT ${Math.floor(limit / 2)}
        `;

        // Combine Quran results with their tafsirs
        const ayahMap = new Map();

        // Add translation results
        for (const result of quranResults) {
          if (!ayahMap.has(result.id)) {
            ayahMap.set(result.id, {
              type: 'ayah',
              id: result.id,
              textArabic: result.textArabic,
              text: result.translationText,
              reference: `${result.surahName} ${result.surahNumber}:${result.ayahNumber}`,
              surah: {
                id: result.surahId,
                number: result.surahNumber,
                nameEnglish: result.surahName,
                nameArabic: result.surahNameArabic,
              },
              ayahNumber: result.ayahNumber,
              translator: result.translatorName,
              tafsirs: [],
              relatedHadiths: [],
            });
          }
        }

        // Add tafsir results
        for (const tafsir of tafsirResults) {
          if (!ayahMap.has(tafsir.ayahId)) {
            // Get primary translation for this ayah
            const primaryTranslation = await prisma.translation.findFirst({
              where: { ayahId: tafsir.ayahId },
              include: { translator: true },
            });

            if (primaryTranslation) {
              ayahMap.set(tafsir.ayahId, {
                type: 'ayah',
                id: tafsir.ayahId,
                textArabic: tafsir.textArabic,
                text: primaryTranslation.text,
                reference: `${tafsir.surahName} ${tafsir.surahNumber}:${tafsir.ayahNumber}`,
                surah: {
                  number: tafsir.surahNumber,
                  nameEnglish: tafsir.surahName,
                },
                ayahNumber: tafsir.ayahNumber,
                translator: primaryTranslation.translator.name,
                matchedInTafsir: true,
                tafsirs: [],
                relatedHadiths: [],
              });
            }
          }

          // Add tafsir to ayah
          if (ayahMap.has(tafsir.ayahId)) {
            const ayah = ayahMap.get(tafsir.ayahId);
            ayah.tafsirs.push({
              id: tafsir.tafsirId,
              text: tafsir.tafsirText,
              tafsirBook: tafsir.tafsirBookName,
              author: tafsir.tafsirAuthor,
            });
          }
        }

        // Fetch related hadiths for each ayah
        const ayahResults = Array.from(ayahMap.values());
        for (const ayahResult of ayahResults) {
          const relatedHadiths = await prisma.$queryRaw<Array<any>>`
            SELECT
              h.id,
              h."textArabic",
              h."textEnglish",
              h."hadithNumber",
              h.grade,
              b.id as "bookId",
              b.name as "bookName",
              c."nameEnglish" as "chapterName"
            FROM hadiths h
            INNER JOIN hadith_books b ON h."bookId" = b.id
            LEFT JOIN hadith_chapters c ON h."chapterId" = c.id
            WHERE h.search_vector_english @@ to_tsquery('english', ${sanitizedQuery})
            LIMIT 5
          `;

          ayahResult.relatedHadiths = relatedHadiths.map(hadith => ({
            id: hadith.id,
            textArabic: hadith.textArabic,
            textEnglish: hadith.textEnglish,
            reference: `${hadith.bookName} ${hadith.hadithNumber}`,
            book: {
              id: hadith.bookId,
              name: hadith.bookName,
            },
            chapter: hadith.chapterName ? {
              nameEnglish: hadith.chapterName,
            } : null,
            grade: hadith.grade,
          }));
        }

        results.push(...ayahResults);
      } catch (error) {
        console.error('Error searching Quran:', error);
      }
    }

    // Search Hadith using full-text search
    if (type === 'all' || type === 'hadith') {
      try {
        const hadithResults = await prisma.$queryRaw<Array<any>>`
          SELECT
            h.id,
            h."textArabic",
            h."textEnglish",
            h."hadithNumber",
            h.grade,
            b.id as "bookId",
            b.name as "bookName",
            b."nameArabic" as "bookNameArabic",
            c.id as "chapterId",
            c."nameEnglish" as "chapterName",
            ts_rank(h.search_vector_english, to_tsquery('english', ${sanitizedQuery})) as relevance
          FROM hadiths h
          INNER JOIN hadith_books b ON h."bookId" = b.id
          LEFT JOIN hadith_chapters c ON h."chapterId" = c.id
          WHERE h.search_vector_english @@ to_tsquery('english', ${sanitizedQuery})
             OR h.search_vector_arabic @@ to_tsquery('arabic', ${sanitizedQuery})
          ORDER BY relevance DESC
          LIMIT ${limit}
          OFFSET ${type === 'hadith' ? skip : 0}
        `;

        results.push(...hadithResults.map(result => ({
          type: 'hadith',
          id: result.id,
          text: result.textEnglish,
          textArabic: result.textArabic,
          reference: `${result.bookName} ${result.hadithNumber}`,
          book: {
            id: result.bookId,
            name: result.bookName,
            nameArabic: result.bookNameArabic,
          },
          chapter: result.chapterId ? {
            id: result.chapterId,
            nameEnglish: result.chapterName,
          } : null,
          hadithNumber: result.hadithNumber,
          grade: result.grade,
        })));
      } catch (error) {
        console.error('Error searching Hadiths:', error);
      }
    }

    // Search Duas (using LIKE for now as they might not have FTS)
    if (type === 'all' || type === 'dua') {
      try {
        const duaResults = await prisma.dua.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: query.trim(),
                  mode: 'insensitive',
                },
              },
              {
                textEnglish: {
                  contains: query.trim(),
                  mode: 'insensitive',
                },
              },
              {
                tags: {
                  contains: query.trim(),
                  mode: 'insensitive',
                },
              },
            ],
          },
          take: limit,
          skip: type === 'dua' ? skip : 0,
          include: {
            category: true,
          },
        });

        results.push(...duaResults.map(result => ({
          type: 'dua',
          id: result.id,
          text: result.textEnglish,
          textArabic: result.textArabic,
          title: result.title,
          titleArabic: result.titleArabic,
          transliteration: result.transliteration,
          reference: result.reference || result.category.name,
          category: {
            id: result.category.id,
            name: result.category.name,
            slug: result.category.slug,
          },
          tags: result.tags,
          occasion: result.occasion,
          benefits: result.benefits,
        })));
      } catch (error) {
        console.error('Error searching Duas:', error);
      }
    }

    // Search Books (using LIKE for now as they might not have FTS)
    if (type === 'all' || type === 'book') {
      try {
        const bookChunkResults = await prisma.bookChunk.findMany({
          where: {
            content: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
          take: limit,
          skip: type === 'book' ? skip : 0,
          include: {
            book: true,
          },
          orderBy: {
            pageNumber: 'asc',
          },
        });

        // Group chunks by book and get first matching chunk from each
        const bookMap = new Map();
        bookChunkResults.forEach(chunk => {
          if (!bookMap.has(chunk.bookId)) {
            bookMap.set(chunk.bookId, {
              type: 'book',
              id: chunk.book.id,
              title: chunk.book.title,
              titleArabic: chunk.book.titleArabic,
              author: chunk.book.author,
              authorArabic: chunk.book.authorArabic,
              category: chunk.book.category,
              language: chunk.book.language,
              description: chunk.book.description,
              pageNumber: chunk.pageNumber,
              excerpt: chunk.content.substring(0, 300) + '...',
              reference: `${chunk.book.title} - Page ${chunk.pageNumber}`,
              totalPages: chunk.book.totalPages,
              pdfUrl: chunk.book.pdfUrl,
              pdfPath: chunk.book.pdfPath,
            });
          }
        });

        results.push(...Array.from(bookMap.values()));
      } catch (error) {
        console.error('Error searching Books:', error);
      }
    }

    // Calculate total (this is approximate for 'all' type)
    const total = results.length;

    return paginatedResponse(results, page, limit, total);
  } catch (error) {
    console.error('Error searching:', error);
    return errorResponse('Search failed', 500);
  }
}
