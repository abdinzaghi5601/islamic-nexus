// scripts/corpus/index.ts
// Master script for corpus data management
import { downloadCorpusData } from './download-corpus-data';
import { parseMorphologyXML } from './parse-morphology';
import { importCorpusData } from './import-to-database';

/**
 * Run complete corpus import pipeline
 */
async function runFullImport(options: {
  startSurah?: number;
  endSurah?: number;
  clearExisting?: boolean;
  skipDownload?: boolean;
} = {}) {
  const {
    startSurah = 1,
    endSurah = 114,
    clearExisting = false,
    skipDownload = false,
  } = options;

  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Quranic Arabic Corpus Importer v1.0     ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    // Step 1: Download (if needed)
    if (!skipDownload) {
      console.log('📥 STEP 1: Downloading corpus data\n');
      await downloadCorpusData();
      console.log('');
    } else {
      console.log('⏭️  STEP 1: Skipped (using existing data)\n');
    }

    // Step 2: Parse (verification)
    console.log('📖 STEP 2: Parsing XML data\n');
    const ayahs = await parseMorphologyXML();
    console.log(`   ✅ Verified ${ayahs.length} ayahs\n`);

    // Step 3: Import to database
    console.log('💾 STEP 3: Importing to database\n');
    await importCorpusData({ startSurah, endSurah, clearExisting });

    console.log('\n🎊 ALL STEPS COMPLETED SUCCESSFULLY! 🎊\n');
    console.log('Next steps:');
    console.log('  1. Navigate to http://localhost:3000/analytics');
    console.log('  2. Click the "Corpus Analysis 🌱" tab');
    console.log('  3. Enjoy beautiful linguistic statistics!\n');

  } catch (error) {
    console.error('\n❌ IMPORT FAILED:', error);
    throw error;
  }
}

// Command-line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    startSurah: 1,
    endSurah: 114,
    clearExisting: false,
    skipDownload: false,
  };

  // Parse command-line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--start' && args[i + 1]) {
      options.startSurah = parseInt(args[i + 1]);
      i++;
    } else if (arg === '--end' && args[i + 1]) {
      options.endSurah = parseInt(args[i + 1]);
      i++;
    } else if (arg === '--clear') {
      options.clearExisting = true;
    } else if (arg === '--skip-download') {
      options.skipDownload = true;
    } else if (arg === '--help') {
      console.log(`
Quranic Arabic Corpus Importer

Usage: npm run corpus:import [options]

Options:
  --start <number>      Start from surah number (default: 1)
  --end <number>        End at surah number (default: 114)
  --clear               Clear existing corpus data before import
  --skip-download       Skip download step (use existing XML file)
  --help                Show this help message

Examples:
  npm run corpus:import                    # Import all 114 surahs
  npm run corpus:import -- --start 1 --end 10   # Import first 10 surahs
  npm run corpus:import -- --clear         # Clear and reimport all
  npm run corpus:import -- --skip-download # Use existing XML file
      `);
      process.exit(0);
    }
  }

  console.log('Starting import with options:', options, '\n');

  runFullImport(options)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { runFullImport };
