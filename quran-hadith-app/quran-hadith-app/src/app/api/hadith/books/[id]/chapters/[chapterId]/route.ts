import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/hadith/books/[id]/chapters/[chapterId]
 * Get a specific chapter with all its hadiths
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id, chapterId } = await params;
    const bookId = parseInt(id);
    const chapterIdInt = parseInt(chapterId);

    if (isNaN(bookId) || isNaN(chapterIdInt)) {
      return errorResponse('Invalid book or chapter ID');
    }

    // Fetch chapter with its book and hadiths
    const chapter = await prisma.hadithChapter.findUnique({
      where: { id: chapterIdInt },
      include: {
        book: true,
        hadiths: {
          orderBy: {
            hadithInChapter: 'asc',
          },
        },
      },
    });

    if (!chapter) {
      return errorResponse('Chapter not found', 404);
    }

    if (chapter.bookId !== bookId) {
      return errorResponse('Chapter does not belong to this book', 400);
    }

    return successResponse(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return errorResponse('Failed to fetch chapter', 500);
  }
}
