# Database Schema Documentation

## Overview

This database schema is designed to store and manage Islamic content including the complete Quran, Hadith collections, Tafsir (commentary), and user interactions.

## Technology

- **Database**: MySQL (compatible with PlanetScale/Railway)
- **ORM**: Prisma
- **Type Safety**: TypeScript

## Schema Sections

### 1. Quran Models

#### Surah
Stores information about each chapter of the Quran.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| number | Int | Surah number (1-114) |
| nameArabic | String | Arabic name |
| nameEnglish | String | English name |
| nameTranslation | String | Meaning of the name |
| revelationType | String | "Meccan" or "Medinan" |
| numberOfAyahs | Int | Total verses in surah |
| bismillahPre | Boolean | Has Bismillah at start |
| order | Int | Revelation order |

#### Ayah
Stores individual verses of the Quran.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| surahId | Int | Foreign key to Surah |
| ayahNumber | Int | Verse number within surah |
| numberInQuran | Int | Sequential number in entire Quran |
| textArabic | Text | Arabic text |
| textUthmani | Text | Uthmani script |
| textSimple | Text | Simplified Arabic |
| juz | Int | Juz number (1-30) |
| manzil | Int | Manzil number (1-7) |
| ruku | Int | Ruku number |
| hizbQuarter | Int | Hizb quarter |
| sajdah | Boolean | Contains sajdah |

#### Translation
Stores translations of Quranic verses.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| ayahId | Int | Foreign key to Ayah |
| translatorId | Int | Foreign key to Translator |
| text | Text | Translated text |

#### Translator
Stores information about translators.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Translator name |
| language | String | Translation language |
| description | Text | About the translator |

### 2. Tafsir Models

#### TafsirBook
Stores information about tafsir collections.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Tafsir name |
| authorName | String | Author name |
| language | String | Language |
| description | Text | About the tafsir |

#### TafsirVerse
Stores tafsir text for each verse.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| ayahId | Int | Foreign key to Ayah |
| tafsirBookId | Int | Foreign key to TafsirBook |
| text | LongText | Commentary text |

### 3. Hadith Models

#### HadithBook
Stores information about hadith collections (e.g., Sahih Bukhari).

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Book name |
| nameArabic | String | Arabic name |
| author | String | Author name |
| description | Text | About the book |
| totalHadiths | Int | Total number of hadiths |

#### HadithChapter
Stores chapters within hadith books.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| bookId | Int | Foreign key to HadithBook |
| chapterNumber | Int | Chapter number |
| nameArabic | String | Arabic name |
| nameEnglish | String | English name |
| intro | Text | Chapter introduction |

#### Hadith
Stores individual hadiths.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| bookId | Int | Foreign key to HadithBook |
| chapterId | Int | Foreign key to HadithChapter |
| hadithNumber | String | Book-specific number |
| hadithInChapter | Int | Number within chapter |
| textArabic | LongText | Arabic text |
| textEnglish | LongText | English translation |
| narratorChain | LongText | Isnad (chain of narrators) |
| grade | String | Sahih, Hasan, Daif, etc. |

### 4. Cross-Reference Models

#### HadithAyahReference
Links hadiths to related Quranic verses.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| hadithId | Int | Foreign key to Hadith |
| ayahId | Int | Foreign key to Ayah |

### 5. User Models

#### User
Stores user account information.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| email | String | User email |
| name | String | User name |
| password | String | Hashed password |
| emailVerified | DateTime | Email verification date |
| image | String | Profile image URL |

#### Account, Session, VerificationToken
NextAuth.js authentication models.

### 6. User Interaction Models

#### Bookmark
Stores user bookmarks for Quranic verses.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| userId | String | Foreign key to User |
| ayahId | Int | Foreign key to Ayah |
| note | Text | Optional user note |

#### HadithBookmark
Stores user bookmarks for hadiths.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| userId | String | Foreign key to User |
| hadithId | Int | Foreign key to Hadith |
| note | Text | Optional user note |

#### ReadingHistory
Tracks user reading history.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| userId | String | Foreign key to User |
| surahId | Int | Surah ID (optional) |
| ayahId | Int | Ayah ID (optional) |
| hadithId | Int | Hadith ID (optional) |
| readAt | DateTime | Timestamp |

#### Note
Stores user notes on verses or hadiths.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| userId | String | Foreign key to User |
| ayahId | Int | Ayah ID (optional) |
| hadithId | Int | Hadith ID (optional) |
| title | String | Note title |
| content | LongText | Note content |

## Relationships

### Quran Relationships
- Surah → Ayah (one-to-many)
- Ayah → Translation (one-to-many)
- Ayah → TafsirVerse (one-to-many)
- Translator → Translation (one-to-many)

### Hadith Relationships
- HadithBook → HadithChapter (one-to-many)
- HadithBook → Hadith (one-to-many)
- HadithChapter → Hadith (one-to-many)

### Cross-References
- Hadith ↔ Ayah (many-to-many via HadithAyahReference)

### User Relationships
- User → Bookmark (one-to-many)
- User → HadithBookmark (one-to-many)
- User → ReadingHistory (one-to-many)
- User → Note (one-to-many)

## Indexes

Key indexes for performance:

- Surah: `number`
- Ayah: `surahId`, `juz`, `numberInQuran`
- Translation: `ayahId`, `translatorId`
- Hadith: `bookId`, `chapterId`, `grade`
- User lookups: `email`
- Bookmarks: `userId`, `ayahId`/`hadithId`

## Data Sources

### Quran Data
- Quran API: https://api.quran.com/api/v4/
- Quran JSON: https://github.com/semarketir/quranjson

### Hadith Data
- Hadith Database: https://sunnah.com/
- Hadith JSON: https://github.com/A-Hussien96/hadith-json

### Tafsir Data
- Tafsir API: http://api.quran-tafseer.com/

## Scripts

### Database Commands
```bash
# Generate Prisma Client
npm run db:generate

# Create migration
npm run db:migrate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Import Commands
```bash
# Import Quran data
npm run import:quran

# Import Hadith data
npm run import:hadith

# Import Tafsir data
npm run import:tafsir
```

## Future Enhancements

- Audio recitations (add AudioRecitation model)
- User collections/playlists
- Social sharing features
- Advanced analytics
- Multi-language support expansion
