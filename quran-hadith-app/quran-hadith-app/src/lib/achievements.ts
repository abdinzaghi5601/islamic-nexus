// Achievement definitions and criteria

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'reading' | 'bookmarks' | 'streak' | 'exploration';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: {
    type: 'ayah_reads' | 'bookmarks' | 'streak' | 'hadith_bookmarks' | 'dua_bookmarks' | 'unique_ayahs' | 'surahs_completed';
    threshold: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  // Reading Achievements
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Read your first ayah',
    icon: '📖',
    category: 'reading',
    tier: 'bronze',
    criteria: {
      type: 'ayah_reads',
      threshold: 1,
    },
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Read 50 unique ayahs',
    icon: '📚',
    category: 'reading',
    tier: 'silver',
    criteria: {
      type: 'unique_ayahs',
      threshold: 50,
    },
  },
  {
    id: 'quran_explorer',
    name: 'Quran Explorer',
    description: 'Read 200 unique ayahs',
    icon: '🌟',
    category: 'reading',
    tier: 'gold',
    criteria: {
      type: 'unique_ayahs',
      threshold: 200,
    },
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Read 500 unique ayahs',
    icon: '🎓',
    category: 'reading',
    tier: 'platinum',
    criteria: {
      type: 'unique_ayahs',
      threshold: 500,
    },
  },

  // Bookmark Achievements
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Bookmark your first ayah',
    icon: '❤️',
    category: 'bookmarks',
    tier: 'bronze',
    criteria: {
      type: 'bookmarks',
      threshold: 1,
    },
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Save 10 bookmarks',
    icon: '💝',
    category: 'bookmarks',
    tier: 'silver',
    criteria: {
      type: 'bookmarks',
      threshold: 10,
    },
  },
  {
    id: 'archivist',
    name: 'Archivist',
    description: 'Save 50 bookmarks',
    icon: '💎',
    category: 'bookmarks',
    tier: 'gold',
    criteria: {
      type: 'bookmarks',
      threshold: 50,
    },
  },

  // Streak Achievements
  {
    id: 'dedicated_reader',
    name: 'Dedicated Reader',
    description: 'Maintain a 3-day reading streak',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    criteria: {
      type: 'streak',
      threshold: 3,
    },
  },
  {
    id: 'committed_scholar',
    name: 'Committed Scholar',
    description: 'Maintain a 7-day reading streak',
    icon: '⚡',
    category: 'streak',
    tier: 'silver',
    criteria: {
      type: 'streak',
      threshold: 7,
    },
  },
  {
    id: 'devoted_student',
    name: 'Devoted Student',
    description: 'Maintain a 30-day reading streak',
    icon: '✨',
    category: 'streak',
    tier: 'gold',
    criteria: {
      type: 'streak',
      threshold: 30,
    },
  },
  {
    id: 'unwavering_faith',
    name: 'Unwavering Faith',
    description: 'Maintain a 100-day reading streak',
    icon: '🌙',
    category: 'streak',
    tier: 'platinum',
    criteria: {
      type: 'streak',
      threshold: 100,
    },
  },

  // Hadith & Dua Achievements
  {
    id: 'hadith_student',
    name: 'Hadith Student',
    description: 'Bookmark 5 hadiths',
    icon: '📜',
    category: 'exploration',
    tier: 'bronze',
    criteria: {
      type: 'hadith_bookmarks',
      threshold: 5,
    },
  },
  {
    id: 'hadith_scholar',
    name: 'Hadith Scholar',
    description: 'Bookmark 25 hadiths',
    icon: '📋',
    category: 'exploration',
    tier: 'silver',
    criteria: {
      type: 'hadith_bookmarks',
      threshold: 25,
    },
  },
  {
    id: 'prayer_beginner',
    name: 'Prayer Beginner',
    description: 'Learn 3 duas',
    icon: '🤲',
    category: 'exploration',
    tier: 'bronze',
    criteria: {
      type: 'dua_bookmarks',
      threshold: 3,
    },
  },
  {
    id: 'prayer_master',
    name: 'Prayer Master',
    description: 'Learn 10 duas',
    icon: '🕌',
    category: 'exploration',
    tier: 'silver',
    criteria: {
      type: 'dua_bookmarks',
      threshold: 10,
    },
  },
];

// Check which achievements a user has unlocked
export function checkAchievements(userStats: {
  ayahReads: number;
  uniqueAyahs: number;
  bookmarks: number;
  hadithBookmarks: number;
  duaBookmarks: number;
  streak: number;
}): Achievement[] {
  const unlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    let isUnlocked = false;

    switch (achievement.criteria.type) {
      case 'ayah_reads':
        isUnlocked = userStats.ayahReads >= achievement.criteria.threshold;
        break;
      case 'unique_ayahs':
        isUnlocked = userStats.uniqueAyahs >= achievement.criteria.threshold;
        break;
      case 'bookmarks':
        isUnlocked = userStats.bookmarks >= achievement.criteria.threshold;
        break;
      case 'hadith_bookmarks':
        isUnlocked = userStats.hadithBookmarks >= achievement.criteria.threshold;
        break;
      case 'dua_bookmarks':
        isUnlocked = userStats.duaBookmarks >= achievement.criteria.threshold;
        break;
      case 'streak':
        isUnlocked = userStats.streak >= achievement.criteria.threshold;
        break;
    }

    if (isUnlocked) {
      unlocked.push(achievement);
    }
  }

  return unlocked;
}
