/**
 * Populate AyahWord table with actual Arabic text from Ayah table
 *
 * The morphology CSV uses Buckwalter transliteration, but we have
 * the actual Arabic text in the Ayah table. This script extracts
 * words from each ayah and updates the AyahWord records.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateArabicText() {
  console.log('📝 Populating Arabic text for corpus words...\n');

  // Get all ayahs with their Arabic text
  const ayahs = await prisma.ayah.findMany({
    include: {
      surah: true,
    },
    orderBy: [
      { surah: { number: 'asc' } },
      { ayahNumber: 'asc' },
    ],
  });

  console.log(`Found ${ayahs.length} ayahs\n`);

  let updatedCount = 0;
  let errorCount = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < ayahs.length; i++) {
    const ayah = ayahs[i];

    // Split the Arabic text into words
    const arabicWords = ayah.textArabic
      .trim()
      .split(/\s+/) // Split by whitespace
      .filter((word) => word.length > 0); // Remove empty strings

    try {
      // Update each word in the database
      for (let position = 1; position <= arabicWords.length; position++) {
        const arabicWord = arabicWords[position - 1];

        // Find the word record
        const wordRecord = await prisma.ayahWord.findUnique({
          where: {
            ayahId_position: {
              ayahId: ayah.id,
              position: position,
            },
          },
        });

        if (wordRecord) {
          // Update with actual Arabic text
          await prisma.ayahWord.update({
            where: { id: wordRecord.id },
            data: {
              textArabic: arabicWord,
              textSimplified: arabicWord.replace(/[ًٌٍَُِّْ]/g, ''), // Remove diacritics
            },
          });
          updatedCount++;
        }
      }

      if ((i + 1) % BATCH_SIZE === 0) {
        console.log(`   Processed ${i + 1} / ${ayahs.length} ayahs (${updatedCount} words updated)...`);
      }
    } catch (error) {
      console.error(`❌ Error processing Surah ${ayah.surah.number}:${ayah.ayahNumber}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Arabic text population complete!`);
  console.log(`   Ayahs processed: ${ayahs.length}`);
  console.log(`   Words updated: ${updatedCount.toLocaleString()}`);
  console.log(`   Errors: ${errorCount}`);

  await prisma.$disconnect();
}

populateArabicText()
  .then(() => {
    console.log('\n🎉 Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
