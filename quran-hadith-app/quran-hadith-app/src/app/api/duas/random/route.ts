import { NextResponse } from 'next/server';
import { getRandomDua, getRandomDuaByCategory, getAllCategories } from '@/lib/api/dua-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/duas/random
 * Get a random dua, optionally filtered by category
 * Query params:
 *   - category: filter by category name (optional)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let dua;

    if (category && category !== 'all') {
      dua = getRandomDuaByCategory(category);

      if (!dua) {
        return NextResponse.json(
          { success: false, error: `No duas found for category: ${category}` },
          { status: 404 }
        );
      }
    } else {
      dua = getRandomDua();
    }

    return NextResponse.json({
      success: true,
      dua,
    });
  } catch (error) {
    console.error('Error fetching random dua:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch random dua' },
      { status: 500 }
    );
  }
}
