/**
 * Import Arabic Dictionary Script
 *
 * This script imports the comprehensive Arabic dictionary
 * from the QURAN-NLP dataset into the database.
 *
 * Data Source: https://www.kaggle.com/datasets/alizahidraja/quran-nlp
 * File: arabic_dictionary.csv (54,000+ entries)
 *
 * Usage:
 *   npm run import:dictionary
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

const DICTIONARY_FILE = path.join(process.cwd(), 'data', 'quran-nlp', 'data', 'quran', 'corpus', 'quran_dictionary.csv');
const BATCH_SIZE = 500;

interface DictionaryRow {
  title: string;
  subheading: string;
  location: string;
  transliteration: string;
  translation: string;
  arabic_verse_part: string;
  arabic_word: string;
}

async function importDictionary() {
  console.log('📚 Starting Arabic Dictionary import from QURAN-NLP dataset...\n');

  try {
    // Check if file exists
    if (!fs.existsSync(DICTIONARY_FILE)) {
      console.error(`❌ Error: Dictionary file not found at ${DICTIONARY_FILE}`);
      console.log('\n📥 Please ensure you have:');
      console.log('1. Downloaded quran-nlp.zip from Kaggle');
      console.log('2. Extracted it to: data/quran-nlp/');
      console.log('3. The file arabic_dictionary.csv exists in that directory\n');
      process.exit(1);
    }

    console.log(`📂 Reading dictionary file: ${DICTIONARY_FILE}\n`);

    // Read and parse CSV file
    const fileContent = fs.readFileSync(DICTIONARY_FILE, 'utf-8');
    const parseResult = Papa.parse<DictionaryRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    const rows = parseResult.data.filter(row => row.arabic_word && row.translation);
    console.log(`📊 Found ${rows.length.toLocaleString()} dictionary entries\n`);

    // Clear existing dictionary data (optional - remove if you want to preserve existing data)
    console.log('🗑️  Clearing existing dictionary entries...');
    const deleted = await prisma.arabicDictionary.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count.toLocaleString()} old entries\n`);

    // Import dictionary entries in batches
    console.log('📝 Importing dictionary entries...');
    let importedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const dictionaryData = batch
        .filter(row => {
          // Basic validation
          if (!row.arabic_word || !row.translation) {
            skippedCount++;
            return false;
          }
          return true;
        })
        .map(row => ({
          arabic: row.arabic_word.trim(),
          root: row.title?.trim() || '',
          definition: row.translation.trim(),
          examples: row.arabic_verse_part ? JSON.stringify([row.arabic_verse_part]) : null,
          partOfSpeech: row.subheading?.trim() || 'Unknown',
          usageNotes: row.location ? `Used at ${row.location}` : null,
          frequency: null,
        }));

      try {
        await prisma.arabicDictionary.createMany({
          data: dictionaryData,
          skipDuplicates: true,
        });
        importedCount += dictionaryData.length;
      } catch (error) {
        console.error(`Error importing batch starting at index ${i}:`, error);
        skippedCount += dictionaryData.length;
      }

      console.log(`   📝 Processed ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} entries (Imported: ${importedCount}, Skipped: ${skippedCount})`);
    }

    // Update word roots with dictionary meanings
    console.log('\n🌱 Updating word roots with dictionary meanings...');
    const dictEntries = await prisma.arabicDictionary.findMany({
      where: {
        root: { not: '' },
      },
      distinct: ['root'],
    });

    let rootsUpdated = 0;
    for (const entry of dictEntries) {
      try {
        const updated = await prisma.wordRoot.updateMany({
          where: {
            root: entry.root,
            meaning: '', // Only update empty meanings
          },
          data: {
            meaning: entry.definition.substring(0, 500), // Limit to 500 chars
          },
        });
        if (updated.count > 0) rootsUpdated += updated.count;
      } catch (error) {
        // Skip if root doesn't exist
      }
    }
    console.log(`✅ Updated ${rootsUpdated} word root meanings\n`);

    console.log('🎉 Dictionary import completed successfully!\n');
    console.log('Summary:');
    console.log(`- Total entries processed: ${rows.length.toLocaleString()}`);
    console.log(`- Entries imported: ${importedCount.toLocaleString()}`);
    console.log(`- Entries skipped: ${skippedCount.toLocaleString()}`);
    console.log(`- Root meanings updated: ${rootsUpdated.toLocaleString()}`);
    console.log(`\nThe Arabic dictionary is now available in your application.`);

  } catch (error) {
    console.error('❌ Error during dictionary import:', error);
    throw error;
  }
}

importDictionary()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
