#!/usr/bin/env python3
"""
Islamic Knowledge Database - Quran Data Importer
================================================

This script imports complete Quran data into IslamicKnowledgeDB MySQL database.

Features:
- Imports all 114 Surahs with metadata
- Imports all 6,236 Ayahs with Arabic text
- Imports multiple English translations (Sahih International, Yusuf Ali, etc.)
- Uses batch inserts for optimal performance
- Handles duplicate entries gracefully

Data Source: AlQuran.cloud API (https://api.alquran.cloud)

Usage:
    python import_quran.py

Requirements:
    pip install mysql-connector-python requests
"""

import mysql.connector
import requests
import sys
import time
from typing import List, Dict, Any

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',  # UPDATE THIS
    'database': 'IslamicKnowledgeDB',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'raise_on_warnings': True
}

# ============================================================================
# API CONFIGURATION
# ============================================================================

API_BASE = 'http://api.alquran.cloud/v1'

TRANSLATION_EDITIONS = [
    {'identifier': 'en.sahih', 'name': 'Sahih International', 'language': 'en', 'type': 'translation'},
    {'identifier': 'en.yusufali', 'name': 'Yusuf Ali', 'language': 'en', 'type': 'translation'},
    {'identifier': 'en.pickthall', 'name': 'Pickthall', 'language': 'en', 'type': 'translation'},
    {'identifier': 'en.clearquran', 'name': 'The Clear Quran', 'language': 'en', 'type': 'translation'},
]

BATCH_SIZE = 500  # Number of records to insert at once

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def fetch_api(url: str) -> Dict[str, Any]:
    """Fetch data from AlQuran.cloud API with retry logic."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"    Fetching: {url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()
            if data.get('code') == 200:
                return data['data']
            else:
                raise Exception(f"API returned code {data.get('code')}")
        except requests.RequestException as e:
            print(f"    ⚠ Attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise
    raise Exception("Max retries exceeded")

def remove_diacritics(arabic_text: str) -> str:
    """Remove Arabic diacritics (harakat) from text for simpler searching."""
    diacritics = [
        '\u064B',  # Fathatan
        '\u064C',  # Dammatan
        '\u064D',  # Kasratan
        '\u064E',  # Fatha
        '\u064F',  # Damma
        '\u0650',  # Kasra
        '\u0651',  # Shadda
        '\u0652',  # Sukun
        '\u0653',  # Maddah
        '\u0654',  # Hamza above
        '\u0655',  # Hamza below
        '\u0656',  # Subscript alef
        '\u0657',  # Inverted damma
        '\u0658',  # Mark noon ghunna
    ]
    clean_text = arabic_text
    for diacritic in diacritics:
        clean_text = clean_text.replace(diacritic, '')
    return clean_text

def batch_insert(cursor, table: str, columns: List[str], data: List[tuple], ignore_duplicates: bool = True):
    """Perform batch insert with proper error handling."""
    if not data:
        return 0

    placeholders = ', '.join(['%s'] * len(columns))
    columns_str = ', '.join(columns)

    ignore_clause = 'IGNORE' if ignore_duplicates else ''
    sql = f"INSERT {ignore_clause} INTO {table} ({columns_str}) VALUES ({placeholders})"

    inserted = 0
    for i in range(0, len(data), BATCH_SIZE):
        batch = data[i:i + BATCH_SIZE]
        cursor.executemany(sql, batch)
        inserted += cursor.rowcount
        print(f"    📝 Inserted {min(i + BATCH_SIZE, len(data))}/{len(data)} records")

    return inserted

# ============================================================================
# MAIN IMPORT FUNCTIONS
# ============================================================================

def import_surahs(cursor, connection) -> Dict[int, int]:
    """Import all 114 Surahs into the database."""
    print("\n" + "="*70)
    print("STEP 1: IMPORTING SURAHS")
    print("="*70)

    # Fetch Quran metadata
    print("\n📖 Fetching Quran metadata...")
    meta_data = fetch_api(f"{API_BASE}/meta")
    surahs = meta_data['surahs']['references']

    print(f"   ✅ Retrieved {len(surahs)} Surahs\n")

    # Prepare data for batch insert
    surah_data = []
    for surah in surahs:
        surah_data.append((
            surah['number'],
            surah['name'],
            surah['englishName'],
            surah['revelationType'],
            surah['numberOfAyahs']
        ))

    # Batch insert
    print("💾 Inserting Surahs into database...")
    columns = ['surah_number', 'name_arabic', 'name_english', 'revelation_place', 'ayah_count']
    inserted = batch_insert(cursor, 'surahs', columns, surah_data)
    connection.commit()

    print(f"\n✅ Successfully imported {inserted} Surahs")

    # Create mapping of surah_number to id
    cursor.execute("SELECT id, surah_number FROM surahs")
    surah_map = {row[1]: row[0] for row in cursor.fetchall()}

    return surah_map

def import_ayahs(cursor, connection, surah_map: Dict[int, int]) -> Dict[int, int]:
    """Import all Ayahs with Arabic text."""
    print("\n" + "="*70)
    print("STEP 2: IMPORTING AYAHS")
    print("="*70)

    # Fetch complete Quran with Uthmani script
    print("\n📖 Fetching complete Quran with Arabic text...")
    quran_data = fetch_api(f"{API_BASE}/quran/quran-uthmani")

    print(f"   ✅ Retrieved Quran data\n")

    # Prepare ayah data
    print("💾 Preparing Ayah data for import...")
    ayah_data = []
    ayah_number_map = {}  # Maps ayah_key to database id

    for surah_data in quran_data['surahs']:
        surah_number = surah_data['number']
        surah_id = surah_map.get(surah_number)

        if not surah_id:
            print(f"⚠ Warning: Surah {surah_number} not found in database")
            continue

        for ayah in surah_data['ayahs']:
            ayah_key = f"{surah_number}:{ayah['numberInSurah']}"
            text_arabic = ayah['text']
            text_clean = remove_diacritics(text_arabic)

            ayah_data.append((
                surah_id,
                ayah['numberInSurah'],
                ayah_key,
                text_arabic,
                text_clean,
                ayah.get('juz'),
                ayah.get('manzil'),
                ayah.get('ruku'),
                ayah.get('page')
            ))

    print(f"   ✅ Prepared {len(ayah_data)} Ayahs\n")

    # Batch insert
    print("💾 Inserting Ayahs into database...")
    columns = ['surah_id', 'ayah_number', 'ayah_key', 'text_arabic', 'text_clean', 'juz', 'manzil', 'ruku', 'page']
    inserted = batch_insert(cursor, 'ayahs', columns, ayah_data)
    connection.commit()

    print(f"\n✅ Successfully imported {inserted} Ayahs")

    # Create mapping of ayah_key to id
    cursor.execute("SELECT id, ayah_key FROM ayahs")
    ayah_key_map = {row[1]: row[0] for row in cursor.fetchall()}

    return ayah_key_map

def import_translations(cursor, connection, ayah_key_map: Dict[str, int]):
    """Import translations for all Ayahs."""
    print("\n" + "="*70)
    print("STEP 3: IMPORTING TRANSLATIONS")
    print("="*70)

    for edition in TRANSLATION_EDITIONS:
        print(f"\n📖 Processing {edition['name']}...")

        # Step 1: Create or get edition
        print("   1️⃣  Creating edition entry...")
        edition_slug = edition['identifier']
        cursor.execute("""
            INSERT INTO editions (slug, name, language, type, author, source_api)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
        """, (edition_slug, edition['name'], edition['language'], edition['type'],
              edition.get('author', edition['name']), API_BASE))

        edition_id = cursor.lastrowid
        if edition_id == 0:
            cursor.execute("SELECT id FROM editions WHERE slug = %s", (edition_slug,))
            edition_id = cursor.fetchone()[0]

        connection.commit()
        print(f"      ✅ Edition ID: {edition_id}")

        # Step 2: Fetch translation data
        print("   2️⃣  Fetching translation data...")
        translation_data = fetch_api(f"{API_BASE}/quran/{edition_slug}")

        # Step 3: Prepare translation data
        print("   3️⃣  Preparing translation data...")
        ayah_data_entries = []

        for surah_data in translation_data['surahs']:
            surah_number = surah_data['number']

            for ayah in surah_data['ayahs']:
                ayah_key = f"{surah_number}:{ayah['numberInSurah']}"
                ayah_id = ayah_key_map.get(ayah_key)

                if ayah_id:
                    ayah_data_entries.append((
                        ayah_id,
                        edition_id,
                        ayah['text']
                    ))

        print(f"      ✅ Prepared {len(ayah_data_entries)} translations")

        # Step 4: Batch insert
        print("   4️⃣  Inserting translations into database...")
        columns = ['ayah_id', 'edition_id', 'text']
        inserted = batch_insert(cursor, 'ayah_data', columns, ayah_data_entries)
        connection.commit()

        print(f"\n   ✅ Completed {edition['name']} ({inserted} translations)")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("ISLAMIC KNOWLEDGE DATABASE - QURAN DATA IMPORTER")
    print("="*70)
    print("\nData Source: AlQuran.cloud API")
    print("Target Database: IslamicKnowledgeDB")
    print("\nThis will import:")
    print("  - All 114 Surahs")
    print("  - All 6,236 Ayahs with Arabic text")
    print(f"  - {len(TRANSLATION_EDITIONS)} English translations")
    print("="*70)

    # Connect to database
    print("\n🔌 Connecting to MySQL database...")
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor(buffered=True)
        print("   ✅ Connected successfully\n")
    except mysql.connector.Error as err:
        print(f"   ❌ Error: {err}")
        sys.exit(1)

    try:
        # Import data
        start_time = time.time()

        surah_map = import_surahs(cursor, connection)
        ayah_key_map = import_ayahs(cursor, connection, surah_map)
        import_translations(cursor, connection, ayah_key_map)

        elapsed_time = time.time() - start_time

        # Summary
        print("\n" + "="*70)
        print("IMPORT COMPLETED SUCCESSFULLY!")
        print("="*70)

        cursor.execute("SELECT COUNT(*) FROM surahs")
        surah_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM ayahs")
        ayah_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM editions WHERE type='translation'")
        edition_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM ayah_data")
        translation_count = cursor.fetchone()[0]

        print(f"\nStatistics:")
        print(f"  - Surahs: {surah_count}")
        print(f"  - Ayahs: {ayah_count}")
        print(f"  - Translation Editions: {edition_count}")
        print(f"  - Total Translations: {translation_count}")
        print(f"\nTime Elapsed: {elapsed_time:.2f} seconds")
        print("\n✅ You can now query the database!")
        print("="*70 + "\n")

    except Exception as e:
        print(f"\n❌ Error during import: {e}")
        connection.rollback()
        sys.exit(1)
    finally:
        cursor.close()
        connection.close()
        print("🔌 Database connection closed\n")

if __name__ == "__main__":
    main()
