/**
 * Dua & Azkar Service
 *
 * Service for managing Islamic supplications (duas) and remembrances (azkar)
 * Compatible with islam.js Azkar format
 */

import duasData from '@/lib/data/duas.json';

// ============================================================================
// TYPES
// ============================================================================

export interface Dua {
  id: number;
  category: string;
  categoryArabic: string;
  zikr: string; // Arabic text
  translation: string;
  transliteration?: string;
  reference: string;
  count: string;
  description: string;
  benefits?: string;
}

export interface DuaCategory {
  name: string;
  nameArabic: string;
  count: number;
  icon?: string;
}

// ============================================================================
// DUA CATEGORIES
// ============================================================================

export const DUA_CATEGORIES = {
  MORNING: 'Morning Azkar',
  EVENING: 'Evening Azkar',
  ANXIETY: 'Anxiety & Distress',
  SLEEP: 'Before Sleep',
  WAKING: 'Upon Waking',
  ADHAN: 'After Adhan',
  MASJID_ENTERING: 'Entering Masjid',
  MASJID_LEAVING: 'Leaving Masjid',
  EATING_BEFORE: 'Before Eating',
  EATING_AFTER: 'After Eating',
  TRAVEL: 'Travel Duas',
  RAIN: 'Rain & Weather',
  GRATITUDE: 'Gratitude & Praise',
  PROTECTION: 'Protection & Refuge',
  FORGIVENESS: 'Seeking Forgiveness',
  GUIDANCE: 'Seeking Guidance',
  HEALTH: 'Health & Healing',
  KNOWLEDGE: 'Seeking Knowledge',
  FAMILY: 'Family & Children',
  GENERAL: 'General Supplications',
} as const;

export const CATEGORY_METADATA: Record<string, { icon: string; color: string }> = {
  'Morning Azkar': { icon: '🌅', color: 'bg-amber-500/20' },
  'Evening Azkar': { icon: '🌙', color: 'bg-blue-500/20' },
  'Anxiety & Distress': { icon: '🤲', color: 'bg-green-500/20' },
  'Before Sleep': { icon: '😴', color: 'bg-indigo-500/20' },
  'Upon Waking': { icon: '☀️', color: 'bg-yellow-500/20' },
  'After Adhan': { icon: '📿', color: 'bg-purple-500/20' },
  'Entering Masjid': { icon: '🕌', color: 'bg-teal-500/20' },
  'Leaving Masjid': { icon: '🚶', color: 'bg-cyan-500/20' },
  'Before Eating': { icon: '🍽️', color: 'bg-orange-500/20' },
  'After Eating': { icon: '🙏', color: 'bg-pink-500/20' },
  'Travel Duas': { icon: '✈️', color: 'bg-sky-500/20' },
  'Rain & Weather': { icon: '🌧️', color: 'bg-blue-400/20' },
  'Gratitude & Praise': { icon: '✨', color: 'bg-yellow-400/20' },
  'Protection & Refuge': { icon: '🛡️', color: 'bg-red-500/20' },
  'Seeking Forgiveness': { icon: '💚', color: 'bg-emerald-500/20' },
  'Seeking Guidance': { icon: '🧭', color: 'bg-indigo-400/20' },
  'Health & Healing': { icon: '💊', color: 'bg-green-400/20' },
  'Seeking Knowledge': { icon: '📚', color: 'bg-purple-400/20' },
  'Family & Children': { icon: '👨‍👩‍👧‍👦', color: 'bg-pink-400/20' },
  'General Supplications': { icon: '🤲', color: 'bg-gray-500/20' },
};

// ============================================================================
// DUA FUNCTIONS
// ============================================================================

/**
 * Get all duas
 */
export function getAllDuas(): Dua[] {
  return duasData as Dua[];
}

/**
 * Get a random dua
 */
export function getRandomDua(): Dua {
  const duas = getAllDuas();
  const randomIndex = Math.floor(Math.random() * duas.length);
  return duas[randomIndex];
}

/**
 * Get random dua by category
 */
export function getRandomDuaByCategory(category: string): Dua | null {
  const duas = getDuasByCategory(category);
  if (duas.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * duas.length);
  return duas[randomIndex];
}

/**
 * Get duas by category
 */
export function getDuasByCategory(category: string): Dua[] {
  return getAllDuas().filter(dua => dua.category === category);
}

/**
 * Get dua by ID
 */
export function getDuaById(id: number): Dua | null {
  return getAllDuas().find(dua => dua.id === id) || null;
}

/**
 * Get all categories with count
 */
export function getAllCategories(): DuaCategory[] {
  const duas = getAllDuas();
  const categoryMap = new Map<string, { nameArabic: string; count: number }>();

  duas.forEach(dua => {
    const existing = categoryMap.get(dua.category);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(dua.category, {
        nameArabic: dua.categoryArabic,
        count: 1,
      });
    }
  });

  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    nameArabic: data.nameArabic,
    count: data.count,
    icon: CATEGORY_METADATA[name]?.icon || '🤲',
  }));
}

/**
 * Search duas by text (Arabic or translation)
 */
export function searchDuas(query: string): Dua[] {
  const lowerQuery = query.toLowerCase();
  return getAllDuas().filter(dua =>
    dua.zikr.includes(query) ||
    dua.translation.toLowerCase().includes(lowerQuery) ||
    dua.category.toLowerCase().includes(lowerQuery) ||
    dua.description.toLowerCase().includes(lowerQuery) ||
    (dua.transliteration && dua.transliteration.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get daily duas (morning or evening based on time)
 */
export function getDailyDuas(): {
  type: 'morning' | 'evening';
  duas: Dua[];
} {
  const hour = new Date().getHours();
  const isMorning = hour >= 6 && hour < 12;
  const category = isMorning ? 'Morning Azkar' : 'Evening Azkar';

  return {
    type: isMorning ? 'morning' : 'evening',
    duas: getDuasByCategory(category),
  };
}

/**
 * Get duas for specific occasions
 */
export function getDuasForOccasion(occasion: string): Dua[] {
  const occasionCategories: Record<string, string[]> = {
    prayer: ['After Adhan', 'Entering Masjid', 'Leaving Masjid'],
    food: ['Before Eating', 'After Eating'],
    sleep: ['Before Sleep', 'Upon Waking'],
    daily: ['Morning Azkar', 'Evening Azkar'],
    difficulty: ['Anxiety & Distress', 'Protection & Refuge', 'Seeking Forgiveness'],
  };

  const categories = occasionCategories[occasion.toLowerCase()] || [];
  return getAllDuas().filter(dua => categories.includes(dua.category));
}

/**
 * Get featured duas (most important/common)
 */
export function getFeaturedDuas(): Dua[] {
  const featuredCategories = ['Morning Azkar', 'Evening Azkar', 'Anxiety & Distress'];
  return getAllDuas().filter(dua => featuredCategories.includes(dua.category));
}

/**
 * Format dua count (e.g., "3" -> "Recite 3 times")
 */
export function formatDuaCount(count: string): string {
  if (!count || count === '') return '';
  if (count === '1') return 'Recite once';
  return `Recite ${count} times`;
}

/**
 * Get category metadata
 */
export function getCategoryMetadata(category: string) {
  return CATEGORY_METADATA[category] || { icon: '🤲', color: 'bg-gray-500/20' };
}
