#!/usr/bin/env python3
"""
Islamic Knowledge Database - Verification Script
================================================

This script verifies the integrity and completeness of the imported data.

Usage:
    python verify_database.py

Requirements:
    pip install mysql-connector-python tabulate
"""

import mysql.connector
import sys
from typing import List, Tuple
try:
    from tabulate import tabulate
except ImportError:
    print("Installing tabulate...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "tabulate"])
    from tabulate import tabulate

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
}

# ============================================================================
# VERIFICATION TESTS
# ============================================================================

def test_table_counts(cursor) -> List[Tuple[str, str, str]]:
    """Verify table record counts."""
    print("\n" + "="*70)
    print("TEST 1: TABLE RECORD COUNTS")
    print("="*70)

    tables = [
        ('surahs', 114, 'Expected 114 Surahs'),
        ('ayahs', 6236, 'Expected 6,236 Ayahs'),
        ('editions', None, 'Translations and Tafsirs'),
        ('ayah_data', None, 'Translation entries'),
        ('hadith_collections', 6, 'Expected 6 major collections'),
        ('hadith_chapters', None, 'Hadith chapters'),
        ('hadiths', None, 'Total hadiths'),
    ]

    results = []
    all_passed = True

    for table, expected, description in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        actual = cursor.fetchone()[0]

        if expected:
            status = "✅ PASS" if actual == expected else "❌ FAIL"
            if actual != expected:
                all_passed = False
        else:
            status = "✅" if actual > 0 else "⚠ EMPTY"

        results.append([table, f"{actual:,}", expected if expected else "-", status, description])

    print(tabulate(results, headers=["Table", "Actual", "Expected", "Status", "Description"], tablefmt="grid"))

    return all_passed

def test_surah_data(cursor) -> bool:
    """Verify Surah data integrity."""
    print("\n" + "="*70)
    print("TEST 2: SURAH DATA INTEGRITY")
    print("="*70)

    # Check for missing surahs
    cursor.execute("SELECT surah_number FROM surahs ORDER BY surah_number")
    surah_numbers = [row[0] for row in cursor.fetchall()]
    expected_numbers = list(range(1, 115))

    missing = set(expected_numbers) - set(surah_numbers)
    if missing:
        print(f"❌ FAIL: Missing surahs: {missing}")
        return False

    # Verify some well-known surahs
    test_cases = [
        (1, 'Al-Fatiha', 7),
        (2, 'Al-Baqara', 286),
        (114, 'An-Nas', 6),
    ]

    results = []
    all_passed = True

    for surah_num, expected_name, expected_ayahs in test_cases:
        cursor.execute("""
            SELECT name_english, ayah_count
            FROM surahs
            WHERE surah_number = %s
        """, (surah_num,))

        row = cursor.fetchone()
        if row:
            actual_name, actual_ayahs = row
            name_match = expected_name.lower() in actual_name.lower()
            ayah_match = actual_ayahs == expected_ayahs

            status = "✅ PASS" if (name_match and ayah_match) else "❌ FAIL"
            if not (name_match and ayah_match):
                all_passed = False

            results.append([
                surah_num,
                actual_name,
                actual_ayahs,
                expected_ayahs,
                status
            ])

    print(tabulate(results, headers=["Surah #", "Name", "Actual Ayahs", "Expected", "Status"], tablefmt="grid"))

    return all_passed

def test_ayah_data(cursor) -> bool:
    """Verify Ayah data integrity."""
    print("\n" + "="*70)
    print("TEST 3: AYAH DATA INTEGRITY")
    print("="*70)

    results = []

    # Test 1: Check ayah_key format
    cursor.execute("SELECT COUNT(*) FROM ayahs WHERE ayah_key NOT REGEXP '^[0-9]+:[0-9]+$'")
    invalid_keys = cursor.fetchone()[0]
    results.append(["Ayah Key Format", "Valid format (surah:ayah)", "✅ PASS" if invalid_keys == 0 else f"❌ FAIL ({invalid_keys} invalid)"])

    # Test 2: Check Arabic text presence
    cursor.execute("SELECT COUNT(*) FROM ayahs WHERE text_arabic IS NULL OR text_arabic = ''")
    missing_arabic = cursor.fetchone()[0]
    results.append(["Arabic Text", "All ayahs have Arabic text", "✅ PASS" if missing_arabic == 0 else f"❌ FAIL ({missing_arabic} missing)"])

    # Test 3: Check clean text presence
    cursor.execute("SELECT COUNT(*) FROM ayahs WHERE text_clean IS NULL OR text_clean = ''")
    missing_clean = cursor.fetchone()[0]
    results.append(["Clean Text", "All ayahs have clean text", "✅ PASS" if missing_clean == 0 else f"⚠ WARNING ({missing_clean} missing)"])

    # Test 4: Verify a famous ayah (Ayat al-Kursi - 2:255)
    cursor.execute("SELECT text_arabic FROM ayahs WHERE ayah_key = '2:255'")
    ayat_kursi = cursor.fetchone()
    if ayat_kursi and 'ٱللَّهُ' in ayat_kursi[0]:
        results.append(["Ayat al-Kursi (2:255)", "Contains 'Allah'", "✅ PASS"])
    else:
        results.append(["Ayat al-Kursi (2:255)", "Contains 'Allah'", "❌ FAIL"])

    print(tabulate(results, headers=["Test", "Expected", "Status"], tablefmt="grid"))

    return all(["FAIL" not in r[2] for r in results])

def test_translations(cursor) -> bool:
    """Verify translation data."""
    print("\n" + "="*70)
    print("TEST 4: TRANSLATION DATA")
    print("="*70)

    # Get all translation editions
    cursor.execute("""
        SELECT slug, name, COUNT(ad.id) as translation_count
        FROM editions e
        LEFT JOIN ayah_data ad ON e.id = ad.edition_id
        WHERE e.type = 'translation'
        GROUP BY e.id, e.slug, e.name
    """)

    results = []
    all_passed = True

    for slug, name, count in cursor.fetchall():
        expected_count = 6236  # Total ayahs
        percentage = (count / expected_count * 100) if expected_count > 0 else 0
        status = "✅ COMPLETE" if count >= 6200 else "⚠ INCOMPLETE"

        if count < 6200:
            all_passed = False

        results.append([slug, name, f"{count:,}", f"{percentage:.1f}%", status])

    print(tabulate(results, headers=["Slug", "Name", "Translations", "Coverage", "Status"], tablefmt="grid"))

    return all_passed

def test_hadith_data(cursor) -> bool:
    """Verify Hadith data."""
    print("\n" + "="*70)
    print("TEST 5: HADITH DATA")
    print("="*70)

    cursor.execute("""
        SELECT
            hc.name_english,
            hc.slug,
            hc.total_hadiths,
            COUNT(DISTINCT hch.id) as chapter_count,
            COUNT(h.id) as actual_hadiths
        FROM hadith_collections hc
        LEFT JOIN hadith_chapters hch ON hc.id = hch.collection_id
        LEFT JOIN hadiths h ON hc.id = h.collection_id
        GROUP BY hc.id, hc.name_english, hc.slug, hc.total_hadiths
        ORDER BY hc.id
    """)

    results = []
    for row in cursor.fetchall():
        name, slug, total, chapters, actual = row
        status = "✅" if actual > 0 else "⚠ EMPTY"
        results.append([name, slug, f"{actual:,}", chapters, status])

    print(tabulate(results, headers=["Collection", "Slug", "Hadiths", "Chapters", "Status"], tablefmt="grid"))

    return True

def test_fulltext_search(cursor) -> bool:
    """Test FULLTEXT search functionality."""
    print("\n" + "="*70)
    print("TEST 6: FULLTEXT SEARCH")
    print("="*70)

    tests = [
        ("Search for 'Paradise' in translations", """
            SELECT COUNT(*) FROM ayah_data ad
            JOIN editions e ON ad.edition_id = e.id
            WHERE MATCH(ad.text) AGAINST('Paradise' IN NATURAL LANGUAGE MODE)
            AND e.type = 'translation'
        """),
        ("Search for 'prayer' in hadiths", """
            SELECT COUNT(*) FROM hadiths
            WHERE MATCH(text_english) AGAINST('prayer' IN NATURAL LANGUAGE MODE)
        """),
    ]

    results = []
    all_passed = True

    for test_name, query in tests:
        try:
            cursor.execute(query)
            count = cursor.fetchone()[0]
            status = "✅ PASS" if count > 0 else "⚠ NO RESULTS"
            results.append([test_name, f"{count:,} results", status])
        except Exception as e:
            results.append([test_name, str(e), "❌ FAIL"])
            all_passed = False

    print(tabulate(results, headers=["Test", "Result", "Status"], tablefmt="grid"))

    return all_passed

def test_database_size(cursor) -> bool:
    """Check database size and table sizes."""
    print("\n" + "="*70)
    print("TEST 7: DATABASE SIZE")
    print("="*70)

    cursor.execute("""
        SELECT
            table_name,
            ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
        FROM information_schema.TABLES
        WHERE table_schema = 'IslamicKnowledgeDB'
        ORDER BY (data_length + index_length) DESC
    """)

    results = []
    total_size = 0

    for table_name, size_mb in cursor.fetchall():
        total_size += size_mb
        results.append([table_name, f"{size_mb:.2f} MB"])

    results.append(["", ""])
    results.append(["TOTAL DATABASE SIZE", f"{total_size:.2f} MB"])

    print(tabulate(results, headers=["Table", "Size"], tablefmt="grid"))

    return True

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("ISLAMIC KNOWLEDGE DATABASE - VERIFICATION SCRIPT")
    print("="*70)
    print("\nThis script will verify the integrity of your imported data.\n")

    # Connect to database
    print("🔌 Connecting to MySQL database...")
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor(buffered=True)
        print("   ✅ Connected successfully\n")
    except mysql.connector.Error as err:
        print(f"   ❌ Error: {err}")
        sys.exit(1)

    try:
        # Run all tests
        test_results = {
            "Table Counts": test_table_counts(cursor),
            "Surah Data": test_surah_data(cursor),
            "Ayah Data": test_ayah_data(cursor),
            "Translations": test_translations(cursor),
            "Hadith Data": test_hadith_data(cursor),
            "FULLTEXT Search": test_fulltext_search(cursor),
            "Database Size": test_database_size(cursor),
        }

        # Summary
        print("\n" + "="*70)
        print("VERIFICATION SUMMARY")
        print("="*70 + "\n")

        summary = []
        for test_name, passed in test_results.items():
            status = "✅ PASSED" if passed else "⚠ WARNINGS/FAILURES"
            summary.append([test_name, status])

        print(tabulate(summary, headers=["Test", "Status"], tablefmt="grid"))

        all_passed = all(test_results.values())

        if all_passed:
            print("\n🎉 All tests passed! Your database is ready to use.")
        else:
            print("\n⚠ Some tests had warnings or failures. Please review above.")

        print("="*70 + "\n")

    except Exception as e:
        print(f"\n❌ Error during verification: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    main()
