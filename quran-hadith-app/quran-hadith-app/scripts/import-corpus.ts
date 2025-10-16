/**
 * Import Quran Corpus Script
 *
 * This script imports word-by-word Quran data with morphological analysis
 * from the QURAN-NLP dataset into the database.
 *
 * Data Source: https://www.kaggle.com/datasets/alizahidraja/quran-nlp
 * File: quran_corpus.csv (190,000+ entries)
 *
 * Usage:
 *   npm run import:corpus
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

const CORPUS_FILE = path.join(process.cwd(), 'data', 'quran-nlp', 'quran_corpus.csv');
const BATCH_SIZE = 1000;

interface CorpusRow {
  chapter_no: string;
  verse_no: string;
  word_no: string;
  word_arabic: string;
  word_english: string;
  root: string;
  type: string;
  grammar: string;
  lemma: string;
  stem: string;
  segment: string;
  prefix: string;
  suffix: string;
  pattern: string;
  arabic_pattern: string;
  english_pattern: string;
}

async function importCorpus() {
  console.log('📖 Starting Quran Corpus import from QURAN-NLP dataset...\n');

  try {
    // Check if file exists
    if (!fs.existsSync(CORPUS_FILE)) {
      console.error(`❌ Error: Corpus file not found at ${CORPUS_FILE}`);
      console.log('\n📥 Please ensure you have:');
      console.log('1. Downloaded quran-nlp.zip from Kaggle');
      console.log('2. Extracted it to: data/quran-nlp/');
      console.log('3. The file quran_corpus.csv exists in that directory\n');
      process.exit(1);
    }

    console.log(`📂 Reading corpus file: ${CORPUS_FILE}\n`);

    // Read and parse CSV file
    const fileContent = fs.readFileSync(CORPUS_FILE, 'utf-8');
    const parseResult = Papa.parse<CorpusRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    const rows = parseResult.data;
    console.log(`📊 Found ${rows.length.toLocaleString()} word entries\n`);

    // Get all ayahs from database
    console.log('🔍 Loading ayahs from database...');
    const allAyahs = await prisma.ayah.findMany({
      include: { surah: true },
      orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
    });
    console.log(`✅ Loaded ${allAyahs.length.toLocaleString()} ayahs\n`);

    // Create a map for quick ayah lookup
    const ayahMap = new Map<string, number>();
    allAyahs.forEach((ayah) => {
      const key = `${ayah.surah.number}-${ayah.ayahNumber}`;
      ayahMap.set(key, ayah.id);
    });

    // Get or create word roots
    console.log('🌱 Processing word roots...');
    const uniqueRoots = new Set<string>();
    rows.forEach((row) => {
      if (row.root && row.root.trim()) {
        uniqueRoots.add(row.root.trim());
      }
    });

    const rootsArray = Array.from(uniqueRoots);
    console.log(`   Found ${rootsArray.length.toLocaleString()} unique roots`);

    // Batch create roots
    for (let i = 0; i < rootsArray.length; i += BATCH_SIZE) {
      const batch = rootsArray.slice(i, i + BATCH_SIZE);
      const rootData = batch.map((root) => ({
        root: root,
        rootSimple: root.replace(/\s+/g, ''),
        meaning: '', // Will be populated later from dictionary
        occurrences: 0,
      }));

      await prisma.wordRoot.createMany({
        data: rootData,
        skipDuplicates: true,
      });

      console.log(`   📝 Processed ${Math.min(i + BATCH_SIZE, rootsArray.length)}/${rootsArray.length} roots`);
    }

    // Load all roots for mapping
    const allRoots = await prisma.wordRoot.findMany();
    const rootMap = new Map(allRoots.map((r) => [r.root, r.id]));
    console.log(`✅ Created/loaded ${allRoots.length.toLocaleString()} word roots\n`);

    // Process and import words with morphology
    console.log('📝 Importing words and morphology...');
    let importedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      for (const row of batch) {
        try {
          const chapterNo = parseInt(row.chapter_no);
          const verseNo = parseInt(row.verse_no);
          const wordNo = parseInt(row.word_no);

          // Get ayah ID
          const ayahKey = `${chapterNo}-${verseNo}`;
          const ayahId = ayahMap.get(ayahKey);

          if (!ayahId) {
            skippedCount++;
            continue;
          }

          // Get root ID
          const rootId = row.root ? rootMap.get(row.root.trim()) : null;

          // Check if word already exists
          const existingWord = await prisma.ayahWord.findUnique({
            where: {
              ayahId_position: {
                ayahId: ayahId,
                position: wordNo,
              },
            },
          });

          if (existingWord) {
            // Update existing word
            await prisma.ayahWord.update({
              where: { id: existingWord.id },
              data: {
                textArabic: row.word_arabic || '',
                textSimplified: row.word_arabic?.replace(/[\u064B-\u065F]/g, '') || '',
                transliteration: row.segment || '',
                rootId: rootId,
              },
            });

            // Create or update morphology
            await prisma.wordMorphology.upsert({
              where: { wordId: existingWord.id },
              create: {
                wordId: existingWord.id,
                stem: row.stem || '',
                lemma: row.lemma || '',
                prefix: row.prefix || null,
                suffix: row.suffix || null,
                pattern: row.pattern || null,
                arabicPattern: row.arabic_pattern || null,
                englishPattern: row.english_pattern || null,
                aspects: row.grammar || null,
              },
              update: {
                stem: row.stem || '',
                lemma: row.lemma || '',
                prefix: row.prefix || null,
                suffix: row.suffix || null,
                pattern: row.pattern || null,
                arabicPattern: row.arabic_pattern || null,
                englishPattern: row.english_pattern || null,
                aspects: row.grammar || null,
              },
            });

            // Create or update grammar
            await prisma.wordGrammar.upsert({
              where: { wordId: existingWord.id },
              create: {
                wordId: existingWord.id,
                partOfSpeech: row.type || 'Unknown',
                root: row.root || null,
              },
              update: {
                partOfSpeech: row.type || 'Unknown',
                root: row.root || null,
              },
            });

            // Create word translation if available
            if (row.word_english) {
              await prisma.wordTranslation.upsert({
                where: {
                  wordId_language: {
                    wordId: existingWord.id,
                    language: 'en',
                  },
                },
                create: {
                  wordId: existingWord.id,
                  language: 'en',
                  translation: row.word_english,
                },
                update: {
                  translation: row.word_english,
                },
              });
            }
          } else {
            // Create new word
            const newWord = await prisma.ayahWord.create({
              data: {
                ayahId: ayahId,
                position: wordNo,
                textArabic: row.word_arabic || '',
                textSimplified: row.word_arabic?.replace(/[\u064B-\u065F]/g, '') || '',
                transliteration: row.segment || '',
                rootId: rootId,
              },
            });

            // Create morphology
            await prisma.wordMorphology.create({
              data: {
                wordId: newWord.id,
                stem: row.stem || '',
                lemma: row.lemma || '',
                prefix: row.prefix || null,
                suffix: row.suffix || null,
                pattern: row.pattern || null,
                arabicPattern: row.arabic_pattern || null,
                englishPattern: row.english_pattern || null,
                aspects: row.grammar || null,
              },
            });

            // Create grammar
            await prisma.wordGrammar.create({
              data: {
                wordId: newWord.id,
                partOfSpeech: row.type || 'Unknown',
                root: row.root || null,
              },
            });

            // Create word translation if available
            if (row.word_english) {
              await prisma.wordTranslation.create({
                data: {
                  wordId: newWord.id,
                  language: 'en',
                  translation: row.word_english,
                },
              });
            }
          }

          importedCount++;
        } catch (error) {
          console.error(`Error processing word at chapter ${row.chapter_no}, verse ${row.verse_no}, word ${row.word_no}:`, error);
          skippedCount++;
        }
      }

      console.log(`   📝 Processed ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} words (Imported: ${importedCount}, Skipped: ${skippedCount})`);
    }

    // Update root occurrence counts
    console.log('\n🔢 Updating root occurrence counts...');
    const rootCounts = await prisma.ayahWord.groupBy({
      by: ['rootId'],
      where: { rootId: { not: null } },
      _count: { rootId: true },
    });

    for (const count of rootCounts) {
      if (count.rootId) {
        await prisma.wordRoot.update({
          where: { id: count.rootId },
          data: { occurrences: count._count.rootId },
        });
      }
    }
    console.log(`✅ Updated ${rootCounts.length} root occurrence counts\n`);

    console.log('🎉 Corpus import completed successfully!\n');
    console.log('Summary:');
    console.log(`- Total words processed: ${rows.length.toLocaleString()}`);
    console.log(`- Words imported: ${importedCount.toLocaleString()}`);
    console.log(`- Words skipped: ${skippedCount.toLocaleString()}`);
    console.log(`- Unique roots: ${allRoots.length.toLocaleString()}`);
    console.log(`\nYou can now view the word-by-word data in your application.`);

  } catch (error) {
    console.error('❌ Error during corpus import:', error);
    throw error;
  }
}

importCorpus()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
