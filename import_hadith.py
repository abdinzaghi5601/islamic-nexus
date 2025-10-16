#!/usr/bin/env python3
"""
Islamic Knowledge Database - Hadith Data Importer
=================================================

This script imports Hadith data from the six major collections into
IslamicKnowledgeDB MySQL database.

Collections:
- Sahih al-Bukhari
- Sahih Muslim
- Sunan Abu Dawud
- Jami at-Tirmidhi
- Sunan an-Nasa'i
- Sunan Ibn Majah

Data Source: fawazahmed0/hadith-api CDN

Usage:
    python import_hadith.py

Requirements:
    pip install mysql-connector-python requests
"""

import mysql.connector
import requests
import sys
import time
from typing import List, Dict, Any, Tuple

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

CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions'

# The six major hadith collections are already inserted via schema.sql
# We just need to fetch and import the actual hadiths

HADITH_COLLECTIONS = [
    {'identifier': 'bukhari', 'slug': 'bukhari'},
    {'identifier': 'muslim', 'slug': 'muslim'},
    {'identifier': 'abudawud', 'slug': 'abudawud'},
    {'identifier': 'tirmidhi', 'slug': 'tirmidhi'},
    {'identifier': 'nasai', 'slug': 'nasai'},
    {'identifier': 'ibnmajah', 'slug': 'ibnmajah'},
]

BATCH_SIZE = 500

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def fetch_json(url: str) -> Dict[str, Any]:
    """Fetch JSON data from CDN with retry logic."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"    Fetching: {url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"    ⚠ Attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise
    raise Exception("Max retries exceeded")

def batch_insert(cursor, table: str, columns: List[str], data: List[tuple], ignore_duplicates: bool = True) -> int:
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

def get_collection_id(cursor, slug: str) -> int:
    """Get the database ID for a hadith collection."""
    cursor.execute("SELECT id FROM hadith_collections WHERE slug = %s", (slug,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        raise Exception(f"Collection '{slug}' not found in database. Please run schema.sql first.")

def import_hadith_collection(cursor, connection, collection: Dict[str, str]) -> Tuple[int, int]:
    """Import a single hadith collection."""
    identifier = collection['identifier']
    slug = collection['slug']

    print(f"\n{'='*70}")
    print(f"IMPORTING: {slug.upper()}")
    print(f"{'='*70}\n")

    # Get collection ID
    collection_id = get_collection_id(cursor, slug)
    print(f"📚 Collection ID: {collection_id}")

    # Fetch Arabic and English data
    print("\n1️⃣  Fetching Arabic text...")
    arabic_url = f"{CDN_BASE}/ara-{identifier}.json"
    arabic_data = fetch_json(arabic_url)

    print("2️⃣  Fetching English translation...")
    english_url = f"{CDN_BASE}/eng-{identifier}.json"
    english_data = fetch_json(english_url)

    total_hadiths = len(arabic_data.get('hadiths', []))
    print(f"\n   ✅ Retrieved {total_hadiths} hadiths")

    # Import chapters if available
    chapter_map = {}
    if arabic_data.get('metadata') and arabic_data['metadata'].get('sections'):
        print("\n3️⃣  Importing chapters...")
        sections = arabic_data['metadata']['sections']

        chapter_data = []
        if isinstance(sections, dict):
            for chapter_num, chapter_name in sections.items():
                chapter_data.append((
                    collection_id,
                    int(chapter_num),
                    str(chapter_name),
                    None  # chapter_name_arabic
                ))

        if chapter_data:
            columns = ['collection_id', 'chapter_number', 'chapter_name_english', 'chapter_name_arabic']
            inserted_chapters = batch_insert(cursor, 'hadith_chapters', columns, chapter_data)
            connection.commit()
            print(f"   ✅ Imported {inserted_chapters} chapters")

            # Create chapter mapping
            cursor.execute("""
                SELECT id, chapter_number
                FROM hadith_chapters
                WHERE collection_id = %s
            """, (collection_id,))
            chapter_map = {row[1]: row[0] for row in cursor.fetchall()}

    # Import hadiths
    print("\n4️⃣  Preparing hadith data...")
    hadith_data = []

    for i, arabic_hadith in enumerate(arabic_data.get('hadiths', [])):
        english_hadith = english_data['hadiths'][i] if i < len(english_data.get('hadiths', [])) else None

        if not english_hadith:
            continue

        # Get chapter ID if available
        chapter_id = None
        if 'reference' in arabic_hadith and 'book' in arabic_hadith['reference']:
            chapter_num = arabic_hadith['reference']['book']
            chapter_id = chapter_map.get(chapter_num)

        # Extract grade
        grade = None
        if 'grades' in arabic_hadith and len(arabic_hadith['grades']) > 0:
            grade = arabic_hadith['grades'][0].get('grade')

        hadith_data.append((
            collection_id,
            chapter_id,
            str(arabic_hadith.get('hadithnumber', i + 1)),
            arabic_hadith['reference'].get('hadith') if 'reference' in arabic_hadith else None,
            arabic_hadith.get('text', ''),
            english_hadith.get('text', ''),
            None,  # narrator_chain (not available in this dataset)
            grade
        ))

    print(f"   ✅ Prepared {len(hadith_data)} hadiths")

    # Batch insert hadiths
    print("\n5️⃣  Inserting hadiths into database...")
    columns = [
        'collection_id', 'chapter_id', 'reference_number',
        'hadith_in_chapter', 'text_arabic', 'text_english',
        'narrator_chain', 'grade'
    ]
    inserted_hadiths = batch_insert(cursor, 'hadiths', columns, hadith_data)
    connection.commit()

    # Update total hadiths count
    cursor.execute("""
        UPDATE hadith_collections
        SET total_hadiths = %s
        WHERE id = %s
    """, (inserted_hadiths, collection_id))
    connection.commit()

    print(f"\n✅ Completed {slug}: {inserted_hadiths} hadiths, {len(chapter_map)} chapters")

    return inserted_hadiths, len(chapter_map)

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("ISLAMIC KNOWLEDGE DATABASE - HADITH DATA IMPORTER")
    print("="*70)
    print("\nData Source: fawazahmed0/hadith-api CDN")
    print("Target Database: IslamicKnowledgeDB")
    print("\nThis will import the six major hadith collections:")
    for collection in HADITH_COLLECTIONS:
        print(f"  - {collection['slug'].title()}")
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
        start_time = time.time()
        total_hadiths = 0
        total_chapters = 0

        # Import each collection
        for collection in HADITH_COLLECTIONS:
            hadiths, chapters = import_hadith_collection(cursor, connection, collection)
            total_hadiths += hadiths
            total_chapters += chapters

        elapsed_time = time.time() - start_time

        # Summary
        print("\n" + "="*70)
        print("IMPORT COMPLETED SUCCESSFULLY!")
        print("="*70)

        # Get final statistics
        cursor.execute("SELECT COUNT(*) FROM hadith_collections")
        collection_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM hadith_chapters")
        chapter_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM hadiths")
        hadith_count = cursor.fetchone()[0]

        print(f"\nStatistics:")
        print(f"  - Collections: {collection_count}")
        print(f"  - Chapters: {chapter_count}")
        print(f"  - Total Hadiths: {hadith_count}")
        print(f"\nBreakdown by Collection:")

        cursor.execute("""
            SELECT hc.name_english, hc.total_hadiths
            FROM hadith_collections hc
            ORDER BY hc.id
        """)

        for row in cursor.fetchall():
            print(f"  - {row[0]}: {row[1]:,} hadiths")

        print(f"\nTime Elapsed: {elapsed_time:.2f} seconds")
        print("\n✅ You can now query the hadith database!")
        print("="*70 + "\n")

    except Exception as e:
        print(f"\n❌ Error during import: {e}")
        import traceback
        traceback.print_exc()
        connection.rollback()
        sys.exit(1)
    finally:
        cursor.close()
        connection.close()
        print("🔌 Database connection closed\n")

if __name__ == "__main__":
    main()
