import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Constants
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions, $0.02/1M tokens
const BATCH_SIZE = 100; // OpenAI allows up to 2048 inputs per request
const MAX_TOKENS_PER_BATCH = 7000; // Conservative limit below 8192 token max
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * Returns an array of embeddings in the same order as input texts
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  retryCount = 0
): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  // Filter out empty texts and keep track of indices
  const validTexts: string[] = [];
  const validIndices: number[] = [];

  texts.forEach((text, index) => {
    if (text && text.trim().length > 0) {
      validTexts.push(text);
      validIndices.push(index);
    }
  });

  if (validTexts.length === 0) {
    return Array(texts.length).fill(null);
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: validTexts,
      encoding_format: 'float',
    });

    // Map embeddings back to original indices
    const results: number[][] = Array(texts.length).fill(null);
    response.data.forEach((embeddingData, i) => {
      results[validIndices[i]] = embeddingData.embedding;
    });

    return results;
  } catch (error: any) {
    // If token limit exceeded and we have multiple texts, split the batch
    if (error.status === 400 && error.message?.includes('maximum context length') && texts.length > 1) {
      console.warn(`Batch too large (${texts.length} texts), splitting in half...`);
      const mid = Math.floor(texts.length / 2);
      const firstHalf = await generateEmbeddingsBatch(texts.slice(0, mid), 0);
      const secondHalf = await generateEmbeddingsBatch(texts.slice(mid), 0);
      return [...firstHalf, ...secondHalf];
    }

    // If single text exceeds token limit, skip it
    if (error.status === 400 && error.message?.includes('maximum context length') && texts.length === 1) {
      console.warn(`⚠️  Text too long (exceeds token limit), skipping...`);
      return [null];
    }

    if (retryCount < MAX_RETRIES) {
      console.warn(`Batch embedding failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return generateEmbeddingsBatch(texts, retryCount + 1);
    }

    console.error('Error generating embeddings batch:', error);
    throw new Error(`Failed to generate embeddings batch: ${error.message}`);
  }
}

/**
 * Estimate token count for text (conservative approximation)
 * ~1.0 tokens per word for safety (actual is ~0.75)
 * Arabic text may use more tokens per word
 */
function estimateTokens(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.0);
}

/**
 * Generate embeddings for large datasets in chunks
 * Uses dynamic batching to respect token limits
 */
export async function generateEmbeddingsChunked(
  texts: string[],
  onProgress?: (processed: number, total: number) => void
): Promise<number[][]> {
  const results: number[][] = [];
  const total = texts.length;
  let i = 0;

  while (i < texts.length) {
    // Dynamic batching: accumulate texts until we hit token or size limit
    const batch: string[] = [];
    let batchTokens = 0;

    while (i < texts.length && batch.length < BATCH_SIZE) {
      const textTokens = estimateTokens(texts[i]);

      // Check if adding this text would exceed token limit
      if (batch.length > 0 && batchTokens + textTokens > MAX_TOKENS_PER_BATCH) {
        break;
      }

      batch.push(texts[i]);
      batchTokens += textTokens;
      i++;

      // If this single text is huge, process it alone
      if (textTokens > MAX_TOKENS_PER_BATCH / 2) {
        break;
      }
    }

    // Process the batch
    const chunkEmbeddings = await generateEmbeddingsBatch(batch);
    results.push(...chunkEmbeddings);

    if (onProgress) {
      onProgress(Math.min(i, total), total);
    }

    // Small delay between batches to avoid rate limits
    if (i < texts.length) {
      await sleep(100);
    }
  }

  return results;
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have same length');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

/**
 * Find most similar embeddings to a query embedding
 */
export function findMostSimilar(
  queryEmbedding: number[],
  embeddings: { id: number; embedding: number[] }[],
  topK = 10,
  minSimilarity = 0.7
): { id: number; similarity: number }[] {
  const similarities = embeddings
    .map(({ id, embedding }) => ({
      id,
      similarity: cosineSimilarity(queryEmbedding, embedding),
    }))
    .filter(({ similarity }) => similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return similarities;
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Estimate cost for embedding generation
 * text-embedding-3-small: $0.02 per 1M tokens
 * Rough estimate: ~0.75 tokens per word
 */
export function estimateEmbeddingCost(textCount: number, avgWordsPerText: number): number {
  const estimatedTokens = textCount * avgWordsPerText * 0.75;
  const costPer1MTokens = 0.02;
  return (estimatedTokens / 1_000_000) * costPer1MTokens;
}

/**
 * Format embedding for database storage (JSONB)
 */
export function formatEmbeddingForDB(embedding: number[]): object {
  return embedding;
}

/**
 * Parse embedding from database (JSONB)
 */
export function parseEmbeddingFromDB(jsonb: any): number[] {
  if (Array.isArray(jsonb)) {
    return jsonb;
  }
  throw new Error('Invalid embedding format in database');
}
