import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse, getPaginationParams } from '@/lib/api/helpers';

/**
 * GET /api/hadith/books/[id]
 * Get a specific hadith book with chapters and optionally hadiths
 * Query params:
 *   - includeHadiths: true/false (default: false)
 *   - page: page number for hadiths pagination
 *   - limit: items per page for hadiths
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return errorResponse('Invalid book ID');
    }

    const searchParams = request.nextUrl.searchParams;
    const includeHadiths = searchParams.get('includeHadiths') === 'true';

    const book = await prisma.hadithBook.findUnique({
      where: { id: bookId },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
      },
    });

    if (!book) {
      return errorResponse('Hadith book not found', 404);
    }

    if (includeHadiths) {
      const { page, limit, skip } = getPaginationParams(searchParams);

      const [hadiths, total] = await Promise.all([
        prisma.hadith.findMany({
          where: { bookId },
          take: limit,
          skip,
          orderBy: { hadithNumber: 'asc' },
          include: {
            chapter: true,
          },
        }),
        prisma.hadith.count({ where: { bookId } }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          ...book,
          hadiths,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    return successResponse(book);
  } catch (error) {
    console.error('Error fetching hadith book:', error);
    return errorResponse('Failed to fetch hadith book', 500);
  }
}
