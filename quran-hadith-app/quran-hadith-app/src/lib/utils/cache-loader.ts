/**
 * Load pre-warmed embeddings cache on server startup
 */

import fs from 'fs';
import path from 'path';
import { embeddingCache } from './embedding-cache';

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

let isLoaded = false;

export function loadPrewarmedCache(): void {
  // Only load once
  if (isLoaded) {
    console.log('[Cache Loader] Cache already loaded, skipping...');
    return;
  }

  try {
    const cacheFilePath = path.join(process.cwd(), 'data', 'embedding-cache.json');

    // Check if cache file exists
    if (!fs.existsSync(cacheFilePath)) {
      console.log('[Cache Loader] No pre-warmed cache file found, skipping...');
      console.log('[Cache Loader] Run "npm run warmup:cache" to generate it');
      return;
    }

    console.log('[Cache Loader] Loading pre-warmed cache...');

    const cacheData: CacheFile = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));

    const count = embeddingCache.loadFromFile(
      cacheData.embeddings.map(item => ({
        normalizedQuery: item.normalizedQuery,
        embedding: item.embedding,
      }))
    );

    console.log(`[Cache Loader] ✅ Loaded ${count} cached embeddings`);
    console.log(`[Cache Loader] Generated: ${new Date(cacheData.generatedAt).toLocaleString()}`);
    console.log(`[Cache Loader] Model: ${cacheData.model}`);

    isLoaded = true;
  } catch (error: any) {
    console.error('[Cache Loader] ❌ Failed to load cache:', error.message);
  }
}

// Auto-load on module import (runs once when server starts)
loadPrewarmedCache();
