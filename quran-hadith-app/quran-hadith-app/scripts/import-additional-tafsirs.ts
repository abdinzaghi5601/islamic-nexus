/**
 * Import Additional Tafsir Data Script
 *
 * This script imports additional English Tafsir (commentary) data from spa5k/tafsir_api CDN
 * that were not imported in the original import-tafsir.ts script.
 *
 * Data Source: https://github.com/spa5k/tafsir_api
 *
 * Usage:
 *   npm run import:additional-tafsirs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CDN configuration
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';

// Additional English Tafsir books to import
const ADDITIONAL_TAFSIR_BOOKS = [
  {
    identifier: 'en-tafsir-ibn-abbas',
    name: 'Tanwîr al-Miqbâs min Tafsîr Ibn \'Abbâs',
    authorName: 'Abdullah Ibn Abbas',
    language: 'English',
    description: 'Classical tafsir attributed to Ibn Abbas, the Prophet\'s cousin',
  },
  {
    identifier: 'en-tafsir-asbab-al-nuzul-by-al-wahidi',
    name: 'Asbab Al-Nuzul by Al-Wahidi',
    authorName: 'Abu al-Hasan Ali ibn Ahmad al-Wahidi',
    language: 'English',
    description: 'Reasons and circumstances of revelation for Quranic verses',
  },
  {
    identifier: 'en-tafsir-al-tustari',
    name: 'Tafsir al-Tustari',
    authorName: 'Sahl ibn Abdullah al-Tustari',
    language: 'English',
    description: 'Early Sufi commentary on the Quran',
  },
  {
    identifier: 'en-tafsir-kashani',
    name: 'Kashani Tafsir',
    authorName: 'Abd al-Razzaq Kashani',
    language: 'English',
    description: 'Sufi interpretation of the Quran',
  },
  {
    identifier: 'en-tafsir-al-qushayri',
    name: 'Al Qushairi Tafsir',
    authorName: 'Abu al-Qasim al-Qushayri',
    language: 'English',
    description: 'Sufi commentary on the Quran',
  },
  {
    identifier: 'en-tafsir-kashf-al-asrar',
    name: 'Kashf Al-Asrar Tafsir',
    authorName: 'Rashid al-Din Maybudi',
    language: 'English',
    description: 'Unveiling of the Mysteries - Persian Sufi tafsir',
  },
  {
    identifier: 'en-tazkir-ul-quran',
    name: 'Tazkirul Quran',
    authorName: 'Various Scholars',
    language: 'English',
    description: 'Remembrance and commentary on the Quran',
  },
  {
    identifier: 'en-tafsir-al-saddi',
    name: 'Tafsir al-Saddi',
    authorName: 'Ismail ibn Abd al-Rahman al-Suddi',
    language: 'English',
    description: 'Early classical tafsir',
  },
  {
    identifier: 'en-tafsir-al-wahidi',
    name: 'Tafsir al-Wahidi',
    authorName: 'Abu al-Hasan Ali ibn Ahmad al-Wahidi',
    language: 'English',
    description: 'Comprehensive classical tafsir',
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

async function importAdditionalTafsirData() {
  console.log('📚 Starting Additional Tafsir data import from CDN...\n');

  try {
    let totalVerses = 0;
    let successfulBooks = 0;
    let skippedBooks = 0;

    for (const tafsir of ADDITIONAL_TAFSIR_BOOKS) {
      console.log(`\n📖 Importing ${tafsir.name}...`);

      try {
        // Step 1: Check if already imported
        const existingBook = await prisma.tafsirBook.findFirst({
          where: { name: tafsir.name },
        });

        if (existingBook) {
          console.log(`      ⏭️  Already imported, skipping...`);
          skippedBooks++;
          continue;
        }

        // Step 2: Create Tafsir Book entry
        console.log('   1️⃣  Creating tafsir book entry...');
        const tafsirBook = await prisma.tafsirBook.create({
          data: {
            name: tafsir.name,
            authorName: tafsir.authorName,
            language: tafsir.language,
            description: tafsir.description,
          },
        });
        console.log(`      ✅ Book entry created`);

        // Step 3: Get all ayahs from database
        console.log('   2️⃣  Fetching ayahs from database...');
        const allAyahs = await prisma.ayah.findMany({
          include: { surah: true },
          orderBy: { numberInQuran: 'asc' },
        });
        console.log(`      ✅ Found ${allAyahs.length} ayahs`);

        // Step 4: Import tafsir for each surah (1-114)
        console.log('   3️⃣  Importing tafsir verses...');
        let verseCount = 0;
        let skippedSurahs = 0;

        for (let surahNum = 1; surahNum <= 114; surahNum++) {
          const url = `${CDN_BASE}/${tafsir.identifier}/${surahNum}.json`;

          try {
            const tafsirData = await fetchJSON(url);

            if (tafsirData && tafsirData.ayahs) {
              const tafsirVerses = [];

              for (const tafsirAyah of tafsirData.ayahs) {
                // Find the corresponding ayah in database
                const ayah = allAyahs.find(
                  (a) => a.surah.number === tafsirAyah.surah && a.ayahNumber === tafsirAyah.ayah
                );

                if (ayah && tafsirAyah.text) {
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

              if (surahNum % 20 === 0) {
                console.log(`      📝 Imported ${surahNum}/114 surahs (${verseCount} verses)`);
              }
            }
          } catch (error: any) {
            // Some surahs might not have tafsir, continue
            if (error.message.includes('404')) {
              skippedSurahs++;
            } else {
              console.error(`      ⚠️  Error on Surah ${surahNum}:`, error.message);
            }
          }

          // Add small delay to avoid overwhelming the CDN
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (verseCount > 0) {
          totalVerses += verseCount;
          successfulBooks++;
          console.log(`      ✅ Completed ${tafsir.name} (${verseCount} verses)`);
          if (skippedSurahs > 0) {
            console.log(`      ⚠️  Skipped ${skippedSurahs} surahs (no data available)`);
          }
        } else {
          console.log(`      ⚠️  No verses found for ${tafsir.name}`);
          // Delete the empty book
          await prisma.tafsirBook.delete({ where: { id: tafsirBook.id } });
          skippedBooks++;
        }
      } catch (bookError: any) {
        console.error(`      ❌ Failed to import ${tafsir.name}:`, bookError.message);
        console.log(`      ⏭️  Skipping to next tafsir book...`);
        skippedBooks++;
      }
    }

    console.log('\n🎉 Additional Tafsir data import completed!\n');
    console.log('Summary:');
    console.log(`- Tafsir books attempted: ${ADDITIONAL_TAFSIR_BOOKS.length}`);
    console.log(`- Tafsir books imported: ${successfulBooks}`);
    console.log(`- Tafsir books skipped: ${skippedBooks}`);
    console.log(`- Total new tafsir verses: ${totalVerses}`);
    console.log(
      '\n📊 To view total tafsir books, run: SELECT COUNT(*) FROM tafsir_books;'
    );
    console.log('📊 To view total tafsir verses, run: SELECT COUNT(*) FROM tafsir_verses;');
    console.log('\n✅ You can now access comprehensive tafsir from multiple scholars!');
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

importAdditionalTafsirData()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
