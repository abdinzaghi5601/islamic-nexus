/**
 * Tafsir API Service
 *
 * Service for accessing the free Tafsir API with 25 different tafsir editions
 * Base URL: https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@1/tafsir
 *
 * Features:
 * - 25 Tafsir editions (Arabic, English, Bengali, Urdu, Kurdish, Russian)
 * - Asbab Al-Nuzul (Reasons for Revelation) - UNIQUE!
 * - Classical and Companion perspectives
 * - Salafi-verified tafsirs marked
 * - No rate limits, completely free
 * - Fast CDN delivery
 *
 * Note: Sufi/Mystical tafsirs have been removed to align with Salafi methodology
 */

const TAFSIR_API_BASE_URL = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@1/tafsir';
const API_TIMEOUT = 10000;

// ============================================================================
// TYPES
// ============================================================================

export interface TafsirEdition {
  identifier: string;
  language: string;
  name: string;
  author: string;
  source: string;
}

export interface TafsirAyah {
  ayah: number;
  surah: number;
  text: string;
}

export interface TafsirSurah {
  ayahs: TafsirAyah[];
}

export type TafsirCategory = 'classical' | 'mystical' | 'companion' | 'concise' | 'historical' | 'general';

export interface TafsirEditionWithCategory extends TafsirEdition {
  category: TafsirCategory;
  description?: string;
  salafiVerified?: boolean; // Verified by Salafi scholars
}

// ============================================================================
// CACHE
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days (static content)

function getCacheKey(endpoint: string): string {
  return endpoint;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > CACHE_DURATION) {
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

async function fetchFromTafsirApi<T>(endpoint: string): Promise<T> {
  const url = `${TAFSIR_API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Tafsir API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Tafsir API request timeout');
      }
      throw new Error(`Tafsir API fetch failed: ${error.message}`);
    }

    throw new Error('Unknown error fetching from Tafsir API');
  }
}

// ============================================================================
// TAFSIR EDITIONS WITH CATEGORIES
// ============================================================================

export const TAFSIR_EDITIONS_ENHANCED: TafsirEditionWithCategory[] = [
  // HISTORICAL - UNIQUE!
  {
    identifier: 'en-asbab-al-nuzul-by-al-wahidi',
    language: 'english',
    name: 'Asbab Al-Nuzul by Al-Wahidi',
    author: 'Al-Wahidi',
    source: 'altafsir.com',
    category: 'historical',
    description: '⭐ Why verses were revealed - Historical context of each revelation',
    salafiVerified: true,
  },

  // CLASSICAL ENGLISH
  {
    identifier: 'en-tafisr-ibn-kathir',
    language: 'english',
    name: 'Tafsir Ibn Kathir (Abridged)',
    author: 'Hafiz Ibn Kathir',
    source: 'quran.com',
    category: 'classical',
    description: 'Most popular classical tafsir - comprehensive and authentic',
    salafiVerified: true,
  },
  {
    identifier: 'en-tafsir-maarif-ul-quran',
    language: 'english',
    name: "Maarif-ul-Quran",
    author: 'Mufti Muhammad Shafi',
    source: 'quran.com',
    category: 'classical',
    description: 'Detailed scholarly interpretation (Deobandi school)',
    salafiVerified: false,
  },
  {
    identifier: 'en-al-jalalayn',
    language: 'english',
    name: 'Tafsir al-Jalalayn',
    author: 'Jalal ad-Din al-Mahalli & Jalal ad-Din as-Suyuti',
    source: 'altafsir.com',
    category: 'concise',
    description: 'Concise, widely-studied classical tafsir (Ash\'ari background)',
    salafiVerified: false,
  },

  // COMPANION PERSPECTIVE
  {
    identifier: 'en-tafsir-ibn-abbas',
    language: 'english',
    name: "Tafsir Ibn 'Abbâs",
    author: 'Abdullah Ibn Abbas',
    source: 'altafsir.com',
    category: 'companion',
    description: 'Interpretation by the Prophet\'s cousin and companion',
    salafiVerified: true,
  },

  // ARABIC TAFSIRS
  {
    identifier: 'ar-tafsir-ibn-kathir',
    language: 'arabic',
    name: 'تفسير ابن كثير',
    author: 'Hafiz Ibn Kathir',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'ar-tafsir-al-tabari',
    language: 'arabic',
    name: 'تفسير الطبري',
    author: 'Al-Tabari',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'ar-tafseer-al-qurtubi',
    language: 'arabic',
    name: 'تفسير القرطبي',
    author: 'Al-Qurtubi',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'ar-tafsir-al-baghawi',
    language: 'arabic',
    name: 'تفسير البغوي',
    author: 'Al-Baghawi',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'ar-tafseer-al-saddi',
    language: 'arabic',
    name: 'تفسير السعدي',
    author: 'عبد الرحمن بن ناصر السعدي',
    source: 'quran.com',
    category: 'classical',
    description: 'من أشهر التفاسير المعاصرة - واضح وموجز',
    salafiVerified: true,
  },
  {
    identifier: 'ar-tafseer-tanwir-al-miqbas',
    language: 'arabic',
    name: 'تفسير تنوير المقباس',
    author: 'Tanweer',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'ar-tafsir-al-wasit',
    language: 'arabic',
    name: 'التفسير الوسيط',
    author: 'Waseet',
    source: 'quran.com',
    category: 'general',
    salafiVerified: false,
  },
  {
    identifier: 'ar-tafsir-muyassar',
    language: 'arabic',
    name: 'التفسير الميسر',
    author: 'المیسر',
    source: 'quran.com',
    category: 'concise',
    salafiVerified: true,
  },

  // BENGALI TAFSIRS
  {
    identifier: 'bn-tafisr-fathul-majid',
    language: 'bengali',
    name: 'Tafsir Fathul Majid',
    author: 'AbdulRahman Bin Hasan Al-Alshaikh',
    source: 'quran.com',
    category: 'general',
    salafiVerified: true,
  },
  {
    identifier: 'bn-tafseer-ibn-e-kaseer',
    language: 'bengali',
    name: 'Tafseer ibn Kathir',
    author: 'Tawheed Publication',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'bn-tafsir-ahsanul-bayaan',
    language: 'bengali',
    name: 'Tafsir Ahsanul Bayaan',
    author: 'Bayaan Foundation',
    source: 'quran.com',
    category: 'general',
    salafiVerified: true,
  },
  {
    identifier: 'bn-tafsir-abu-bakr-zakaria',
    language: 'bengali',
    name: 'Tafsir Abu Bakr Zakaria',
    author: 'King Fahd Quran Printing Complex',
    source: 'quran.com',
    category: 'general',
    salafiVerified: true,
  },

  // URDU TAFSIRS
  {
    identifier: 'ur-tafseer-ibn-e-kaseer',
    language: 'urdu',
    name: 'تفسیر ابنِ کثیر',
    author: 'Hafiz Ibn Kathir',
    source: 'quran.com',
    category: 'classical',
    salafiVerified: true,
  },
  {
    identifier: 'ur-tafsir-bayan-ul-quran',
    language: 'urdu',
    name: 'بیان القرآن',
    author: 'Dr. Israr Ahmad',
    source: 'quran.com',
    category: 'general',
    salafiVerified: false,
  },
  {
    identifier: 'ur-tazkirul-quran',
    language: 'urdu',
    name: 'تذکیر القرآن',
    author: 'Maulana Wahiduddin Khan',
    source: 'quran.com',
    category: 'general',
    salafiVerified: false,
  },

  // OTHER LANGUAGES
  {
    identifier: 'ru-tafseer-al-saddi',
    language: 'russian',
    name: 'Тафсир ас-Саади',
    author: 'Абдур-Рахман ибн Насир ас-Саади',
    source: 'quran.com',
    category: 'classical',
    description: 'Популярный современный тафсир',
    salafiVerified: true,
  },
  {
    identifier: 'kurd-tafsir-rebar',
    language: 'kurdish',
    name: 'Rebar Kurdish Tafsir',
    author: 'Rebar',
    source: 'quran.com',
    category: 'general',
    salafiVerified: false,
  },
];

// ============================================================================
// TAFSIR FUNCTIONS
// ============================================================================

/**
 * Get all available tafsir editions
 */
export async function getAllTafsirEditions(): Promise<TafsirEdition[]> {
  const cacheKey = getCacheKey('/editions.json');
  const cached = getFromCache<TafsirEdition[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const editions = await fetchFromTafsirApi<TafsirEdition[]>('/editions.json');
  setInCache(cacheKey, editions);
  return editions;
}

/**
 * Get tafsir for a specific ayah
 * @param editionIdentifier Edition slug (e.g., 'en-tafisr-ibn-kathir')
 * @param surahNumber Surah number (1-114)
 * @param ayahNumber Ayah number
 */
export async function getTafsirForAyah(
  editionIdentifier: string,
  surahNumber: number,
  ayahNumber: number
): Promise<TafsirAyah | null> {
  const cacheKey = getCacheKey(`/${editionIdentifier}/${surahNumber}.json`);

  try {
    let surahData = getFromCache<TafsirSurah>(cacheKey);

    if (!surahData) {
      surahData = await fetchFromTafsirApi<TafsirSurah>(`/${editionIdentifier}/${surahNumber}.json`);
      setInCache(cacheKey, surahData);
    }

    // Find the specific ayah
    const ayah = surahData.ayahs.find(a => a.ayah === ayahNumber);
    return ayah || null;
  } catch (error) {
    console.error(`Error fetching tafsir ${editionIdentifier} for ${surahNumber}:${ayahNumber}:`, error);
    return null;
  }
}

/**
 * Get tafsir for entire surah
 * @param editionIdentifier Edition slug
 * @param surahNumber Surah number (1-114)
 */
export async function getTafsirForSurah(
  editionIdentifier: string,
  surahNumber: number
): Promise<TafsirSurah | null> {
  const cacheKey = getCacheKey(`/${editionIdentifier}/${surahNumber}.json`);

  try {
    let surahData = getFromCache<TafsirSurah>(cacheKey);

    if (!surahData) {
      surahData = await fetchFromTafsirApi<TafsirSurah>(`/${editionIdentifier}/${surahNumber}.json`);
      setInCache(cacheKey, surahData);
    }

    return surahData;
  } catch (error) {
    console.error(`Error fetching tafsir ${editionIdentifier} for surah ${surahNumber}:`, error);
    return null;
  }
}

/**
 * Get Asbab Al-Nuzul (Reasons for Revelation) for specific ayah
 * This is the UNIQUE feature of this API!
 */
export async function getAsbabAlNuzul(
  surahNumber: number,
  ayahNumber: number
): Promise<TafsirAyah | null> {
  return getTafsirForAyah('en-asbab-al-nuzul-by-al-wahidi', surahNumber, ayahNumber);
}

/**
 * Get editions by language
 */
export function getEditionsByLanguage(language: string): TafsirEditionWithCategory[] {
  return TAFSIR_EDITIONS_ENHANCED.filter(e => e.language.toLowerCase() === language.toLowerCase());
}

/**
 * Get editions by category
 */
export function getEditionsByCategory(category: TafsirCategory): TafsirEditionWithCategory[] {
  return TAFSIR_EDITIONS_ENHANCED.filter(e => e.category === category);
}

/**
 * Get featured editions (most useful/unique - Salafi verified only)
 */
export function getFeaturedEditions(): TafsirEditionWithCategory[] {
  return [
    TAFSIR_EDITIONS_ENHANCED.find(e => e.identifier === 'en-asbab-al-nuzul-by-al-wahidi')!,
    TAFSIR_EDITIONS_ENHANCED.find(e => e.identifier === 'en-tafisr-ibn-kathir')!,
    TAFSIR_EDITIONS_ENHANCED.find(e => e.identifier === 'en-tafsir-ibn-abbas')!,
    TAFSIR_EDITIONS_ENHANCED.find(e => e.identifier === 'ar-tafseer-al-saddi')!,
    TAFSIR_EDITIONS_ENHANCED.find(e => e.identifier === 'ar-tafsir-al-tabari')!,
  ].filter(Boolean);
}

/**
 * Get Salafi-verified editions only
 */
export function getSalafiVerifiedEditions(): TafsirEditionWithCategory[] {
  return TAFSIR_EDITIONS_ENHANCED.filter(e => e.salafiVerified === true);
}

/**
 * Clear the cache
 */
export function clearTafsirCache(): void {
  cache.clear();
}

// ============================================================================
// CATEGORY HELPERS
// ============================================================================

export const TAFSIR_CATEGORIES = {
  historical: {
    name: 'Historical Context',
    description: 'Why verses were revealed',
    icon: '📜',
  },
  classical: {
    name: 'Classical',
    description: 'Traditional scholarly interpretations',
    icon: '📚',
  },
  mystical: {
    name: 'Mystical/Sufi',
    description: 'Spiritual and inner meanings',
    icon: '✨',
  },
  companion: {
    name: "Companion's View",
    description: 'From the Prophet\'s companions',
    icon: '👥',
  },
  concise: {
    name: 'Concise',
    description: 'Brief and to-the-point',
    icon: '📝',
  },
  general: {
    name: 'General',
    description: 'Comprehensive interpretations',
    icon: '📖',
  },
} as const;
