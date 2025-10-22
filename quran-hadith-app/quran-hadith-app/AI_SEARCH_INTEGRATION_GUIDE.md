# 🤖 AI Search Integration Guide - Islamic Nexus

**Transform your search into an intelligent AI-powered assistant**

**Features:**
- Natural language questions (e.g., "What does Islam say about patience?")
- Semantic search (understands meaning, not just keywords)
- Context-aware responses with Quran/Hadith references
- Multi-language support (Arabic + English)
- Citation with sources

**Time Required:** 1-2 hours
**Cost:** $0-5/month (depending on usage)

---

## 🎯 What We're Building

### Before (Keyword Search):
```
User searches: "patience"
Results: Exact matches for word "patience"
```

### After (AI Search):
```
User asks: "What does Islam teach about dealing with hardships?"
AI Response: "Islam emphasizes patience (Sabr) during hardships as mentioned in:
- Quran 2:155 - 'And We will surely test you with something of fear and hunger...'
- Hadith: 'The Messenger of Allah said: How wonderful is the affair of the believer...'
- Related concepts: Trust in Allah (Tawakkul), Gratitude (Shukr), Perseverance"
```

---

## Architecture Options

### Option 1: OpenAI GPT-4 (Recommended - Best Quality)

**Pros:**
- Best AI quality and understanding
- Excellent Arabic language support
- Very reliable
- Good documentation

**Cons:**
- Costs money (~$0.03 per 1000 tokens)
- Estimated monthly cost: $5-20 depending on usage

**Cost Breakdown:**
- Average search: ~2000 tokens (prompt + response)
- Cost per search: ~$0.06
- 100 searches/day = $6/month
- 1000 searches/day = $60/month

### Option 2: Anthropic Claude (Alternative - Similar to OpenAI)

**Pros:**
- Excellent quality (similar to GPT-4)
- Better at following instructions
- Longer context window

**Cons:**
- Similar pricing to OpenAI
- Estimated cost: $5-20/month

### Option 3: Local AI Models (FREE but requires more resources)

**Options:**
- **LLaMA 2** (Meta's open-source model)
- **Mistral** (French open-source model)
- **Qwen** (Alibaba's model - excellent Arabic)

**Pros:**
- Completely FREE
- No API limits
- Data privacy (everything local)

**Cons:**
- Requires more server resources (16GB+ RAM recommended)
- Slower responses than API services
- More complex setup

### Option 4: Hybrid Approach (Recommended for Starting)

Use **OpenAI for AI chat** + **Your existing semantic search** for finding relevant content:

1. User asks question
2. Your semantic search finds relevant Quran/Hadith verses
3. OpenAI formats and explains with context
4. Return well-formatted response with sources

**Cost:** $2-10/month (much cheaper than pure GPT-4)

---

## Setup Guide: Hybrid AI Search (Recommended)

### Phase 1: Get OpenAI API Key

1. **Go to:** https://platform.openai.com/signup
2. **Sign up** or login
3. **Go to:** https://platform.openai.com/api-keys
4. **Click "Create new secret key"**
5. **Name it:** `islamic-nexus-search`
6. **Copy the key** (starts with `sk-proj-...`)
7. **Save it** securely (you won't see it again!)

**Add billing:**
- Go to: https://platform.openai.com/settings/organization/billing
- Click "Add payment method"
- Add credit card
- Set usage limit (e.g., $10/month to prevent overcharges)

### Phase 2: Update Your Environment

**On your Oracle VM:**

```bash
# SSH into server
ssh -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP

# Edit environment file
cd /var/www/islamic-nexus
nano .env.local
```

**Add OpenAI key:**
```env
# Existing config...

# OpenAI Configuration
OPENAI_API_KEY="sk-proj-YOUR-KEY-HERE"
OPENAI_MODEL="gpt-4o-mini"  # Cheaper model, still great quality
OPENAI_MAX_TOKENS=1000
```

Save: `Ctrl+X`, `Y`, `Enter`

### Phase 3: Install OpenAI SDK

```bash
# In your project directory
npm install openai

# Rebuild application
npm run build

# Restart
pm2 restart islamic-nexus
```

### Phase 4: Create AI Search Service

Create new file for AI service:

```bash
nano src/lib/ai/openai-service.ts
```

Add this code:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AISearchRequest {
  query: string;
  context: {
    ayahs?: any[];
    hadiths?: any[];
    duas?: any[];
  };
  language?: 'en' | 'ar';
}

export interface AISearchResponse {
  answer: string;
  sources: Array<{
    type: 'ayah' | 'hadith' | 'dua';
    reference: string;
    text: string;
    relevance: string;
  }>;
  relatedTopics: string[];
}

export async function generateAIResponse(
  request: AISearchRequest
): Promise<AISearchResponse> {
  const { query, context, language = 'en' } = request;

  // Build context from your existing search results
  const contextText = buildContextText(context);

  // Create prompt for OpenAI
  const systemPrompt = `You are an Islamic knowledge assistant for Islamic Nexus website.
Your role is to answer questions about Islam using authentic sources from Quran and Hadith.

Guidelines:
- Provide accurate, authentic information
- Always cite sources (Quran verses, Hadith references)
- Be respectful and scholarly in tone
- If you don't know, say so and suggest consulting a scholar
- Avoid controversial topics
- Focus on mainstream Islamic understanding
- Always provide Arabic text when relevant

Language: ${language === 'ar' ? 'Respond in Arabic' : 'Respond in English'}`;

  const userPrompt = `Question: ${query}

Available Context from Islamic Nexus Database:
${contextText}

Please provide:
1. A clear, comprehensive answer
2. Relevant Quran verses and Hadith with references
3. Related topics the user might want to explore

Format your response as JSON with this structure:
{
  "answer": "Your detailed answer here",
  "sources": [
    {
      "type": "ayah|hadith|dua",
      "reference": "Quran 2:155",
      "text": "The actual text",
      "relevance": "Why this is relevant"
    }
  ],
  "relatedTopics": ["Topic 1", "Topic 2", "Topic 3"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || '{}');
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

function buildContextText(context: AISearchRequest['context']): string {
  let text = '';

  // Add Quran verses
  if (context.ayahs && context.ayahs.length > 0) {
    text += '\n\nRelevant Quran Verses:\n';
    context.ayahs.forEach((ayah) => {
      text += `\n- Surah ${ayah.surah}:${ayah.number}
Arabic: ${ayah.textArabic}
Translation: ${ayah.textEnglish}\n`;
    });
  }

  // Add Hadiths
  if (context.hadiths && context.hadiths.length > 0) {
    text += '\n\nRelevant Hadiths:\n';
    context.hadiths.forEach((hadith) => {
      text += `\n- ${hadith.bookName} ${hadith.hadithNumber}
Arabic: ${hadith.textArabic}
English: ${hadith.textEnglish}
Grade: ${hadith.grade}\n`;
    });
  }

  // Add Duas
  if (context.duas && context.duas.length > 0) {
    text += '\n\nRelevant Duas:\n';
    context.duas.forEach((dua) => {
      text += `\n- ${dua.title}
Arabic: ${dua.arabic}
Translation: ${dua.english}
Reference: ${dua.reference}\n`;
    });
  }

  return text || 'No specific context available from database.';
}

// Chat-style conversation support
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  context?: AISearchRequest['context']
): Promise<string> {
  const contextText = context ? buildContextText(context) : '';

  const systemMessage: ChatMessage = {
    role: 'system',
    content: `You are an Islamic knowledge assistant for Islamic Nexus website.
${contextText ? `\n\nAvailable Context:\n${contextText}` : ''}

Provide accurate, authentic Islamic knowledge with proper citations.`,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI Chat API Error:', error);
    throw new Error('Failed to generate chat response');
  }
}
```

Save file.

### Phase 5: Create AI Search API Endpoint

```bash
# Create AI search API route
mkdir -p src/app/api/search/ai
nano src/app/api/search/ai/route.ts
```

Add this code:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai-service';
import prisma from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const { query, language = 'en' } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // First, use your existing semantic search to find relevant content
    const [ayahs, hadiths, duas] = await Promise.all([
      // Search Quran (using your existing search logic)
      prisma.ayah.findMany({
        where: {
          OR: [
            { textEnglish: { contains: query, mode: 'insensitive' } },
            { textArabic: { contains: query } },
          ],
        },
        take: 5,
        include: {
          surah: true,
        },
      }),

      // Search Hadith (using your existing search logic)
      prisma.hadith.findMany({
        where: {
          OR: [
            { textEnglish: { contains: query, mode: 'insensitive' } },
            { textArabic: { contains: query } },
          ],
        },
        take: 5,
        include: {
          book: true,
        },
      }),

      // Search Duas (you might not have this in DB, use JSON file)
      // Or implement your existing dua search logic
      Promise.resolve([]),
    ]);

    // Generate AI response with context
    const aiResponse = await generateAIResponse({
      query,
      context: {
        ayahs,
        hadiths,
        duas,
      },
      language,
    });

    return NextResponse.json({
      success: true,
      data: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Search Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process AI search',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  // Reuse POST logic
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  );
}
```

Save file.

### Phase 6: Create Chat API Endpoint (Optional - For Conversational AI)

```bash
nano src/app/api/search/chat/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/ai/openai-service';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(messages);

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### Phase 7: Update Search Page UI

```bash
nano src/app/search/page.tsx
```

Add AI search toggle and display:

```typescript
'use client';

import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      if (useAI) {
        // AI Search
        const response = await fetch('/api/search/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error('AI search failed');

        const data = await response.json();
        setAiResponse(data.data);
      } else {
        // Regular search (your existing logic)
        // ... your existing search code
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center gradient-text">
        Search Islamic Nexus
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              useAI
                ? 'Ask anything about Islam...'
                : 'Search Quran, Hadith, Duas...'
            }
            className="flex-1 px-4 py-3 rounded-lg border"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : useAI ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* AI Toggle */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="ai-search"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="ai-search" className="text-sm">
            Use AI Assistant (Ask questions in natural language)
          </label>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* AI Response Display */}
      {aiResponse && (
        <div className="space-y-6">
          {/* Answer */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">AI Response</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {aiResponse.answer}
            </p>
          </div>

          {/* Sources */}
          {aiResponse.sources && aiResponse.sources.length > 0 && (
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Sources</h3>
              <div className="space-y-4">
                {aiResponse.sources.map((source: any, idx: number) => (
                  <div
                    key={idx}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-primary">
                        {source.reference}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({source.type})
                      </span>
                    </div>
                    <p className="text-sm font-arabic text-right mb-2" dir="rtl">
                      {source.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {source.relevance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Topics */}
          {aiResponse.relatedTopics && aiResponse.relatedTopics.length > 0 && (
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {aiResponse.relatedTopics.map((topic: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(topic)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Phase 8: Deploy and Test

```bash
# Rebuild application
npm run build

# Restart
pm2 restart islamic-nexus

# Check logs
pm2 logs islamic-nexus --lines 50
```

**Test AI Search:**

1. Open your website: `https://your-domain.com/search`
2. Check "Use AI Assistant"
3. Try queries like:
   - "What does Islam say about patience?"
   - "Tell me about the virtues of prayer"
   - "What are the conditions for Hajj?"
   - "Explain Tawheed"

---

## Advanced Features (Optional)

### Feature 1: Add Usage Tracking

```typescript
// src/lib/ai/usage-tracker.ts
export async function trackAIUsage(
  userId: string | null,
  query: string,
  tokensUsed: number,
  cost: number
) {
  await prisma.aIUsage.create({
    data: {
      userId,
      query,
      tokensUsed,
      estimatedCost: cost,
      timestamp: new Date(),
    },
  });
}
```

### Feature 2: Add Rate Limiting

```typescript
// Limit to 10 AI searches per hour per user
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function checkRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  return success;
}
```

### Feature 3: Add Caching

```typescript
// Cache common queries to save API costs
import { createHash } from 'crypto';

const cache = new Map<string, { response: any; timestamp: number }>();

function getCacheKey(query: string): string {
  return createHash('md5').update(query.toLowerCase()).digest('hex');
}

export async function getCachedResponse(query: string) {
  const key = getCacheKey(query);
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < 3600000) {
    // Cache for 1 hour
    return cached.response;
  }

  return null;
}

export function setCachedResponse(query: string, response: any) {
  const key = getCacheKey(query);
  cache.set(key, { response, timestamp: Date.now() });
}
```

---

## Cost Optimization Tips

### 1. Use GPT-4o-mini Instead of GPT-4
- 60x cheaper than GPT-4
- Still excellent quality
- Perfect for Q&A
- Cost: $0.15 per 1M input tokens, $0.60 per 1M output tokens

### 2. Limit Max Tokens
```env
OPENAI_MAX_TOKENS=500  # Shorter responses = lower cost
```

### 3. Cache Common Queries
- Store responses for popular questions
- Only call API for new questions

### 4. Use Streaming (Optional)
- Show response as it's generated
- Better UX, same cost

### 5. Implement Daily Budget
```typescript
let dailySpend = 0;
const DAILY_BUDGET = 1.0; // $1 per day

if (dailySpend >= DAILY_BUDGET) {
  throw new Error('Daily AI budget exceeded');
}
```

---

## Alternative: Free Local AI Setup

If you want 100% free AI (no OpenAI costs):

### Option: Use Ollama (Local LLM)

**On your Oracle VM:**

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download model (choose one):
ollama pull llama2                    # Good general model
ollama pull mistral                   # Great quality
ollama pull qwen:7b                   # Best for Arabic

# Test
ollama run llama2 "What is Islam?"
```

**Install Ollama JS SDK:**
```bash
npm install ollama
```

**Update AI service to use Ollama:**
```typescript
// src/lib/ai/ollama-service.ts
import { Ollama } from 'ollama';

const ollama = new Ollama();

export async function generateLocalAIResponse(query: string) {
  const response = await ollama.chat({
    model: 'llama2',
    messages: [
      {
        role: 'system',
        content: 'You are an Islamic knowledge assistant...',
      },
      { role: 'user', content: query },
    ],
  });

  return response.message.content;
}
```

**Pros:**
- ✅ Completely FREE
- ✅ No API limits
- ✅ Privacy (all local)

**Cons:**
- ❌ Slower (10-30 seconds per response)
- ❌ Requires more RAM (use 16GB+ models)
- ❌ Quality slightly lower than GPT-4

---

## Testing & Quality Assurance

### Test Cases:

1. **Simple Questions:**
   - "What is Salah?"
   - "Who is Prophet Muhammad?"
   - "What is Ramadan?"

2. **Complex Questions:**
   - "How should a Muslim deal with anxiety?"
   - "What are the rights of parents in Islam?"
   - "Explain the concept of Qadr"

3. **Arabic Questions:**
   - "ما هي أركان الإسلام؟"
   - "كيف أتوضأ؟"

4. **Edge Cases:**
   - Very long questions
   - Questions with typos
   - Questions in other languages
   - Controversial topics (should be handled gracefully)

---

## Monitoring & Analytics

### Track AI Usage:

```typescript
// Add to your database schema
model AISearchLog {
  id        Int      @id @default(autoincrement())
  query     String   @db.Text
  userId    String?
  tokensUsed Int
  cost      Float
  responseTime Int  // milliseconds
  success   Boolean
  createdAt DateTime @default(now())
}
```

### Create Analytics Dashboard:

```typescript
// src/app/admin/ai-analytics/page.tsx
export default async function AIAnalytics() {
  const stats = await prisma.aISearchLog.aggregate({
    _sum: { tokensUsed: true, cost: true },
    _avg: { responseTime: true },
    _count: true,
  });

  return (
    <div>
      <h1>AI Search Analytics</h1>
      <div>Total Searches: {stats._count}</div>
      <div>Total Cost: ${stats._sum.cost?.toFixed(2)}</div>
      <div>Avg Response Time: {stats._avg.responseTime}ms</div>
    </div>
  );
}
```

---

## Summary

**What You Now Have:**

✅ AI-powered natural language search
✅ Answers with authentic Quran/Hadith sources
✅ Related topic suggestions
✅ Conversation-style interactions
✅ Cost-effective hybrid approach
✅ Scalable architecture

**Monthly Cost Estimate:**
- Light usage (100 searches/day): $3-5/month
- Medium usage (500 searches/day): $10-20/month
- Heavy usage (2000 searches/day): $40-60/month

**Or use local AI (Ollama) for $0/month!**

---

**May Allah make this tool beneficial for spreading Islamic knowledge! 🤲**

Next: You can further enhance with:
- Voice search
- Image recognition (for Arabic text)
- Multi-turn conversations
- Personalized responses based on user history
