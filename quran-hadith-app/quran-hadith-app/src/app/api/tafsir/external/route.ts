import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { getTafsirForAyah } from '@/lib/api/tafsir-api-service';

/**
 * POST /api/tafsir/external
 * Fetch external tafsir for a specific ayah
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { surahNumber, ayahNumber, editionIdentifier } = body;

    // Validate required fields
    if (!surahNumber || !ayahNumber || !editionIdentifier) {
      return errorResponse('Missing required fields: surahNumber, ayahNumber, editionIdentifier');
    }

    // Fetch tafsir
    const tafsir = await getTafsirForAyah(editionIdentifier, surahNumber, ayahNumber);

    if (!tafsir || !tafsir.text) {
      return errorResponse('Tafsir not available for this verse', 404);
    }

    return successResponse({
      text: tafsir.text,
      surah: tafsir.surah,
      ayah: tafsir.ayah,
      edition: editionIdentifier,
    });
  } catch (error) {
    console.error('Error fetching external tafsir:', error);
    return errorResponse('Failed to fetch tafsir', 500);
  }
}
