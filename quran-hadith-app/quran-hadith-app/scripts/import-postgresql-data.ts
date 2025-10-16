/**
 * Step 2: Import data from JSON files to PostgreSQL
 *
 * Run this with: DATABASE_URL="postgresql://..." npm run db:import
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
  console.log('🚀 Starting PostgreSQL data import...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database\n');

    // Import Surahs
    console.log('📖 Importing Surahs...');
    const surahs = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'surahs.json'), 'utf-8')
    );
    for (const surah of surahs) {
      const data = convertBooleans(surah, ['bismillahPre']);
      await prisma.surah.create({ data });
    }
    console.log(`✅ Imported ${surahs.length} surahs\n`);

    // Import Ayahs
    console.log('📜 Importing Ayahs (this may take a while)...');
    const ayahs = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayahs.json'), 'utf-8')
    );
    let ayahCount = 0;
    for (const ayah of ayahs) {
      const data = convertBooleans(ayah, ['sajdah']);
      await prisma.ayah.create({ data });
      ayahCount++;
      if (ayahCount % 500 === 0) {
        console.log(`  Imported ${ayahCount}/${ayahs.length} ayahs...`);
      }
    }
    console.log(`✅ Imported ${ayahs.length} ayahs\n`);

    // Import Translators
    console.log('👤 Importing Translators...');
    const translators = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'translators.json'), 'utf-8')
    );
    for (const translator of translators) {
      await prisma.translator.create({ data: translator });
    }
    console.log(`✅ Imported ${translators.length} translators\n`);

    // Import Translations
    console.log('🌍 Importing Translations (this may take a while)...');
    const translations = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'translations.json'), 'utf-8')
    );
    let translationCount = 0;
    for (const translation of translations) {
      await prisma.translation.create({ data: translation });
      translationCount++;
      if (translationCount % 500 === 0) {
        console.log(`  Imported ${translationCount}/${translations.length} translations...`);
      }
    }
    console.log(`✅ Imported ${translations.length} translations\n`);

    // Import Tafsir Books
    console.log('📚 Importing Tafsir Books...');
    const tafsirBooks = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'tafsir-books.json'), 'utf-8')
    );
    for (const book of tafsirBooks) {
      await prisma.tafsirBook.create({ data: book });
    }
    console.log(`✅ Imported ${tafsirBooks.length} tafsir books\n`);

    // Import Tafsir Verses
    console.log('📝 Importing Tafsir Verses (this may take a while)...');
    const tafsirVerses = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'tafsir-verses.json'), 'utf-8')
    );
    let tafsirCount = 0;
    for (const verse of tafsirVerses) {
      await prisma.tafsirVerse.create({ data: verse });
      tafsirCount++;
      if (tafsirCount % 500 === 0) {
        console.log(`  Imported ${tafsirCount}/${tafsirVerses.length} tafsir verses...`);
      }
    }
    console.log(`✅ Imported ${tafsirVerses.length} tafsir verses\n`);

    // Import Hadith Books
    console.log('📕 Importing Hadith Books...');
    const hadithBooks = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadith-books.json'), 'utf-8')
    );
    for (const book of hadithBooks) {
      await prisma.hadithBook.create({ data: book });
    }
    console.log(`✅ Imported ${hadithBooks.length} hadith books\n`);

    // Import Hadith Chapters
    console.log('📑 Importing Hadith Chapters...');
    const hadithChapters = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadith-chapters.json'), 'utf-8')
    );
    for (const chapter of hadithChapters) {
      await prisma.hadithChapter.create({ data: chapter });
    }
    console.log(`✅ Imported ${hadithChapters.length} hadith chapters\n`);

    // Import Hadiths
    console.log('📿 Importing Hadiths (this will take several minutes)...');
    const hadiths = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadiths.json'), 'utf-8')
    );
    let hadithCount = 0;
    for (const hadith of hadiths) {
      await prisma.hadith.create({ data: hadith });
      hadithCount++;
      if (hadithCount % 1000 === 0) {
        console.log(`  Imported ${hadithCount}/${hadiths.length} hadiths...`);
      }
    }
    console.log(`✅ Imported ${hadiths.length} hadiths\n`);

    // Import Hadith-Ayah References
    console.log('🔗 Importing Hadith-Ayah References...');
    const references = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'hadith-ayah-references.json'), 'utf-8')
    );
    for (const ref of references) {
      await prisma.hadithAyahReference.create({ data: ref });
    }
    console.log(`✅ Imported ${references.length} references\n`);

    // Import Dua Categories
    console.log('🤲 Importing Dua Categories...');
    const duaCategories = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'dua-categories.json'), 'utf-8')
    );
    for (const category of duaCategories) {
      await prisma.duaCategory.create({ data: category });
    }
    console.log(`✅ Imported ${duaCategories.length} dua categories\n`);

    // Import Duas
    console.log('🙏 Importing Duas...');
    const duas = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'duas.json'), 'utf-8')
    );
    for (const dua of duas) {
      await prisma.dua.create({ data: dua });
    }
    console.log(`✅ Imported ${duas.length} duas\n`);

    // Import Users
    console.log('👥 Importing Users...');
    const users = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'users.json'), 'utf-8')
    );
    for (const user of users) {
      await prisma.user.create({ data: user });
    }
    console.log(`✅ Imported ${users.length} users\n`);

    // Import Bookmarks (if any)
    console.log('🔖 Importing Bookmarks...');
    const bookmarks = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'bookmarks.json'), 'utf-8')
    );
    if (bookmarks.length > 0) {
      for (const bookmark of bookmarks) {
        await prisma.bookmark.create({ data: bookmark });
      }
    }
    console.log(`✅ Imported ${bookmarks.length} bookmarks\n`);

    // Import Ayah Themes
    console.log('🏷️  Importing Ayah Themes...');
    const themes = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayah-themes.json'), 'utf-8')
    );
    for (const theme of themes) {
      await prisma.ayahTheme.create({ data: theme });
    }
    console.log(`✅ Imported ${themes.length} themes\n`);

    // Import Ayah Theme Mappings
    console.log('🗺️  Importing Ayah Theme Mappings (this may take a while)...');
    const themeMappings = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayah-theme-mappings.json'), 'utf-8')
    );
    let mappingCount = 0;
    for (const mapping of themeMappings) {
      await prisma.ayahThemeMapping.create({ data: mapping });
      mappingCount++;
      if (mappingCount % 1000 === 0) {
        console.log(`  Imported ${mappingCount}/${themeMappings.length} theme mappings...`);
      }
    }
    console.log(`✅ Imported ${themeMappings.length} theme mappings\n`);

    // Import Ayah Lessons (if any)
    console.log('📚 Importing Ayah Lessons...');
    const ayahLessons = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'ayah-lessons.json'), 'utf-8')
    );
    if (ayahLessons.length > 0) {
      for (const lesson of ayahLessons) {
        await prisma.ayahLesson.create({ data: lesson });
      }
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
