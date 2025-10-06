import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/hadith/books
 * Get all hadith books
 */
export async function GET(request: NextRequest) {
  try {
    const books = await prisma.hadithBook.findMany({
      select: {
        id: true,
        name: true,
        nameArabic: true,
        author: true,
        description: true,
        totalHadiths: true,
      },
      orderBy: { id: 'asc' },
    });

    return successResponse(books);
  } catch (error) {
    console.error('Error fetching hadith books:', error);
    return errorResponse('Failed to fetch hadith books', 500);
  }
}
