/**
 * Import Tafsir Data Script
 *
 * This script imports Tafsir (commentary) data from spa5k/tafsir_api CDN.
 *
 * Data Source: https://github.com/spa5k/tafsir_api
 *
 * Usage:
 *   npm run import:tafsir
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CDN configuration
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';

// Tafsir books to import (English only)
const TAFSIR_BOOKS = [
  {
    identifier: 'en-tafisr-ibn-kathir',
    name: 'Tafsir Ibn Kathir',
    authorName: 'Ismail ibn Kathir',
    language: 'English',
    description: 'Abridged English translation of the classical tafsir',
  },
  {
    identifier: 'en-tafsir-al-jalalayn',
    name: 'Tafsir al-Jalalayn',
    authorName: 'Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti',
    language: 'English',
    description: 'Concise classical tafsir by two Jalals',
  },
  {
    identifier: 'en-tafsir-maarif-ul-quran',
    name: 'Tafsir Maarif-ul-Quran',
    authorName: 'Mufti Muhammad Shafi',
    language: 'English',
    description: 'Comprehensive contemporary tafsir',
  },
];

// Fetch JSON data from CDN
async function fetchJSON(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return await response.json();
}

async function importTafsirData() {
  console.log('📚 Starting Tafsir data import from CDN...\n');

  try {
    let totalVerses = 0;
    let successfulBooks = 0;

    for (const tafsir of TAFSIR_BOOKS) {
      console.log(`\n📖 Importing ${tafsir.name}...`);

      try {

      // Step 1: Create or find Tafsir Book
      console.log('   1️⃣  Creating tafsir book entry...');
      let tafsirBook = await prisma.tafsirBook.findFirst({
        where: { name: tafsir.name },
      });

      if (!tafsirBook) {
        tafsirBook = await prisma.tafsirBook.create({
          data: {
            name: tafsir.name,
            authorName: tafsir.authorName,
            language: tafsir.language,
            description: tafsir.description,
          },
        });
      }
      console.log(`      ✅ Book entry created/found`);

      // Step 2: Get all ayahs from database
      console.log('   2️⃣  Fetching ayahs from database...');
      const allAyahs = await prisma.ayah.findMany({
        include: { surah: true },
        orderBy: { numberInQuran: 'asc' },
      });
      console.log(`      ✅ Found ${allAyahs.length} ayahs`);

      // Step 3: Import tafsir for each surah (1-114)
      console.log('   3️⃣  Importing tafsir verses...');
      let verseCount = 0;

      for (let surahNum = 1; surahNum <= 114; surahNum++) {
        const url = `${CDN_BASE}/${tafsir.identifier}/${surahNum}.json`;

        try {
          const tafsirData = await fetchJSON(url);

          if (tafsirData && tafsirData.ayahs) {
            const tafsirVerses = [];

            for (const tafsirAyah of tafsirData.ayahs) {
              // Find the corresponding ayah in database
              const ayah = allAyahs.find(
                a => a.surah.number === tafsirAyah.surah && a.ayahNumber === tafsirAyah.ayah
              );

              if (ayah) {
                tafsirVerses.push({
                  ayahId: ayah.id,
                  tafsirBookId: tafsirBook.id,
                  text: tafsirAyah.text,
                });
              }
            }

            // Batch insert tafsir verses for this surah
            if (tafsirVerses.length > 0) {
              await prisma.tafsirVerse.createMany({
                data: tafsirVerses,
                skipDuplicates: true,
              });
              verseCount += tafsirVerses.length;
            }

            if (surahNum % 10 === 0) {
              console.log(`      📝 Imported ${surahNum}/114 surahs (${verseCount} verses)`);
            }
          }
        } catch (error: any) {
          // Some surahs might not have tafsir, continue
          if (error.message.includes('404')) {
            console.log(`      ⚠️  Surah ${surahNum} not found, skipping...`);
          } else {
            throw error;
          }
        }
      }

      totalVerses += verseCount;
      successfulBooks++;
      console.log(`      ✅ Completed ${tafsir.name} (${verseCount} verses)`);

      } catch (bookError: any) {
        console.error(`      ❌ Failed to import ${tafsir.name}:`, bookError.message);
        console.log(`      ⏭️  Skipping to next tafsir book...`);
      }
    }

    console.log('\n🎉 Tafsir data import completed!\n');
    console.log('Summary:');
    console.log(`- Tafsir books attempted: ${TAFSIR_BOOKS.length}`);
    console.log(`- Tafsir books imported: ${successfulBooks}`);
    console.log(`- Total tafsir verses: ${totalVerses}`);
    console.log('\nYou can now view the data in MySQL Workbench or run: npm run db:studio');

  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

importTafsirData()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
