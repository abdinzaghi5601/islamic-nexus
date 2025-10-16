-- ============================================================================
-- ISLAMIC KNOWLEDGE DATABASE - COMPLETE MYSQL DDL SCRIPT
-- ============================================================================
-- Database: IslamicKnowledgeDB
-- Character Set: utf8mb4 with utf8mb4_unicode_ci collation
-- Engine: InnoDB for all tables
-- ============================================================================

-- Drop database if exists (CAUTION: This will delete all data)
-- DROP DATABASE IF EXISTS IslamicKnowledgeDB;

-- Create database
CREATE DATABASE IF NOT EXISTS IslamicKnowledgeDB
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE IslamicKnowledgeDB;

-- ============================================================================
-- A. CORE QURAN TABLES (Reference Data)
-- ============================================================================

-- Table: surahs
-- Stores information about all 114 Surahs of the Quran
CREATE TABLE IF NOT EXISTS surahs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surah_number TINYINT UNSIGNED NOT NULL UNIQUE,
  name_arabic VARCHAR(100) NOT NULL,
  name_english VARCHAR(100),
  revelation_place ENUM('Meccan', 'Medinan') NOT NULL,
  ayah_count SMALLINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_surah_number (surah_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ayahs
-- Stores all verses (ayahs) of the Quran with Arabic text
CREATE TABLE IF NOT EXISTS ayahs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surah_id INT NOT NULL,
  ayah_number SMALLINT UNSIGNED NOT NULL,
  ayah_key VARCHAR(10) NOT NULL UNIQUE COMMENT 'Format: surah:ayah (e.g., 1:1, 114:6)',
  text_arabic TEXT NOT NULL,
  text_clean TEXT COMMENT 'Arabic text without diacritics for simpler search',
  juz TINYINT UNSIGNED COMMENT 'Juz number (1-30)',
  manzil TINYINT UNSIGNED COMMENT 'Manzil number (1-7)',
  ruku SMALLINT UNSIGNED COMMENT 'Ruku/Section number',
  page SMALLINT UNSIGNED COMMENT 'Page number in Mushaf',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (surah_id) REFERENCES surahs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_surah_ayah (surah_id, ayah_number),
  INDEX idx_surah_id (surah_id),
  INDEX idx_ayah_number (ayah_number),
  INDEX idx_juz (juz),
  FULLTEXT INDEX ft_text_arabic (text_arabic),
  FULLTEXT INDEX ft_text_clean (text_clean),
  FULLTEXT INDEX ft_text_combined (text_arabic, text_clean)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- B. TAFSIR & TRANSLATION TABLES (Scalability Data)
-- ============================================================================

-- Table: editions
-- Stores metadata about different translations, tafsirs, and recitations
-- This allows infinite scalability for adding new translations/tafsirs
CREATE TABLE IF NOT EXISTS editions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique identifier (e.g., en.sahihintl, ar.muyassar)',
  name VARCHAR(255) NOT NULL COMMENT 'Display name of the edition',
  language VARCHAR(10) NOT NULL COMMENT 'ISO language code (e.g., en, ar, ur)',
  type ENUM('translation', 'tafsir', 'recitation') NOT NULL,
  author VARCHAR(255) COMMENT 'Author or translator name',
  source_api VARCHAR(255) COMMENT 'API source URL where data was obtained',
  description TEXT COMMENT 'Description of the edition',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_slug (slug),
  INDEX idx_type (type),
  INDEX idx_language (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ayah_data
-- Stores translations and tafsirs for each ayah
-- Links ayahs to editions (many-to-many relationship)
CREATE TABLE IF NOT EXISTS ayah_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ayah_id INT NOT NULL,
  edition_id INT NOT NULL,
  text LONGTEXT NOT NULL COMMENT 'Translation or Tafsir text',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (ayah_id) REFERENCES ayahs(id) ON DELETE CASCADE,
  FOREIGN KEY (edition_id) REFERENCES editions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_ayah_edition (ayah_id, edition_id),
  INDEX idx_ayah_id (ayah_id),
  INDEX idx_edition_id (edition_id),
  FULLTEXT INDEX ft_text (text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- C. HADITH TABLES (Structured Complexity)
-- ============================================================================

-- Table: hadith_collections
-- Stores the six major hadith collections (Bukhari, Muslim, etc.)
CREATE TABLE IF NOT EXISTS hadith_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_english VARCHAR(100) NOT NULL COMMENT 'Collection name in English',
  name_arabic VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL-friendly identifier (e.g., bukhari, muslim)',
  author VARCHAR(200) COMMENT 'Compiler/author name',
  description TEXT COMMENT 'Description of the collection',
  total_hadiths INT DEFAULT 0 COMMENT 'Total number of hadiths in collection',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: hadith_chapters
-- Stores chapters (books) within each hadith collection
CREATE TABLE IF NOT EXISTS hadith_chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  collection_id INT NOT NULL,
  chapter_number INT NOT NULL,
  chapter_name_english VARCHAR(255),
  chapter_name_arabic VARCHAR(255),
  intro TEXT COMMENT 'Chapter introduction/description',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (collection_id) REFERENCES hadith_collections(id) ON DELETE CASCADE,
  UNIQUE KEY unique_collection_chapter (collection_id, chapter_number),
  INDEX idx_collection_id (collection_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: hadiths
-- Stores individual hadith narrations
CREATE TABLE IF NOT EXISTS hadiths (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Use BIGINT for safety with large datasets',
  collection_id INT NOT NULL,
  chapter_id INT,
  reference_number VARCHAR(50) NOT NULL COMMENT 'Book-specific hadith number',
  hadith_in_chapter INT COMMENT 'Number within the chapter',
  text_arabic LONGTEXT NOT NULL,
  text_english LONGTEXT,
  narrator_chain LONGTEXT COMMENT 'Isnad (chain of narrators)',
  grade VARCHAR(50) COMMENT 'Authenticity grade (Sahih, Hasan, Daif, etc.)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (collection_id) REFERENCES hadith_collections(id) ON DELETE CASCADE,
  FOREIGN KEY (chapter_id) REFERENCES hadith_chapters(id) ON DELETE SET NULL,
  UNIQUE KEY unique_collection_ref (collection_id, reference_number),
  INDEX idx_collection_id (collection_id),
  INDEX idx_chapter_id (chapter_id),
  INDEX idx_grade (grade),
  FULLTEXT INDEX ft_text_arabic (text_arabic),
  FULLTEXT INDEX ft_text_english (text_english),
  FULLTEXT INDEX ft_text_combined (text_arabic, text_english)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- D. CROSS-REFERENCE TABLES
-- ============================================================================

-- Table: hadith_ayah_references
-- Links hadiths to related Quranic verses
CREATE TABLE IF NOT EXISTS hadith_ayah_references (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hadith_id BIGINT NOT NULL,
  ayah_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (hadith_id) REFERENCES hadiths(id) ON DELETE CASCADE,
  FOREIGN KEY (ayah_id) REFERENCES ayahs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_hadith_ayah (hadith_id, ayah_id),
  INDEX idx_hadith_id (hadith_id),
  INDEX idx_ayah_id (ayah_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- E. USER TABLES (For Authentication & User Data)
-- ============================================================================

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID or CUID',
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  email_verified TIMESTAMP NULL,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: bookmarks
-- Stores user bookmarks for Quranic verses
CREATE TABLE IF NOT EXISTS bookmarks (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  ayah_id INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ayah_id) REFERENCES ayahs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_ayah (user_id, ayah_id),
  INDEX idx_user_id (user_id),
  INDEX idx_ayah_id (ayah_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: hadith_bookmarks
-- Stores user bookmarks for hadiths
CREATE TABLE IF NOT EXISTS hadith_bookmarks (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  hadith_id BIGINT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hadith_id) REFERENCES hadiths(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_hadith (user_id, hadith_id),
  INDEX idx_user_id (user_id),
  INDEX idx_hadith_id (hadith_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reading_history
-- Tracks user reading history
CREATE TABLE IF NOT EXISTS reading_history (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  surah_id INT,
  ayah_id INT,
  hadith_id BIGINT,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (surah_id) REFERENCES surahs(id) ON DELETE SET NULL,
  FOREIGN KEY (ayah_id) REFERENCES ayahs(id) ON DELETE SET NULL,
  FOREIGN KEY (hadith_id) REFERENCES hadiths(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_read_at (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- F. INITIAL DATA: HADITH COLLECTIONS
-- ============================================================================

-- Insert the six major hadith collections
INSERT INTO hadith_collections (name_english, name_arabic, slug, author, description) VALUES
('Sahih al-Bukhari', 'صحيح البخاري', 'bukhari', 'Imam Muhammad al-Bukhari', 'The most authentic hadith collection'),
('Sahih Muslim', 'صحيح مسلم', 'muslim', 'Imam Muslim ibn al-Hajjaj', 'Second most authentic hadith collection'),
('Sunan Abu Dawud', 'سنن أبي داود', 'abudawud', 'Imam Abu Dawud', 'Collection focused on legal hadiths'),
('Jami at-Tirmidhi', 'جامع الترمذي', 'tirmidhi', 'Imam at-Tirmidhi', 'Collection with grading of hadiths'),
('Sunan an-Nasa\'i', 'سنن النسائي', 'nasai', 'Imam an-Nasa\'i', 'Rigorous collection of hadiths'),
('Sunan Ibn Majah', 'سنن ابن ماجه', 'ibnmajah', 'Imam Ibn Majah', 'Final book of the six major collections')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- G. SAMPLE EDITIONS (Translation & Tafsir)
-- ============================================================================

-- Insert common English translations
INSERT INTO editions (slug, name, language, type, author, source_api) VALUES
('en.sahihintl', 'Sahih International', 'en', 'translation', 'Sahih International', 'https://api.alquran.cloud'),
('en.yusufali', 'Yusuf Ali', 'en', 'translation', 'Abdullah Yusuf Ali', 'https://api.alquran.cloud'),
('en.pickthall', 'Pickthall', 'en', 'translation', 'Mohammed Marmaduke Pickthall', 'https://api.alquran.cloud'),
('en.clearquran', 'The Clear Quran', 'en', 'translation', 'Dr. Mustafa Khattab', 'https://api.alquran.cloud'),
('ar.muyassar', 'Tafsir Al-Muyassar', 'ar', 'tafsir', 'King Fahd Quran Complex', 'https://api.alquran.cloud'),
('ar.jalalayn', 'Tafsir Al-Jalalayn', 'ar', 'tafsir', 'Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti', 'https://api.alquran.cloud')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- H. USEFUL QUERIES & EXAMPLES
-- ============================================================================

-- Query Example 1: Get all verses from Surah Al-Baqarah with English translation
/*
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
*/

-- Query Example 2: FULLTEXT search for verses containing 'Paradise' in English
/*
SELECT
    a.ayah_key,
    a.text_arabic,
    ad.text AS translation_english,
    MATCH(ad.text) AGAINST('Paradise' IN NATURAL LANGUAGE MODE) AS relevance_score
FROM ayah_data ad
JOIN ayahs a ON ad.ayah_id = a.id
JOIN editions e ON ad.edition_id = e.id
WHERE MATCH(ad.text) AGAINST('Paradise' IN NATURAL LANGUAGE MODE)
  AND e.type = 'translation'
  AND e.language = 'en'
ORDER BY relevance_score DESC
LIMIT 20;
*/

-- Query Example 3: Get all hadiths from Sahih Bukhari with 'prayer'
/*
SELECT
    h.reference_number,
    h.text_english,
    h.grade,
    hch.chapter_name_english
FROM hadiths h
JOIN hadith_collections hc ON h.collection_id = hc.id
LEFT JOIN hadith_chapters hch ON h.chapter_id = hch.id
WHERE hc.slug = 'bukhari'
  AND MATCH(h.text_english) AGAINST('prayer' IN NATURAL LANGUAGE MODE)
LIMIT 20;
*/

-- Query Example 4: Get user's bookmarked verses with translations
/*
SELECT
    b.id AS bookmark_id,
    a.ayah_key,
    s.name_english AS surah_name,
    a.text_arabic,
    ad.text AS translation,
    b.note,
    b.created_at AS bookmarked_at
FROM bookmarks b
JOIN ayahs a ON b.ayah_id = a.id
JOIN surahs s ON a.surah_id = s.id
LEFT JOIN ayah_data ad ON a.id = ad.ayah_id
LEFT JOIN editions e ON ad.edition_id = e.id AND e.slug = 'en.sahihintl'
WHERE b.user_id = 'user-uuid-here'
ORDER BY b.created_at DESC;
*/

-- ============================================================================
-- I. DATABASE STATISTICS QUERIES
-- ============================================================================

-- Check table sizes
/*
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'IslamicKnowledgeDB'
ORDER BY (data_length + index_length) DESC;
*/

-- Count records in all tables
/*
SELECT
    'surahs' AS table_name, COUNT(*) AS record_count FROM surahs
UNION ALL
SELECT 'ayahs', COUNT(*) FROM ayahs
UNION ALL
SELECT 'editions', COUNT(*) FROM editions
UNION ALL
SELECT 'ayah_data', COUNT(*) FROM ayah_data
UNION ALL
SELECT 'hadith_collections', COUNT(*) FROM hadith_collections
UNION ALL
SELECT 'hadith_chapters', COUNT(*) FROM hadith_chapters
UNION ALL
SELECT 'hadiths', COUNT(*) FROM hadiths;
*/

-- ============================================================================
-- END OF DDL SCRIPT
-- ============================================================================

-- To execute this script:
-- 1. Save as schema.sql
-- 2. Run: mysql -u root -p < schema.sql
-- Or import via MySQL Workbench / phpMyAdmin

-- Next Steps:
-- 1. Run the data import scripts (Python/TypeScript)
-- 2. Verify data integrity
-- 3. Create API endpoints
-- 4. Build frontend interface
