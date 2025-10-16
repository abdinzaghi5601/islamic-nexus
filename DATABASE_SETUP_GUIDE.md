# Islamic Knowledge Database - Complete Setup Guide

This guide will help you set up the **IslamicKnowledgeDB** MySQL database with complete Quran and Hadith data.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Data Import](#data-import)
4. [Verification](#verification)
5. [Example Queries](#example-queries)
6. [API Integration](#api-integration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Software Requirements

- **MySQL Server** 8.0 or higher
- **Python** 3.8 or higher
- **pip** (Python package manager)

### Python Dependencies

```bash
pip install mysql-connector-python requests tabulate
```

### MySQL Setup

1. **Install MySQL** (if not already installed):
   - Windows: Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Start MySQL Server**:
   ```bash
   # macOS/Linux
   sudo mysql.server start

   # Or using systemctl (Linux)
   sudo systemctl start mysql
   ```

3. **Login to MySQL**:
   ```bash
   mysql -u root -p
   ```

---

## Database Setup

### Step 1: Update Database Credentials

Before running any scripts, update the database password in all Python files:

**Files to update:**
- `import_quran.py`
- `import_hadith.py`
- `verify_database.py`

Change this line in each file:
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',  # ← UPDATE THIS
    'database': 'IslamicKnowledgeDB',
    ...
}
```

### Step 2: Create Database and Tables

Run the DDL script to create the database schema:

**Option 1: MySQL Command Line**
```bash
mysql -u root -p < schema.sql
```

**Option 2: MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `schema.sql`
4. Execute the script (⚡ icon or Ctrl+Shift+Enter)

**Option 3: Direct MySQL**
```bash
mysql -u root -p
```
```sql
source /path/to/schema.sql
```

### Step 3: Verify Database Creation

```sql
USE IslamicKnowledgeDB;
SHOW TABLES;
```

You should see 14 tables:
- `surahs`
- `ayahs`
- `editions`
- `ayah_data`
- `hadith_collections`
- `hadith_chapters`
- `hadiths`
- `hadith_ayah_references`
- `users`
- `bookmarks`
- `hadith_bookmarks`
- `reading_history`

---

## Data Import

### Step 1: Import Quran Data

This will import:
- All 114 Surahs
- All 6,236 Ayahs with Arabic text
- 4 English translations (Sahih International, Yusuf Ali, Pickthall, Clear Quran)

```bash
python import_quran.py
```

**Expected output:**
```
========================================================
ISLAMIC KNOWLEDGE DATABASE - QURAN DATA IMPORTER
========================================================

STEP 1: IMPORTING SURAHS
✅ Successfully imported 114 Surahs

STEP 2: IMPORTING AYAHS
✅ Successfully imported 6,236 Ayahs

STEP 3: IMPORTING TRANSLATIONS
✅ Completed Sahih International (6,236 translations)
✅ Completed Yusuf Ali (6,236 translations)
...

IMPORT COMPLETED SUCCESSFULLY!
Time Elapsed: ~120 seconds
```

### Step 2: Import Hadith Data

This will import the six major hadith collections:
- Sahih al-Bukhari (~7,563 hadiths)
- Sahih Muslim (~7,190 hadiths)
- Sunan Abu Dawud (~5,274 hadiths)
- Jami at-Tirmidhi (~3,956 hadiths)
- Sunan an-Nasa'i (~5,758 hadiths)
- Sunan Ibn Majah (~4,341 hadiths)

```bash
python import_hadith.py
```

**Expected output:**
```
========================================================
ISLAMIC KNOWLEDGE DATABASE - HADITH DATA IMPORTER
========================================================

IMPORTING: BUKHARI
✅ Completed bukhari: 7,563 hadiths, 97 chapters

IMPORTING: MUSLIM
✅ Completed muslim: 7,190 hadiths, 56 chapters

...

IMPORT COMPLETED SUCCESSFULLY!
Total Hadiths: ~34,000
Time Elapsed: ~300 seconds
```

### Step 3: Verify Data Integrity

Run the verification script to ensure all data was imported correctly:

```bash
python verify_database.py
```

**Expected output:**
```
TEST 1: TABLE RECORD COUNTS
✅ surahs: 114
✅ ayahs: 6,236
✅ editions: 4+
✅ ayah_data: 24,944+ (6,236 × 4 translations)
✅ hadith_collections: 6
✅ hadiths: 34,000+

All tests passed! Your database is ready to use.
```

---

## Example Queries

### Quran Queries

#### 1. Get All Verses from Surah Al-Baqarah with Translation

```sql
SELECT
    a.ayah_key,
    a.text_arabic,
    ad.text AS translation_english
FROM ayahs a
JOIN surahs s ON a.surah_id = s.id
JOIN ayah_data ad ON a.id = ad.ayah_id
JOIN editions e ON ad.edition_id = e.id
WHERE s.surah_number = 2
  AND e.slug = 'en.sahihintl'
ORDER BY a.ayah_number;
```

#### 2. Search for Verses Containing "Paradise"

```sql
SELECT
    a.ayah_key,
    s.name_english AS surah_name,
    a.text_arabic,
    ad.text AS translation,
    MATCH(ad.text) AGAINST('Paradise' IN NATURAL LANGUAGE MODE) AS relevance
FROM ayah_data ad
JOIN ayahs a ON ad.ayah_id = a.id
JOIN surahs s ON a.surah_id = s.id
JOIN editions e ON ad.edition_id = e.id
WHERE MATCH(ad.text) AGAINST('Paradise' IN NATURAL LANGUAGE MODE)
  AND e.type = 'translation'
  AND e.language = 'en'
ORDER BY relevance DESC
LIMIT 20;
```

#### 3. Get Ayat al-Kursi (2:255) in All Translations

```sql
SELECT
    e.name AS translation_name,
    ad.text AS translation_text
FROM ayahs a
JOIN ayah_data ad ON a.id = ad.ayah_id
JOIN editions e ON ad.edition_id = e.id
WHERE a.ayah_key = '2:255'
  AND e.type = 'translation'
ORDER BY e.language, e.name;
```

#### 4. Get All Verses from a Specific Juz

```sql
SELECT
    s.name_english AS surah,
    a.ayah_number,
    a.ayah_key,
    a.text_arabic
FROM ayahs a
JOIN surahs s ON a.surah_id = s.id
WHERE a.juz = 1
ORDER BY a.id;
```

### Hadith Queries

#### 1. Get All Hadiths from Sahih Bukhari About Prayer

```sql
SELECT
    h.reference_number,
    hch.chapter_name_english,
    h.text_english,
    h.grade
FROM hadiths h
JOIN hadith_collections hc ON h.collection_id = hc.id
LEFT JOIN hadith_chapters hch ON h.chapter_id = hch.id
WHERE hc.slug = 'bukhari'
  AND MATCH(h.text_english) AGAINST('prayer' IN NATURAL LANGUAGE MODE)
ORDER BY CAST(h.reference_number AS UNSIGNED)
LIMIT 20;
```

#### 2. Get Random Hadith from Any Collection

```sql
SELECT
    hc.name_english AS collection,
    h.reference_number,
    h.text_english,
    h.grade
FROM hadiths h
JOIN hadith_collections hc ON h.collection_id = hc.id
WHERE h.grade = 'Sahih'
ORDER BY RAND()
LIMIT 1;
```

#### 3. Get Hadith Statistics by Collection

```sql
SELECT
    hc.name_english AS collection,
    COUNT(h.id) AS total_hadiths,
    COUNT(DISTINCT h.chapter_id) AS chapters,
    SUM(CASE WHEN h.grade = 'Sahih' THEN 1 ELSE 0 END) AS sahih_count,
    SUM(CASE WHEN h.grade = 'Hasan' THEN 1 ELSE 0 END) AS hasan_count
FROM hadith_collections hc
LEFT JOIN hadiths h ON hc.id = h.collection_id
GROUP BY hc.id, hc.name_english
ORDER BY total_hadiths DESC;
```

#### 4. Search Across All Hadiths in Arabic

```sql
SELECT
    hc.name_english AS collection,
    h.reference_number,
    h.text_arabic,
    h.text_english
FROM hadiths h
JOIN hadith_collections hc ON h.collection_id = hc.id
WHERE MATCH(h.text_arabic) AGAINST('الصلاة' IN NATURAL LANGUAGE MODE)
LIMIT 10;
```

### Cross-Reference Queries

#### 1. Find Hadiths Related to Specific Ayah

```sql
-- (Requires data in hadith_ayah_references table)
SELECT
    a.ayah_key,
    hc.name_english AS hadith_collection,
    h.reference_number,
    h.text_english
FROM hadith_ayah_references har
JOIN ayahs a ON har.ayah_id = a.id
JOIN hadiths h ON har.hadith_id = h.id
JOIN hadith_collections hc ON h.collection_id = hc.id
WHERE a.ayah_key = '2:255'
ORDER BY hc.id, h.reference_number;
```

---

## API Integration

### Using with Next.js API Routes

Example API endpoint (`/app/api/quran/[surah]/route.ts`):

```typescript
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'IslamicKnowledgeDB',
  waitForConnections: true,
  connectionLimit: 10,
});

export async function GET(
  request: Request,
  { params }: { params: { surah: string } }
) {
  try {
    const surahNumber = parseInt(params.surah);

    const [rows] = await pool.execute(`
      SELECT
        a.ayah_key,
        a.ayah_number,
        a.text_arabic,
        ad.text AS translation
      FROM ayahs a
      JOIN surahs s ON a.surah_id = s.id
      JOIN ayah_data ad ON a.id = ad.ayah_id
      JOIN editions e ON ad.edition_id = e.id
      WHERE s.surah_number = ?
        AND e.slug = 'en.sahihintl'
      ORDER BY a.ayah_number
    `, [surahNumber]);

    return NextResponse.json({ verses: rows });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch surah' },
      { status: 500 }
    );
  }
}
```

### Environment Variables

Add to `.env.local`:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/IslamicKnowledgeDB"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=IslamicKnowledgeDB
```

---

## Troubleshooting

### Common Issues

#### 1. "Access denied for user 'root'@'localhost'"

**Solution:** Update the password in the Python scripts:
```python
DB_CONFIG = {
    'password': 'your_actual_password',  # Use your MySQL root password
}
```

#### 2. "Can't connect to MySQL server"

**Solution:** Make sure MySQL is running:
```bash
# macOS/Linux
sudo mysql.server status

# Or
sudo systemctl status mysql
```

#### 3. "Database 'IslamicKnowledgeDB' doesn't exist"

**Solution:** Run the schema.sql file first:
```bash
mysql -u root -p < schema.sql
```

#### 4. Import script is slow

**Solution:** This is normal. The full import takes:
- Quran: ~2-3 minutes
- Hadith: ~5-10 minutes

The scripts use batch inserts for optimal performance.

#### 5. FULLTEXT search not working

**Solution:** Ensure you're using MySQL 8.0+ and InnoDB engine. Check:
```sql
SHOW TABLE STATUS WHERE Name = 'ayah_data';
```

#### 6. Character encoding issues (Arabic text shows as ???)

**Solution:** Ensure proper UTF-8 configuration:
```sql
ALTER DATABASE IslamicKnowledgeDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Database Maintenance

### Backup Database

```bash
mysqldump -u root -p IslamicKnowledgeDB > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
mysql -u root -p IslamicKnowledgeDB < backup_20250101.sql
```

### Optimize Tables

```sql
OPTIMIZE TABLE ayahs, ayah_data, hadiths;
```

### Check Database Size

```sql
SELECT
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'IslamicKnowledgeDB'
ORDER BY (data_length + index_length) DESC;
```

---

## Next Steps

After successful setup:

1. ✅ **Test the Example Queries** above to explore the data
2. ✅ **Integrate with Your Application** (Next.js, Express, etc.)
3. ✅ **Setup User Authentication** (use the `users` table)
4. ✅ **Implement Bookmark Features** (use `bookmarks` and `hadith_bookmarks` tables)
5. ✅ **Add Search Functionality** (FULLTEXT indexes are already set up)
6. ✅ **Deploy to Production** (Railway, PlanetScale, etc.)

---

## Additional Resources

- **Quran API Documentation**: https://alquran.cloud/api
- **Hadith API Repository**: https://github.com/fawazahmed0/hadith-api
- **MySQL FULLTEXT Search**: https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the verification script output: `python verify_database.py`
3. Check MySQL error logs
4. Ensure all dependencies are installed

---

## License & Credits

- Quran data: AlQuran.cloud (Public Domain)
- Hadith data: fawazahmed0/hadith-api (Public Domain)
- Database Schema: Custom design for IslamicKnowledgeDB

---

**May this project be beneficial for all who seek Islamic knowledge.**
