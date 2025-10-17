#!/usr/bin/env python3
"""
Fortification of the Muslim (Hisnul Muslim) - Dua Extractor
============================================================

Extracts duas from the PDF and formats them for Prisma database import.

Output: fortification_duas.json
"""

import PyPDF2
import json
import re
from pathlib import Path
from typing import List, Dict, Optional

# PDF Path
PDF_PATH = "quran-hadith-app/quran-hadith-app/data/quran-nlp/data/Fortification of the Muslim (from the Quran and Sunnah) (Sa'id ibn Ali ibn Wahf al-Qahtani) (Z-Library).pdf"

# Category mappings (Hisnul Muslim categories)
CATEGORY_PATTERNS = {
    "Morning": ["morning", "awaking", "wake up", "after waking"],
    "Evening": ["evening", "before sleeping", "sleep", "going to bed"],
    "Prayer": ["prayer", "salah", "prostration", "sujud", "ruku", "after prayer"],
    "Quran": ["quran", "recit"],
    "Mosque": ["mosque", "masjid", "entering", "leaving"],
    "Adhan": ["adhan", "azan", "call to prayer"],
    "Travel": ["travel", "journey", "vehicle", "riding"],
    "Food": ["food", "eating", "drink", "meal"],
    "Distress": ["distress", "anxiety", "worry", "grief", "sorrow", "difficulty"],
    "Forgiveness": ["forgiveness", "repentance", "sin", "istighfar"],
    "Protection": ["protection", "evil", "satan", "shaytan", "refuge"],
    "Family": ["family", "children", "spouse", "marriage"],
    "Health": ["sick", "illness", "health", "disease", "pain"],
    "Rain": ["rain", "thunder", "lightning"],
    "General": ["general", "various", "miscellaneous"]
}

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from PDF."""
    print(f"📄 Reading PDF: {pdf_path}")

    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""

        total_pages = len(reader.pages)
        print(f"   Total pages: {total_pages}")

        for i, page in enumerate(reader.pages):
            text += page.extract_text()
            if (i + 1) % 10 == 0:
                print(f"   Processed {i + 1}/{total_pages} pages...")

        print(f"   ✅ Extracted {len(text)} characters\n")
        return text

def detect_category(text: str) -> str:
    """Detect dua category from context."""
    text_lower = text.lower()

    for category, patterns in CATEGORY_PATTERNS.items():
        for pattern in patterns:
            if pattern in text_lower:
                return category

    return "General"

def is_arabic(text: str) -> bool:
    """Check if text contains Arabic characters."""
    arabic_pattern = re.compile(r'[\u0600-\u06FF]+')
    return bool(arabic_pattern.search(text))

def clean_text(text: str) -> str:
    """Clean extracted text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove page numbers
    text = re.sub(r'\b\d+\s*$', '', text)
    return text.strip()

def extract_reference(text: str) -> Optional[str]:
    """Extract hadith reference from text."""
    # Common patterns for references
    patterns = [
        r'(?:Bukhari|Muslim|Abu Dawud|Tirmidhi|Nasa\'i|Ibn Majah)[\s:]+\d+',
        r'Sahih\s+(?:al-)?Bukhari\s+\d+',
        r'Sahih\s+Muslim\s+\d+',
        r'Sunan\s+\w+\s+\d+',
        r'Quran\s+\d+:\d+',
        r'Al-Quran\s+\d+:\d+',
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)

    return None

def split_into_duas(text: str) -> List[Dict]:
    """Parse text into individual duas."""
    print("🔍 Parsing duas from text...")

    duas = []

    # Split by common section markers
    sections = re.split(r'\n\s*\n|\d+\.\s+', text)

    current_category = "General"
    dua_number = 1

    for section in sections:
        section = clean_text(section)

        if len(section) < 20:  # Skip very short sections
            continue

        # Check if this is a category header
        if len(section) < 100 and any(cat.lower() in section.lower() for cat in CATEGORY_PATTERNS.keys()):
            current_category = detect_category(section)
            continue

        # Split section into lines
        lines = [line.strip() for line in section.split('\n') if line.strip()]

        if len(lines) < 2:
            continue

        # Try to identify Arabic text, translation, and transliteration
        arabic_text = None
        english_text = None
        transliteration = None
        reference = extract_reference(section)

        for line in lines:
            if is_arabic(line) and not arabic_text:
                arabic_text = line
            elif line.startswith('(') or '[' in line:
                # Likely transliteration (often in parentheses)
                if not transliteration:
                    transliteration = line.strip('()[]')
            elif len(line) > 20 and not english_text:
                english_text = line

        # Create dua entry if we have at least Arabic or English
        if arabic_text or english_text:
            dua = {
                "number": dua_number,
                "category": current_category,
                "title": f"{current_category} Dua #{dua_number}",
                "arabic": arabic_text or "",
                "english": english_text or "",
                "transliteration": transliteration or "",
                "reference": reference or "",
                "occasion": current_category
            }

            duas.append(dua)
            dua_number += 1

            if dua_number % 10 == 0:
                print(f"   Extracted {dua_number} duas...")

    print(f"   ✅ Total duas extracted: {len(duas)}\n")
    return duas

def generate_prisma_format(duas: List[Dict]) -> Dict:
    """Format duas for Prisma import."""
    print("📦 Formatting for Prisma...")

    # Group by category
    categories = {}
    for dua in duas:
        cat = dua['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(dua)

    print(f"   Categories found: {len(categories)}")
    for cat, items in categories.items():
        print(f"   - {cat}: {len(items)} duas")

    # Create output structure
    output = {
        "source": "Fortification of the Muslim (Hisnul Muslim)",
        "author": "Sa'id ibn Ali ibn Wahf al-Qahtani",
        "total_duas": len(duas),
        "categories": list(categories.keys()),
        "duas": []
    }

    # Format each dua
    for dua in duas:
        formatted = {
            "title": dua['title'],
            "titleArabic": None,
            "textArabic": dua['arabic'],
            "textEnglish": dua['english'],
            "transliteration": dua['transliteration'] if dua['transliteration'] else None,
            "reference": dua['reference'] if dua['reference'] else None,
            "category": dua['category'],
            "tags": f"{dua['category']},Daily Duas,Hisnul Muslim",
            "benefits": None,
            "occasion": dua['occasion']
        }
        output["duas"].append(formatted)

    return output

def save_json(data: Dict, output_file: str):
    """Save data to JSON file."""
    print(f"💾 Saving to {output_file}...")

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"   ✅ Saved successfully!\n")

def main():
    """Main execution."""
    print("\n" + "="*70)
    print("FORTIFICATION OF THE MUSLIM - DUA EXTRACTOR")
    print("="*70 + "\n")

    # Check if PDF exists
    pdf_path = Path(PDF_PATH)
    if not pdf_path.exists():
        print(f"❌ Error: PDF not found at {PDF_PATH}")
        print(f"   Please ensure the file exists at this location.")
        return

    try:
        # Extract text from PDF
        text = extract_text_from_pdf(PDF_PATH)

        # Parse duas
        duas = split_into_duas(text)

        if not duas:
            print("⚠️  Warning: No duas extracted. PDF might be image-based or encrypted.")
            print("   Try using an OCR tool first.")
            return

        # Format for Prisma
        output = generate_prisma_format(duas)

        # Save to JSON
        output_file = "fortification_duas.json"
        save_json(output, output_file)

        # Summary
        print("="*70)
        print("EXTRACTION COMPLETE!")
        print("="*70)
        print(f"\n📊 Summary:")
        print(f"   Total Duas: {len(duas)}")
        print(f"   Categories: {len(output['categories'])}")
        print(f"   Output File: {output_file}")
        print(f"\n📝 Next Steps:")
        print(f"   1. Review the JSON file: {output_file}")
        print(f"   2. Import into database using Prisma")
        print(f"   3. Verify duas are correctly formatted")
        print("\n" + "="*70 + "\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
