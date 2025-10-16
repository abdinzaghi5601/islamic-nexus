# 🔍 Enhanced Search System with Full-Text Search

This document explains the enhanced search system that integrates the English.csv translation file with PostgreSQL full-text search for powerful, fast, and relevant Quran search capabilities.

## 🎯 Features

### 1. **Full-Text Search with Ranking**
- Uses PostgreSQL's `tsvector` and `ts_rank` for relevance-based search
- Results ranked by relevance score
- Supports prefix matching (e.g., "pray" matches "prayer", "praying", "prays")

### 2. **English Translation Integration**
- Imports Abdullah Yusuf Ali's English translation from CSV
- 6,236 verses indexed for full-text search
- Search vectors automatically updated for optimal performance

### 3. **Multi-Source Search**
- Search across Quran translations
- Search in Hadith collections
- Search in Duas
- Search in Islamic books (PDF content)

### 4. **Enhanced Results**
- Related tafsirs for each ayah
- Alternative translations
- Related hadiths for Quran results
- Relevance ranking

## 📦 Setup Instructions

### Step 1: Import English Translation

Run the import script to load the English.csv translation into your database:

```bash
npm run import:translation
```

This script will:
1. Create a translator entry for "Abdullah Yusuf Ali"
2. Import all 6,236 verses from the CSV file
3. Update full-text search vectors
4. Verify the import

**Expected output:**
```
🚀 Starting English translation import...

📝 Step 1: Setting up translator...
  ✓ Created translator: Abdullah Yusuf Ali

📖 Step 2: Reading CSV file...
  ✓ Found 6236 lines in CSV

🔄 Step 3: Parsing CSV data...
  ✓ Successfully parsed 6236 verses

💾 Step 4: Importing translations to database...
  Processing in batches of 100...

✅ Import completed!
╔════════════════════════════════════════╗
║  Import Summary                        ║
╠════════════════════════════════════════╣
║  Imported:  6236                       ║
║  Updated:   0                          ║
║  Skipped:   0                          ║
║  Errors:    0                          ║
║  Total:     6236                       ║
╚════════════════════════════════════════╝

🔍 Step 5: Updating full-text search vectors...
  ✓ Search vectors updated successfully!
```

### Step 2: Test the Enhanced Search

The enhanced search is available at two endpoints:

#### **Option A: Enhanced Search API** (Recommended)
```
GET /api/search/enhanced?q=patience&type=quran
```

Query parameters:
- `q` (required): Search query
- `type`: 'quran' | 'hadith' | 'all' (default: 'quran')
- `translator`: Translator ID (default: 1 for Yusuf Ali)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `minRank`: Minimum relevance score (default: 0.01)

**Example response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "ayah",
        "id": 123,
        "text": "O ye who believe! seek help with patient perseverance and prayer...",
        "textArabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ...",
        "reference": "Al-Baqarah 2:153",
        "rank": 0.45,
        "surah": {
          "number": 2,
          "nameEnglish": "Al-Baqarah",
          "nameArabic": "البقرة"
        },
        "tafsirs": [...],
        "otherTranslations": [...]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    },
    "query": {
      "original": "patience",
      "processed": "patience:*",
      "type": "quran"
    }
  }
}
```

#### **Option B: Original Search API** (Legacy)
```
GET /api/search?q=patience&type=quran
```

The original API uses `LIKE` queries and keyword expansion but is slower for large datasets.

## 🔧 Technical Details

### Database Schema

The search system uses these tables:

**Translator** - Translation author information
```sql
CREATE TABLE translators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  language VARCHAR(50),
  description TEXT
);
```

**Translation** - Verse translations with full-text search
```sql
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  ayah_id INTEGER REFERENCES ayahs(id),
  translator_id INTEGER REFERENCES translators(id),
  text TEXT,
  search_vector tsvector,  -- Full-text search index
  UNIQUE(ayah_id, translator_id)
);

-- GIN index for fast full-text search
CREATE INDEX idx_translations_search_vector ON translations USING GIN(search_vector);
```

### Full-Text Search Query Example

The enhanced search uses PostgreSQL's powerful text search:

```sql
SELECT
  t.text,
  ts_rank(t.search_vector, to_tsquery('english', 'patience:*')) as rank
FROM translations t
WHERE t.search_vector @@ to_tsquery('english', 'patience:*')
ORDER BY rank DESC;
```

### Search Vector Update

Search vectors are automatically created using:

```sql
UPDATE translations
SET search_vector = to_tsvector('english', text)
WHERE translator_id = 1;
```

## 📊 Performance Comparison

| Method | Query Time | Relevance | Features |
|--------|-----------|-----------|----------|
| **Enhanced (tsvector)** | ~5-20ms | ⭐⭐⭐⭐⭐ | Ranking, prefix match, stemming |
| **Original (LIKE)** | ~100-500ms | ⭐⭐⭐ | Keyword expansion |

## 🚀 Usage Examples

### Example 1: Search for verses about prayer
```bash
curl "http://localhost:3000/api/search/enhanced?q=prayer&type=quran&limit=5"
```

### Example 2: Search with minimum relevance threshold
```bash
curl "http://localhost:3000/api/search/enhanced?q=charity&minRank=0.1"
```

### Example 3: Search hadiths
```bash
curl "http://localhost:3000/api/search/enhanced?q=patience&type=hadith"
```

### Example 4: Multi-word search
```bash
curl "http://localhost:3000/api/search/enhanced?q=patience%20hardship"
```

## 🎨 Frontend Integration

Update your search component to use the enhanced API:

```typescript
const searchQuran = async (query: string) => {
  const response = await fetch(
    `/api/search/enhanced?q=${encodeURIComponent(query)}&type=quran&limit=20`
  );
  const data = await response.json();

  if (data.success) {
    return data.data.results.map(result => ({
      ...result,
      relevance: result.rank, // 0-1 scale
    }));
  }
};
```

## 🔄 Updating Translations

To re-import or update translations:

```bash
# Re-run the import script (will update existing translations)
npm run import:translation
```

## 📝 CSV File Format

The `English.csv` file should have this format:
```
SurahNumber|AyahNumber|EnglishText
1|1|In the name of Allah, Most Gracious, Most Merciful.
1|2|Praise be to Allah, the Cherisher and Sustainer of the worlds;
```

## 🐛 Troubleshooting

### Issue: Search returns no results

**Solution:** Ensure search vectors are updated:
```sql
UPDATE translations SET search_vector = to_tsvector('english', text);
```

### Issue: Import script fails

**Solution:** Check file path and format:
```typescript
// scripts/import-english-translation.ts
const CSV_FILE_PATH = 'C:\\Users\\abdul\\Desktop\\English.csv'; // Update this path
```

### Issue: Slow search queries

**Solution:** Verify GIN index exists:
```sql
CREATE INDEX IF NOT EXISTS idx_translations_search_vector
ON translations USING GIN(search_vector);
```

## 📚 Additional Resources

- [PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [ts_rank Documentation](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING)
- [Prisma Raw Queries](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)

## 🎯 Future Enhancements

- [ ] Add Arabic full-text search support
- [ ] Implement fuzzy matching for typos
- [ ] Add search history and autocomplete
- [ ] Support for multiple translators simultaneously
- [ ] Search result highlighting
- [ ] Advanced boolean operators (AND, OR, NOT)

---

Built with ❤️ using Next.js, PostgreSQL, and Prisma
