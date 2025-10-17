/**
 * Fortification of the Muslim (Hisnul Muslim) - Dua Extractor
 * Simple JavaScript version
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { PDFParse, VerbosityLevel } = require('pdf-parse');

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('FORTIFICATION OF THE MUSLIM - DUA EXTRACTOR');
  console.log('='.repeat(70) + '\n');

  // Find PDF
  console.log('🔍 Searching for PDF file...');
  const searchPattern = path.join(process.cwd(), 'data/duas-pdfs/Fortification*.pdf');
  const files = await glob(searchPattern);

  if (files.length === 0) {
    console.log('❌ Error: PDF not found');
    return;
  }

  const pdfPath = files[0];
  console.log('   ✅ Found:', path.basename(pdfPath), '\n');

  console.log('📄 Reading PDF...');
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({
    data: dataBuffer,
    verbosity: VerbosityLevel.ERRORS
  });

  const textResult = await parser.getText();
  const info = await parser.getInfo();
  const text = textResult.text;

  console.log(`   Total pages: ${info.numPages || 'unknown'}`);
  console.log(`   Extracted ${text.length} characters\n`);

  // Extract duas from text
  console.log('🔍 Parsing duas...\n');

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  const duas = [];
  let currentCategory = 'General';
  let duaNumber = 1;

  // Simple pattern: Look for Arabic text followed by English
  const arabicPattern = /[\u0600-\u06FF]/;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if line contains Arabic
    if (arabicPattern.test(line) && line.length > 20) {
      // Next line might be English translation
      if (!arabicPattern.test(nextLine) && nextLine.length > 20) {
        duas.push({
          number: duaNumber,
          category: currentCategory,
          title: `${currentCategory} Dua #${duaNumber}`,
          titleArabic: null,
          textArabic: line,
          textEnglish: nextLine,
          transliteration: null,
          reference: null,
          tags: `${currentCategory},Daily Duas,Hisnul Muslim`,
          occasion: currentCategory,
          benefits: null
        });

        duaNumber++;

        if (duaNumber % 10 === 0) {
          console.log(`   Extracted ${duaNumber} duas...`);
        }

        i++; // Skip next line since we used it
      }
    }
  }

  console.log(`   ✅ Total duas extracted: ${duas.length}\n`);

  // Group by category
  const categories = {};
  duas.forEach(dua => {
    if (!categories[dua.category]) {
      categories[dua.category] = [];
    }
    categories[dua.category].push(dua);
  });

  console.log('📦 Formatting for Prisma...');
  console.log(`   Categories: ${Object.keys(categories).length}`);

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
  console.log('\n' + '='.repeat(70) + '\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
