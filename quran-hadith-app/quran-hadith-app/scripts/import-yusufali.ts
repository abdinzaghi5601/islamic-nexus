/**
 * Import Yusuf Ali Translation into Database
 *
 * This script imports the Yusuf Ali translation from CSV into the database
 * and creates analytics data for the dashboard.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

const prisma = new PrismaClient();

interface CSVRow {
  Surah: string;
  Ayah: string;
  Text: string;
}

interface ImportStats {
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
}

async function readCSV(filePath: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function getOrCreateTranslator() {
  console.log('📝 Checking for Yusuf Ali translator...');

  let translator = await prisma.translator.findFirst({
    where: { name: 'Abdullah Yusuf Ali' }
  });

  if (!translator) {
    console.log('✅ Creating Yusuf Ali translator entry...');
    translator = await prisma.translator.create({
      data: {
        name: 'Abdullah Yusuf Ali',
        language: 'English',
        description: 'Abdullah Yusuf Ali (1872-1953) was an Indian-British Islamic scholar who translated the Quran into English. His translation is one of the most widely known English translations of the Quran.'
      }
    });
  } else {
    console.log('✅ Yusuf Ali translator already exists');
  }

  return translator;
}

async function importTranslations(data: CSVRow[], translatorId: number): Promise<ImportStats> {
  const stats: ImportStats = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    skipped: 0
  };

  console.log(`\n📊 Starting import of ${data.length} translations...`);

  for (const row of data) {
    stats.totalProcessed++;

    try {
      const surahNum = parseInt(row.Surah);
      const ayahNum = parseInt(row.Ayah);

      // Find the ayah
      const ayah = await prisma.ayah.findFirst({
        where: {
          surah: { number: surahNum },
          ayahNumber: ayahNum
        }
      });

      if (!ayah) {
        console.log(`⚠️  Ayah not found: Surah ${surahNum}, Ayah ${ayahNum}`);
        stats.skipped++;
        continue;
      }

      // Check if translation already exists
      const existing = await prisma.translation.findUnique({
        where: {
          ayahId_translatorId: {
            ayahId: ayah.id,
            translatorId: translatorId
          }
        }
      });

      if (existing) {
        // Update existing translation
        await prisma.translation.update({
          where: { id: existing.id },
          data: { text: row.Text }
        });
        stats.successful++;
      } else {
        // Create new translation
        await prisma.translation.create({
          data: {
            ayahId: ayah.id,
            translatorId: translatorId,
            text: row.Text
          }
        });
        stats.successful++;
      }

      // Progress indicator
      if (stats.totalProcessed % 100 === 0) {
        console.log(`  Progress: ${stats.totalProcessed}/${data.length} (${Math.round(stats.totalProcessed / data.length * 100)}%)`);
      }

    } catch (error) {
      console.error(`❌ Error processing Surah ${row.Surah}, Ayah ${row.Ayah}:`, error);
      stats.failed++;
    }
  }

  return stats;
}

async function generateAnalytics() {
  console.log('\n📊 Generating analytics data...');

  try {
    // Count translations
    const translationCount = await prisma.translation.count();
    console.log(`  Total translations in database: ${translationCount}`);

    // Count ayahs with translations
    const ayahsWithTranslations = await prisma.ayah.count({
      where: {
        translations: {
          some: {}
        }
      }
    });
    console.log(`  Ayahs with translations: ${ayahsWithTranslations}`);

    // Get translator stats
    const translators = await prisma.translator.findMany({
      include: {
        _count: {
          select: { translations: true }
        }
      }
    });

    console.log('\n  Translators:');
    for (const translator of translators) {
      console.log(`    - ${translator.name}: ${translator._count.translations} translations`);
    }

  } catch (error) {
    console.error('❌ Error generating analytics:', error);
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('YUSUF ALI TRANSLATION IMPORT');
  console.log('='.repeat(60));
  console.log();

  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '../en.yusufali.csv');
    console.log(`📂 Reading CSV from: ${csvPath}`);
    const data = await readCSV(csvPath);
    console.log(`✅ Loaded ${data.length} rows from CSV`);

    // Get or create translator
    const translator = await getOrCreateTranslator();
    console.log(`✅ Translator ID: ${translator.id}`);

    // Import translations
    const stats = await importTranslations(data, translator.id);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Processed: ${stats.totalProcessed}`);
    console.log(`Successful:      ${stats.successful}`);
    console.log(`Failed:          ${stats.failed}`);
    console.log(`Skipped:         ${stats.skipped}`);
    console.log('='.repeat(60));

    // Generate analytics
    await generateAnalytics();

    console.log('\n✅ Import completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
