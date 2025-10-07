import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/duas/categories
 * Get all dua categories
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.duaCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { duas: true },
        },
      },
    });

    return successResponse(categories);
  } catch (error) {
    console.error('Error fetching dua categories:', error);
    return errorResponse('Failed to fetch dua categories', 500);
  }
}
