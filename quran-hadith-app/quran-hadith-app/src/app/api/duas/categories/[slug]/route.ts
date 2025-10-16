import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/duas/categories/[slug]
 * Get a specific dua category with its duas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await prisma.duaCategory.findUnique({
      where: { slug },
      include: {
        duas: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (error) {
    console.error('Error fetching dua category:', error);
    return errorResponse('Failed to fetch dua category', 500);
  }
}
