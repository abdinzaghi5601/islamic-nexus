import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/quran/surahs/[id]
 * Get a specific surah with its ayahs, translations, and tafsir
 * Query params:
 *   - translations: comma-separated translator IDs (e.g., ?translations=1,2)
 *   - tafsir: comma-separated tafsir book IDs (e.g., ?tafsir=1,2)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surahNumber = parseInt(id);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return errorResponse('Invalid surah number. Must be between 1 and 114');
    }

    // Get translation and tafsir IDs from query params
    const searchParams = request.nextUrl.searchParams;
    const translationsParam = searchParams.get('translations');
    const translatorIds = translationsParam
      ? translationsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      : undefined;

    const tafsirParam = searchParams.get('tafsir');
    const tafsirIds = tafsirParam
      ? tafsirParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      : undefined;

    const surah = await prisma.surah.findUnique({
      where: { number: surahNumber },
      include: {
        ayahs: {
          orderBy: { ayahNumber: 'asc' },
          include: {
            translations: {
              where: translatorIds ? { translatorId: { in: translatorIds } } : undefined,
              include: {
                translator: true,
              },
            },
            tafsirs: {
              where: tafsirIds ? { tafsirBookId: { in: tafsirIds } } : undefined,
              include: {
                tafsirBook: true,
              },
            },
          },
        },
      },
    });

    if (!surah) {
      return errorResponse('Surah not found', 404);
    }

    return successResponse(surah);
  } catch (error) {
    console.error('Error fetching surah:', error);
    return errorResponse('Failed to fetch surah', 500);
  }
}
