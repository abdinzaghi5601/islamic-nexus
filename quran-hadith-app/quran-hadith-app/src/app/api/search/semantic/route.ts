import { NextRequest, NextResponse } from 'next/server';
import { semanticSearchAll, searchAyahsSemantic, searchHadithsSemantic } from '@/lib/utils/semantic-search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      language = 'english',
      similarityThreshold = 0.7,
      maxResults = 20,
      types = ['ayah', 'hadith'],
    } = body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query must be less than 500 characters' },
        { status: 400 }
      );
    }

    if (!['arabic', 'english'].includes(language)) {
      return NextResponse.json(
        { error: 'Language must be either "arabic" or "english"' },
        { status: 400 }
      );
    }

    if (similarityThreshold < 0 || similarityThreshold > 1) {
      return NextResponse.json(
        { error: 'Similarity threshold must be between 0 and 1' },
        { status: 400 }
      );
    }

    // Perform semantic search
    const startTime = Date.now();
    const results = await semanticSearchAll(query, {
      language,
      similarityThreshold,
      maxResults,
      types: Array.isArray(types) ? types : [types],
    });
    const searchTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      query,
      language,
      results,
      metadata: {
        count: results.length,
        searchTime: `${searchTime}ms`,
        similarityThreshold,
        searchType: 'semantic',
        model: 'text-embedding-3-small',
      },
    });
  } catch (error: any) {
    console.error('Semantic search error:', error);

    if (error.message?.includes('OpenAI')) {
      return NextResponse.json(
        {
          error: 'AI service unavailable',
          message: 'Please ensure OPENAI_API_KEY is configured correctly',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Search failed',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Semantic Search API',
    description: 'AI-powered semantic search using OpenAI embeddings',
    methods: ['POST'],
    endpoint: '/api/search/semantic',
    parameters: {
      query: 'string (required) - The search query',
      language: 'string (optional) - "english" or "arabic", default: "english"',
      similarityThreshold: 'number (optional) - 0-1, default: 0.7',
      maxResults: 'number (optional) - Max results to return, default: 20',
      types: 'array (optional) - ["ayah", "hadith"], default: both',
    },
    example: {
      query: 'How to be patient in difficult times',
      language: 'english',
      similarityThreshold: 0.75,
      maxResults: 10,
      types: ['ayah', 'hadith'],
    },
  });
}
