/**
 * Import Quran Morphology Script
 *
 * This script imports word-level morphological data from the QURAN-NLP dataset
 *
 * Data Source: https://www.kaggle.com/datasets/alizahidraja/quran-nlp
 * File: quran_morphology.csv (128K+ morpheme entries)
 *
 * Usage:
 *   npm run import:morphology
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

const MORPHOLOGY_FILE = path.join(process.cwd(), 'data', 'quran-nlp', 'data', 'quran', 'corpus', 'quran_morphology.csv');
const BATCH_SIZE = 1000;

interface MorphologyRow {
  LOCATION: string;
  FORM: string;
  TAG: string;
  FEATURES: string;
}

interface WordData {
  chapterNo: number;
  verseNo: number;
  wordNo: number;
  arabicText: string;
  segments: string[];
  pos: string;
  lemma: string;
  root: string;
  features: string[];
}

// Parse location string (chapter:verse:word:segment)
function parseLocation(location: string): { chapter: number; verse: number; word: number; segment: number } | null {
  const match = location.match(/\((\d+):(\d+):(\d+):(\d+)\)/);
  if (!match) return null;

  return {
    chapter: parseInt(match[1]),
    verse: parseInt(match[2]),
    word: parseInt(match[3]),
    segment: parseInt(match[4]),
  };
}

// Extract features from FEATURES string
function extractFeatures(features: string): { lemma?: string; root?: string; pos?: string } {
  const result: { lemma?: string; root?: string; pos?: string } = {};

  const lemmaMatch = features.match(/LEM:([^|]+)/);
  const rootMatch = features.match(/ROOT:([^|]+)/);
  const posMatch = features.match(/POS:([^|]+)/);

  if (lemmaMatch) result.lemma = lemmaMatch[1];
  if (rootMatch) result.root = rootMatch[1];
  if (posMatch) result.pos = posMatch[1];

  return result;
}

async function importMorphology() {
  console.log('📖 Starting Quran Morphology import from QURAN-NLP dataset...\n');

  try {
    // Check if file exists
    if (!fs.existsSync(MORPHOLOGY_FILE)) {
      console.error(`❌ Error: Morphology file not found at ${MORPHOLOGY_FILE}`);
      process.exit(1);
    }

    console.log(`📂 Reading morphology file: ${MORPHOLOGY_FILE}\n`);

    // Read and parse CSV file
    const fileContent = fs.readFileSync(MORPHOLOGY_FILE, 'utf-8');
    const parseResult = Papa.parse<MorphologyRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    const rows = parseResult.data;
    console.log(`📊 Found ${rows.length.toLocaleString()} morpheme entries\n`);

    // Group morphemes by word
    console.log('🔄 Grouping morphemes into words...');
    const wordMap = new Map<string, WordData>();

    for (const row of rows) {
      const loc = parseLocation(row.LOCATION);
      if (!loc) continue;

      const wordKey = `${loc.chapter}:${loc.verse}:${loc.word}`;
      const features = extractFeatures(row.FEATURES);

      if (!wordMap.has(wordKey)) {
        wordMap.set(wordKey, {
          chapterNo: loc.chapter,
          verseNo: loc.verse,
          wordNo: loc.word,
          arabicText: '',
          segments: [],
          pos: features.pos || row.TAG,
          lemma: features.lemma || '',
          root: features.root || '',
          features: [],
        });
      }

      const wordData = wordMap.get(wordKey)!;
      wordData.segments.push(row.FORM);
      wordData.arabicText += row.FORM;
      wordData.features.push(row.FEATURES);

      // Update root and lemma if found
      if (features.root && !wordData.root) wordData.root = features.root;
      if (features.lemma && !wordData.lemma) wordData.lemma = features.lemma;
      if (features.pos && !wordData.pos) wordData.pos = features.pos;
    }

    const words = Array.from(wordMap.values());
    console.log(`✅ Grouped into ${words.length.toLocaleString()} words\n`);

    // Get all ayahs from database
    console.log('🔍 Loading ayahs from database...');
    const allAyahs = await prisma.ayah.findMany({
      include: { surah: true },
      orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
    });
    console.log(`✅ Loaded ${allAyahs.length.toLocaleString()} ayahs\n`);

    // Create ayah map
    const ayahMap = new Map<string, number>();
    allAyahs.forEach((ayah) => {
      const key = `${ayah.surah.number}-${ayah.ayahNumber}`;
      ayahMap.set(key, ayah.id);
    });

    // Get or create word roots
    console.log('🌱 Processing word roots...');
    const uniqueRoots = new Set<string>();
    words.forEach((word) => {
      if (word.root && word.root.trim()) {
        uniqueRoots.add(word.root.trim());
      }
    });

    const rootsArray = Array.from(uniqueRoots);
    console.log(`   Found ${rootsArray.length.toLocaleString()} unique roots`);

    // Check existing roots
    const existingRoots = await prisma.wordRoot.findMany();
    const existingRootSet = new Set(existingRoots.map(r => r.root));

    // Create missing roots
    const newRoots = rootsArray.filter(r => !existingRootSet.has(r));
    if (newRoots.length > 0) {
      console.log(`   Creating ${newRoots.length} new roots...`);
      for (let i = 0; i < newRoots.length; i += BATCH_SIZE) {
        const batch = newRoots.slice(i, i + BATCH_SIZE);
        const rootData = batch.map((root) => ({
          root: root,
          rootSimple: root.replace(/\s+/g, ''),
          meaning: '',
          occurrences: 0,
        }));

        await prisma.wordRoot.createMany({
          data: rootData,
          skipDuplicates: true,
        });
      }
    }

    // Load all roots for mapping
    const allRoots = await prisma.wordRoot.findMany();
    const rootMap = new Map(allRoots.map((r) => [r.root, r.id]));
    console.log(`✅ Total roots in database: ${allRoots.length.toLocaleString()}\n`);

    // Import words with morphology
    console.log('📝 Importing words with morphology...');
    let importedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
      const batch = words.slice(i, i + BATCH_SIZE);

      for (const word of batch) {
        try {
          const ayahKey = `${word.chapterNo}-${word.verseNo}`;
          const ayahId = ayahMap.get(ayahKey);

          if (!ayahId) {
            skippedCount++;
            continue;
          }

          const rootId = word.root ? rootMap.get(word.root.trim()) : null;

          // Create or update word
          const ayahWord = await prisma.ayahWord.upsert({
            where: {
              ayahId_position: {
                ayahId: ayahId,
                position: word.wordNo,
              },
            },
            create: {
              ayahId: ayahId,
              position: word.wordNo,
              textArabic: word.arabicText,
              textSimplified: word.arabicText.replace(/[\u064B-\u065F]/g, ''),
              transliteration: word.segments.join('-'),
              rootId: rootId,
            },
            update: {
              textArabic: word.arabicText,
              textSimplified: word.arabicText.replace(/[\u064B-\u065F]/g, ''),
              transliteration: word.segments.join('-'),
              rootId: rootId,
            },
          });

          // Create morphology
          await prisma.wordMorphology.upsert({
            where: { wordId: ayahWord.id },
            create: {
              wordId: ayahWord.id,
              stem: word.segments[0] || '',
              lemma: word.lemma,
              prefix: word.segments.length > 1 ? word.segments[0] : null,
              suffix: word.segments.length > 2 ? word.segments[word.segments.length - 1] : null,
              pattern: null,
              arabicPattern: null,
              englishPattern: null,
              aspects: JSON.stringify(word.features),
            },
            update: {
              stem: word.segments[0] || '',
              lemma: word.lemma,
              prefix: word.segments.length > 1 ? word.segments[0] : null,
              suffix: word.segments.length > 2 ? word.segments[word.segments.length - 1] : null,
              aspects: JSON.stringify(word.features),
            },
          });

          // Create grammar
          await prisma.wordGrammar.upsert({
            where: { wordId: ayahWord.id },
            create: {
              wordId: ayahWord.id,
              partOfSpeech: word.pos,
              root: word.root || null,
            },
            update: {
              partOfSpeech: word.pos,
              root: word.root || null,
            },
          });

          importedCount++;
        } catch (error) {
          skippedCount++;
        }
      }

      console.log(`   📝 Processed ${Math.min(i + BATCH_SIZE, words.length)}/${words.length} words (Imported: ${importedCount}, Skipped: ${skippedCount})`);
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

    console.log('🎉 Morphology import completed successfully!\n');
    console.log('Summary:');
    console.log(`- Morpheme entries: ${rows.length.toLocaleString()}`);
    console.log(`- Words created: ${importedCount.toLocaleString()}`);
    console.log(`- Words skipped: ${skippedCount.toLocaleString()}`);
    console.log(`- Unique roots: ${allRoots.length.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error during morphology import:', error);
    throw error;
  }
}

importMorphology()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
