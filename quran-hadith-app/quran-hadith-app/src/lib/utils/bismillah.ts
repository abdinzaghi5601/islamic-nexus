/**
 * Bismillah Utility Functions
 *
 * Handles the correct display of Bismillah in Quranic text according to Islamic rules:
 *
 * 1. Surah Al-Fatiha (1): Bismillah IS Ayah #1 - Do NOT remove
 * 2. Surah At-Tawbah (9): Has NO Bismillah at all
 * 3. All other Surahs (2-8, 10-114): Bismillah is a HEADER/SEPARATOR, not part of ayah text
 *
 * This ensures that when displaying individual ayahs, Bismillah is not incorrectly
 * attached to the first ayah of surahs where it should be a separate header.
 */

/**
 * Comprehensive Bismillah patterns to match various Unicode representations
 * Handles different diacritical marks and Unicode variations
 */
const BISMILLAH_PATTERNS = [
  // Standard Bismillah patterns with various Unicode representations
  /بِسْمِ\s*[اٱ]للَّهِ\s*[اٱ]لرَّحْمَٰنِ\s*[اٱ]لرَّحِيمِ\s*/g,
  /بِسْمِ\s*[اٱ]للَّهِ\s*[اٱ]لرَّحْمَٰنِ\s*[اٱ]لرحيم\s*/g,
  /بِسْمِ\s*[اٱ]للَّهِ\s*[اٱ]لرحمن\s*[اٱ]لرَّحِيمِ\s*/g,
  /بِسْمِ\s*[اٱ]للَّهِ\s*[اٱ]لرحمن\s*[اٱ]لرحيم\s*/g,

  // Patterns without full diacritics
  /بسم\s*[اٱ]للَّهِ\s*[اٱ]لرَّحْمَٰنِ\s*[اٱ]لرَّحِيمِ\s*/g,
  /بسم\s*[اٱ]للَّهِ\s*[اٱ]لرحمن\s*[اٱ]لرحيم\s*/g,

  // More flexible patterns to catch edge cases
  /بِسْمِ[^ي]*[اٱ]لرَّحِيمِ\s*/g,
  /بِسْمِ[^ي]*[اٱ]لرحيم\s*/g,

  // Patterns matching from start of text
  /^[^ي]*[اٱ]لرَّحِيمِ\s*/,
  /^[^ي]*[اٱ]لرحيم\s*/,
];

/**
 * Additional cleanup patterns for Bismillah-like text at the beginning
 * Looks for patterns that start with "بسم" or "بِسْمِ" and end with "الرحيم" or "الرحيمِ"
 */
const START_PATTERNS = [
  /^[بِسْمِ\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرَّحِيمِ\s*/,
  /^[بِسْمِ\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرحيم\s*/,
  /^[بسم\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرَّحِيمِ\s*/,
  /^[بسم\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرحيم\s*/,
];

/**
 * Removes Bismillah from Arabic text
 *
 * This function removes all variations of Bismillah text from the input string.
 * It handles multiple Unicode representations and diacritic variations.
 *
 * @param text - The Arabic text that may contain Bismillah
 * @returns The text with Bismillah removed and trimmed
 */
export function removeBismillah(text: string): string {
  if (!text) return text;

  let cleanedText = text;

  // Try each standard pattern and remove matches
  for (const pattern of BISMILLAH_PATTERNS) {
    cleanedText = cleanedText.replace(pattern, '');
  }

  // Additional cleanup for Bismillah-like text at the beginning
  for (const pattern of START_PATTERNS) {
    cleanedText = cleanedText.replace(pattern, '');
  }

  return cleanedText.trim();
}

/**
 * Determines if Bismillah should be removed from an ayah's text
 *
 * Islamic Rules:
 * - Surah 1 (Al-Fatiha): Bismillah IS ayah 1 - keep it
 * - Surah 9 (At-Tawbah): No Bismillah at all - nothing to remove
 * - All other surahs: Bismillah is a header - remove from ayah text
 *
 * @param surahNumber - The surah number (1-114)
 * @param ayahNumber - The ayah number within the surah
 * @returns true if Bismillah should be removed, false otherwise
 */
export function shouldRemoveBismillah(surahNumber: number, ayahNumber: number): boolean {
  // Never remove from Al-Fatiha (surah 1) - Bismillah IS the first ayah
  if (surahNumber === 1) {
    return false;
  }

  // At-Tawbah (surah 9) has no Bismillah at all
  if (surahNumber === 9) {
    return false;
  }

  // For all other surahs (2-8, 10-114), Bismillah should be removed from ayah text
  // It's most commonly in ayah 1, but we check all ayahs to be safe
  return true;
}

/**
 * Gets the cleaned Arabic text for an ayah
 *
 * This is a convenience function that combines the logic of determining
 * whether Bismillah should be removed and actually removing it.
 *
 * @param arabicText - The raw Arabic text from the database
 * @param surahNumber - The surah number (1-114)
 * @param ayahNumber - The ayah number within the surah
 * @returns The cleaned Arabic text with Bismillah removed if appropriate
 */
export function getCleanedAyahText(
  arabicText: string,
  surahNumber: number,
  ayahNumber: number
): string {
  if (!arabicText) return arabicText;

  if (shouldRemoveBismillah(surahNumber, ayahNumber)) {
    return removeBismillah(arabicText);
  }

  return arabicText;
}

/**
 * Checks if text contains Bismillah
 *
 * Useful for debugging and validation purposes.
 *
 * @param text - The text to check
 * @returns true if the text contains any form of Bismillah
 */
export function containsBismillah(text: string): boolean {
  if (!text) return false;

  for (const pattern of BISMILLAH_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }

  return false;
}

/**
 * Gets Bismillah text in standard form
 *
 * @returns The standard Bismillah text with full diacritics
 */
export function getBismillahText(): string {
  return 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
}

/**
 * Gets Bismillah translation
 *
 * @returns The English translation of Bismillah
 */
export function getBismillahTranslation(): string {
  return 'In the name of Allah, the Most Gracious, the Most Merciful';
}
