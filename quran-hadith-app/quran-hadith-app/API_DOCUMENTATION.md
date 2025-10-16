# API Documentation - Quran & Hadith App

## Complete Ayah Endpoint

### GET /api/quran/ayah-complete/[surah]/[ayah]

Get comprehensive data for a specific ayah including translations, tafsirs, themes, related hadiths, duas, and lessons.

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| surah | number | Yes | Surah number (1-114) |
| ayah | number | Yes | Ayah number within the surah |

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| translations | string | all | Comma-separated translator IDs (e.g., `1,2,3`) |
| tafsir | string | all | Comma-separated tafsir book IDs (e.g., `1,2`) |
| includeThemes | boolean | true | Include theme tags |
| includeHadiths | boolean | true | Include related hadiths |
| includeDuas | boolean | true | Include duas from ayah |
| includeLessons | boolean | true | Include lessons from ayah |

#### Response Format

```json
{
  "success": true,
  "data": {
    "ayah": {
      "id": 262,
      "surahNumber": 2,
      "ayahNumber": 255,
      "numberInQuran": 262,
      "arabicText": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ...",
      "juz": 3,
      "manzil": 1,
      "page": 42,
      "hizbQuarter": 17,
      "sajda": false,

      "surah": {
        "number": 2,
        "name": "Al-Baqarah",
        "nameArabic": "سُورَةُ البَقَرَةِ",
        "nameTranslation": "The Cow",
        "revelationType": "Medinan",
        "totalAyahs": 286
      },

      "translations": [
        {
          "id": 262,
          "text": "Allah - there is no deity except Him...",
          "translator": {
            "id": 1,
            "name": "Sahih International",
            "language": "English"
          }
        }
      ],

      "tafsirs": [
        {
          "id": 181,
          "text": "This is Ayat Al-Kursi and tremendous virtues...",
          "tafsirBook": {
            "id": 1,
            "name": "Tafsir Ibn Kathir",
            "authorName": "Ismail ibn Kathir",
            "language": "English"
          }
        }
      ],

      "themes": [
        {
          "id": 2,
          "name": "Tawhid (Oneness of Allah)",
          "nameArabic": "التوحيد",
          "slug": "tawhid",
          "description": "Oneness and uniqueness of Allah",
          "relevance": 10,
          "parentTheme": {
            "id": 1,
            "name": "Faith & Belief",
            "slug": "faith-belief"
          }
        }
      ],

      "relatedHadiths": [
        {
          "id": 12345,
          "hadithNumber": "2311",
          "textArabic": "...",
          "textEnglish": "Narrated Abu Huraira...",
          "book": {
            "id": 1,
            "name": "Sahih al-Bukhari",
            "arabicName": "صحيح البخاري"
          },
          "chapter": {
            "id": 123,
            "title": "Book of Virtues of the Quran",
            "arabicTitle": "..."
          }
        }
      ],

      "duas": [
        {
          "id": 1,
          "arabicText": "...",
          "transliteration": "...",
          "translation": "...",
          "occasion": "Morning/Evening",
          "benefits": "Protection from evil"
        }
      ],

      "lessons": [
        {
          "id": 1,
          "title": "Allah's Complete Knowledge",
          "lessonText": "This verse teaches that...",
          "category": "Faith",
          "tags": "tawhid, knowledge",
          "source": "Tafsir Ibn Kathir"
        }
      ]
    },

    "navigation": {
      "previous": {
        "surah": 2,
        "ayah": 254
      },
      "next": {
        "surah": 2,
        "ayah": 256
      }
    },

    "metadata": {
      "totalTranslations": 4,
      "totalTafsirs": 5,
      "totalThemes": 3,
      "totalRelatedHadiths": 2,
      "totalDuas": 0,
      "totalLessons": 0
    }
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Invalid surah number. Must be between 1 and 114"
}
```

#### Example Requests

**Get Ayat al-Kursi with all data:**
```bash
GET /api/quran/ayah-complete/2/255
```

**Get with specific translations only:**
```bash
GET /api/quran/ayah-complete/2/255?translations=1,2
```

**Get without hadiths and duas:**
```bash
GET /api/quran/ayah-complete/2/255?includeHadiths=false&includeDuas=false
```

**Get with specific tafsir:**
```bash
GET /api/quran/ayah-complete/2/255?tafsir=1
```

#### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Invalid parameters (e.g., surah/ayah out of range) |
| 404 | Ayah not found |
| 500 | Server error |

## Available Translators

| ID | Name | Language |
|----|------|----------|
| 1 | Sahih International | English |
| 2 | Yusuf Ali | English |
| 3 | Pickthall | English |
| 4 | Dr. Mustafa Khattab | English |

## Available Tafsir Books

| ID | Name | Author | Language |
|----|------|--------|----------|
| 1 | Tafsir Ibn Kathir | Ismail ibn Kathir | English |
| 2 | Maarif-ul-Quran | Mufti Muhammad Shafi | English |
| 3 | Al-Jalalayn | Jalal ad-Din al-Mahalli & as-Suyuti | English |
| 4 | Tanwîr al-Miqbâs | Abdullah Ibn Abbas | English |
| 5 | Tafsir al-Tustari | Sahl al-Tustari | English |

## Performance Considerations

1. **Caching**: The API automatically caches responses for better performance
2. **Pagination**: Related hadiths are limited to 10 most relevant
3. **Selective Loading**: Use query parameters to only fetch needed data
4. **Database Indexing**: All queries are optimized with proper indexes

## Rate Limiting

Currently no rate limiting is implemented. This will be added in production.

## CORS

CORS is enabled for all origins in development. Production will have specific allowed origins.

## Testing Examples

### Using cURL

```bash
# Get Ayat al-Kursi
curl http://localhost:3000/api/quran/ayah-complete/2/255

# Get Al-Fatiha opening verse
curl http://localhost:3000/api/quran/ayah-complete/1/1

# Get with specific translation
curl "http://localhost:3000/api/quran/ayah-complete/2/255?translations=1"
```

### Using JavaScript/Fetch

```javascript
// Get complete ayah data
const response = await fetch('/api/quran/ayah-complete/2/255');
const data = await response.json();

if (data.success) {
  const ayah = data.data.ayah;
  console.log(ayah.translations[0].text);
  console.log(ayah.themes);
  console.log(ayah.relatedHadiths);
}
```

### Using React/Next.js

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function AyahPage({ surah, ayah }: { surah: number; ayah: number }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAyah() {
      const response = await fetch(`/api/quran/ayah-complete/${surah}/${ayah}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data.ayah);
      }
      setLoading(false);
    }
    fetchAyah();
  }, [surah, ayah]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Error loading ayah</div>;

  return (
    <div>
      <h1>{data.surah.name} {data.ayahNumber}</h1>
      <p className="arabic">{data.arabicText}</p>

      <h2>Translations</h2>
      {data.translations.map(t => (
        <div key={t.id}>
          <p>{t.text}</p>
          <small>{t.translator.name}</small>
        </div>
      ))}

      <h2>Themes</h2>
      {data.themes.map(theme => (
        <span key={theme.id} className="badge">
          {theme.name}
        </span>
      ))}

      <h2>Related Hadiths</h2>
      {data.relatedHadiths.map(hadith => (
        <div key={hadith.id}>
          <h3>{hadith.book.name} {hadith.hadithNumber}</h3>
          <p>{hadith.textEnglish}</p>
        </div>
      ))}
    </div>
  );
}
```

## Data Quality

All data is sourced from:
- **Quran Text**: QuranCloud API (authenticated sources)
- **Translations**: Multiple verified English translations
- **Tafsirs**: Classical and contemporary scholars
- **Hadiths**: Sahih Bukhari, Sahih Muslim, and other authentic collections
- **Themes**: Manually curated with automated keyword tagging
- **Cross-references**: Manually verified hadith-ayah connections

## Future Enhancements

1. **Search Endpoint**: Search ayahs by theme, keyword, or text
2. **Theme Browse Endpoint**: Get all ayahs for a specific theme
3. **Hadith Endpoint**: Get hadith with related ayahs
4. **Bookmark Endpoint**: User bookmarks and notes
5. **Audio Endpoint**: Quranic recitation integration
6. **Translation Languages**: Arabic, Urdu, French, etc.
