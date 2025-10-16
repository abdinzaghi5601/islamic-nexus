# Semantic Search Implementation

## Overview

This application now includes **true semantic search** using OpenAI embeddings and vector similarity. Unlike traditional keyword-based search, semantic search understands the **meaning** of your query and finds conceptually similar content, even without exact keyword matches.

## How It Works

### Architecture

```
User Query: "How to be patient in hard times"
     ↓
[OpenAI Embeddings API] → Vector [0.234, -0.456, 0.789, ...]
     ↓
[PostgreSQL Cosine Similarity] → Find similar vectors
     ↓
Results: Verses about patience, perseverance, trust in Allah
```

### Technology Stack

- **Embeddings**: OpenAI `text-embedding-3-small` (1536 dimensions)
- **Storage**: PostgreSQL JSONB columns
- **Search**: Custom PostgreSQL functions with cosine similarity
- **Cost**: $0.02 per 1M tokens (~$0.01 for entire Quran)

## Setup

### 1. Add OpenAI API Key

Add to your `.env` file:

```bash
OPENAI_API_KEY="sk-your-key-here"
```

Get your key from: https://platform.openai.com/api-keys

### 2. Database is Ready

The database migration has already been applied with:
- JSONB embedding columns on `ayahs`, `translations`, `hadiths`, `tafsir_verses`
- PostgreSQL functions for semantic search
- GIN indexes for performance

### 3. Generate Embeddings

Generate embeddings for your content:

```bash
# Test with 10 ayahs first
npm run generate:embeddings:test

# Generate all ayah embeddings
npm run generate:embeddings:ayahs

# Generate all hadith embeddings
npm run generate:embeddings:hadiths

# Generate everything
npm run generate:embeddings
```

**Cost Estimate:**
- Quran (6,236 ayahs): ~$0.01
- Hadiths (40,000): ~$0.40
- **Total**: ~$0.50

## Usage

### API Endpoint: POST /api/search/semantic

#### Request

```json
{
  "query": "How to be patient in difficult times",
  "language": "english",
  "similarityThreshold": 0.7,
  "maxResults": 10,
  "types": ["ayah", "hadith"]
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | *required* | The search query |
| `language` | string | `"english"` | `"english"` or `"arabic"` |
| `similarityThreshold` | number | `0.7` | Minimum similarity (0-1) |
| `maxResults` | number | `20` | Maximum results to return |
| `types` | array | `["ayah","hadith"]` | Content types to search |

#### Response

```json
{
  "success": true,
  "query": "How to be patient in difficult times",
  "language": "english",
  "results": [
    {
      "id": 255,
      "type": "ayah",
      "similarity": 0.89,
      "content": {
        "textArabic": "...",
        "textEnglish": "O you who believe! Seek help through patience and prayer...",
        "reference": "Al-Baqarah 153",
        "surahNumber": 2,
        "ayahNumber": 153
      }
    }
  ],
  "metadata": {
    "count": 10,
    "searchTime": "234ms",
    "similarityThreshold": 0.7,
    "searchType": "semantic",
    "model": "text-embedding-3-small"
  }
}
```

### Example Queries

#### Conceptual Queries (Meaning-based)

```bash
# Find verses about being kind to parents
curl -X POST http://localhost:3000/api/search/semantic \
  -H "Content-Type: application/json" \
  -d '{"query": "being kind to parents"}'

# Find verses about forgiveness
curl -X POST http://localhost:3000/api/search/semantic \
  -H "Content-Type: application/json" \
  -d '{"query": "seeking forgiveness from God"}'

# Find hadiths about good character
curl -X POST http://localhost:3000/api/search/semantic \
  -H "Content-Type: application/json" \
  -d '{"query": "importance of good manners", "types": ["hadith"]}'
```

#### Arabic Queries

```bash
curl -X POST http://localhost:3000/api/search/semantic \
  -H "Content-Type: application/json" \
  -d '{"query": "الصبر والصلاة", "language": "arabic"}'
```

## Comparison: Keyword vs Semantic Search

### Example: "caring for elderly parents"

**Keyword Search (Traditional FTS):**
- Matches: "parents", "care", "elderly"
- Misses: Verses about "honoring mother and father", "kindness to family"

**Semantic Search (AI Embeddings):**
- Matches: All of the above
- **Also finds**:
  - Verses about "goodness to parents"
  - Verses about "lowering the wing of mercy"
  - Hadiths about "Paradise lies at the feet of mothers"
  - Content about respecting elders

## Performance

### Search Speed

- **Embedding Generation**: ~100ms per query (cached for repeated queries)
- **Vector Similarity Search**: 50-200ms (depends on dataset size)
- **Total**: ~150-300ms per search

### Database Performance

- **JSONB Storage**: ~6KB per embedding
- **GIN Indexes**: Fast filtering
- **Cosine Similarity**: O(N) but optimized with PostgreSQL

## Utilities

### Embedding Generation (`src/lib/utils/embeddings.ts`)

```typescript
import { generateEmbedding, generateEmbeddingsBatch } from '@/lib/utils/embeddings';

// Single embedding
const embedding = await generateEmbedding("patience in adversity");

// Batch processing
const embeddings = await generateEmbeddingsBatch([
  "first text",
  "second text",
  // ... up to 100 texts
]);

// Calculate similarity
import { cosineSimilarity } from '@/lib/utils/embeddings';
const similarity = cosineSimilarity(embedding1, embedding2);
// Returns: 0.0 (completely different) to 1.0 (identical)
```

### Semantic Search Functions (`src/lib/utils/semantic-search.ts`)

```typescript
import { searchAyahsSemantic, searchHadithsSemantic, semanticSearchAll } from '@/lib/utils/semantic-search';

// Search only Ayahs
const ayahs = await searchAyahsSemantic("patience", {
  language: "english",
  similarityThreshold: 0.75,
  maxResults: 10
});

// Search only Hadiths
const hadiths = await searchHadithsSemantic("good character", {
  language: "english"
});

// Search both
const all = await semanticSearchAll("gratitude", {
  types: ["ayah", "hadith"]
});
```

## Files Created

### Database
- `prisma/migrations/add_semantic_search_jsonb/migration.sql` - Database schema
- Updated `prisma/schema.prisma` with embedding columns

### Scripts
- `scripts/generate-embeddings.ts` - Embedding generation script
- `scripts/check-pgvector.ts` - Extension checker

### Source Code
- `src/lib/utils/embeddings.ts` - Embedding utilities
- `src/lib/utils/semantic-search.ts` - Search functions
- `src/app/api/search/semantic/route.ts` - API endpoint

### Documentation
- `SEMANTIC_SEARCH.md` - This file

## Troubleshooting

### Error: "OpenAI API key not found"
**Solution**: Add `OPENAI_API_KEY` to your `.env` file

### Error: "extension 'vector' is not available"
**Solution**: pgvector isn't needed! We're using JSONB storage instead

### Search returns no results
**Solutions**:
1. Check if embeddings are generated: `SELECT COUNT(*) FROM ayahs WHERE embedding_english_jsonb IS NOT NULL;`
2. Lower similarity threshold: Try `0.5` instead of `0.7`
3. Verify query isn't empty

### Slow search performance
**Solutions**:
1. Ensure GIN indexes exist
2. Reduce `maxResults`
3. Increase `similarityThreshold`
4. Consider adding LIMIT to SQL queries

## Future Enhancements

### Potential Upgrades

1. **Query Caching**: Cache frequent query embeddings in Redis
2. **Hybrid Search**: Combine FTS + Semantic search with weighted scoring
3. **Reranking**: Use cross-encoder models for better ranking
4. **Faceted Search**: Add filters by surah, juz, theme, etc.
5. **Multi-language**: Support Urdu, French, etc. translations
6. **pgvector Migration**: Switch to proper pgvector when available on Railway

### Cost Optimization

- **Batch Processing**: Process embeddings in larger batches
- **Caching**: Cache query embeddings
- **Smaller Model**: Use `text-embedding-ada-002` (cheaper but less accurate)
- **Selective Embedding**: Only embed popular content initially

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review OpenAI API status: https://status.openai.com/
3. Check database connection and migrations

## License

This semantic search implementation is part of the Quran & Hadith Application.
