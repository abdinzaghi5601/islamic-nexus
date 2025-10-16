# Islamic Knowledge Database - Quick Start Guide

Get your Islamic Knowledge Database up and running in 5 simple steps.

## Prerequisites

- MySQL 8.0+
- Python 3.8+
- 5 GB free disk space
- Internet connection (for data download)

## Quick Setup (5 Steps)

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Update Database Password

Edit these files and update the password:
- `import_quran.py` (line 26)
- `import_hadith.py` (line 26)
- `verify_database.py` (line 21)

```python
'password': 'your_mysql_password',  # ← Update this
```

### 3. Create Database Schema

```bash
mysql -u root -p < schema.sql
```

### 4. Import Data

```bash
# Import Quran data (~2-3 minutes)
python import_quran.py

# Import Hadith data (~5-10 minutes)
python import_hadith.py
```

### 5. Verify Installation

```bash
python verify_database.py
```

## What You'll Get

After setup, your database will contain:

| Data Type | Count | Description |
|-----------|-------|-------------|
| **Surahs** | 114 | All Quran chapters |
| **Ayahs** | 6,236 | All Quran verses |
| **Translations** | 4 editions | English translations |
| **Total Translations** | 24,944 | All verse translations |
| **Hadith Collections** | 6 | Major hadith books |
| **Hadiths** | ~34,000 | Authentic narrations |

## Quick Test Query

After setup, try this query in MySQL:

```sql
USE IslamicKnowledgeDB;

-- Get Ayat al-Kursi (2:255) with translation
SELECT
    a.ayah_key,
    a.text_arabic,
    ad.text AS translation
FROM ayahs a
JOIN ayah_data ad ON a.id = ad.ayah_id
JOIN editions e ON ad.edition_id = e.id
WHERE a.ayah_key = '2:255'
  AND e.slug = 'en.sahihintl';
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to MySQL | Make sure MySQL is running: `sudo systemctl start mysql` |
| Access denied | Update password in Python scripts |
| Import is slow | Normal - takes 5-15 minutes total |
| Python module error | Run `pip install -r requirements.txt` |

## Next Steps

1. ✅ Read the full [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)
2. ✅ Explore [Example Queries](DATABASE_SETUP_GUIDE.md#example-queries)
3. ✅ Integrate with your Next.js app
4. ✅ Build your Islamic knowledge application!

## File Overview

```
.
├── schema.sql                 # Database structure (run first)
├── import_quran.py           # Import Quran data
├── import_hadith.py          # Import Hadith data
├── verify_database.py        # Verify data integrity
├── requirements.txt          # Python dependencies
├── QUICK_START.md           # This file
└── DATABASE_SETUP_GUIDE.md  # Detailed documentation
```

## Support

For detailed documentation and troubleshooting, see [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md).

---

**Estimated Total Setup Time:** 15-20 minutes
