import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse, getPaginationParams, paginatedResponse } from '@/lib/api/helpers';

/**
 * GET /api/duas
 * Get all duas with optional filtering
 * Query params:
 *   - categoryId: filter by category
 *   - search: search in title, text, tags
 *   - page: page number
 *   - limit: items per page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const searchQuery = searchParams.get('search');
    const { page, limit, skip } = getPaginationParams(searchParams);

    const where: any = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery } },
        { titleArabic: { contains: searchQuery } },
        { textEnglish: { contains: searchQuery } },
        { textArabic: { contains: searchQuery } },
        { tags: { contains: searchQuery } },
      ];
    }

    const [duas, total] = await Promise.all([
      prisma.dua.findMany({
        where,
        take: limit,
        skip,
        include: {
          category: true,
        },
        orderBy: { id: 'asc' },
      }),
      prisma.dua.count({ where }),
    ]);

    return paginatedResponse(duas, page, limit, total);
  } catch (error) {
    console.error('Error fetching duas:', error);
    return errorResponse('Failed to fetch duas', 500);
  }
}
