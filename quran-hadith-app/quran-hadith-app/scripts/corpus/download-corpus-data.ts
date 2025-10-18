// scripts/corpus/download-corpus-data.ts
// Downloads Quranic Arabic Corpus XML data
import fs from 'fs';
import path from 'path';

// Use GitHub raw content for reliable downloads
const CORPUS_XML_URL = 'https://raw.githubusercontent.com/quran/quran-morphology/master/quranic-corpus-morphology.xml';
const DATA_DIR = path.join(process.cwd(), 'data', 'corpus', 'morphology');

/**
 * Download the complete Quranic Morphology XML file
 * Source: https://github.com/quran/quran-morphology
 */
async function downloadCorpusData() {
  console.log('📥 Downloading Quranic Arabic Corpus data...\n');
  console.log('ℹ️  Source: GitHub - quran/quran-morphology repository\n');

  // Ensure directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`✅ Created directory: ${DATA_DIR}`);
  }

  try {
    console.log(`🌐 Fetching from GitHub repository...`);
    console.log(`   URL: ${CORPUS_XML_URL}\n`);

    const response = await fetch(CORPUS_XML_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();

    // Verify we got XML, not HTML
    if (!xmlData.trim().startsWith('<?xml') && !xmlData.trim().startsWith('<quran')) {
      throw new Error('Downloaded file is not valid XML. Please check the URL.');
    }

    const filePath = path.join(DATA_DIR, 'quran-morphology.xml');
    fs.writeFileSync(filePath, xmlData, 'utf-8');

    const fileSizeMB = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Downloaded ${fileSizeMB} MB to: ${filePath}`);
    console.log('\n✨ Download complete!\n');

    return filePath;
  } catch (error) {
    console.error('❌ Error downloading corpus data:', error);
    console.error('\n💡 Alternative: You can manually download from:');
    console.error('   https://github.com/quran/quran-morphology');
    console.error('   and save as: data/corpus/morphology/quran-morphology.xml\n');
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  downloadCorpusData()
    .then(() => {
      console.log('🎉 Success! Corpus data is ready for import.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error.message);
      process.exit(1);
    });
}

export { downloadCorpusData, DATA_DIR };
