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
            mode: 'insensitive',
          },
        },
        take: limit,
        skip: type === 'quran' ? skip : 0,
        include: {
          ayah: {
            include: {
              surah: true,
            },
          },
          translator: true,
        },
        orderBy: {
          ayahId: 'asc',
        },
      });

      results.push(
        ...quranResults.map(result => ({
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
        }))
      );
    }

    // Search Hadith
    if (type === 'all' || type === 'hadith') {
      const hadithResults = await prisma.hadith.findMany({
        where: {
          OR: [
            {
              textEnglish: {
                contains: query.trim(),
                mode: 'insensitive',
              },
            },
            {
              textArabic: {
                contains: query.trim(),
                mode: 'insensitive',
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
