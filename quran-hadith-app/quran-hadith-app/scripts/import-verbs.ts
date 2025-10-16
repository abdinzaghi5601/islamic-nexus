/**
 * Import Verb Conjugation Script
 *
 * This script imports Arabic verb conjugations
 * from the QURAN-NLP dataset into the database.
 *
 * Data Source: https://www.kaggle.com/datasets/alizahidraja/quran-nlp
 * File: verb_conjugations.csv (1,475+ entries)
 *
 * Usage:
 *   npm run import:verbs
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

const VERBS_FILE = path.join(process.cwd(), 'data', 'quran-nlp', 'data', 'quran', 'corpus', 'quran_verbs.csv');
const BATCH_SIZE = 500;

interface VerbRow {
  verb: string;
  root: string;
  form: string;
  frequency: string;
  translation: string;
}

async function importVerbs() {
  console.log('🔤 Starting Verb Conjugation import from QURAN-NLP dataset...\n');

  try {
    // Check if file exists
    if (!fs.existsSync(VERBS_FILE)) {
      console.error(`❌ Error: Verb conjugations file not found at ${VERBS_FILE}`);
      console.log('\n📥 Please ensure you have:');
      console.log('1. Downloaded quran-nlp.zip from Kaggle');
      console.log('2. Extracted it to: data/quran-nlp/');
      console.log('3. The file verb_conjugations.csv exists in that directory\n');
      process.exit(1);
    }

    console.log(`📂 Reading verb conjugations file: ${VERBS_FILE}\n`);

    // Read and parse CSV file
    const fileContent = fs.readFileSync(VERBS_FILE, 'utf-8');
    const parseResult = Papa.parse<VerbRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    const rows = parseResult.data.filter(row => row.root && row.verb);
    console.log(`📊 Found ${rows.length.toLocaleString()} verb conjugation entries\n`);

    // Get all word roots
    console.log('🌱 Loading word roots from database...');
    const allRoots = await prisma.wordRoot.findMany();
    const rootMap = new Map(allRoots.map(r => [r.root, r.id]));
    console.log(`✅ Loaded ${allRoots.length.toLocaleString()} word roots\n`);

    // Create any missing roots
    const missingRoots = new Set<string>();
    rows.forEach(row => {
      if (row.root && !rootMap.has(row.root)) {
        missingRoots.add(row.root);
      }
    });

    if (missingRoots.size > 0) {
      console.log(`🌱 Creating ${missingRoots.size} missing roots...`);
      const newRootsData = Array.from(missingRoots).map(root => ({
        root: root,
        rootSimple: root.replace(/\s+/g, ''),
        meaning: '',
        occurrences: 0,
      }));

      await prisma.wordRoot.createMany({
        data: newRootsData,
        skipDuplicates: true,
      });

      // Reload roots
      const updatedRoots = await prisma.wordRoot.findMany();
      rootMap.clear();
      updatedRoots.forEach(r => rootMap.set(r.root, r.id));
      console.log(`✅ Created missing roots\n`);
    }

    // Clear existing verb conjugations (optional)
    console.log('🗑️  Clearing existing verb conjugations...');
    const deleted = await prisma.verbConjugation.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count.toLocaleString()} old entries\n`);

    // Import verb conjugations in batches
    console.log('📝 Importing verb conjugations...');
    let importedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const verbData = batch
        .filter(row => {
          // Basic validation
          if (!row.root || !row.verb) {
            skippedCount++;
            return false;
          }

          const rootId = rootMap.get(row.root);
          if (!rootId) {
            skippedCount++;
            return false;
          }

          return true;
        })
        .map(row => {
          const rootId = rootMap.get(row.root)!;

          return {
            rootId: rootId,
            verbForm: row.form?.trim() || 'I',
            tense: 'past', // Default since not provided in this dataset
            person: 'third', // Default
            number: 'singular', // Default
            gender: 'masculine', // Default
            arabicText: row.verb.trim(),
            transliteration: row.translation?.trim() || null,
          };
        });

      try {
        await prisma.verbConjugation.createMany({
          data: verbData,
          skipDuplicates: true,
        });
        importedCount += verbData.length;
      } catch (error) {
        console.error(`Error importing batch starting at index ${i}:`, error);
        skippedCount += verbData.length;
      }

      console.log(`   📝 Processed ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} conjugations (Imported: ${importedCount}, Skipped: ${skippedCount})`);
    }

    // Get statistics
    const verbStats = await prisma.verbConjugation.groupBy({
      by: ['rootId'],
      _count: { rootId: true },
    });

    console.log('\n🎉 Verb conjugation import completed successfully!\n');
    console.log('Summary:');
    console.log(`- Total conjugations processed: ${rows.length.toLocaleString()}`);
    console.log(`- Conjugations imported: ${importedCount.toLocaleString()}`);
    console.log(`- Conjugations skipped: ${skippedCount.toLocaleString()}`);
    console.log(`- Unique verb roots: ${verbStats.length.toLocaleString()}`);
    console.log(`\nVerb conjugations are now available in your application.`);

  } catch (error) {
    console.error('❌ Error during verb conjugation import:', error);
    throw error;
  }
}

importVerbs()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
