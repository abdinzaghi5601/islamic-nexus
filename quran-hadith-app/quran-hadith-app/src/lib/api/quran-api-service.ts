/**
 * Quran.com API Service
 *
 * Centralized service for interacting with the Quran.com API
 * Base URL: https://api.quran.com/api/v4
 *
 * Features:
 * - Translations (100+ languages)
 * - Tafsirs (16+ interpretations)
 * - Verse Metadata (Juz, Hizb, Ruku, etc.)
 */

const QURAN_API_BASE_URL = process.env.NEXT_PUBLIC_QURAN_API_BASE_URL || 'https://api.quran.com/api/v4';
const API_TIMEOUT = parseInt(process.env.QURAN_API_TIMEOUT || '10000');

// ============================================================================
// TYPES
// ============================================================================

export interface QuranApiTranslation {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface QuranApiTafsir {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name?: {
    name: string;
    language_name: string;
  };
}

export interface QuranApiVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani?: string;
  text_imlaei?: string;
  translations?: Array<{
    id: number;
    resource_id: number;
    text: string;
    language_name: string;
    resource_name: string;
  }>;
  words?: any[];
}

export interface QuranApiChapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface QuranApiTafsirText {
  verse_id: number;
  verse_key: string;
  text: string;
  resource_id: number;
  resource_name: string;
  language_name: string;
}

// ============================================================================
// CACHE
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = {
  translations: 24 * 60 * 60 * 1000, // 24 hours
  tafsirs: 24 * 60 * 60 * 1000, // 24 hours
  verses: 60 * 60 * 1000, // 1 hour
  chapters: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function getCacheKey(endpoint: string, params?: Record<string, any>): string {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${endpoint}:${paramStr}`;
}

function getFromCache<T>(key: string, maxAge: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > maxAge) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setInCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// ============================================================================
// API FETCH HELPER
// ============================================================================

async function fetchFromQuranApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${QURAN_API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Quran API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Quran API request timeout');
      }
      throw new Error(`Quran API fetch failed: ${error.message}`);
    }

    throw new Error('Unknown error fetching from Quran API');
  }
}

// ============================================================================
// TRANSLATION FUNCTIONS
// ============================================================================

/**
 * Get all available translations
 * Returns 100+ translations across 50+ languages
 */
export async function getAvailableTranslations(): Promise<QuranApiTranslation[]> {
  const cacheKey = getCacheKey('translations');
  const cached = getFromCache<QuranApiTranslation[]>(cacheKey, CACHE_DURATION.translations);

  if (cached) {
    return cached;
  }

  const response = await fetchFromQuranApi<{ translations: QuranApiTranslation[] }>(
    '/resources/translations'
  );

  setInCache(cacheKey, response.translations);
  return response.translations;
}

/**
 * Get verse with specific translations
 * @param verseKey Format: "2:255" (surah:ayah)
 * @param translationIds Array of translation IDs (e.g., [20, 22, 85])
 */
export async function getVerseWithTranslations(
  verseKey: string,
  translationIds: number[]
): Promise<QuranApiVerse> {
  const cacheKey = getCacheKey(`verse:${verseKey}`, { translations: translationIds });
  const cached = getFromCache<QuranApiVerse>(cacheKey, CACHE_DURATION.verses);

  if (cached) {
    return cached;
  }

  const translationParam = translationIds.join(',');
  const response = await fetchFromQuranApi<{ verse: QuranApiVerse }>(
    `/verses/by_key/${verseKey}?translations=${translationParam}`
  );

  setInCache(cacheKey, response.verse);
  return response.verse;
}

/**
 * Get multiple verses from a chapter with translations
 * @param chapterNumber Chapter/Surah number (1-114)
 * @param translationIds Array of translation IDs
 * @param page Page number for pagination (default: 1)
 * @param perPage Items per page (default: 10)
 */
export async function getChapterVerses(
  chapterNumber: number,
  translationIds: number[],
  page: number = 1,
  perPage: number = 10
): Promise<{ verses: QuranApiVerse[]; pagination: any }> {
  const cacheKey = getCacheKey(`chapter:${chapterNumber}`, {
    translations: translationIds,
    page,
    perPage
  });
  const cached = getFromCache<any>(cacheKey, CACHE_DURATION.verses);

  if (cached) {
    return cached;
  }

  const translationParam = translationIds.join(',');
  const response = await fetchFromQuranApi<any>(
    `/verses/by_chapter/${chapterNumber}?translations=${translationParam}&page=${page}&per_page=${perPage}`
  );

  const result = {
    verses: response.verses,
    pagination: response.pagination,
  };

  setInCache(cacheKey, result);
  return result;
}

// ============================================================================
// TAFSIR FUNCTIONS
// ============================================================================

/**
 * Get all available tafsirs
 * Returns 16+ tafsirs in multiple languages
 */
export async function getAvailableTafsirs(): Promise<QuranApiTafsir[]> {
  const cacheKey = getCacheKey('tafsirs');
  const cached = getFromCache<QuranApiTafsir[]>(cacheKey, CACHE_DURATION.tafsirs);

  if (cached) {
    return cached;
  }

  const response = await fetchFromQuranApi<{ tafsirs: QuranApiTafsir[] }>(
    '/resources/tafsirs'
  );

  setInCache(cacheKey, response.tafsirs);
  return response.tafsirs;
}

/**
 * Get tafsir for a specific verse
 * @param verseKey Format: "2:255" (surah:ayah)
 * @param tafsirId Tafsir ID (e.g., 169 for Ibn Kathir English)
 */
export async function getTafsirForVerse(
  verseKey: string,
  tafsirId: number
): Promise<QuranApiTafsirText | null> {
  const cacheKey = getCacheKey(`tafsir:${verseKey}:${tafsirId}`);
  const cached = getFromCache<QuranApiTafsirText | null>(cacheKey, CACHE_DURATION.tafsirs);

  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetchFromQuranApi<{ tafsirs: QuranApiTafsirText[] }>(
      `/quran/tafsirs/${tafsirId}?verse_key=${verseKey}`
    );

    const tafsir = response.tafsirs.length > 0 ? response.tafsirs[0] : null;
    setInCache(cacheKey, tafsir);
    return tafsir;
  } catch (error) {
    // Some tafsirs may not have content for all verses
    console.error(`Error fetching tafsir ${tafsirId} for verse ${verseKey}:`, error);
    setInCache(cacheKey, null);
    return null;
  }
}

// ============================================================================
// CHAPTER FUNCTIONS
// ============================================================================

/**
 * Get all chapters
 */
export async function getAllChapters(): Promise<QuranApiChapter[]> {
  const cacheKey = getCacheKey('chapters');
  const cached = getFromCache<QuranApiChapter[]>(cacheKey, CACHE_DURATION.chapters);

  if (cached) {
    return cached;
  }

  const response = await fetchFromQuranApi<{ chapters: QuranApiChapter[] }>(
    '/chapters'
  );

  setInCache(cacheKey, response.chapters);
  return response.chapters;
}

/**
 * Get specific chapter info
 * @param chapterId Chapter number (1-114)
 */
export async function getChapter(chapterId: number): Promise<QuranApiChapter> {
  const cacheKey = getCacheKey(`chapter:${chapterId}`);
  const cached = getFromCache<QuranApiChapter>(cacheKey, CACHE_DURATION.chapters);

  if (cached) {
    return cached;
  }

  const response = await fetchFromQuranApi<{ chapter: QuranApiChapter }>(
    `/chapters/${chapterId}`
  );

  setInCache(cacheKey, response.chapter);
  return response.chapter;
}

// ============================================================================
// METADATA FUNCTIONS
// ============================================================================

/**
 * Get verse metadata (Juz, Hizb, Ruku, Manzil, Page)
 * @param verseKey Format: "2:255"
 */
export async function getVerseMetadata(verseKey: string): Promise<{
  juz_number: number;
  hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  page_number: number;
  verse_key: string;
}> {
  const cacheKey = getCacheKey(`metadata:${verseKey}`);
  const cached = getFromCache<any>(cacheKey, CACHE_DURATION.verses);

  if (cached) {
    return cached;
  }

  // Fetch verse without translations to get metadata only
  const response = await fetchFromQuranApi<{ verse: QuranApiVerse }>(
    `/verses/by_key/${verseKey}`
  );

  const metadata = {
    juz_number: response.verse.juz_number,
    hizb_number: response.verse.hizb_number,
    ruku_number: response.verse.ruku_number,
    manzil_number: response.verse.manzil_number,
    page_number: response.verse.page_number,
    verse_key: response.verse.verse_key,
  };

  setInCache(cacheKey, metadata);
  return metadata;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert surah and ayah numbers to verse_key format
 * @param surahNumber Surah number (1-114)
 * @param ayahNumber Ayah number
 * @returns Verse key in format "surah:ayah" (e.g., "2:255")
 */
export function toVerseKey(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

/**
 * Parse verse key into surah and ayah numbers
 * @param verseKey Format: "2:255"
 * @returns Object with surahNumber and ayahNumber
 */
export function fromVerseKey(verseKey: string): { surahNumber: number; ayahNumber: number } {
  const [surah, ayah] = verseKey.split(':').map(Number);
  return { surahNumber: surah, ayahNumber: ayah };
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Clear specific cache entry
 * @param key Cache key to clear
 */
export function clearCacheEntry(key: string): void {
  cache.delete(key);
}

// ============================================================================
// POPULAR TRANSLATIONS (Constants for quick access)
// ============================================================================

export const POPULAR_TRANSLATIONS = {
  SAHEEH_INTERNATIONAL: 20,
  YUSUF_ALI: 22,
  PICKTHALL: 19,
  ABDEL_HALEEM: 85,
  MAUDUDI_URDU: 97,
  JUNAGARHI_URDU: 54,
} as const;

// ============================================================================
// POPULAR TAFSIRS (Constants for quick access)
// ============================================================================

export const POPULAR_TAFSIRS = {
  IBN_KATHIR_ENGLISH: 169,
  MAARIF_QURAN_ENGLISH: 168,
  IBN_KATHIR_ARABIC: 14,
  TABARI_ARABIC: 15,
  QURTUBI_ARABIC: 90,
  SAADI_ARABIC: 91,
} as const;
