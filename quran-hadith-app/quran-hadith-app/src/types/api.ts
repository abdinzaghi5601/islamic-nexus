/**
 * API Response Types
 */

// ============================================================================
// QURAN TYPES
// ============================================================================

export interface Surah {
  id: number;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  order: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  numberInQuran: number;
  textArabic: string;
  textUthmani: string;
  textSimple: string;
  juz: number;
  manzil: number;
  ruku: number;
  hizbQuarter: number;
  sajdah: boolean;
}

export interface Translation {
  id: number;
  ayahId: number;
  translatorId: number;
  text: string;
  translator?: Translator;
}

export interface Translator {
  id: number;
  name: string;
  language: string;
  description?: string;
}

export interface AyahWithTranslations extends Ayah {
  translations: Translation[];
}

export interface SurahWithAyahs extends Surah {
  ayahs: AyahWithTranslations[];
}

// ============================================================================
// HADITH TYPES
// ============================================================================

export interface HadithBook {
  id: number;
  name: string;
  nameArabic?: string;
  author: string;
  description?: string;
  totalHadiths: number;
}

export interface HadithChapter {
  id: number;
  bookId: number;
  chapterNumber: number;
  nameArabic?: string;
  nameEnglish: string;
  intro?: string;
}

export interface Hadith {
  id: number;
  bookId: number;
  chapterId?: number;
  hadithNumber: string;
  hadithInChapter?: number;
  textArabic: string;
  textEnglish: string;
  narratorChain?: string;
  grade?: string;
}

export interface HadithWithBook extends Hadith {
  book: HadithBook;
  chapter?: HadithChapter;
}

export interface HadithBookWithChapters extends HadithBook {
  chapters: HadithChapter[];
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  type: 'ayah' | 'hadith';
  id: number;
  text: string;
  textArabic?: string;
  reference: string;
  surah?: Surah;
  book?: HadithBook;
}

// ============================================================================
// API RESPONSE WRAPPER
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
