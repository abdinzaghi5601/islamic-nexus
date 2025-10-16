import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { getVerseWithTranslations, toVerseKey } from '@/lib/api/quran-api-service';

/**
 * POST /api/quran/external-translations
 * Fetch translations from Quran.com API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { surahNumber, ayahNumber, translationIds } = body;

    // Validate required fields
    if (!surahNumber || !ayahNumber || !translationIds || !Array.isArray(translationIds)) {
      return errorResponse('Missing required fields: surahNumber, ayahNumber, translationIds (array)');
    }

    // Validate translation IDs
    if (translationIds.length === 0) {
      return errorResponse('At least one translation ID is required');
    }

    // Convert to verse key format
    const verseKey = toVerseKey(surahNumber, ayahNumber);

    // Fetch translations from Quran.com API
    const verse = await getVerseWithTranslations(verseKey, translationIds);

    // Format the response
    const translations = verse.translations?.map((t) => ({
      id: t.resource_id,
      text: t.text,
      translatorName: t.resource_name,
      language: t.language_name,
      source: 'quran.com',
    })) || [];

    return successResponse({
      verseKey: verse.verse_key,
      translations,
      metadata: {
        juz: verse.juz_number,
        hizb: verse.hizb_number,
        ruku: verse.ruku_number,
        manzil: verse.manzil_number,
        page: verse.page_number,
      },
    });
  } catch (error) {
    console.error('Error fetching external translations:', error);
    return errorResponse('Failed to fetch translations from Quran.com API', 500);
  }
}
