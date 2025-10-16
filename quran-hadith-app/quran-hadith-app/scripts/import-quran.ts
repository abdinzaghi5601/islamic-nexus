/**
 * Import Quran Data Script (Optimized)
 *
 * This script imports Quran data from AlQuran.cloud API into the database.
 *
 * Data Source: https://alquran.cloud/api
 *
 * Usage:
 *   npm run import:quran
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API configuration
const API_BASE = 'http://api.alquran.cloud/v1';

// Translation editions to import
const TRANSLATION_EDITIONS = [
  { identifier: 'en.sahih', name: 'Sahih International', language: 'English' },
  { identifier: 'en.yusufali', name: 'Yusuf Ali', language: 'English' },
  { identifier: 'en.pickthall', name: 'Pickthall', language: 'English' },
  { identifier: 'en.clearquran', name: 'Dr. Mustafa Khattab', language: 'English' },
];

// Fetch data from API
async function fetchAPI(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
}

async function importQuranData() {
  console.log('📖 Starting Quran data import from AlQuran.cloud API...\n');

  try {
    // Step 1: Import Surahs
    console.log('1️⃣  Fetching and importing Surahs...');
    const quranMeta = await fetchAPI(`${API_BASE}/meta`);
    const surahs = quranMeta.surahs.references;

    const surahData = surahs.map((surah: any) => ({
      number: surah.number,
      nameArabic: surah.name,
      nameEnglish: surah.englishName,
      nameTranslation: surah.englishNameTranslation,
      revelationType: surah.revelationType,
      numberOfAyahs: surah.numberOfAyahs,
      bismillahPre: true,
      order: surah.number,
    }));

    // Batch insert surahs
    await prisma.surah.createMany({
      data: surahData,
      skipDuplicates: true,
    });
    console.log(`   ✅ Imported ${surahData.length} surahs\n`);

    // Step 2: Import Ayahs - Fetch entire Quran at once
    console.log('2️⃣  Fetching complete Quran with Arabic text...');
    const completeQuran = await fetchAPI(`${API_BASE}/quran/quran-uthmani`);

    console.log('   💾 Importing all ayahs to database...');
    let ayahCount = 0;
    let globalAyahNumber = 1;

    const allSurahs = await prisma.surah.findMany({ orderBy: { number: 'asc' } });
    const surahMap = new Map(allSurahs.map(s => [s.number, s]));

    // Prepare all ayahs for batch insert
    const ayahsToInsert = [];
    for (const surahData of completeQuran.surahs) {
      const surah = surahMap.get(surahData.number);
      if (!surah) continue;

      for (const ayah of surahData.ayahs) {
        ayahsToInsert.push({
          surahId: surah.id,
          ayahNumber: ayah.numberInSurah,
          numberInQuran: globalAyahNumber,
          textArabic: ayah.text,
          textUthmani: ayah.text,
          textSimple: ayah.text,
          juz: ayah.juz,
          manzil: ayah.manzil,
          ruku: ayah.ruku,
          hizbQuarter: ayah.hizbQuarter,
          sajdah: ayah.sajda !== false,
        });
        globalAyahNumber++;
      }
    }

    // Batch insert all ayahs (split into chunks to avoid memory issues)
    const CHUNK_SIZE = 500;
    for (let i = 0; i < ayahsToInsert.length; i += CHUNK_SIZE) {
      const chunk = ayahsToInsert.slice(i, i + CHUNK_SIZE);
      await prisma.ayah.createMany({
        data: chunk,
        skipDuplicates: true,
      });
      console.log(`   📝 Imported ${Math.min(i + CHUNK_SIZE, ayahsToInsert.length)}/${ayahsToInsert.length} ayahs`);
    }
    ayahCount = ayahsToInsert.length;
    console.log(`   ✅ Imported ${ayahCount} ayahs\n`);

    // Step 3: Import Translations
    console.log('3️⃣  Importing translations...');

    for (const edition of TRANSLATION_EDITIONS) {
      console.log(`   📝 Importing ${edition.name}...`);

      // Find or create translator
      let translator = await prisma.translator.findFirst({
        where: { name: edition.name },
      });

      if (!translator) {
        translator = await prisma.translator.create({
          data: {
            name: edition.name,
            language: edition.language,
          },
        });
      }

      // Fetch entire Quran translation at once
      console.log(`      Fetching complete ${edition.name} translation...`);
      const translationData = await fetchAPI(`${API_BASE}/quran/${edition.identifier}`);

      // Get all ayahs from DB
      const allAyahs = await prisma.ayah.findMany({
        orderBy: { numberInQuran: 'asc' },
      });

      // Prepare translations for batch insert
      const translationsToInsert = [];
      let ayahIndex = 0;

      for (const surahData of translationData.surahs) {
        for (const ayah of surahData.ayahs) {
          if (ayahIndex < allAyahs.length) {
            translationsToInsert.push({
              ayahId: allAyahs[ayahIndex].id,
              translatorId: translator.id,
              text: ayah.text,
            });
            ayahIndex++;
          }
        }
      }

      // Batch insert translations
      console.log(`      Importing ${translationsToInsert.length} verses...`);
      for (let i = 0; i < translationsToInsert.length; i += CHUNK_SIZE) {
        const chunk = translationsToInsert.slice(i, i + CHUNK_SIZE);
        await prisma.translation.createMany({
          data: chunk,
          skipDuplicates: true,
        });
        console.log(`      📝 ${Math.min(i + CHUNK_SIZE, translationsToInsert.length)}/${translationsToInsert.length}`);
      }
      console.log(`      ✅ Completed ${edition.name}\n`);
    }

    console.log('🎉 Quran data import completed successfully!\n');
    console.log('Summary:');
    console.log(`- Surahs: ${surahData.length}`);
    console.log(`- Ayahs: ${ayahCount}`);
    console.log(`- Translations: ${TRANSLATION_EDITIONS.length} editions`);
    console.log(`\nYou can now view the data in MySQL Workbench or run: npm run db:studio`);

  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

importQuranData()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
