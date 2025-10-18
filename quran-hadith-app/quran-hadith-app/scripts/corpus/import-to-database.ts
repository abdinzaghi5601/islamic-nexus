// scripts/corpus/import-to-database.ts
// Import parsed corpus data into PostgreSQL database
import { PrismaClient } from '@prisma/client';
import { parseMorphologyXML, ParsedAyah, ParsedWord } from './parse-morphology';

const prisma = new PrismaClient();

interface ImportStats {
  words: number;
  roots: number;
  grammar: number;
  morphology: number;
  skipped: number;
  errors: number;
}

/**
 * Import corpus data into database
 */
async function importCorpusData(options: {
  startSurah?: number;
  endSurah?: number;
  clearExisting?: boolean;
} = {}) {
  const { startSurah = 1, endSurah = 114, clearExisting = false } = options;

  console.log('🚀 Starting Corpus Data Import\n');
  console.log(`📖 Range: Surah ${startSurah} to ${endSurah}`);
  console.log(`🗑️  Clear existing: ${clearExisting ? 'Yes' : 'No'}\n`);

  const stats: ImportStats = {
    words: 0,
    roots: 0,
    grammar: 0,
    morphology: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    // Step 1: Clear existing data if requested
    if (clearExisting) {
      console.log('🗑️  Clearing existing corpus data...');
      await prisma.$transaction([
        prisma.wordMorphology.deleteMany(),
        prisma.wordGrammar.deleteMany(),
        prisma.ayahWord.deleteMany(),
        prisma.wordRoot.deleteMany(),
      ]);
      console.log('✅ Existing data cleared\n');
    }

    // Step 2: Parse XML data
    console.log('📖 Parsing morphology XML...');
    const allAyahs = await parseMorphologyXML();

    // Filter by surah range
    const ayahsToImport = allAyahs.filter(
      a => a.surahNumber >= startSurah && a.surahNumber <= endSurah
    );

    console.log(`✅ Loaded ${ayahsToImport.length} ayahs\n`);

    // Step 3: Import data
    console.log('💾 Importing to database...\n');

    let currentSurah = 0;

    for (const ayah of ayahsToImport) {
      if (ayah.surahNumber !== currentSurah) {
        currentSurah = ayah.surahNumber;
        console.log(`📝 Processing Surah ${currentSurah}...`);
      }

      try {
        await importAyah(ayah, stats);
      } catch (error) {
        console.error(`   ❌ Error in Surah ${ayah.surahNumber}:${ayah.ayahNumber}:`, error);
        stats.errors++;
      }
    }

    // Step 4: Print summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ IMPORT COMPLETE!\n');
    console.log('📊 Statistics:');
    console.log(`   Words imported:      ${stats.words.toLocaleString()}`);
    console.log(`   Unique roots:        ${stats.roots.toLocaleString()}`);
    console.log(`   Grammar entries:     ${stats.grammar.toLocaleString()}`);
    console.log(`   Morphology entries:  ${stats.morphology.toLocaleString()}`);
    console.log(`   Skipped:             ${stats.skipped.toLocaleString()}`);
    console.log(`   Errors:              ${stats.errors.toLocaleString()}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Import a single ayah's words into database
 */
async function importAyah(ayah: ParsedAyah, stats: ImportStats) {
  // Get or verify ayah exists in database
  const dbAyah = await prisma.ayah.findFirst({
    where: {
      surah: { number: ayah.surahNumber },
      ayahNumber: ayah.ayahNumber,
    },
    select: { id: true },
  });

  if (!dbAyah) {
    console.warn(`   ⚠️  Ayah ${ayah.surahNumber}:${ayah.ayahNumber} not found in database`);
    stats.skipped += ayah.words.length;
    return;
  }

  // Import each word
  for (const word of ayah.words) {
    try {
      await importWord(dbAyah.id, word, stats);
    } catch (error) {
      console.error(`     ❌ Error importing word at position ${word.position}:`, error);
      stats.errors++;
    }
  }
}

/**
 * Import a single word with its grammar and morphology
 */
async function importWord(ayahId: number, word: ParsedWord, stats: ImportStats) {
  // Step 1: Get or create root
  let rootId: number | null = null;

  if (word.root) {
    const root = await prisma.wordRoot.upsert({
      where: { root: word.root },
      create: {
        root: word.root,
        rootSimple: word.root.replace(/\s/g, ''),
        meaning: '', // Will be populated later from dictionary
        occurrences: 1,
      },
      update: {
        occurrences: { increment: 1 },
      },
    });
    rootId = root.id;
    if (root.occurrences === 1) stats.roots++;
  }

  // Step 2: Create word entry
  const dbWord = await prisma.ayahWord.create({
    data: {
      ayahId,
      position: word.position,
      textArabic: word.textArabic,
      textSimplified: word.textArabic.normalize('NFD').replace(/[\u064B-\u065F]/g, ''),
      rootId,
    },
  });
  stats.words++;

  // Step 3: Create grammar entry
  if (word.partOfSpeech || word.features) {
    await prisma.wordGrammar.create({
      data: {
        wordId: dbWord.id,
        partOfSpeech: word.partOfSpeech || 'Unknown',
        root: word.root || null,
        form: word.features?.form || null,
        mood: word.features?.mood || null,
        case_: word.features?.case || null,
        number: word.features?.number || null,
        gender: word.features?.gender || null,
        person: word.features?.person || null,
        tense: word.features?.tense || null,
      },
    });
    stats.grammar++;
  }

  // Step 4: Create morphology entry
  if (word.lemma || word.segments.length > 0) {
    const stem = word.segments.find(s => s.tag?.includes('STEM'));

    await prisma.wordMorphology.create({
      data: {
        wordId: dbWord.id,
        stem: stem?.form || word.textArabic,
        lemma: word.lemma || word.textArabic,
        prefix: word.segments.find(s => s.tag?.includes('PREFIX'))?.form || null,
        suffix: word.segments.find(s => s.tag?.includes('SUFFIX'))?.form || null,
        pattern: word.features?.form ? `Form ${word.features.form}` : null,
      },
    });
    stats.morphology++;
  }
}

// Run if executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const startSurah = args[0] ? parseInt(args[0]) : 1;
  const endSurah = args[1] ? parseInt(args[1]) : 114;
  const clearExisting = args.includes('--clear');

  importCorpusData({ startSurah, endSurah, clearExisting })
    .then(() => {
      console.log('🎉 Success! Corpus data has been imported.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

export { importCorpusData };
