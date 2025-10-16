// lib/utils/search-utils.ts
// Utilities for search query analysis and term expansion

export interface ProphetInfo {
  english: string[];
  arabic: string[];
  variations: string[];
  relatedTopics?: string[];
}

export const PROPHETS: Record<string, ProphetInfo> = {
  adam: {
    english: ['Adam'],
    arabic: ['آدم'],
    variations: ['adam', 'adem'],
    relatedTopics: ['creation', 'paradise', 'forgiveness', 'knowledge'],
  },
  noah: {
    english: ['Noah', 'Nuh'],
    arabic: ['نوح'],
    variations: ['noah', 'nuh', 'nooh'],
    relatedTopics: ['flood', 'ark', 'patience', 'warning', 'destruction'],
  },
  abraham: {
    english: ['Abraham', 'Ibrahim'],
    arabic: ['إبراهيم'],
    variations: ['abraham', 'ibrahim', 'ibraheem'],
    relatedTopics: ['kaaba', 'sacrifice', 'idols', 'faith', 'hospitality'],
  },
  moses: {
    english: ['Moses', 'Musa'],
    arabic: ['موسى'],
    variations: ['moses', 'musa', 'moosa'],
    relatedTopics: ['pharaoh', 'miracles', 'staff', 'exodus', 'tablets'],
  },
  jesus: {
    english: ['Jesus', 'Isa'],
    arabic: ['عيسى'],
    variations: ['jesus', 'isa', 'eesa'],
    relatedTopics: ['miracles', 'mary', 'disciples', 'gospel', 'messiah'],
  },
  muhammad: {
    english: ['Muhammad', 'Mohammed'],
    arabic: ['محمد'],
    variations: ['muhammad', 'mohammed', 'mohamed', 'prophet'],
    relatedTopics: ['revelation', 'hijrah', 'companions', 'battles', 'character'],
  },
  joseph: {
    english: ['Joseph', 'Yusuf'],
    arabic: ['يوسف'],
    variations: ['joseph', 'yusuf', 'yousuf', 'yousef'],
    relatedTopics: ['dreams', 'egypt', 'patience', 'brothers', 'forgiveness'],
  },
  david: {
    english: ['David', 'Dawud'],
    arabic: ['داود', 'داوود'],
    variations: ['david', 'dawud', 'dawood', 'daud'],
    relatedTopics: ['psalms', 'zabur', 'goliath', 'judgment', 'kingdom'],
  },
  solomon: {
    english: ['Solomon', 'Sulaiman'],
    arabic: ['سليمان'],
    variations: ['solomon', 'sulaiman', 'sulayman', 'suleiman'],
    relatedTopics: ['wisdom', 'sheba', 'jinn', 'animals', 'kingdom'],
  },
  jonah: {
    english: ['Jonah', 'Yunus'],
    arabic: ['يونس'],
    variations: ['jonah', 'yunus', 'yoonus'],
    relatedTopics: ['whale', 'fish', 'repentance', 'patience', 'nineveh'],
  },
  job: {
    english: ['Job', 'Ayyub'],
    arabic: ['أيوب'],
    variations: ['job', 'ayyub', 'ayub', 'ayoob'],
    relatedTopics: ['patience', 'trials', 'suffering', 'healing', 'perseverance'],
  },
  lot: {
    english: ['Lot', 'Lut'],
    arabic: ['لوط'],
    variations: ['lot', 'lut', 'loot'],
    relatedTopics: ['sodom', 'punishment', 'warning', 'destruction'],
  },
  ishmael: {
    english: ['Ishmael', 'Ismail'],
    arabic: ['إسماعيل'],
    variations: ['ishmael', 'ismail', 'ismael'],
    relatedTopics: ['sacrifice', 'kaaba', 'zamzam', 'mecca'],
  },
  isaac: {
    english: ['Isaac', 'Ishaq'],
    arabic: ['إسحاق', 'إسحٰق'],
    variations: ['isaac', 'ishaq', 'ishaaq'],
    relatedTopics: ['sacrifice', 'covenant', 'blessing'],
  },
  jacob: {
    english: ['Jacob', 'Yaqub'],
    arabic: ['يعقوب'],
    variations: ['jacob', 'yaqub', 'yacoob'],
    relatedTopics: ['patience', 'sons', 'joseph', 'grief'],
  },
  aaron: {
    english: ['Aaron', 'Harun'],
    arabic: ['هارون'],
    variations: ['aaron', 'harun', 'haroon'],
    relatedTopics: ['moses', 'pharaoh', 'golden calf', 'priesthood'],
  },
  zachariah: {
    english: ['Zachariah', 'Zakariya'],
    arabic: ['زكريا'],
    variations: ['zachariah', 'zakariya', 'zakaria'],
    relatedTopics: ['dua', 'john', 'old age', 'miracles'],
  },
  john: {
    english: ['John', 'Yahya'],
    arabic: ['يحيى'],
    variations: ['john', 'yahya', 'yehya'],
    relatedTopics: ['prophet', 'wisdom', 'youth', 'zachariah'],
  },
  elijah: {
    english: ['Elijah', 'Ilyas'],
    arabic: ['إلياس'],
    variations: ['elijah', 'ilyas', 'elias'],
    relatedTopics: ['prophet', 'guidance', 'worship'],
  },
  elisha: {
    english: ['Elisha', 'Alyasa'],
    arabic: ['اليسع'],
    variations: ['elisha', 'alyasa', 'alyas'],
    relatedTopics: ['prophet', 'miracles', 'guidance'],
  },
};

export interface TopicInfo {
  keywords: string[];
  relatedTerms: string[];
  arabicTerms?: string[];
}

export const TOPICS: Record<string, TopicInfo> = {
  forgiveness: {
    keywords: ['forgiveness', 'forgive', 'pardon', 'repentance', 'repent'],
    relatedTerms: ['mercy', 'sin', 'tawbah', 'maghfirah', 'atonement', 'pardon'],
    arabicTerms: ['غفران', 'مغفرة', 'توبة'],
  },
  patience: {
    keywords: ['patience', 'patient', 'perseverance', 'endurance'],
    relatedTerms: ['sabr', 'steadfast', 'forbearance', 'trials', 'hardship', 'persevere'],
    arabicTerms: ['صبر'],
  },
  prayer: {
    keywords: ['prayer', 'pray', 'salah', 'salat', 'worship'],
    relatedTerms: ['prostration', 'ruku', 'sujood', 'qiyam', 'tahajjud', 'namaz'],
    arabicTerms: ['صلاة', 'صلوة'],
  },
  dua: {
    keywords: ['dua', 'supplication', 'invocation'],
    relatedTerms: ['ask', 'calling', 'pleading', 'prayer', 'request'],
    arabicTerms: ['دعاء'],
  },
  charity: {
    keywords: ['charity', 'sadaqah', 'zakat', 'alms'],
    relatedTerms: ['giving', 'donation', 'poor', 'needy', 'spending', 'generosity'],
    arabicTerms: ['صدقة', 'زكاة'],
  },
  guidance: {
    keywords: ['guidance', 'guide', 'path'],
    relatedTerms: ['hidayah', 'straight path', 'sirat', 'direction', 'way'],
    arabicTerms: ['هداية', 'صراط'],
  },
  mercy: {
    keywords: ['mercy', 'merciful', 'compassion'],
    relatedTerms: ['rahma', 'rahman', 'rahim', 'kindness', 'clemency', 'grace'],
    arabicTerms: ['رحمة', 'رحمن', 'رحيم'],
  },
  knowledge: {
    keywords: ['knowledge', 'wisdom', 'learning'],
    relatedTerms: ['ilm', 'scholar', 'understanding', 'education', 'teach', 'hikmah'],
    arabicTerms: ['علم', 'حكمة'],
  },
  faith: {
    keywords: ['faith', 'belief', 'believe'],
    relatedTerms: ['iman', 'trust', 'conviction', 'creed', 'tawhid'],
    arabicTerms: ['إيمان', 'توحيد'],
  },
  gratitude: {
    keywords: ['gratitude', 'grateful', 'thankful', 'thanks'],
    relatedTerms: ['shukr', 'appreciation', 'blessing', 'thankfulness'],
    arabicTerms: ['شكر'],
  },
  justice: {
    keywords: ['justice', 'just', 'fair', 'fairness'],
    relatedTerms: ['adl', 'equity', 'righteousness', 'judgment'],
    arabicTerms: ['عدل'],
  },
  trust: {
    keywords: ['trust', 'reliance', 'depend'],
    relatedTerms: ['tawakkul', 'confidence', 'faith', 'belief'],
    arabicTerms: ['توكل'],
  },
  paradise: {
    keywords: ['paradise', 'heaven', 'jannah'],
    relatedTerms: ['garden', 'eternal', 'reward', 'bliss'],
    arabicTerms: ['جنة', 'فردوس'],
  },
  hell: {
    keywords: ['hell', 'hellfire', 'jahannam'],
    relatedTerms: ['punishment', 'fire', 'torment', 'eternal'],
    arabicTerms: ['جهنم', 'نار'],
  },
  angels: {
    keywords: ['angel', 'angels', 'malak'],
    relatedTerms: ['gabriel', 'jibreel', 'michael', 'mika\'il', 'celestial'],
    arabicTerms: ['ملائكة', 'ملك'],
  },
  quran: {
    keywords: ['quran', 'koran', 'book'],
    relatedTerms: ['revelation', 'scripture', 'holy book', 'furqan', 'kitab'],
    arabicTerms: ['قرآن', 'كتاب'],
  },
  jihad: {
    keywords: ['jihad', 'struggle', 'striving'],
    relatedTerms: ['effort', 'fight', 'struggle', 'spiritual struggle'],
    arabicTerms: ['جهاد'],
  },
  family: {
    keywords: ['family', 'parents', 'mother', 'father'],
    relatedTerms: ['children', 'spouse', 'relatives', 'kindred', 'kin'],
    arabicTerms: ['أسرة', 'عائلة'],
  },
  death: {
    keywords: ['death', 'dying', 'mortality'],
    relatedTerms: ['afterlife', 'grave', 'resurrection', 'hereafter', 'barzakh'],
    arabicTerms: ['موت', 'قبر'],
  },
  wealth: {
    keywords: ['wealth', 'money', 'riches'],
    relatedTerms: ['prosperity', 'poverty', 'sustenance', 'rizq'],
    arabicTerms: ['رزق', 'مال'],
  },
};

/**
 * Analyze query to extract prophets, topics, and search terms
 */
export function analyzeSearchQuery(query: string) {
  const normalized = query.toLowerCase().trim();
  const words = normalized.split(/\s+/);

  const result = {
    prophets: [] as string[],
    prophetArabic: [] as string[],
    prophetRelatedTopics: [] as string[],
    topics: [] as string[],
    searchTerms: new Set<string>(),
    arabicTerms: new Set<string>(),
    originalQuery: query,
  };

  // Detect prophets
  Object.entries(PROPHETS).forEach(([key, info]) => {
    const matches = info.variations.some(variant =>
      normalized.includes(variant.toLowerCase())
    );

    if (matches) {
      result.prophets.push(...info.english);
      result.prophetArabic.push(...info.arabic);
      if (info.relatedTopics) {
        result.prophetRelatedTopics.push(...info.relatedTopics);
      }
    }
  });

  // Detect topics
  Object.entries(TOPICS).forEach(([topic, info]) => {
    const matches = words.some(word =>
      info.keywords.includes(word) ||
      info.relatedTerms.includes(word)
    );

    if (matches) {
      result.topics.push(topic);
      info.keywords.forEach(kw => result.searchTerms.add(kw));
      info.relatedTerms.forEach(rt => result.searchTerms.add(rt));
      if (info.arabicTerms) {
        info.arabicTerms.forEach(at => result.arabicTerms.add(at));
      }
    }
  });

  // Add original words
  words.forEach(word => result.searchTerms.add(word));

  return {
    ...result,
    searchTerms: Array.from(result.searchTerms),
    arabicTerms: Array.from(result.arabicTerms),
    prophets: [...new Set(result.prophets)],
    prophetArabic: [...new Set(result.prophetArabic)],
    prophetRelatedTopics: [...new Set(result.prophetRelatedTopics)],
    topics: [...new Set(result.topics)],
  };
}

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(query: string, maxResults = 10): string[] {
  const analysis = analyzeSearchQuery(query);
  const suggestions = new Set<string>();

  // Prophet-specific suggestions
  if (analysis.prophets.length > 0) {
    analysis.prophets.forEach(prophet => {
      suggestions.add(`${prophet} story`);
      suggestions.add(`${prophet} dua`);
      suggestions.add(`${prophet} in the Quran`);
      suggestions.add(`lessons from ${prophet}`);
      suggestions.add(`${prophet} miracles`);
      suggestions.add(`${prophet} family`);
    });
  }

  // Topic-specific suggestions
  if (analysis.topics.length > 0) {
    analysis.topics.forEach(topic => {
      suggestions.add(`${topic} in Quran`);
      suggestions.add(`${topic} hadith`);
      suggestions.add(`dua for ${topic}`);
      suggestions.add(`verses about ${topic}`);
      suggestions.add(`importance of ${topic}`);
    });
  }

  // Combined suggestions
  if (analysis.prophets.length > 0 && analysis.topics.length > 0) {
    analysis.prophets.forEach(prophet => {
      analysis.topics.forEach(topic => {
        suggestions.add(`${prophet} ${topic}`);
      });
    });
  }

  // Prophet + related topics
  if (analysis.prophets.length > 0 && analysis.prophetRelatedTopics.length > 0) {
    analysis.prophets.forEach(prophet => {
      analysis.prophetRelatedTopics.slice(0, 3).forEach(topic => {
        suggestions.add(`${prophet} ${topic}`);
      });
    });
  }

  return Array.from(suggestions).slice(0, maxResults);
}

/**
 * Build Prisma where clause for search
 */
export function buildSearchWhereClause(analysis: ReturnType<typeof analyzeSearchQuery>) {
  const conditions: any[] = [];

  // Text search conditions
  analysis.searchTerms.forEach(term => {
    conditions.push({
      text: { contains: term, mode: 'insensitive' as const },
    });
  });

  // Arabic text search for prophets
  analysis.prophetArabic.forEach(arabic => {
    conditions.push({
      textArabic: { contains: arabic },
    });
  });

  // Arabic terms search
  analysis.arabicTerms.forEach(arabic => {
    conditions.push({
      textArabic: { contains: arabic },
    });
  });

  return conditions.length > 0 ? { OR: conditions } : undefined;
}

/**
 * Format search results with highlighting
 */
export function highlightSearchTerms(text: string, searchTerms: string[]): string {
  let highlighted = text;

  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  return highlighted;
}

/**
 * Calculate relevance score for search result
 */
export function calculateRelevanceScore(
  result: any,
  analysis: ReturnType<typeof analyzeSearchQuery>
): number {
  let score = 0;

  const text = (result.text || '').toLowerCase();
  const arabicText = result.textArabic || '';

  // Exact prophet match in Arabic (highest priority)
  analysis.prophetArabic.forEach(arabic => {
    if (arabicText.includes(arabic)) score += 15;
  });

  // Prophet name in English text
  analysis.prophets.forEach(prophet => {
    if (text.includes(prophet.toLowerCase())) score += 10;
  });

  // Arabic topic terms
  analysis.arabicTerms.forEach(arabic => {
    if (arabicText.includes(arabic)) score += 8;
  });

  // Topic keywords
  analysis.topics.forEach(topic => {
    if (text.includes(topic)) score += 6;
  });

  // Search terms
  analysis.searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    // Exact word match
    const wordBoundaryRegex = new RegExp(`\\b${termLower}\\b`, 'i');
    if (wordBoundaryRegex.test(text)) {
      score += 5;
    } else if (text.includes(termLower)) {
      score += 3;
    }
  });

  // Boost for matched themes
  if (result.matchedInTheme) score += 9;

  // Boost for tafsir matches
  if (result.matchedInTafsir) score += 7;

  // Boost for title/heading matches
  if (result.title && analysis.searchTerms.some(term =>
    result.title.toLowerCase().includes(term.toLowerCase())
  )) {
    score += 8;
  }

  return score;
}

/**
 * Sort search results by relevance
 */
export function sortByRelevance<T>(
  results: T[],
  analysis: ReturnType<typeof analyzeSearchQuery>
): T[] {
  return results.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, analysis);
    const scoreB = calculateRelevanceScore(b, analysis);
    return scoreB - scoreA;
  });
}

/**
 * Get expanded search terms for better coverage
 */
export function getExpandedSearchTerms(query: string): string[] {
  const analysis = analyzeSearchQuery(query);
  const expanded = new Set<string>();

  // Add original terms
  analysis.searchTerms.forEach(term => expanded.add(term));

  // Add related topic terms
  analysis.topics.forEach(topic => {
    const topicInfo = TOPICS[topic];
    if (topicInfo) {
      topicInfo.relatedTerms.forEach(term => expanded.add(term));
    }
  });

  // Add prophet variations
  analysis.prophets.forEach(prophet => {
    Object.values(PROPHETS).forEach(info => {
      if (info.english.includes(prophet)) {
        info.variations.forEach(v => expanded.add(v));
      }
    });
  });

  return Array.from(expanded);
}
