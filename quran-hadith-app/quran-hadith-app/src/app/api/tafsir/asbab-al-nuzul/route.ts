import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { getAsbabAlNuzul } from '@/lib/api/tafsir-api-service';

/**
 * POST /api/tafsir/asbab-al-nuzul
 * Get Asbab Al-Nuzul (reasons for revelation) for a specific ayah
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { surahNumber, ayahNumber } = body;

    // Validate required fields
    if (!surahNumber || !ayahNumber) {
      return errorResponse('Missing required fields: surahNumber, ayahNumber');
    }

    // Fetch Asbab Al-Nuzul
    const asbab = await getAsbabAlNuzul(surahNumber, ayahNumber);

    if (!asbab || !asbab.text) {
      return errorResponse('Historical context not available for this verse', 404);
    }

    return successResponse({
      text: asbab.text,
      surah: asbab.surah,
      ayah: asbab.ayah,
    });
  } catch (error) {
    console.error('Error fetching Asbab Al-Nuzul:', error);
    return errorResponse('Failed to fetch historical context', 500);
  }
}
