// scripts/import-english-translation.ts
// Import English translation from CSV file into the Translation table

import fs from 'fs';
import path from 'path';
import prisma from '../src/lib/db/prisma';

const CSV_FILE_PATH = 'C:\\Users\\abdul\\Desktop\\English.csv';
const TRANSLATOR_NAME = 'Abdullah Yusuf Ali';
const TRANSLATOR_LANGUAGE = 'English';
const BATCH_SIZE = 100; // Process in batches for better performance

interface CSVRow {
  surahNumber: number;
  ayahNumber: number;
  text: string;
}

function parseCSVLine(line: string): CSVRow | null {
  // Split by pipe character
  const parts = line.split('|');

  if (parts.length < 3) {
    return null;
  }

  const surahNumber = parseInt(parts[0].trim());
  const ayahNumber = parseInt(parts[1].trim());

  // Extract text and clean up extra commas
  let text = parts[2].trim();

  // Remove trailing commas
  text = text.replace(/,+$/, '');

  // Handle quoted text (some verses have quotes with internal pipes)
  if (text.startsWith('"')) {
    text = text.substring(1);
    if (text.endsWith('"')) {
      text = text.substring(0, text.length - 1);
    }
  }

  return {
    surahNumber,
    ayahNumber,
    text: text.trim(),
  };
}

async function main() {
  console.log('🚀 Starting English translation import...\n');

  try {
    // Step 1: Create or get the translator
    console.log('📝 Step 1: Setting up translator...');

    let translator = await prisma.translator.findFirst({
      where: {
        name: TRANSLATOR_NAME,
        language: TRANSLATOR_LANGUAGE,
      },
    });

    if (!translator) {
      translator = await prisma.translator.create({
        data: {
          name: TRANSLATOR_NAME,
          language: TRANSLATOR_LANGUAGE,
          description: 'English translation by Abdullah Yusuf Ali, one of the most widely known English translations of the Quran.',
        },
      });
      console.log(`  ✓ Created translator: ${translator.name}`);
    } else {
      console.log(`  ✓ Using existing translator: ${translator.name} (ID: ${translator.id})`);
    }

    // Step 2: Read and parse CSV file
    console.log('\n📖 Step 2: Reading CSV file...');

    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    console.log(`  ✓ Found ${lines.length} lines in CSV`);

    // Step 3: Parse all rows
    console.log('\n🔄 Step 3: Parsing CSV data...');

    const rows: CSVRow[] = [];
    let parseErrors = 0;

    for (const line of lines) {
      const row = parseCSVLine(line);
      if (row) {
        rows.push(row);
      } else {
        parseErrors++;
      }
    }

    console.log(`  ✓ Successfully parsed ${rows.length} verses`);
    if (parseErrors > 0) {
      console.log(`  ⚠️  ${parseErrors} lines could not be parsed`);
    }

    // Step 4: Import translations in batches
    console.log('\n💾 Step 4: Importing translations to database...');
    console.log(`  Processing in batches of ${BATCH_SIZE}...`);

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

      console.log(`  Processing batch ${batchNumber}/${totalBatches}...`);

      for (const row of batch) {
        try {
          // Find the ayah
          const ayah = await prisma.ayah.findFirst({
            where: {
              surah: { number: row.surahNumber },
              ayahNumber: row.ayahNumber,
            },
          });

          if (!ayah) {
            console.warn(`    ⚠️  Ayah not found: ${row.surahNumber}:${row.ayahNumber}`);
            skipped++;
            continue;
          }

          // Upsert translation
          const translation = await prisma.translation.upsert({
            where: {
              ayahId_translatorId: {
                ayahId: ayah.id,
                translatorId: translator.id,
              },
            },
            update: {
              text: row.text,
            },
            create: {
              ayahId: ayah.id,
              translatorId: translator.id,
              text: row.text,
            },
          });

          if (translation.createdAt.getTime() === translation.updatedAt.getTime()) {
            imported++;
          } else {
            updated++;
          }
        } catch (error) {
          console.error(`    ❌ Error processing ${row.surahNumber}:${row.ayahNumber}:`, error);
          errors++;
        }
      }
    }

    console.log('\n✅ Import completed!');
    console.log('╔════════════════════════════════════════╗');
    console.log('║  Import Summary                        ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  Imported:  ${imported.toString().padEnd(28)}║`);
    console.log(`║  Updated:   ${updated.toString().padEnd(28)}║`);
    console.log(`║  Skipped:   ${skipped.toString().padEnd(28)}║`);
    console.log(`║  Errors:    ${errors.toString().padEnd(28)}║`);
    console.log(`║  Total:     ${rows.length.toString().padEnd(28)}║`);
    console.log('╚════════════════════════════════════════╝');

    // Step 5: Update search vectors
    console.log('\n🔍 Step 5: Updating full-text search vectors...');

    await prisma.$executeRaw`
      UPDATE translations
      SET search_vector = to_tsvector('english', text)
      WHERE translator_id = ${translator.id}
    `;

    console.log('  ✓ Search vectors updated successfully!');

    // Step 6: Verify import
    console.log('\n🔎 Step 6: Verifying import...');

    const totalTranslations = await prisma.translation.count({
      where: { translatorId: translator.id },
    });

    console.log(`  ✓ Total translations in database: ${totalTranslations}`);

    // Sample verification
    const sampleTranslation = await prisma.translation.findFirst({
      where: {
        translatorId: translator.id,
        ayah: {
          surah: { number: 1 },
          ayahNumber: 1,
        },
      },
      include: {
        ayah: {
          include: {
            surah: true,
          },
        },
      },
    });

    if (sampleTranslation) {
      console.log('\n📝 Sample translation (Surah 1, Ayah 1):');
      console.log(`  ${sampleTranslation.text}`);
    }

  } catch (error) {
    console.error('\n❌ Fatal error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
