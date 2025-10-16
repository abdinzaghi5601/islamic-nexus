/**
 * Import Hadith Data Script
 *
 * This script imports Hadith data from fawazahmed0/hadith-api CDN into the database.
 *
 * Data Source: https://github.com/fawazahmed0/hadith-api
 *
 * Usage:
 *   npm run import:hadith
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API configuration
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

// Hadith collections to import
const HADITH_COLLECTIONS = [
  {
    identifier: 'bukhari',
    name: 'Sahih al-Bukhari',
    nameArabic: 'صحيح البخاري',
    author: 'Imam Muhammad al-Bukhari',
    description: 'The most authentic hadith collection',
  },
  {
    identifier: 'muslim',
    name: 'Sahih Muslim',
    nameArabic: 'صحيح مسلم',
    author: 'Imam Muslim ibn al-Hajjaj',
    description: 'Second most authentic hadith collection',
  },
  {
    identifier: 'abudawud',
    name: 'Sunan Abu Dawud',
    nameArabic: 'سنن أبي داود',
    author: 'Imam Abu Dawud',
    description: 'Collection focused on legal hadiths',
  },
  {
    identifier: 'tirmidhi',
    name: 'Jami at-Tirmidhi',
    nameArabic: 'جامع الترمذي',
    author: 'Imam at-Tirmidhi',
    description: 'Collection with grading of hadiths',
  },
  {
    identifier: 'nasai',
    name: "Sunan an-Nasa'i",
    nameArabic: 'سنن النسائي',
    author: "Imam an-Nasa'i",
    description: 'Rigorous collection of hadiths',
  },
  {
    identifier: 'ibnmajah',
    name: 'Sunan Ibn Majah',
    nameArabic: 'سنن ابن ماجه',
    author: 'Imam Ibn Majah',
    description: 'Final book of the six major collections',
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

async function importHadithData() {
  console.log('📕 Starting Hadith data import from CDN...\n');

  try {
    let totalHadiths = 0;
    let totalChapters = 0;

    for (const collection of HADITH_COLLECTIONS) {
      console.log(`\n📚 Importing ${collection.name}...`);

      // Step 1: Create or update Hadith Book
      console.log('   1️⃣  Creating book entry...');
      const hadithBook = await prisma.hadithBook.upsert({
        where: { id: 0 }, // Will never match, forcing lookup by name
        update: {},
        create: {
          name: collection.name,
          nameArabic: collection.nameArabic,
          author: collection.author,
          description: collection.description,
          totalHadiths: 0, // Will update later
        },
      }).catch(async () => {
        // If upsert fails, try to find existing
        return await prisma.hadithBook.findFirst({
          where: { name: collection.name },
        }) || await prisma.hadithBook.create({
          data: {
            name: collection.name,
            nameArabic: collection.nameArabic,
            author: collection.author,
            description: collection.description,
            totalHadiths: 0,
          },
        });
      });
      console.log(`      ✅ Book entry created/found`);

      // Step 2: Fetch Arabic and English data
      console.log('   2️⃣  Fetching Arabic text...');
      const arabicUrl = `${CDN_BASE}/ara-${collection.identifier}.json`;
      const arabicData = await fetchJSON(arabicUrl);

      console.log('   3️⃣  Fetching English translation...');
      const englishUrl = `${CDN_BASE}/eng-${collection.identifier}.json`;
      const englishData = await fetchJSON(englishUrl);

      console.log(`      ✅ Fetched data (${arabicData.hadiths.length} hadiths)`);

      // Step 3: Import Chapters
      console.log('   4️⃣  Importing chapters...');
      const chapterMap = new Map();

      if (arabicData.metadata && arabicData.metadata.sections) {
        let chapterCount = 0;
        const sections = arabicData.metadata.sections;

        // Check if sections is an object (not an array)
        if (typeof sections === 'object' && !Array.isArray(sections)) {
          for (const [chapterNumber, chapterName] of Object.entries(sections)) {
            const chapter = await prisma.hadithChapter.upsert({
              where: {
                bookId_chapterNumber: {
                  bookId: hadithBook.id,
                  chapterNumber: parseInt(chapterNumber),
                },
              },
              update: {},
              create: {
                bookId: hadithBook.id,
                chapterNumber: parseInt(chapterNumber),
                nameEnglish: chapterName as string || `Chapter ${chapterNumber}`,
                nameArabic: null,
              },
            });

            chapterMap.set(parseInt(chapterNumber), chapter);
            chapterCount++;
          }
          totalChapters += chapterCount;
          console.log(`      ✅ Imported ${chapterCount} chapters`);
        }
      }

      // Step 4: Import Hadiths (Batch Insert)
      console.log('   5️⃣  Preparing hadiths for import...');
      const hadiths = arabicData.hadiths;
      const hadithsToInsert = [];

      for (let i = 0; i < hadiths.length; i++) {
        const arabicHadith = hadiths[i];
        const englishHadith = englishData.hadiths[i];

        if (!englishHadith) continue;

        const chapterId = chapterMap.get(arabicHadith.reference.book)?.id || null;

        hadithsToInsert.push({
          bookId: hadithBook.id,
          chapterId: chapterId,
          hadithNumber: arabicHadith.hadithnumber.toString(),
          hadithInChapter: arabicHadith.reference.hadith,
          textArabic: arabicHadith.text,
          textEnglish: englishHadith.text,
          narratorChain: null,
          grade: arabicHadith.grades && arabicHadith.grades.length > 0 ? arabicHadith.grades[0].grade : null,
        });
      }

      console.log(`   📦 Batch importing ${hadithsToInsert.length} hadiths...`);
      const CHUNK_SIZE = 500;
      let hadithCount = 0;

      for (let i = 0; i < hadithsToInsert.length; i += CHUNK_SIZE) {
        const chunk = hadithsToInsert.slice(i, i + CHUNK_SIZE);
        await prisma.hadith.createMany({
          data: chunk,
          skipDuplicates: true,
        });
        hadithCount += chunk.length;
        console.log(`      📝 Imported ${Math.min(i + CHUNK_SIZE, hadithsToInsert.length)}/${hadithsToInsert.length} hadiths`);
      }

      // Update total hadiths count
      await prisma.hadithBook.update({
        where: { id: hadithBook.id },
        data: { totalHadiths: hadithCount },
      });

      totalHadiths += hadithCount;
      console.log(`      ✅ Completed ${collection.name} (${hadithCount} hadiths)`);
    }

    console.log('\n🎉 Hadith data import completed successfully!\n');
    console.log('Summary:');
    console.log(`- Books imported: ${HADITH_COLLECTIONS.length}`);
    console.log(`- Total chapters: ${totalChapters}`);
    console.log(`- Total hadiths: ${totalHadiths}`);
    console.log('\nYou can now view the data in MySQL Workbench or run: npm run db:studio');

  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

importHadithData()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
