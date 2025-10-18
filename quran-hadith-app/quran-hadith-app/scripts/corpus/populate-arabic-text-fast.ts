/**
 * Populate AyahWord table with actual Arabic text from Ayah table (FAST VERSION)
 *
 * Uses batch updates for better performance
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BATCH_SIZE = 500;

async function populateArabicTextFast() {
  console.log('📝 Populating Arabic text for corpus words (Fast Version)...\n');

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
  let updates: any[] = [];

  for (let i = 0; i < ayahs.length; i++) {
    const ayah = ayahs[i];

    // Split the Arabic text into words
    const arabicWords = ayah.textArabic
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Prepare updates for this ayah's words
    for (let position = 1; position <= arabicWords.length; position++) {
      const arabicWord = arabicWords[position - 1];

      updates.push({
        ayahId: ayah.id,
        position: position,
        textArabic: arabicWord,
        textSimplified: arabicWord.replace(/[ًٌٍَُِّْ]/g, ''),
      });

      // Execute batch when we reach BATCH_SIZE
      if (updates.length >= BATCH_SIZE) {
        await executeBatch(updates);
        updatedCount += updates.length;
        console.log(`   Updated ${updatedCount.toLocaleString()} words...`);
        updates = [];
      }
    }

    if ((i + 1) % 100 === 0) {
      console.log(`   Processed ${i + 1} / ${ayahs.length} ayahs...`);
    }
  }

  // Execute remaining updates
  if (updates.length > 0) {
    await executeBatch(updates);
    updatedCount += updates.length;
  }

  console.log(`\n✅ Arabic text population complete!`);
  console.log(`   Ayahs processed: ${ayahs.length}`);
  console.log(`   Words updated: ${updatedCount.toLocaleString()}`);

  await prisma.$disconnect();
}

async function executeBatch(updates: any[]) {
  // Use a transaction with multiple update statements
  await prisma.$transaction(
    updates.map((update) =>
      prisma.ayahWord.updateMany({
        where: {
          ayahId: update.ayahId,
          position: update.position,
        },
        data: {
          textArabic: update.textArabic,
          textSimplified: update.textSimplified,
        },
      })
    )
  );
}

populateArabicTextFast()
  .then(() => {
    console.log('\n🎉 Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
