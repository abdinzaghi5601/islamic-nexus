/**
 * Import Quran Corpus from CSV (QURAN-NLP Dataset)
 *
 * Imports morphological data from the existing quran_morphology.csv file
 * into the database tables for corpus analytics.
 *
 * Data Source: data/quran-nlp/data/quran/corpus/quran_morphology.csv
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

const MORPHOLOGY_FILE = path.join(
  process.cwd(),
  'data',
  'quran-nlp',
  'data',
  'quran',
  'corpus',
  'quran_morphology.csv'
);

const DICTIONARY_FILE = path.join(
  process.cwd(),
  'data',
  'quran-nlp',
  'data',
  'quran',
  'corpus',
  'quran_dictionary.csv'
);

interface MorphologyRow {
  '': string; // index
  LOCATION: string; // (surah:ayah:word:segment)
  FORM: string; // word form
  TAG: string; // grammatical tag
  FEATURES: string; // pipe-separated features
}

interface DictionaryRow {
  location: string;
  arabic_word: string;
  transliteration: string;
  translation: string;
}

interface ParsedLocation {
  surah: number;
  ayah: number;
  word: number;
  segment: number;
}

interface WordData {
  location: ParsedLocation;
  arabic: string;
  transliteration: string;
  translation: string;
  segments: MorphologyRow[];
  root?: string;
  lemma?: string;
  pos?: string;
  features: Map<string, string>;
}

function parseLocation(location: string): ParsedLocation | null {
  // Parse location format: (1:1:1:1) = (surah:ayah:word:segment)
  const match = location.match(/\((\d+):(\d+):(\d+):(\d+)\)/);
  if (!match) return null;

  return {
    surah: parseInt(match[1]),
    ayah: parseInt(match[2]),
    word: parseInt(match[3]),
    segment: parseInt(match[4]),
  };
}

function parseFeatures(featuresStr: string): {
  features: Map<string, string>;
  root?: string;
  lemma?: string;
  pos?: string;
} {
  const features = new Map<string, string>();
  let root: string | undefined;
  let lemma: string | undefined;
  let pos: string | undefined;

  const parts = featuresStr.split('|');
  for (const part of parts) {
    if (part.startsWith('ROOT:')) {
      root = part.substring(5);
      features.set('root', root);
    } else if (part.startsWith('LEM:')) {
      lemma = part.substring(4);
      features.set('lemma', lemma);
    } else if (part.startsWith('POS:')) {
      pos = part.substring(4);
      features.set('pos', pos);
    } else if (part.includes(':')) {
      const [key, value] = part.split(':');
      features.set(key.toLowerCase(), value);
    } else {
      // Single value features like STEM, PREFIX, SUFFIX
      features.set(part.toLowerCase(), 'true');
    }
  }

  return { features, root, lemma, pos };
}

async function importFromCSV() {
  console.log('📖 Starting Corpus Import from CSV files...\n');

  // Check if files exist
  if (!fs.existsSync(MORPHOLOGY_FILE)) {
    console.error(`❌ Morphology file not found: ${MORPHOLOGY_FILE}`);
    process.exit(1);
  }

  if (!fs.existsSync(DICTIONARY_FILE)) {
    console.error(`❌ Dictionary file not found: ${DICTIONARY_FILE}`);
    process.exit(1);
  }

  console.log('📂 Reading morphology data...');
  const morphologyContent = fs.readFileSync(MORPHOLOGY_FILE, 'utf-8');
  const morphologyResult = Papa.parse<MorphologyRow>(morphologyContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log('📂 Reading dictionary data...');
  const dictionaryContent = fs.readFileSync(DICTIONARY_FILE, 'utf-8');
  const dictionaryResult = Papa.parse<DictionaryRow>(dictionaryContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`✅ Loaded ${morphologyResult.data.length.toLocaleString()} morphology entries`);
  console.log(`✅ Loaded ${dictionaryResult.data.length.toLocaleString()} dictionary entries\n`);

  // Build dictionary map
  const dictMap = new Map<string, DictionaryRow>();
  dictionaryResult.data.forEach((row) => {
    if (row.location) {
      const loc = parseLocation(row.location);
      if (loc) {
        const key = `${loc.surah}:${loc.ayah}:${loc.word}`;
        dictMap.set(key, row);
      }
    }
  });

  // Group morphology entries by word
  const wordMap = new Map<string, MorphologyRow[]>();
  morphologyResult.data.forEach((row) => {
    const loc = parseLocation(row.LOCATION);
    if (loc) {
      const key = `${loc.surah}:${loc.ayah}:${loc.word}`;
      if (!wordMap.has(key)) {
        wordMap.set(key, []);
      }
      wordMap.get(key)!.push(row);
    }
  });

  console.log(`📊 Found ${wordMap.size.toLocaleString()} unique words\n`);

  // Build ayah map without loading all data (more efficient)
  console.log('🔍 Building ayah lookup map...\n');

  // Process and import words
  console.log('🌱 Processing roots and importing words...\n');

  let wordsImported = 0;
  let rootsCreated = 0;
  const rootIdMap = new Map<string, number>();
  const ayahIdCache = new Map<string, number>();

  for (const [key, segments] of wordMap.entries()) {
    const [surah, ayah, wordNum] = key.split(':').map(Number);

    // Look up ayah ID (with caching)
    const cacheKey = `${surah}-${ayah}`;
    let ayahId = ayahIdCache.get(cacheKey);

    if (!ayahId) {
      const ayahRecord = await prisma.ayah.findFirst({
        where: {
          surah: { number: surah },
          ayahNumber: ayah,
        },
        select: { id: true },
      });

      if (!ayahRecord) {
        console.warn(`⚠️  Skipping word ${key} - ayah not found in database`);
        continue;
      }

      ayahId = ayahRecord.id;
      ayahIdCache.set(cacheKey, ayahId);
    }

    // Get dictionary entry for this word (may not exist for all words)
    const dictEntry = dictMap.get(key);

    // Extract features from all segments
    let root: string | undefined;
    let lemma: string | undefined;
    let pos: string | undefined;
    const allFeatures = new Map<string, string>();

    for (const segment of segments) {
      const parsed = parseFeatures(segment.FEATURES);
      if (parsed.root) root = parsed.root;
      if (parsed.lemma) lemma = parsed.lemma;
      if (parsed.pos) pos = parsed.pos;

      // Merge all features
      parsed.features.forEach((value, key) => {
        allFeatures.set(key, value);
      });
    }

    // Handle root
    let rootId: number | undefined;
    if (root) {
      if (!rootIdMap.has(root)) {
        // Create new root
        const newRoot = await prisma.wordRoot.upsert({
          where: { root },
          update: {
            occurrences: { increment: 1 },
          },
          create: {
            root,
            rootSimple: root.replace(/\s+/g, ''),
            meaning: '', // Will be populated later from dictionary
            occurrences: 1,
          },
        });
        rootIdMap.set(root, newRoot.id);
        rootsCreated++;
      } else {
        // Update occurrence count
        await prisma.wordRoot.update({
          where: { id: rootIdMap.get(root)! },
          data: { occurrences: { increment: 1 } },
        });
      }
      rootId = rootIdMap.get(root);
    }

    // Build word text from segments if no dictionary entry
    const wordArabic = dictEntry?.arabic_word || segments.map(s => s.FORM).join('');
    const wordTranslit = dictEntry?.transliteration || segments.map(s => s.FORM).join('');

    // Create AyahWord using compound unique constraint (ayahId, position)
    try {
      const word = await prisma.ayahWord.upsert({
        where: {
          ayahId_position: {
            ayahId,
            position: wordNum
          }
        },
        update: {
          textArabic: wordArabic,
          textSimplified: wordArabic.replace(/[ًٌٍَُِّْ]/g, ''),
          transliteration: wordTranslit,
          rootId,
        },
        create: {
          ayahId,
          position: wordNum,
          textArabic: wordArabic,
          textSimplified: wordArabic.replace(/[ًٌٍَُِّْ]/g, ''),
          transliteration: wordTranslit,
          rootId,
        },
      });

      const wordId = word.id;

      // Create WordGrammar
      await prisma.wordGrammar.upsert({
        where: { wordId },
        update: {},
        create: {
          wordId,
          partOfSpeech: pos || 'Unknown',
          form: allFeatures.get('form'),
          mood: allFeatures.get('mood'),
          case_: allFeatures.get('case'),
          number: allFeatures.get('num'),
          gender: allFeatures.get('gen'),
          person: allFeatures.get('per'),
          tense: allFeatures.get('asp'),
        },
      });

      // Create WordMorphology
      const stem = segments.find((s) => s.TAG === 'N' || s.TAG === 'V')?.FORM || '';
      const prefix = segments.find((s) => s.TAG.includes('PREFIX'))?.FORM;
      const suffix = segments.find((s) => s.TAG.includes('SUFFIX'))?.FORM;

      await prisma.wordMorphology.upsert({
        where: { wordId },
        update: {},
        create: {
          wordId,
          stem: stem,
          lemma: lemma || '',
          prefix: prefix,
          suffix: suffix,
          pattern: '',
          arabicPattern: '',
          englishPattern: '',
          aspects: Object.fromEntries(allFeatures),
        },
      });

      // Create WordTranslation (only if we have a dictionary entry)
      if (dictEntry?.translation) {
        await prisma.wordTranslation.upsert({
          where: {
            wordId_language: {
              wordId,
              language: 'en',
            },
          },
          update: {},
          create: {
            wordId,
            language: 'en',
            translation: dictEntry.translation,
          },
        });
      }

      wordsImported++;

      if (wordsImported % 1000 === 0) {
        console.log(`   Imported ${wordsImported.toLocaleString()} words...`);
      }
    } catch (error) {
      console.error(`❌ Error importing word ${key}:`, error);
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Words imported: ${wordsImported.toLocaleString()}`);
  console.log(`   Roots created: ${rootsCreated.toLocaleString()}`);

  await prisma.$disconnect();
}

// Run the import
importFromCSV()
  .then(() => {
    console.log('\n🎉 Success! Corpus data is ready.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
