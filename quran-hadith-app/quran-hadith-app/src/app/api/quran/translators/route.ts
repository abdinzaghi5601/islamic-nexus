import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/quran/translators
 * Get all available translators
 */
export async function GET(request: NextRequest) {
  try {
    const translators = await prisma.translator.findMany({
      select: {
        id: true,
        name: true,
        language: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(translators);
  } catch (error) {
    console.error('Error fetching translators:', error);
    return errorResponse('Failed to fetch translators', 500);
  }
}
