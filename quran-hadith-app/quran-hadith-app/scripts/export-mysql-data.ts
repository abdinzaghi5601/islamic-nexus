/**
 * Step 1: Export data from MySQL to JSON files with batching for large tables
 */

import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

const exportDir = path.join(process.cwd(), 'data-export');

// MySQL connection config with extended timeouts and SSL
const mysqlConfig = {
  host: 'ballast.proxy.rlwy.net',
  port: 11669,
  user: 'root',
  password: 'bWhWOWQIRRtdbHGInkrugAqmwwRJUyDf',
  database: 'railway',
  connectTimeout: 60000, // 60 seconds
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Try with SSL - Railway usually requires it
  ssl: {
    rejectUnauthorized: false
  }
};

// Small tables - export all at once
async function exportTable(connection: mysql.Connection | mysql.Pool, tableName: string, fileName: string) {
  console.log(`📦 Exporting ${tableName}...`);
  const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
  const data = rows as any[];

  fs.writeFileSync(
    path.join(exportDir, fileName),
    JSON.stringify(data, null, 2)
  );

  console.log(`✅ Exported ${data.length} rows from ${tableName}\n`);
  return data.length;
}

// Large tables - export with batching
async function exportTableBatched(
  connection: mysql.Connection | mysql.Pool,
  tableName: string,
  fileName: string,
  batchSize: number = 5000
) {
  console.log(`📦 Exporting ${tableName} (batched)...`);

  // Get total count
  const [countResult] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
  const total = (countResult as any)[0].total;
  console.log(`   Total rows: ${total}`);

  if (total === 0) {
    fs.writeFileSync(path.join(exportDir, fileName), JSON.stringify([], null, 2));
    console.log(`✅ Exported 0 rows from ${tableName} (empty)\n`);
    return 0;
  }

  let allData: any[] = [];
  let offset = 0;

  while (offset < total) {
    const [rows] = await connection.query(
      `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
      [batchSize, offset]
    );
    const batch = rows as any[];
    allData.push(...batch);

    offset += batchSize;
    const progress = Math.min(offset, total);
    console.log(`   Progress: ${progress}/${total} (${Math.round(progress/total*100)}%)`);
  }

  fs.writeFileSync(
    path.join(exportDir, fileName),
    JSON.stringify(allData, null, 2)
  );

  console.log(`✅ Exported ${allData.length} rows from ${tableName}\n`);
  return allData.length;
}

// Stream large tables directly to file (most memory efficient)
async function exportTableStreamed(
  connection: mysql.Connection | mysql.Pool,
  tableName: string,
  fileName: string,
  batchSize: number = 5000
) {
  console.log(`📦 Exporting ${tableName} (streaming)...`);

  // Get total count
  const [countResult] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
  const total = (countResult as any)[0].total;
  console.log(`   Total rows: ${total}`);

  if (total === 0) {
    fs.writeFileSync(path.join(exportDir, fileName), JSON.stringify([], null, 2));
    console.log(`✅ Exported 0 rows from ${tableName} (empty)\n`);
    return 0;
  }

  const writeStream = fs.createWriteStream(path.join(exportDir, fileName));
  writeStream.write('[\n');

  let offset = 0;
  let isFirst = true;

  while (offset < total) {
    const [rows] = await connection.query(
      `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
      [batchSize, offset]
    );
    const batch = rows as any[];

    for (const row of batch) {
      if (!isFirst) {
        writeStream.write(',\n');
      }
      writeStream.write('  ' + JSON.stringify(row));
      isFirst = false;
    }

    offset += batchSize;
    const progress = Math.min(offset, total);
    console.log(`   Progress: ${progress}/${total} (${Math.round(progress/total*100)}%)`);
  }

  writeStream.write('\n]');
  writeStream.end();

  await new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => resolve());
    writeStream.on('error', reject);
  });

  console.log(`✅ Exported ${total} rows from ${tableName}\n`);
  return total;
}

async function exportData() {
  console.log('🚀 Starting MySQL data export...\n');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  let connection: mysql.Connection | mysql.Pool | null = null;

  try {
    // Connect to MySQL
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connected to MySQL database\n');

    const stats: Record<string, number> = {};

    // Small tables - export normally
    stats.surahs = await exportTable(connection, 'surahs', 'surahs.json');
    stats.translators = await exportTable(connection, 'translators', 'translators.json');
    stats.tafsirBooks = await exportTable(connection, 'tafsir_books', 'tafsir-books.json');
    stats.hadithBooks = await exportTable(connection, 'hadith_books', 'hadith-books.json');
    stats.hadithChapters = await exportTable(connection, 'hadith_chapters', 'hadith-chapters.json');
    stats.duaCategories = await exportTable(connection, 'dua_categories', 'dua-categories.json');
    stats.users = await exportTable(connection, 'users', 'users.json');
    stats.wordRoots = await exportTable(connection, 'word_roots', 'word-roots.json');
    stats.ayahThemes = await exportTable(connection, 'ayah_themes', 'ayah-themes.json');

    // Medium tables - use batching
    stats.duas = await exportTableBatched(connection, 'duas', 'duas.json', 2000);
    stats.bookmarks = await exportTableBatched(connection, 'bookmarks', 'bookmarks.json', 5000);
    stats.hadithBookmarks = await exportTableBatched(connection, 'hadith_bookmarks', 'hadith-bookmarks.json', 5000);
    stats.duaBookmarks = await exportTableBatched(connection, 'dua_bookmarks', 'dua-bookmarks.json', 5000);
    stats.ayahLessons = await exportTableBatched(connection, 'ayah_lessons', 'ayah-lessons.json', 2000);
    stats.ayahDuas = await exportTableBatched(connection, 'ayah_duas', 'ayah-duas.json', 2000);

    // Large tables - use streaming (most memory efficient)
    stats.ayahs = await exportTableStreamed(connection, 'ayahs', 'ayahs.json', 5000);
    stats.translations = await exportTableStreamed(connection, 'translations', 'translations.json', 5000);
    stats.tafsirVerses = await exportTableStreamed(connection, 'tafsir_verses', 'tafsir-verses.json', 5000);
    stats.hadiths = await exportTableStreamed(connection, 'hadiths', 'hadiths.json', 3000);
    stats.hadithAyahReferences = await exportTableStreamed(connection, 'hadith_ayah_references', 'hadith-ayah-references.json', 5000);
    stats.ayahWords = await exportTableStreamed(connection, 'ayah_words', 'ayah-words.json', 5000);
    stats.wordTranslations = await exportTableStreamed(connection, 'word_translations', 'word-translations.json', 5000);
    stats.ayahThemeMappings = await exportTableStreamed(connection, 'ayah_theme_mappings', 'ayah-theme-mappings.json', 5000);
    stats.wordGrammar = await exportTableStreamed(connection, 'word_grammar', 'word-grammar.json', 5000);
    stats.wordMorphology = await exportTableStreamed(connection, 'word_morphology', 'word-morphology.json', 5000);

    console.log('\n📊 Export Summary:');
    console.log('━'.repeat(50));
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`  ${table.padEnd(25)} ${count.toLocaleString()} rows`);
    });
    console.log('━'.repeat(50));

    const totalRows = Object.values(stats).reduce((sum, count) => sum + count, 0);
    console.log(`  ${'TOTAL'.padEnd(25)} ${totalRows.toLocaleString()} rows`);
    console.log('━'.repeat(50));

    console.log(`\n✅ All data exported successfully to ${exportDir}`);
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 MySQL connection closed');
    }
  }
}

exportData()
  .then(() => {
    console.log('\n🎉 Export completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
