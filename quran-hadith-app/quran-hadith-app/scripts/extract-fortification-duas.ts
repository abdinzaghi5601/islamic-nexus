/**
 * Fortification of the Muslim (Hisnul Muslim) - Dua Extractor
 * =============================================================
 *
 * Extracts duas from the PDF and formats them for Prisma database import.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
// @ts-ignore
import PDFParse from 'pdf-parse';

interface Dua {
  number: number;
  category: string;
  title: string;
  titleArabic: string | null;
  textArabic: string;
  textEnglish: string;
  transliteration: string | null;
  reference: string | null;
  tags: string;
  occasion: string;
  benefits: string | null;
}

// Category patterns for detection
const CATEGORY_PATTERNS: Record<string, string[]> = {
  Morning: ['morning', 'awaking', 'wake up', 'after waking'],
  Evening: ['evening', 'before sleeping', 'sleep', 'going to bed'],
  Prayer: ['prayer', 'salah', 'prostration', 'sujud', 'ruku', 'after prayer'],
  Quran: ['quran', 'recit'],
  Mosque: ['mosque', 'masjid', 'entering', 'leaving'],
  Adhan: ['adhan', 'azan', 'call to prayer'],
  Travel: ['travel', 'journey', 'vehicle', 'riding'],
  Food: ['food', 'eating', 'drink', 'meal'],
  Distress: ['distress', 'anxiety', 'worry', 'grief', 'sorrow', 'difficulty'],
  Forgiveness: ['forgiveness', 'repentance', 'sin', 'istighfar'],
  Protection: ['protection', 'evil', 'satan', 'shaytan', 'refuge'],
  Family: ['family', 'children', 'spouse', 'marriage'],
  Health: ['sick', 'illness', 'health', 'disease', 'pain'],
  Rain: ['rain', 'thunder', 'lightning'],
  General: ['general', 'various', 'miscellaneous']
};

function isArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

function detectCategory(text: string): string {
  const textLower = text.toLowerCase();

  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (textLower.includes(pattern)) {
        return category;
      }
    }
  }

  return 'General';
}

function extractReference(text: string): string | null {
  const patterns = [
    /(?:Bukhari|Muslim|Abu Dawud|Tirmidhi|Nasa'i|Ibn Majah)[\s:]+\d+/i,
    /Sahih\s+(?:al-)?Bukhari\s+\d+/i,
    /Sahih\s+Muslim\s+\d+/i,
    /Sunan\s+\w+\s+\d+/i,
    /Quran\s+\d+:\d+/i,
    /Al-Quran\s+\d+:\d+/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/\b\d+\s*$/, '').trim();
}

async function extractDuas(pdfPath: string): Promise<Dua[]> {
  console.log('📄 Reading PDF:', pdfPath);

  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await PDFParse(dataBuffer);

  console.log(`   Total pages: ${data.numpages}`);
  console.log(`   Extracted ${data.text.length} characters\n`);

  console.log('🔍 Parsing duas from text...');

  const duas: Dua[] = [];
  const sections = data.text.split(/\n\s*\n|\d+\.\s+/);

  let currentCategory = 'General';
  let duaNumber = 1;

  for (const section of sections) {
    const cleanSection = cleanText(section);

    if (cleanSection.length < 20) continue;

    // Check if category header
    if (cleanSection.length < 100) {
      const detectedCategory = detectCategory(cleanSection);
      if (detectedCategory !== 'General') {
        currentCategory = detectedCategory;
        continue;
      }
    }

    const lines = cleanSection.split('\n').map(l => l.trim()).filter(l => l);

    if (lines.length < 2) continue;

    let arabicText = '';
    let englishText = '';
    let transliteration: string | null = null;
    const reference = extractReference(cleanSection);

    for (const line of lines) {
      if (isArabic(line) && !arabicText) {
        arabicText = line;
      } else if (line.startsWith('(') || line.includes('[')) {
        if (!transliteration) {
          transliteration = line.replace(/[()[\]]/g, '').trim();
        }
      } else if (line.length > 20 && !englishText) {
        englishText = line;
      }
    }

    if (arabicText || englishText) {
      duas.push({
        number: duaNumber,
        category: currentCategory,
        title: `${currentCategory} Dua #${duaNumber}`,
        titleArabic: null,
        textArabic: arabicText,
        textEnglish: englishText,
        transliteration,
        reference,
        tags: `${currentCategory},Daily Duas,Hisnul Muslim`,
        occasion: currentCategory,
        benefits: null
      });

      duaNumber++;

      if (duaNumber % 10 === 0) {
        console.log(`   Extracted ${duaNumber} duas...`);
      }
    }
  }

  console.log(`   ✅ Total duas extracted: ${duas.length}\n`);
  return duas;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('FORTIFICATION OF THE MUSLIM - DUA EXTRACTOR');
  console.log('='.repeat(70) + '\n');

  // Find the PDF using glob pattern to handle special characters
  console.log('🔍 Searching for PDF file...');
  const searchPattern = path.join(process.cwd(), 'data/duas-pdfs/Fortification*.pdf');
  const files = await glob(searchPattern);

  if (files.length === 0) {
    console.log('❌ Error: PDF not found');
    console.log('   Searched in:', searchPattern);
    return;
  }

  const pdfPath = files[0];
  console.log('   ✅ Found:', path.basename(pdfPath), '\n');

  try {
    const duas = await extractDuas(pdfPath);

    if (duas.length === 0) {
      console.log('⚠️  Warning: No duas extracted. PDF might be image-based or encrypted.');
      console.log('   Try using an OCR tool first.');
      return;
    }

    // Group by category
    const categories = duas.reduce((acc, dua) => {
      if (!acc[dua.category]) {
        acc[dua.category] = [];
      }
      acc[dua.category].push(dua);
      return acc;
    }, {} as Record<string, Dua[]>);

    console.log('📦 Formatting for Prisma...');
    console.log(`   Categories found: ${Object.keys(categories).length}`);
    for (const [cat, items] of Object.entries(categories)) {
      console.log(`   - ${cat}: ${items.length} duas`);
    }

    const output = {
      source: 'Fortification of the Muslim (Hisnul Muslim)',
      author: 'Sa\'id ibn Ali ibn Wahf al-Qahtani',
      total_duas: duas.length,
      categories: Object.keys(categories),
      duas: duas
    };

    // Save to JSON
    const outputFile = path.join(process.cwd(), '../fortification_duas.json');
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

    console.log(`💾 Saved to ${outputFile}\n`);

    console.log('='.repeat(70));
    console.log('EXTRACTION COMPLETE!');
    console.log('='.repeat(70));
    console.log(`\n📊 Summary:`);
    console.log(`   Total Duas: ${duas.length}`);
    console.log(`   Categories: ${Object.keys(categories).length}`);
    console.log(`   Output File: ${outputFile}`);
    console.log(`\n📝 Next Steps:`);
    console.log(`   1. Review the JSON file`);
    console.log(`   2. Import into database using Prisma`);
    console.log(`   3. Verify duas are correctly formatted`);
    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
  }
}

main();
