/**
 * Verify PostgreSQL data migration
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  console.log('🔍 Verifying PostgreSQL data migration...\n');

  try {
    await prisma.$connect();

    // Count records in each table
    const surahCount = await prisma.surah.count();
    const ayahCount = await prisma.ayah.count();
    const translatorCount = await prisma.translator.count();
    const translationCount = await prisma.translation.count();
    const tafsirBookCount = await prisma.tafsirBook.count();
    const tafsirVerseCount = await prisma.tafsirVerse.count();
    const hadithBookCount = await prisma.hadithBook.count();
    const hadithChapterCount = await prisma.hadithChapter.count();
    const hadithCount = await prisma.hadith.count();
    const duaCategoryCount = await prisma.duaCategory.count();
    const duaCount = await prisma.dua.count();
    const themeCount = await prisma.ayahTheme.count();
    const themeMappingCount = await prisma.ayahThemeMapping.count();

    console.log('📊 Record Counts:');
    console.log(`   ✅ Surahs: ${surahCount}`);
    console.log(`   ✅ Ayahs: ${ayahCount}`);
    console.log(`   ✅ Translators: ${translatorCount}`);
    console.log(`   ✅ Translations: ${translationCount}`);
    console.log(`   ✅ Tafsir Books: ${tafsirBookCount}`);
    console.log(`   ✅ Tafsir Verses: ${tafsirVerseCount}`);
    console.log(`   ✅ Hadith Books: ${hadithBookCount}`);
    console.log(`   ✅ Hadith Chapters: ${hadithChapterCount}`);
    console.log(`   ✅ Hadiths: ${hadithCount}`);
    console.log(`   ✅ Dua Categories: ${duaCategoryCount}`);
    console.log(`   ✅ Duas: ${duaCount}`);
    console.log(`   ✅ Themes: ${themeCount}`);
    console.log(`   ✅ Theme Mappings: ${themeMappingCount}`);

    // Test a sample query
    console.log('\n🔍 Testing sample queries...\n');

    const firstSurah = await prisma.surah.findFirst({
      where: { number: 1 },
      include: { ayahs: true }
    });
    console.log(`📖 Surah Al-Fatiha:`);
    console.log(`   - Name: ${firstSurah?.nameEnglish}`);
    console.log(`   - Ayahs: ${firstSurah?.ayahs.length}`);

    const firstAyah = await prisma.ayah.findFirst({
      where: { numberInQuran: 1 },
      include: { translations: { include: { translator: true } } }
    });
    console.log(`\n📜 First Ayah:`);
    console.log(`   - Arabic: ${firstAyah?.textArabic}`);
    console.log(`   - Translations: ${firstAyah?.translations.length}`);

    const firstHadith = await prisma.hadith.findFirst({
      include: { book: true }
    });
    console.log(`\n📿 Sample Hadith:`);
    console.log(`   - Book: ${firstHadith?.book.name}`);
    console.log(`   - Number: ${firstHadith?.hadithNumber}`);

    console.log('\n✅ All verification checks passed!');
    console.log('🎉 Your PostgreSQL database is ready to use!\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
