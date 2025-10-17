/**
 * In-memory LRU cache for query embeddings
 * Reduces OpenAI API calls for repeated/similar searches
 */

interface CacheEntry {
  embedding: number[];
  timestamp: number;
}

class EmbeddingCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize = 1000, ttlMinutes = 60) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttlMinutes * 60 * 1000;
  }

  /**
   * Normalize query for cache key (lowercase, trim, remove extra spaces)
   */
  private normalizeQuery(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Get embedding from cache if exists and not expired
   */
  get(query: string): number[] | null {
    const key = this.normalizeQuery(query);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.embedding;
  }

  /**
   * Store embedding in cache
   */
  set(query: string, embedding: number[]): void {
    const key = this.normalizeQuery(query);

    // If at max size, remove oldest entry (first item in Map)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      embedding,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; maxSize: number; ttlMinutes: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttlMinutes: this.ttl / (60 * 1000),
    };
  }

  /**
   * Load cached embeddings from file (for pre-warming)
   */
  loadFromFile(embeddings: Array<{ normalizedQuery: string; embedding: number[] }>): number {
    let loaded = 0;
    const now = Date.now();

    for (const item of embeddings) {
      this.cache.set(item.normalizedQuery, {
        embedding: item.embedding,
        timestamp: now,
      });
      loaded++;
    }

    return loaded;
  }
}

// Export singleton instance
export const embeddingCache = new EmbeddingCache(1000, 60);
