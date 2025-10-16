/**
 * Step 2: Import data from JSON files to PostgreSQL (OPTIMIZED with batch inserts)
 *
 * Run this with: npm run db:import:fast
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const exportDir = path.join(process.cwd(), 'data-export');

// Helper to convert MySQL integers to PostgreSQL booleans
function convertBooleans(obj: any, booleanFields: string[]): any {
  const converted = { ...obj };
  for (const field of booleanFields) {
    if (field in converted) {
      converted[field] = converted[field] === 1 || converted[field] === true;
    }
  }
  return converted;
}

async function importData() {
  console.log('🚀 Starting PostgreSQL data import (optimized)...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database\n');

    // Import Surahs
    console.log('📖 Importing Surahs...');
    const surahs = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'surahs.json'), 'utf-8')
    ).map((s: any) => convertBooleans(s, ['bismillahPre']));
    await prisma.surah.createMany({ data: surahs, skipDuplicates: true });
    console.log(`✅ Imported ${surahs.length} surahs\n`);

    // Import Ayahs
    console.log('📜 Importing Ayahs...');
    const ayahs = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayahs.json'), 'utf-8')
    ).map((a: any) => convertBooleans(a, ['sajdah']));
    await prisma.ayah.createMany({ data: ayahs, skipDuplicates: true });
    console.log(`✅ Imported ${ayahs.length} ayahs\n`);

    // Import Translators
    console.log('👤 Importing Translators...');
    const translators = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'translators.json'), 'utf-8')
    );
    await prisma.translator.createMany({ data: translators, skipDuplicates: true });
    console.log(`✅ Imported ${translators.length} translators\n`);

    // Import Translations
    console.log('🌍 Importing Translations...');
    const translations = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'translations.json'), 'utf-8')
    );
    await prisma.translation.createMany({ data: translations, skipDuplicates: true });
    console.log(`✅ Imported ${translations.length} translations\n`);

    // Import Tafsir Books
    console.log('📚 Importing Tafsir Books...');
    const tafsirBooks = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'tafsir-books.json'), 'utf-8')
    );
    await prisma.tafsirBook.createMany({ data: tafsirBooks, skipDuplicates: true });
    console.log(`✅ Imported ${tafsirBooks.length} tafsir books\n`);

    // Import Tafsir Verses
    console.log('📝 Importing Tafsir Verses...');
    const tafsirVerses = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'tafsir-verses.json'), 'utf-8')
    );
    await prisma.tafsirVerse.createMany({ data: tafsirVerses, skipDuplicates: true });
    console.log(`✅ Imported ${tafsirVerses.length} tafsir verses\n`);

    // Import Hadith Books
    console.log('📕 Importing Hadith Books...');
    const hadithBooks = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadith-books.json'), 'utf-8')
    );
    await prisma.hadithBook.createMany({ data: hadithBooks, skipDuplicates: true });
    console.log(`✅ Imported ${hadithBooks.length} hadith books\n`);

    // Import Hadith Chapters
    console.log('📑 Importing Hadith Chapters...');
    const hadithChapters = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadith-chapters.json'), 'utf-8')
    );
    await prisma.hadithChapter.createMany({ data: hadithChapters, skipDuplicates: true });
    console.log(`✅ Imported ${hadithChapters.length} hadith chapters\n`);

    // Import Hadiths in batches
    console.log('📿 Importing Hadiths...');
    const hadiths = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadiths.json'), 'utf-8')
    );
    const batchSize = 1000;
    for (let i = 0; i < hadiths.length; i += batchSize) {
      const batch = hadiths.slice(i, i + batchSize);
      await prisma.hadith.createMany({ data: batch, skipDuplicates: true });
      console.log(`  Imported ${Math.min(i + batchSize, hadiths.length)}/${hadiths.length} hadiths...`);
    }
    console.log(`✅ Imported ${hadiths.length} hadiths\n`);

    // Import Hadith-Ayah References
    console.log('🔗 Importing Hadith-Ayah References...');
    const references = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadith-ayah-references.json'), 'utf-8')
    );
    if (references.length > 0) {
      await prisma.hadithAyahReference.createMany({ data: references, skipDuplicates: true });
    }
    console.log(`✅ Imported ${references.length} references\n`);

    // Import Dua Categories
    console.log('🤲 Importing Dua Categories...');
    const duaCategories = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'dua-categories.json'), 'utf-8')
    );
    await prisma.duaCategory.createMany({ data: duaCategories, skipDuplicates: true });
    console.log(`✅ Imported ${duaCategories.length} dua categories\n`);

    // Import Duas
    console.log('🙏 Importing Duas...');
    const duas = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'duas.json'), 'utf-8')
    );
    await prisma.dua.createMany({ data: duas, skipDuplicates: true });
    console.log(`✅ Imported ${duas.length} duas\n`);

    // Import Users
    console.log('👥 Importing Users...');
    const users = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'users.json'), 'utf-8')
    );
    await prisma.user.createMany({ data: users, skipDuplicates: true });
    console.log(`✅ Imported ${users.length} users\n`);

    // Import Bookmarks
    console.log('🔖 Importing Bookmarks...');
    const bookmarks = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'bookmarks.json'), 'utf-8')
    );
    if (bookmarks.length > 0) {
      await prisma.bookmark.createMany({ data: bookmarks, skipDuplicates: true });
    }
    console.log(`✅ Imported ${bookmarks.length} bookmarks\n`);

    // Import Ayah Themes
    console.log('🏷️  Importing Ayah Themes...');
    const themes = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayah-themes.json'), 'utf-8')
    );
    await prisma.ayahTheme.createMany({ data: themes, skipDuplicates: true });
    console.log(`✅ Imported ${themes.length} themes\n`);

    // Import Ayah Theme Mappings in batches
    console.log('🗺️  Importing Ayah Theme Mappings...');
    const themeMappings = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayah-theme-mappings.json'), 'utf-8')
    );
    for (let i = 0; i < themeMappings.length; i += batchSize) {
      const batch = themeMappings.slice(i, i + batchSize);
      await prisma.ayahThemeMapping.createMany({ data: batch, skipDuplicates: true });
      console.log(`  Imported ${Math.min(i + batchSize, themeMappings.length)}/${themeMappings.length} theme mappings...`);
    }
    console.log(`✅ Imported ${themeMappings.length} theme mappings\n`);

    // Import Ayah Lessons
    console.log('📚 Importing Ayah Lessons...');
    const ayahLessons = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayah-lessons.json'), 'utf-8')
    );
    if (ayahLessons.length > 0) {
      await prisma.ayahLesson.createMany({ data: ayahLessons, skipDuplicates: true });
    }
    console.log(`✅ Imported ${ayahLessons.length} ayah lessons\n`);

    console.log('\n🎉 Import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Surahs: ${surahs.length}`);
    console.log(`   - Ayahs: ${ayahs.length}`);
    console.log(`   - Translations: ${translations.length}`);
    console.log(`   - Tafsir Verses: ${tafsirVerses.length}`);
    console.log(`   - Hadiths: ${hadiths.length}`);
    console.log(`   - Duas: ${duas.length}`);
    console.log(`   - Theme Mappings: ${themeMappings.length}`);
    console.log(`   - Users: ${users.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importData()
  .then(() => {
    console.log('\n✨ All done! Your data has been migrated to PostgreSQL.');
    process.exit(0);
  })
  .catch(() => process.exit(1));
