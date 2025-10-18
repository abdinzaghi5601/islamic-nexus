/**
 * FAST Batch-Optimized Corpus Import from CSV
 *
 * Optimizations:
 * - Batch inserts (500 records at a time)
 * - Pre-load all ayah IDs in one query
 * - Transaction-based processing
 * - Bulk root creation
 * - Minimal database round-trips
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

const BATCH_SIZE = 100; // Smaller batches for remote database
const ROOT_BATCH_SIZE = 50; // Even smaller for upsert transactions

interface MorphologyRow {
  '': string;
  LOCATION: string;
  FORM: string;
  TAG: string;
  FEATURES: string;
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

function parseLocation(location: string): ParsedLocation | null {
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
  root?: string;
  lemma?: string;
  pos?: string;
  gender?: string;
  number?: string;
  case_?: string;
  person?: string;
  mood?: string;
  form?: string;
} {
  const result: any = {};
  const parts = featuresStr.split('|');

  for (const part of parts) {
    if (part.startsWith('ROOT:')) {
      result.root = part.substring(5);
    } else if (part.startsWith('LEM:')) {
      result.lemma = part.substring(4);
    } else if (part.startsWith('POS:')) {
      result.pos = part.substring(4);
    } else if (part.startsWith('GEN:')) {
      result.gender = part.substring(4);
    } else if (part.startsWith('NUM:')) {
      result.number = part.substring(4);
    } else if (part.startsWith('CASE:')) {
      result.case_ = part.substring(5);
    } else if (part.startsWith('PER:')) {
      result.person = part.substring(4);
    } else if (part.startsWith('MOOD:')) {
      result.mood = part.substring(5);
    } else if (part.startsWith('FORM:')) {
      result.form = part.substring(5);
    }
  }

  return result;
}

async function importFromCSVFast() {
  console.log('🚀 Starting FAST Batch-Optimized Corpus Import...\n');

  // Read CSV files
  console.log('📂 Reading CSV files...');
  const morphologyContent = fs.readFileSync(MORPHOLOGY_FILE, 'utf-8');
  const dictionaryContent = fs.readFileSync(DICTIONARY_FILE, 'utf-8');

  const morphologyResult = Papa.parse<MorphologyRow>(morphologyContent, {
    header: true,
    skipEmptyLines: true,
  });

  const dictionaryResult = Papa.parse<DictionaryRow>(dictionaryContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`✅ Loaded ${morphologyResult.data.length.toLocaleString()} morphology entries`);
  console.log(`✅ Loaded ${dictionaryResult.data.length.toLocaleString()} dictionary entries\n`);

  // Build dictionaries
  console.log('📊 Building lookup maps...');
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

  // Group morphology by word
  const wordMap = new Map<string, MorphologyRow[]>();
  morphologyResult.data.forEach((row) => {
    if (row.LOCATION) {
      const loc = parseLocation(row.LOCATION);
      if (loc) {
        const key = `${loc.surah}:${loc.ayah}:${loc.word}`;
        if (!wordMap.has(key)) {
          wordMap.set(key, []);
        }
        wordMap.get(key)!.push(row);
      }
    }
  });

  console.log(`✅ Found ${wordMap.size.toLocaleString()} unique words\n`);

  // Load all ayah IDs efficiently
  console.log('🔍 Loading ayah IDs from database...');
  const ayahsRaw = await prisma.ayah.findMany({
    select: {
      id: true,
      ayahNumber: true,
      surah: {
        select: {
          number: true,
        },
      },
    },
    orderBy: [
      { surahId: 'asc' },
      { ayahNumber: 'asc' },
    ],
  });

  const ayahMap = new Map<string, number>();
  ayahsRaw.forEach((a) => {
    ayahMap.set(`${a.surah.number}-${a.ayahNumber}`, a.id);
  });

  console.log(`✅ Loaded ${ayahsRaw.length.toLocaleString()} ayah IDs\n`);

  // Extract and create all roots first
  console.log('🌱 Processing roots...');
  const rootsSet = new Set<string>();
  for (const segments of wordMap.values()) {
    for (const segment of segments) {
      const features = parseFeatures(segment.FEATURES);
      if (features.root) {
        rootsSet.add(features.root);
      }
    }
  }

  console.log(`   Found ${rootsSet.size.toLocaleString()} unique roots`);

  // Batch insert roots
  const rootsArray = Array.from(rootsSet);
  const rootBatches = [];
  for (let i = 0; i < rootsArray.length; i += ROOT_BATCH_SIZE) {
    rootBatches.push(rootsArray.slice(i, i + ROOT_BATCH_SIZE));
  }

  console.log(`   Creating roots in ${rootBatches.length} batches of ${ROOT_BATCH_SIZE}...`);
  let rootsProcessed = 0;
  for (const batch of rootBatches) {
    await prisma.$transaction(
      batch.map((root) =>
        prisma.wordRoot.upsert({
          where: { root },
          update: {},
          create: {
            root,
            rootSimple: root.replace(/\s+/g, ''),
            meaning: '',
            occurrences: 0,
          },
        })
      )
    );
    rootsProcessed += batch.length;
    console.log(`   Processed ${rootsProcessed} / ${rootsArray.length} roots...`);
  }

  // Load all root IDs
  const allRoots = await prisma.wordRoot.findMany({
    select: { id: true, root: true },
  });
  const rootIdMap = new Map(allRoots.map((r) => [r.root, r.id]));
  console.log(`✅ Loaded ${allRoots.length.toLocaleString()} root IDs\n`);

  // Prepare all word data for batch insert
  console.log('📝 Preparing word data for batch insert...');
  const wordRecords: any[] = [];
  const grammarRecords: any[] = [];
  const morphologyRecords: any[] = [];
  const translationRecords: any[] = [];
  const rootOccurrences = new Map<number, number>();

  let skipped = 0;

  for (const [key, segments] of wordMap.entries()) {
    const [surah, ayah, wordNum] = key.split(':').map(Number);
    const ayahId = ayahMap.get(`${surah}-${ayah}`);

    if (!ayahId) {
      skipped++;
      continue;
    }

    // Get dictionary entry
    const dictEntry = dictMap.get(key);
    const wordArabic = dictEntry?.arabic_word || segments.map((s) => s.FORM).join('');
    const wordTranslit = dictEntry?.transliteration || segments.map((s) => s.FORM).join('');

    // Extract features from all segments
    let root: string | undefined;
    let lemma: string | undefined;
    let pos: string | undefined;
    let gender: string | undefined;
    let number: string | undefined;
    let case_: string | undefined;
    let person: string | undefined;
    let mood: string | undefined;
    let form: string | undefined;

    for (const segment of segments) {
      const features = parseFeatures(segment.FEATURES);
      if (features.root) root = features.root;
      if (features.lemma) lemma = features.lemma;
      if (features.pos) pos = features.pos;
      if (features.gender) gender = features.gender;
      if (features.number) number = features.number;
      if (features.case_) case_ = features.case_;
      if (features.person) person = features.person;
      if (features.mood) mood = features.mood;
      if (features.form) form = features.form;
    }

    const rootId = root ? rootIdMap.get(root) : undefined;
    if (rootId) {
      rootOccurrences.set(rootId, (rootOccurrences.get(rootId) || 0) + 1);
    }

    wordRecords.push({
      ayahId,
      position: wordNum,
      textArabic: wordArabic,
      textSimplified: wordArabic.replace(/[ًٌٍَُِّْ]/g, ''),
      transliteration: wordTranslit,
      rootId: rootId || null,
    });

    // Store grammar and morphology data (will link after words are created)
    grammarRecords.push({
      key: `${ayahId}-${wordNum}`,
      partOfSpeech: pos || 'Unknown',
      form,
      mood,
      case_,
      number,
      gender,
      person,
    });

    const stem = segments.find((s) => s.TAG === 'N' || s.TAG === 'V')?.FORM || '';
    const prefix = segments.find((s) => s.TAG.includes('PREFIX'))?.FORM;
    const suffix = segments.find((s) => s.TAG.includes('SUFFIX'))?.FORM;

    morphologyRecords.push({
      key: `${ayahId}-${wordNum}`,
      stem,
      lemma: lemma || '',
      prefix: prefix || null,
      suffix: suffix || null,
      pattern: '',
      arabicPattern: '',
      englishPattern: '',
    });

    if (dictEntry?.translation) {
      translationRecords.push({
        key: `${ayahId}-${wordNum}`,
        language: 'en',
        translation: dictEntry.translation,
      });
    }
  }

  console.log(`✅ Prepared ${wordRecords.length.toLocaleString()} words (skipped ${skipped})\n`);

  // Clear existing data
  console.log('🗑️  Clearing existing corpus data...');
  await prisma.wordTranslation.deleteMany({});
  await prisma.wordMorphology.deleteMany({});
  await prisma.wordGrammar.deleteMany({});
  await prisma.ayahWord.deleteMany({});
  console.log('✅ Cleared\n');

  // Batch insert words
  console.log('💾 Inserting words in batches...');
  let inserted = 0;
  for (let i = 0; i < wordRecords.length; i += BATCH_SIZE) {
    const batch = wordRecords.slice(i, i + BATCH_SIZE);
    await prisma.ayahWord.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
    if (inserted % 5000 === 0 || inserted === wordRecords.length) {
      console.log(`   Inserted ${inserted.toLocaleString()} / ${wordRecords.length.toLocaleString()} words...`);
    }
  }
  console.log(`✅ Inserted all ${inserted.toLocaleString()} words\n`);

  // Load word IDs for linking grammar/morphology
  console.log('🔗 Loading word IDs for linking...');
  const allWords = await prisma.ayahWord.findMany({
    select: { id: true, ayahId: true, position: true },
  });
  const wordIdMap = new Map(allWords.map((w) => [`${w.ayahId}-${w.position}`, w.id]));
  console.log(`✅ Loaded ${allWords.length.toLocaleString()} word IDs\n`);

  // Batch insert grammar
  console.log('💾 Inserting grammar data in batches...');
  const grammarData = grammarRecords
    .map((g) => {
      const wordId = wordIdMap.get(g.key);
      if (!wordId) return null;
      return {
        wordId,
        partOfSpeech: g.partOfSpeech,
        form: g.form,
        mood: g.mood,
        case_: g.case_,
        number: g.number,
        gender: g.gender,
        person: g.person,
      };
    })
    .filter((g) => g !== null);

  inserted = 0;
  for (let i = 0; i < grammarData.length; i += BATCH_SIZE) {
    const batch = grammarData.slice(i, i + BATCH_SIZE);
    await prisma.wordGrammar.createMany({
      data: batch as any,
      skipDuplicates: true,
    });
    inserted += batch.length;
    if (inserted % 5000 === 0 || inserted === grammarData.length) {
      console.log(`   Inserted ${inserted.toLocaleString()} / ${grammarData.length.toLocaleString()} grammar records...`);
    }
  }
  console.log(`✅ Inserted all ${grammarData.length.toLocaleString()} grammar records\n`);

  // Batch insert morphology
  console.log('💾 Inserting morphology data in batches...');
  const morphologyData = morphologyRecords
    .map((m) => {
      const wordId = wordIdMap.get(m.key);
      if (!wordId) return null;
      return {
        wordId,
        stem: m.stem,
        lemma: m.lemma,
        prefix: m.prefix,
        suffix: m.suffix,
        pattern: m.pattern,
        arabicPattern: m.arabicPattern,
        englishPattern: m.englishPattern,
        aspects: {},
      };
    })
    .filter((m) => m !== null);

  inserted = 0;
  for (let i = 0; i < morphologyData.length; i += BATCH_SIZE) {
    const batch = morphologyData.slice(i, i + BATCH_SIZE);
    await prisma.wordMorphology.createMany({
      data: batch as any,
      skipDuplicates: true,
    });
    inserted += batch.length;
    if (inserted % 5000 === 0 || inserted === morphologyData.length) {
      console.log(`   Inserted ${inserted.toLocaleString()} / ${morphologyData.length.toLocaleString()} morphology records...`);
    }
  }
  console.log(`✅ Inserted all ${morphologyData.length.toLocaleString()} morphology records\n`);

  // Batch insert translations
  console.log('💾 Inserting translations in batches...');
  const translationData = translationRecords
    .map((t) => {
      const wordId = wordIdMap.get(t.key);
      if (!wordId) return null;
      return {
        wordId,
        language: t.language,
        translation: t.translation,
      };
    })
    .filter((t) => t !== null);

  inserted = 0;
  for (let i = 0; i < translationData.length; i += BATCH_SIZE) {
    const batch = translationData.slice(i, i + BATCH_SIZE);
    await prisma.wordTranslation.createMany({
      data: batch as any,
      skipDuplicates: true,
    });
    inserted += batch.length;
    if (inserted % 5000 === 0 || inserted === translationData.length) {
      console.log(`   Inserted ${inserted.toLocaleString()} / ${translationData.length.toLocaleString()} translation records...`);
    }
  }
  console.log(`✅ Inserted all ${translationData.length.toLocaleString()} translation records\n`);

  // Update root occurrences
  console.log('📊 Updating root occurrence counts...');
  for (const [rootId, count] of rootOccurrences.entries()) {
    await prisma.wordRoot.update({
      where: { id: rootId },
      data: { occurrences: count },
    });
  }
  console.log(`✅ Updated ${rootOccurrences.size.toLocaleString()} root occurrence counts\n`);

  // Final statistics
  const finalStats = {
    words: await prisma.ayahWord.count(),
    roots: await prisma.wordRoot.count(),
    grammar: await prisma.wordGrammar.count(),
    morphology: await prisma.wordMorphology.count(),
    translations: await prisma.wordTranslation.count(),
  };

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     IMPORT COMPLETE - STATISTICS       ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`  Words imported:       ${finalStats.words.toLocaleString()}`);
  console.log(`  Unique roots:         ${finalStats.roots.toLocaleString()}`);
  console.log(`  Grammar records:      ${finalStats.grammar.toLocaleString()}`);
  console.log(`  Morphology records:   ${finalStats.morphology.toLocaleString()}`);
  console.log(`  Translations:         ${finalStats.translations.toLocaleString()}`);
  console.log('\n✨ Corpus data is ready for analytics!\n');

  await prisma.$disconnect();
}

// Run the import
importFromCSVFast()
  .then(() => {
    console.log('🎉 Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
