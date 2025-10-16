/**
 * Migration script to transfer data from Railway MySQL to Railway PostgreSQL
 *
 * This script migrates all data while preserving relationships and IDs
 */

import { PrismaClient as PrismaClientMySQL } from '@prisma/client';
import { PrismaClient as PrismaClientPostgreSQL } from '@prisma/client';

// MySQL connection (source)
const mysqlUrl = 'mysql://root:bWhWOWQIRRtdbHGInkrugAqmwwRJUyDf@ballast.proxy.rlwy.net:11669/railway';
const mysqlClient = new PrismaClientMySQL({
  datasources: {
    db: {
      url: mysqlUrl,
    },
  },
});

// PostgreSQL connection (destination)
const postgresUrl = 'postgresql://postgres:lyxsAemhyeZAQqrcjWaJYvfzKKfWghcQ@turntable.proxy.rlwy.net:27913/railway';
const postgresClient = new PrismaClientPostgreSQL({
  datasources: {
    db: {
      url: postgresUrl,
    },
  },
});

async function migrate() {
  console.log('🚀 Starting migration from MySQL to PostgreSQL...\n');

  try {
    // Connect to both databases
    await mysqlClient.$connect();
    await postgresClient.$connect();
    console.log('✅ Connected to both databases\n');

    // Step 1: Migrate Surahs
    console.log('📖 Migrating Surahs...');
    const surahs = await mysqlClient.surah.findMany();
    for (const surah of surahs) {
      await postgresClient.surah.create({ data: surah });
    }
    console.log(`✅ Migrated ${surahs.length} surahs\n`);

    // Step 2: Migrate Ayahs
    console.log('📜 Migrating Ayahs...');
    const ayahs = await mysqlClient.ayah.findMany();
    let ayahCount = 0;
    for (const ayah of ayahs) {
      await postgresClient.ayah.create({ data: ayah });
      ayahCount++;
      if (ayahCount % 500 === 0) {
        console.log(`  Migrated ${ayahCount}/${ayahs.length} ayahs...`);
      }
    }
    console.log(`✅ Migrated ${ayahs.length} ayahs\n`);

    // Step 3: Migrate Translators
    console.log('👤 Migrating Translators...');
    const translators = await mysqlClient.translator.findMany();
    for (const translator of translators) {
      await postgresClient.translator.create({ data: translator });
    }
    console.log(`✅ Migrated ${translators.length} translators\n`);

    // Step 4: Migrate Translations
    console.log('🌍 Migrating Translations...');
    const translations = await mysqlClient.translation.findMany();
    let translationCount = 0;
    for (const translation of translations) {
      await postgresClient.translation.create({ data: translation });
      translationCount++;
      if (translationCount % 500 === 0) {
        console.log(`  Migrated ${translationCount}/${translations.length} translations...`);
      }
    }
    console.log(`✅ Migrated ${translations.length} translations\n`);

    // Step 5: Migrate Tafsir Books
    console.log('📚 Migrating Tafsir Books...');
    const tafsirBooks = await mysqlClient.tafsirBook.findMany();
    for (const book of tafsirBooks) {
      await postgresClient.tafsirBook.create({ data: book });
    }
    console.log(`✅ Migrated ${tafsirBooks.length} tafsir books\n`);

    // Step 6: Migrate Tafsir Verses
    console.log('📝 Migrating Tafsir Verses...');
    const tafsirVerses = await mysqlClient.tafsirVerse.findMany();
    let tafsirCount = 0;
    for (const verse of tafsirVerses) {
      await postgresClient.tafsirVerse.create({ data: verse });
      tafsirCount++;
      if (tafsirCount % 500 === 0) {
        console.log(`  Migrated ${tafsirCount}/${tafsirVerses.length} tafsir verses...`);
      }
    }
    console.log(`✅ Migrated ${tafsirVerses.length} tafsir verses\n`);

    // Step 7: Migrate Hadith Books
    console.log('📕 Migrating Hadith Books...');
    const hadithBooks = await mysqlClient.hadithBook.findMany();
    for (const book of hadithBooks) {
      await postgresClient.hadithBook.create({ data: book });
    }
    console.log(`✅ Migrated ${hadithBooks.length} hadith books\n`);

    // Step 8: Migrate Hadith Chapters
    console.log('📑 Migrating Hadith Chapters...');
    const hadithChapters = await mysqlClient.hadithChapter.findMany();
    for (const chapter of hadithChapters) {
      await postgresClient.hadithChapter.create({ data: chapter });
    }
    console.log(`✅ Migrated ${hadithChapters.length} hadith chapters\n`);

    // Step 9: Migrate Hadiths
    console.log('📿 Migrating Hadiths...');
    const hadiths = await mysqlClient.hadith.findMany();
    let hadithCount = 0;
    for (const hadith of hadiths) {
      await postgresClient.hadith.create({ data: hadith });
      hadithCount++;
      if (hadithCount % 100 === 0) {
        console.log(`  Migrated ${hadithCount}/${hadiths.length} hadiths...`);
      }
    }
    console.log(`✅ Migrated ${hadiths.length} hadiths\n`);

    // Step 10: Migrate Hadith-Ayah References
    console.log('🔗 Migrating Hadith-Ayah References...');
    const references = await mysqlClient.hadithAyahReference.findMany();
    for (const ref of references) {
      await postgresClient.hadithAyahReference.create({ data: ref });
    }
    console.log(`✅ Migrated ${references.length} hadith-ayah references\n`);

    // Step 11: Migrate Dua Categories
    console.log('🤲 Migrating Dua Categories...');
    const duaCategories = await mysqlClient.duaCategory.findMany();
    for (const category of duaCategories) {
      await postgresClient.duaCategory.create({ data: category });
    }
    console.log(`✅ Migrated ${duaCategories.length} dua categories\n`);

    // Step 12: Migrate Duas
    console.log('🙏 Migrating Duas...');
    const duas = await mysqlClient.dua.findMany();
    for (const dua of duas) {
      await postgresClient.dua.create({ data: dua });
    }
    console.log(`✅ Migrated ${duas.length} duas\n`);

    // Step 13: Migrate Users
    console.log('👥 Migrating Users...');
    const users = await mysqlClient.user.findMany();
    for (const user of users) {
      await postgresClient.user.create({ data: user });
    }
    console.log(`✅ Migrated ${users.length} users\n`);

    // Step 14: Migrate Bookmarks
    console.log('🔖 Migrating Bookmarks...');
    const bookmarks = await mysqlClient.bookmark.findMany();
    for (const bookmark of bookmarks) {
      await postgresClient.bookmark.create({ data: bookmark });
    }
    console.log(`✅ Migrated ${bookmarks.length} bookmarks\n`);

    // Step 15: Migrate Word Roots
    console.log('🌳 Migrating Word Roots...');
    const wordRoots = await mysqlClient.wordRoot.findMany();
    for (const root of wordRoots) {
      await postgresClient.wordRoot.create({ data: root });
    }
    console.log(`✅ Migrated ${wordRoots.length} word roots\n`);

    // Step 16: Migrate Ayah Words
    console.log('📝 Migrating Ayah Words...');
    const ayahWords = await mysqlClient.ayahWord.findMany();
    let wordCount = 0;
    for (const word of ayahWords) {
      await postgresClient.ayahWord.create({ data: word });
      wordCount++;
      if (wordCount % 1000 === 0) {
        console.log(`  Migrated ${wordCount}/${ayahWords.length} words...`);
      }
    }
    console.log(`✅ Migrated ${ayahWords.length} ayah words\n`);

    // Step 17: Migrate Word Translations
    console.log('🌐 Migrating Word Translations...');
    const wordTranslations = await mysqlClient.wordTranslation.findMany();
    let wtCount = 0;
    for (const wt of wordTranslations) {
      await postgresClient.wordTranslation.create({ data: wt });
      wtCount++;
      if (wtCount % 1000 === 0) {
        console.log(`  Migrated ${wtCount}/${wordTranslations.length} word translations...`);
      }
    }
    console.log(`✅ Migrated ${wordTranslations.length} word translations\n`);

    // Step 18: Migrate other tables as needed...
    // Add more tables here if you have data in them

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Surahs: ${surahs.length}`);
    console.log(`   - Ayahs: ${ayahs.length}`);
    console.log(`   - Translations: ${translations.length}`);
    console.log(`   - Tafsir Verses: ${tafsirVerses.length}`);
    console.log(`   - Hadiths: ${hadiths.length}`);
    console.log(`   - Duas: ${duas.length}`);
    console.log(`   - Ayah Words: ${ayahWords.length}`);
    console.log(`   - Users: ${users.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mysqlClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('\n✨ All done! Your data has been migrated to PostgreSQL.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
