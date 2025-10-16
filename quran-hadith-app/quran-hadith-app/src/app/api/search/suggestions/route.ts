import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { analyzeSearchQuery, PROPHETS, TOPICS } from '@/lib/utils/search-utils';

// Prophet-specific suggestions with more depth
const PROPHET_SUGGESTIONS: { [key: string]: string[] } = {
  'adam': [
    'Prophet Adam creation story',
    'Prophet Adam and Eve',
    'Prophet Adam dua for forgiveness',
    'Prophet Adam in the Quran',
    'lessons from Prophet Adam',
    'Prophet Adam children',
    'Prophet Adam paradise',
  ],
  'noah': [
    'Prophet Noah and the flood',
    'Prophet Noah ark',
    'Prophet Noah dua',
    'Prophet Noah patience',
    'story of Prophet Noah',
    'Prophet Noah calling his people',
    'Prophet Noah son',
  ],
  'abraham': [
    'Prophet Ibrahim and Ismail',
    'Prophet Ibrahim sacrifice',
    'Prophet Ibrahim dua',
    'Prophet Ibrahim in Mecca',
    'lessons from Prophet Ibrahim',
    'Prophet Ibrahim and idols',
    'Prophet Ibrahim building Kaaba',
    'Prophet Ibrahim hospitality',
  ],
  'moses': [
    'Prophet Moses and Pharaoh',
    'Prophet Moses miracles',
    'Prophet Moses dua',
    'Prophet Moses mountain',
    'story of Prophet Moses',
    'Prophet Moses staff',
    'Prophet Moses red sea',
    'Prophet Moses tablets',
  ],
  'jesus': [
    'Prophet Isa in the Quran',
    'Prophet Isa miracles',
    'Prophet Isa birth',
    'Prophet Isa second coming',
    'teachings of Prophet Isa',
    'Prophet Isa mother Mary',
    'Prophet Isa disciples',
  ],
  'muhammad': [
    'Prophet Muhammad seerah',
    'Prophet Muhammad character',
    'Prophet Muhammad duas',
    'Prophet Muhammad miracles',
    'teachings of Prophet Muhammad',
    'Prophet Muhammad night journey',
    'Prophet Muhammad companions',
    'Prophet Muhammad battles',
  ],
  'joseph': [
    'Prophet Yusuf dream',
    'Prophet Yusuf and brothers',
    'Prophet Yusuf patience',
    'Prophet Yusuf in Egypt',
    'story of Prophet Yusuf',
    'Prophet Yusuf forgiveness',
    'Prophet Yusuf beauty',
  ],
  'david': [
    'Prophet Dawud psalms',
    'Prophet Dawud judgment',
    'Prophet Dawud worship',
    'Prophet Dawud and Goliath',
    'lessons from Prophet Dawud',
    'Prophet Dawud voice',
    'Prophet Dawud armor',
  ],
  'solomon': [
    'Prophet Sulaiman wisdom',
    'Prophet Sulaiman and Queen of Sheba',
    'Prophet Sulaiman dua',
    'Prophet Sulaiman kingdom',
    'lessons from Prophet Sulaiman',
    'Prophet Sulaiman and jinn',
    'Prophet Sulaiman and animals',
  ],
  'jonah': [
    'Prophet Yunus and the whale',
    'Prophet Yunus dua',
    'Prophet Yunus repentance',
    'lessons from Prophet Yunus',
    'story of Prophet Yunus',
    'Prophet Yunus in the belly of fish',
  ],
  'job': [
    'Prophet Ayub patience',
    'Prophet Ayub trials',
    'Prophet Ayub dua',
    'lessons from Prophet Ayub',
    'story of Prophet Ayub',
    'Prophet Ayub suffering',
    'Prophet Ayub healing',
  ],
  'lot': [
    'Prophet Lut story',
    'Prophet Lut people',
    'Prophet Lut warning',
    'Prophet Lut and angels',
  ],
  'ishmael': [
    'Prophet Ismail sacrifice',
    'Prophet Ismail and Kaaba',
    'Prophet Ismail zamzam',
    'Prophet Ismail obedience',
  ],
  'isaac': [
    'Prophet Ishaq story',
    'Prophet Ishaq blessing',
    'Prophet Ishaq and Ibrahim',
  ],
  'jacob': [
    'Prophet Yaqub patience',
    'Prophet Yaqub sons',
    'Prophet Yaqub and Yusuf',
    'Prophet Yaqub grief',
  ],
  'aaron': [
    'Prophet Harun and Moses',
    'Prophet Harun golden calf',
    'Prophet Harun patience',
  ],
  'zachariah': [
    'Prophet Zakariya dua',
    'Prophet Zakariya old age',
    'Prophet Zakariya son Yahya',
  ],
  'john': [
    'Prophet Yahya story',
    'Prophet Yahya wisdom',
    'Prophet Yahya youth',
  ],
};

// Expanded topic-based suggestions
const TOPIC_SUGGESTIONS: { [key: string]: string[] } = {
  'dua': [
    'dua for forgiveness',
    'dua for health',
    'dua before sleeping',
    'dua for guidance',
    'dua for protection',
    'dua for parents',
    'dua for patience',
    'dua for knowledge',
    'dua for marriage',
    'dua for success',
    'dua from Quran',
    'dua from prophets',
    'morning duas',
    'evening duas',
    'dua for anxiety',
    'dua for stress',
    'dua for wealth',
  ],
  'prayer': [
    'prayer times',
    'prayer importance',
    'prayer in Quran',
    'prayer of prophets',
    'night prayer',
    'Friday prayer',
    'tahajjud prayer',
    'prayer benefits',
    'prayer concentration',
    'prayer for beginners',
  ],
  'patience': [
    'patience in hardship',
    'patience in Quran',
    'patience of prophets',
    'patience and reward',
    'verses about patience',
    'hadith about patience',
    'patience in trials',
    'patience with family',
  ],
  'forgiveness': [
    'seeking forgiveness',
    'Allah forgiveness',
    'forgiveness in Quran',
    'repentance verses',
    'dua for forgiveness',
    'forgiveness hadith',
    'forgiving others',
    'tawbah',
  ],
  'guidance': [
    'seeking guidance',
    'guidance in Quran',
    'straight path',
    'guidance from Allah',
    'dua for guidance',
    'guidance verses',
    'hidayah',
  ],
  'mercy': [
    'Allah mercy',
    'mercy in Quran',
    'mercy of prophets',
    'divine mercy',
    'mercy verses',
    'mercy hadith',
    'rahma',
  ],
  'faith': [
    'strengthening faith',
    'faith in Allah',
    'faith in Quran',
    'pillars of faith',
    'verses about faith',
    'faith and deeds',
    'iman',
    'tawhid',
  ],
  'family': [
    'family in Islam',
    'parents rights',
    'children upbringing',
    'family dua',
    'family values',
    'kindness to parents',
    'honoring mother',
    'honoring father',
  ],
  'charity': [
    'charity in Islam',
    'sadaqah benefits',
    'zakat',
    'charity verses',
    'charity hadith',
    'giving to poor',
    'helping needy',
  ],
  'knowledge': [
    'seeking knowledge',
    'knowledge in Islam',
    'importance of learning',
    'knowledge verses',
    'scholars',
    'wisdom',
  ],
  'gratitude': [
    'gratitude to Allah',
    'being thankful',
    'shukr',
    'gratitude verses',
    'blessings',
    'counting blessings',
  ],
  'justice': [
    'justice in Islam',
    'being just',
    'fairness',
    'justice verses',
    'adl',
  ],
  'paradise': [
    'jannah description',
    'paradise in Quran',
    'entering paradise',
    'paradise rewards',
    'paradise levels',
  ],
  'hell': [
    'jahannam description',
    'hellfire warning',
    'punishment verses',
    'avoiding hell',
  ],
  'angels': [
    'angels in Islam',
    'angel Gabriel',
    'angel Michael',
    'recording angels',
    'angel of death',
  ],
  'death': [
    'death in Islam',
    'afterlife',
    'grave',
    'resurrection',
    'day of judgment',
    'barzakh',
  ],
  'wealth': [
    'wealth in Islam',
    'rizq',
    'sustenance',
    'earning halal',
    'poverty',
  ],
};

// Expanded popular searches
const POPULAR_SEARCHES = [
  // Prophet-related
  'Prophet Muhammad life',
  'Prophet Ibrahim sacrifice',
  'Prophet Yusuf story',
  'Prophet Adam creation',
  'Prophet Musa miracles',
  'Prophet Isa in Quran',
  'Prophet Nuh flood',

  // Dua-related
  'dua for forgiveness',
  'dua for health',
  'dua before sleeping',
  'morning and evening duas',
  'dua for guidance',
  'dua for success',
  'dua for parents',

  // Topic-related
  'patience in hardship',
  'death and afterlife',
  'seeking knowledge',
  'charity importance',
  'family values',
  'prayer benefits',
  'fasting Ramadan',
  'hajj pilgrimage',
  'paradise description',
  'repentance verses',

  // Concept-related
  'tawhid',
  'iman',
  'taqwa',
  'sabr',
  'shukr',
  'tawakkul',
  'ihsan',

  // Practical
  'how to pray',
  'learning Quran',
  'Islamic manners',
  'dealing with stress',
  'overcoming sin',
];

/**
 * Detect if query contains prophet names
 */
function detectProphet(query: string): string | null {
  const lowercaseQuery = query.toLowerCase();

  // Use the PROPHETS object from search-utils
  for (const [key, info] of Object.entries(PROPHETS)) {
    if (info.variations.some(variant => lowercaseQuery.includes(variant))) {
      return key;
    }
  }

  return null;
}

/**
 * Detect if query contains specific topics
 */
function detectTopics(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  const detectedTopics: string[] = [];

  Object.entries(TOPICS).forEach(([topic, info]) => {
    const matches = info.keywords.some(kw => lowercaseQuery.includes(kw)) ||
                   info.relatedTerms.some(rt => lowercaseQuery.includes(rt));
    if (matches) {
      detectedTopics.push(topic);
    }
  });

  return detectedTopics;
}

/**
 * GET /api/search/suggestions - Enhanced with prophet and topic detection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // If no query, return popular suggestions
    if (!query) {
      return successResponse({
        suggestions: POPULAR_SEARCHES.slice(0, 15),
        type: 'popular',
      });
    }

    // Use the enhanced analyzer
    const analysis = analyzeSearchQuery(query);

    // Detect prophet in query
    const detectedProphet = detectProphet(query);
    if (detectedProphet && PROPHET_SUGGESTIONS[detectedProphet]) {
      return successResponse({
        suggestions: PROPHET_SUGGESTIONS[detectedProphet],
        type: 'prophet',
        prophet: detectedProphet,
        message: `Suggestions for Prophet ${detectedProphet.charAt(0).toUpperCase() + detectedProphet.slice(1)}`,
        analysis: {
          prophets: analysis.prophets,
          relatedTopics: analysis.prophetRelatedTopics,
        },
      });
    }

    // Detect topics in query
    const detectedTopics = detectTopics(query);
    if (detectedTopics.length > 0) {
      const topicSuggestions = detectedTopics
        .flatMap(topic => TOPIC_SUGGESTIONS[topic] || [])
        .slice(0, 15);

      return successResponse({
        suggestions: topicSuggestions,
        type: 'topic',
        topics: detectedTopics,
        message: `Suggestions for ${detectedTopics.join(', ')}`,
        analysis: {
          topics: analysis.topics,
          relatedTerms: analysis.searchTerms.slice(0, 10),
        },
      });
    }

    // Fuzzy match against all suggestions
    const allSuggestions = [
      ...POPULAR_SEARCHES,
      ...Object.values(PROPHET_SUGGESTIONS).flat(),
      ...Object.values(TOPIC_SUGGESTIONS).flat(),
    ];

    const matchedSuggestions = allSuggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(query) ||
        query.split(' ').some(word => suggestion.toLowerCase().includes(word))
      )
      .slice(0, 15);

    if (matchedSuggestions.length > 0) {
      return successResponse({
        suggestions: matchedSuggestions,
        type: 'match',
        query,
        analysis: {
          searchTerms: analysis.searchTerms.slice(0, 10),
        },
      });
    }

    // No matches - return popular searches
    return successResponse({
      suggestions: POPULAR_SEARCHES.slice(0, 15),
      type: 'popular',
      message: 'No exact matches found. Here are popular searches:',
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return errorResponse('Failed to fetch suggestions', 500);
  }
}
