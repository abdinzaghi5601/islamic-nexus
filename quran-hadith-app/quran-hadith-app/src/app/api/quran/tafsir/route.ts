import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/quran/tafsir
 * Get all available tafsir books
 */
export async function GET(request: NextRequest) {
  try {
    const tafsirBooks = await prisma.tafsirBook.findMany({
      select: {
        id: true,
        name: true,
        authorName: true,
        language: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(tafsirBooks);
  } catch (error) {
    console.error('Error fetching tafsir books:', error);
    return errorResponse('Failed to fetch tafsir books', 500);
  }
}
