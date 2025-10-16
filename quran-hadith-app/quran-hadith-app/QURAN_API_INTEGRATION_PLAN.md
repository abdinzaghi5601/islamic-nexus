# Quran.com API Integration Plan

**Date:** 2025-10-11
**Purpose:** Integrate Quran.com API to enhance Islamic Nexus with additional translations, tafsirs, and audio recitations

---

## Current Islamic Nexus Features

### What We Have:
- ✅ Database with Quran text (Arabic)
- ✅ 4 English translations (loaded locally)
- ✅ 5 Tafsirs (Ibn Kathir, Maarif-ul-Quran, Jalalayn, Tanwir al-Miqbas, Tustari)
- ✅ 18,706 theme/tag mappings across 6,236 ayahs
- ✅ Hadith references linked to ayahs
- ✅ Complete API endpoint: `/api/quran/ayah-complete/[surah]/[ayah]`
- ✅ Study pages with tafsir selector
- ✅ Admin panel for adding hadiths and lessons

### What's Missing:
- ❌ Audio recitations
- ❌ Additional translations (only 4 vs 100+ available)
- ❌ Additional tafsirs in multiple languages
- ❌ Juz/Hizb/Ruku/Manzil metadata
- ❌ Word-by-word analysis

---

## Quran.com API Analysis

### Base URL:
```
https://api.quran.com/api/v4
```

### Available Endpoints:

#### 1. **Chapters API**
```
GET /chapters
GET /chapters/{id}
```

**Response Data:**
```json
{
  "id": 1,
  "revelation_place": "makkah",
  "revelation_order": 5,
  "name_simple": "Al-Fatihah",
  "name_arabic": "الفاتحة",
  "verses_count": 7,
  "pages": [1, 1],
  "translated_name": {
    "language_name": "english",
    "name": "The Opener"
  }
}
```

#### 2. **Verses API**
```
GET /verses/by_chapter/{chapter_number}
GET /verses/by_key/{verse_key}?translations={ids}
```

**Response Data:**
```json
{
  "id": 262,
  "verse_number": 255,
  "verse_key": "2:255",
  "page_number": 42,
  "juz_number": 3,
  "hizb_number": 5,
  "ruku_number": 35,
  "manzil_number": 1,
  "translations": [...]
}
```

#### 3. **Translations API**
```
GET /resources/translations
GET /quran/translations/{translation_id}?chapter_number={n}
```

**Available Translations (100+):**
- English: Saheeh International (20), Yusuf Ali (22), Pickthall (19), Abdel Haleem (85)
- Urdu: Junagarhi (54), Maududi (97), Israr Ahmad (158)
- Arabic: Multiple options
- 50+ other languages

#### 4. **Tafsirs API**
```
GET /resources/tafsirs
GET /quran/tafsirs/{tafsir_id}?verse_key={key}
```

**Available Tafsirs:**
- ID 169: Ibn Kathir (Abridged) - English
- ID 168: Ma'arif al-Qur'an - English
- ID 14: Ibn Kathir - Arabic
- ID 15: Al-Tabari - Arabic
- ID 90: Al-Qurtubi - Arabic
- ID 91: Al-Sa'di - Arabic
- ID 93: Al-Wasit (Tantawi) - Arabic
- ID 94: Al-Baghawi - Arabic
- ID 157: Fi Zilal al-Quran - Urdu

#### 5. **Audio/Recitations API**
```
GET /resources/recitations
GET /chapter_recitations/{recitation_id}/{chapter_number}
```

---

## Integration Strategy

### Phase 1: API Service Layer (Priority: HIGH)

**Create:** `src/lib/api/quran-api-service.ts`

**Purpose:** Centralized service to interact with Quran.com API

**Functions:**
```typescript
// Translations
export async function getAvailableTranslations()
export async function getVerseWithTranslations(verseKey: string, translationIds: number[])

// Tafsirs
export async function getAvailableTafsirs()
export async function getTafsirForVerse(verseKey: string, tafsirId: number)

// Audio
export async function getAvailableReciters()
export async function getChapterAudio(reciterId: number, chapterNumber: number)
export async function getVerseAudio(reciterId: number, verseKey: string)

// Metadata
export async function getVerseMetadata(verseKey: string)
```

**Benefits:**
- Single source of truth for external API calls
- Caching support
- Error handling
- Rate limiting protection

---

### Phase 2: Enhanced Translations (Priority: HIGH)

**Goal:** Allow users to select from 100+ translations instead of just 4

**Implementation Steps:**

1. **Create Translation Selector Component**
   - File: `src/components/translation-selector.tsx`
   - Features:
     - Searchable list of translations
     - Filter by language
     - Select multiple translations
     - Save user preferences

2. **Update Study Page**
   - Add translation selector UI
   - Fetch selected translations from Quran.com API
   - Display alongside local translations
   - Cache API responses for performance

3. **API Integration Endpoint**
   - Create: `/api/quran/external-translations/[verseKey]`
   - Accept translation IDs as query params
   - Return formatted translation data

**User Experience:**
```
Study Page → Click "Add Translation" → Select from 100+ options → Translation appears in tabs
```

---

### Phase 3: Audio Recitations (Priority: MEDIUM)

**Goal:** Add audio playback for ayahs and full surahs

**Implementation Steps:**

1. **Create Audio Player Component**
   - File: `src/components/audio-player.tsx`
   - Features:
     - Play/pause controls
     - Progress bar
     - Playback speed control
     - Loop single ayah or entire surah
     - Auto-advance to next ayah

2. **Reciter Selection**
   - File: `src/components/reciter-selector.tsx`
   - Features:
     - List of famous reciters (Abdul Basit, Mishary, Sudais, etc.)
     - Recitation style (Murattal, Mujawwad, Muallim)
     - Save preferred reciter

3. **Audio API Integration**
   - Fetch audio URLs from Quran.com API
   - Preload next ayah for smooth playback
   - Handle network errors gracefully

4. **Update Study Page**
   - Add audio player above or below Arabic text
   - Display current reciter
   - Option to change reciter

**User Experience:**
```
Study Page → Click play icon → Audio plays → Auto-advances to next ayah
```

---

### Phase 4: Enhanced Metadata (Priority: LOW)

**Goal:** Show Juz, Hizb, Ruku, Manzil information for each ayah

**Implementation Steps:**

1. **Add Metadata Display**
   - File: Update `src/components/ayah-study-client.tsx`
   - Add metadata section showing:
     - Juz (Part) number
     - Hizb (Section) number
     - Ruku (Passage) number
     - Manzil (Stage) number
     - Page number in Mushaf

2. **Fetch Metadata**
   - Use Quran.com API's verse endpoint
   - Cache metadata for all ayahs
   - Display in info card

**User Experience:**
```
Study Page → See "Ayah Info" card → Shows: Juz 3, Hizb 5, Page 42, etc.
```

---

### Phase 5: Additional Tafsirs (Priority: MEDIUM)

**Goal:** Supplement local tafsirs with on-demand external tafsirs

**Implementation Steps:**

1. **Hybrid Tafsir System**
   - Show local tafsirs first (already loaded)
   - Add "More Tafsirs" button
   - Fetch additional tafsirs from Quran.com API on demand

2. **Tafsir Language Filter**
   - Allow users to select tafsir language
   - Show Arabic, English, Urdu options
   - Fetch relevant tafsirs dynamically

3. **Update Tafsir Selector**
   - File: Update `src/components/ayah-study-client.tsx`
   - Add external tafsirs to selection dialog
   - Mark external tafsirs with icon
   - Fetch on selection

**User Experience:**
```
Study Page → Tafsir section → Click "More Tafsirs" → Select from 16+ options → Tafsir loads
```

---

## Implementation Priority

### High Priority (Implement First):
1. ✅ API Service Layer
2. ✅ Enhanced Translations Feature

### Medium Priority (Implement Second):
3. Audio Recitations
4. Additional Tafsirs

### Low Priority (Future Enhancement):
5. Enhanced Metadata Display
6. Word-by-word Analysis (if API supports it)

---

## Technical Considerations

### Caching Strategy:
- Cache API responses in memory
- Use Next.js cache for SSR
- Consider Redis for production
- Set cache expiry (24 hours for translations, 7 days for audio URLs)

### Error Handling:
- Fallback to local data if API fails
- Show user-friendly error messages
- Log API errors for monitoring
- Retry failed requests (3 attempts max)

### Performance:
- Lazy load audio files
- Preload next ayah audio for smooth playback
- Compress translation data
- Use pagination for long surah audio

### Rate Limiting:
- Respect Quran.com API rate limits
- Implement exponential backoff
- Cache aggressively to reduce API calls
- Consider self-hosting frequently accessed data

### Environment Variables:
```bash
# Add to .env.local
NEXT_PUBLIC_QURAN_API_BASE_URL=https://api.quran.com/api/v4
QURAN_API_TIMEOUT=10000
```

---

## Database Schema Updates

### Optional: Cache External Translations
```prisma
model ExternalTranslation {
  id              Int      @id @default(autoincrement())
  verseKey        String   // "2:255"
  translationId   Int      // Quran.com translation ID
  text            String   @db.Text
  translatorName  String
  language        String
  cachedAt        DateTime @default(now())

  @@unique([verseKey, translationId])
  @@index([verseKey])
}
```

### Optional: Store User Preferences
```prisma
model UserPreferences {
  id                    Int      @id @default(autoincrement())
  userId                String   @unique
  preferredTranslations Json     // [20, 22, 85]
  preferredTafsirs      Json     // [169, 168]
  preferredReciter      Int?     // Reciter ID
  playbackSpeed         Float    @default(1.0)
  autoAdvance           Boolean  @default(true)

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

---

## API Endpoint Structure

### New Endpoints to Create:

```
POST /api/quran/external-translations
Body: { verseKey: "2:255", translationIds: [20, 22, 85] }
Response: Array of translation objects

POST /api/quran/external-tafsir
Body: { verseKey: "2:255", tafsirId: 169 }
Response: Tafsir text and metadata

GET /api/quran/audio/[reciterId]/[verseKey]
Response: Audio URL and metadata

GET /api/quran/metadata/[verseKey]
Response: Juz, hizb, ruku, manzil data

GET /api/resources/translations
Response: List of all available translations

GET /api/resources/tafsirs
Response: List of all available tafsirs

GET /api/resources/reciters
Response: List of all available reciters
```

---

## Testing Plan

### Unit Tests:
- Test API service functions
- Mock Quran.com API responses
- Test error handling
- Test caching logic

### Integration Tests:
- Test translation selector component
- Test audio player component
- Test API endpoints
- Test fallback mechanisms

### Manual Testing:
1. Select multiple translations → Verify all appear
2. Play audio → Verify playback works
3. Switch reciter → Verify audio changes
4. Disconnect internet → Verify fallback to local data
5. Test on mobile → Verify responsive design

---

## Rollout Plan

### Development:
1. Create feature branch: `feature/quran-api-integration`
2. Implement Phase 1 (API Service Layer)
3. Test thoroughly
4. Implement Phase 2 (Translations)
5. Test thoroughly
6. Merge to main

### Staging:
1. Deploy to Vercel preview
2. Test with real API
3. Monitor API usage
4. Verify caching works

### Production:
1. Merge to main
2. Vercel auto-deploys
3. Monitor API rate limits
4. Gather user feedback
5. Iterate based on feedback

---

## Documentation Updates

### Update Files:
- `README.md` - Add Quran.com API credit
- `NEW_FEATURES_GUIDE.md` - Add translation selector guide
- `DEPLOYMENT_STATUS.md` - Note new environment variables

### Create New Files:
- `AUDIO_GUIDE.md` - How to use audio recitations
- `TRANSLATION_GUIDE.md` - How to select translations

---

## Legal & Attribution

### Quran.com API License:
- **License:** MIT License
- **Attribution Required:** Yes
- **Credit:** "Translations and audio powered by Quran.com"

### Add to Footer:
```html
<footer>
  Translations and audio recitations powered by
  <a href="https://quran.com">Quran.com</a>
</footer>
```

---

## Success Metrics

### User Engagement:
- Number of translations selected per user
- Audio playback duration
- Tafsir views (local vs external)

### Performance:
- API response times
- Cache hit rate
- Audio loading time

### Error Tracking:
- API failure rate
- Fallback usage frequency
- User-reported issues

---

## Next Steps

1. **Review this plan** ✅
2. **Create API service layer** (Next task)
3. **Implement translation selector** (After service layer)
4. **Test integration** (After implementation)
5. **Deploy to production** (After testing)

---

**Status:** ✅ Planning Complete - Ready to Implement
**Estimated Time:**
- Phase 1 (API Service): 2-3 hours
- Phase 2 (Translations): 3-4 hours
- Phase 3 (Audio): 4-6 hours
- Phase 4 (Metadata): 1-2 hours
- Phase 5 (Additional Tafsirs): 2-3 hours

**Total Estimated Time:** 12-18 hours

---

Last Updated: 2025-10-11
