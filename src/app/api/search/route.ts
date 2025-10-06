import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse, getPaginationParams, paginatedResponse } from '@/lib/api/helpers';

/**
 * GET /api/search
 * Search across Quran and Hadith
 * Query params:
 *   - q: search query (required)
 *   - type: 'quran' | 'hadith' | 'all' (default: 'all')
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

    const searchTerm = `%${query.trim()}%`;
    const results: any[] = [];

    // Search Quran translations
    if (type === 'all' || type === 'quran') {
      const quranResults = await prisma.translation.findMany({
        where: {
          text: {
            contains: query.trim(),
          },
        },
        take: limit,
        skip: type === 'quran' ? skip : 0,
        include: {
          ayah: {
            include: {
              surah: true,
              tafsirs: {
                include: {
                  tafsirBook: true,
                },
              },
            },
          },
          translator: true,
        },
        orderBy: {
          ayahId: 'asc',
        },
      });

      // For each ayah result, fetch related hadiths
      const quranResultsWithHadiths = await Promise.all(
        quranResults.map(async (result) => {
          // Search for hadiths that mention the same keywords
          const relatedHadiths = await prisma.hadith.findMany({
            where: {
              textEnglish: {
                contains: query.trim(),
              },
            },
            take: 3, // Limit to 3 related hadiths per ayah
            include: {
              book: true,
              chapter: true,
            },
          });

          return {
            type: 'ayah',
            id: result.ayah.id,
            text: result.text,
            textArabic: result.ayah.textArabic,
            reference: `${result.ayah.surah.nameEnglish} ${result.ayah.ayahNumber}:${result.ayah.surah.number}`,
            surah: {
              id: result.ayah.surah.id,
              number: result.ayah.surah.number,
              nameEnglish: result.ayah.surah.nameEnglish,
              nameArabic: result.ayah.surah.nameArabic,
            },
            ayahNumber: result.ayah.ayahNumber,
            translator: result.translator.name,
            tafsirs: result.ayah.tafsirs.map(tafsir => ({
              id: tafsir.id,
              text: tafsir.text,
              tafsirBook: tafsir.tafsirBook.name,
              author: tafsir.tafsirBook.authorName,
            })),
            relatedHadiths: relatedHadiths.map(hadith => ({
              id: hadith.id,
              textArabic: hadith.textArabic,
              textEnglish: hadith.textEnglish,
              reference: `${hadith.book.name} ${hadith.hadithNumber}`,
              book: {
                id: hadith.book.id,
                name: hadith.book.name,
              },
              chapter: hadith.chapter ? {
                nameEnglish: hadith.chapter.nameEnglish,
              } : null,
              grade: hadith.grade,
            })),
          };
        })
      );

      results.push(...quranResultsWithHadiths);
    }

    // Search Hadith
    if (type === 'all' || type === 'hadith') {
      const hadithResults = await prisma.hadith.findMany({
        where: {
          OR: [
            {
              textEnglish: {
                contains: query.trim(),
              },
            },
            {
              textArabic: {
                contains: query.trim(),
              },
            },
          ],
        },
        take: limit,
        skip: type === 'hadith' ? skip : 0,
        include: {
          book: true,
          chapter: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      results.push(
        ...hadithResults.map(result => ({
          type: 'hadith',
          id: result.id,
          text: result.textEnglish,
          textArabic: result.textArabic,
          reference: `${result.book.name} ${result.hadithNumber}`,
          book: {
            id: result.book.id,
            name: result.book.name,
            nameArabic: result.book.nameArabic,
          },
          chapter: result.chapter ? {
            id: result.chapter.id,
            nameEnglish: result.chapter.nameEnglish,
          } : null,
          hadithNumber: result.hadithNumber,
          grade: result.grade,
        }))
      );
    }

    // Calculate total (this is approximate for 'all' type)
    const total = results.length;

    return paginatedResponse(results, page, limit, total);
  } catch (error) {
    console.error('Error searching:', error);
    return errorResponse('Search failed', 500);
  }
}
