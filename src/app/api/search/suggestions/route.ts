import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/helpers';

// Popular search suggestions organized by category
const SEARCH_SUGGESTIONS = {
  duas: [
    'dua for health',
    'dua for forgiveness',
    'dua before sleeping',
    'dua for guidance',
    'dua for parents',
    'dua for protection',
    'dua for patience',
    'dua for knowledge',
    'dua for marriage',
    'dua for success',
  ],
  worship: [
    'prayer times',
    'fasting in Ramadan',
    'charity and zakat',
    'hajj pilgrimage',
    'night prayer',
    'Friday prayer',
    'prostration',
    'ablution',
  ],
  morals: [
    'patience in hardship',
    'honesty in business',
    'kindness to parents',
    'forgiveness',
    'gratitude',
    'humility',
    'trustworthiness',
    'good character',
  ],
  life: [
    'marriage in Islam',
    'raising children',
    'death and burial',
    'dealing with loss',
    'seeking knowledge',
    'earning halal income',
    'repentance',
  ],
  faith: [
    'belief in Allah',
    'prophets and messengers',
    'angels',
    'day of judgment',
    'heaven and paradise',
    'hell and punishment',
    'divine decree',
  ],
};

/**
 * GET /api/search/suggestions
 * Get search suggestions based on query
 * Query params:
 *   - q: partial search query (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // If no query, return popular suggestions from all categories
    if (!query) {
      const allSuggestions = Object.values(SEARCH_SUGGESTIONS).flat();
      return successResponse({
        suggestions: allSuggestions.slice(0, 10),
        categories: SEARCH_SUGGESTIONS,
      });
    }

    // Filter suggestions based on query
    const matchedSuggestions = Object.values(SEARCH_SUGGESTIONS)
      .flat()
      .filter(suggestion => suggestion.toLowerCase().includes(query))
      .slice(0, 10);

    // If we have matches, return them
    if (matchedSuggestions.length > 0) {
      return successResponse({
        suggestions: matchedSuggestions,
        query,
      });
    }

    // No matches - return suggestions from the most relevant category
    const keywords = query.split(/\s+/);
    let bestCategory = 'duas'; // default

    // Simple keyword matching to find best category
    if (keywords.some(k => ['dua', 'supplication', 'prayer', 'ask'].includes(k))) {
      bestCategory = 'duas';
    } else if (keywords.some(k => ['pray', 'salah', 'fast', 'zakat', 'hajj', 'worship'].includes(k))) {
      bestCategory = 'worship';
    } else if (keywords.some(k => ['patience', 'honesty', 'kind', 'moral', 'character'].includes(k))) {
      bestCategory = 'morals';
    } else if (keywords.some(k => ['marriage', 'child', 'death', 'life', 'family'].includes(k))) {
      bestCategory = 'life';
    } else if (keywords.some(k => ['allah', 'faith', 'belief', 'angel', 'prophet', 'judgment'].includes(k))) {
      bestCategory = 'faith';
    }

    return successResponse({
      suggestions: SEARCH_SUGGESTIONS[bestCategory as keyof typeof SEARCH_SUGGESTIONS] || [],
      query,
      suggestedCategory: bestCategory,
      message: `No exact matches found. Try these ${bestCategory} related searches:`,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return errorResponse('Failed to fetch suggestions', 500);
  }
}
