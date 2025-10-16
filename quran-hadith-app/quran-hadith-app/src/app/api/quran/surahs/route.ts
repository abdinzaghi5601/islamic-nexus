import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/quran/surahs
 * Get all surahs (chapters)
 */
export async function GET(request: NextRequest) {
  try {
    const surahs = await prisma.surah.findMany({
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        nameArabic: true,
        nameEnglish: true,
        nameTranslation: true,
        revelationType: true,
        numberOfAyahs: true,
        order: true,
      },
    });

    return successResponse(surahs);
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return errorResponse('Failed to fetch surahs', 500);
  }
}
