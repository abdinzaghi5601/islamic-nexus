/**
 * Pre-warm embedding cache with popular queries
 * Generates embeddings for common searches and saves to file
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

import { generateEmbedding } from '../src/lib/utils/embeddings';

interface PopularQueries {
  queries: string[];
}

interface CachedEmbedding {
  query: string;
  normalizedQuery: string;
  embedding: number[];
  timestamp: number;
}

interface CacheFile {
  version: string;
  generatedAt: string;
  model: string;
  embeddings: CachedEmbedding[];
}

// Normalize query for cache key (same as embedding-cache.ts)
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

async function warmupCache() {
  console.log('🔥 Starting cache warm-up...\n');

  // Read popular queries
  const queriesPath = path.join(process.cwd(), 'data', 'popular-queries.json');
  const queriesData: PopularQueries = JSON.parse(fs.readFileSync(queriesPath, 'utf-8'));

  console.log(`📋 Found ${queriesData.queries.length} popular queries\n`);

  // Generate embeddings
  const cachedEmbeddings: CachedEmbedding[] = [];
  let processed = 0;
  let failed = 0;

  for (const query of queriesData.queries) {
    try {
      console.log(`[${processed + 1}/${queriesData.queries.length}] Generating embedding for: "${query}"`);

      const embedding = await generateEmbedding(query);

      cachedEmbeddings.push({
        query,
        normalizedQuery: normalizeQuery(query),
        embedding,
        timestamp: Date.now(),
      });

      processed++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`❌ Failed for "${query}":`, error.message);
      failed++;
    }
  }

  console.log(`\n✅ Successfully generated ${processed} embeddings`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} embeddings`);
  }

  // Save to file
  const cacheFile: CacheFile = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    model: 'text-embedding-3-small',
    embeddings: cachedEmbeddings,
  };

  const outputPath = path.join(process.cwd(), 'data', 'embedding-cache.json');
  fs.writeFileSync(outputPath, JSON.stringify(cacheFile, null, 2));

  console.log(`\n💾 Cache saved to: ${outputPath}`);
  console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  // Calculate cost
  const avgTokensPerQuery = 5; // Conservative estimate
  const totalTokens = processed * avgTokensPerQuery;
  const cost = (totalTokens / 1_000_000) * 0.02;

  console.log(`\n💰 Estimated cost: $${cost.toFixed(4)}`);
  console.log(`\n🎉 Cache warm-up complete!`);
}

// Run
warmupCache().catch(console.error);
