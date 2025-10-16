/**
 * Script to verify all PostgreSQL optimizations are working
 * Run with: npx tsx scripts/verify-optimizations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFTS() {
  console.log('🔍 Checking Full-Text Search setup...');

  try {
    // Check if search_vector columns exist and are populated
    const ayahCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM ayahs WHERE search_vector IS NOT NULL
    `;

    const hadithCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM hadiths WHERE search_vector IS NOT NULL
    `;

    const duaCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM duas WHERE search_vector IS NOT NULL
    `;

    console.log(`  ✅ Ayahs with FTS: ${ayahCount[0].count}`);
    console.log(`  ✅ Hadiths with FTS: ${hadithCount[0].count}`);
    console.log(`  ✅ Duas with FTS: ${duaCount[0].count}\n`);

    // Test a search
    const searchTest = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM ayahs
      WHERE search_vector @@ to_tsquery('arabic', 'الله')
    `;
    console.log(`  ✅ Test search found ${searchTest[0].count} ayahs mentioning الله\n`);

  } catch (error) {
    console.error('  ❌ FTS check failed:', error.message, '\n');
  }
}

async function checkIndexes() {
  console.log('🔍 Checking indexes...');

  try {
    const indexes = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%'
      ORDER BY indexname
    `;

    console.log(`  ✅ Found ${indexes.length} custom indexes:`);

    // Check for specific important indexes
    const expectedIndexes = [
      'idx_ayahs_search_vector',
      'idx_hadiths_search_vector',
      'idx_duas_search_vector',
      'idx_active_memorization_goals',
      'idx_sahih_hadiths',
    ];

    for (const expected of expectedIndexes) {
      const found = indexes.some(idx => idx.indexname === expected);
      console.log(`    ${found ? '✅' : '❌'} ${expected}`);
    }
    console.log();

  } catch (error) {
    console.error('  ❌ Index check failed:', error.message, '\n');
  }
}

async function checkMaterializedViews() {
  console.log('🔍 Checking materialized views...');

  try {
    const views = await prisma.$queryRaw<Array<{ matviewname: string }>>`
      SELECT matviewname
      FROM pg_matviews
      WHERE schemaname = 'public'
      ORDER BY matviewname
    `;

    console.log(`  ✅ Found ${views.length} materialized views:`);

    for (const view of views) {
      // Test if view has data
      const count = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM ${view.matviewname}`
      );
      console.log(`    ✅ ${view.matviewname.padEnd(35)} (${count[0].count} rows)`);
    }
    console.log();

  } catch (error) {
    console.error('  ❌ Materialized views check failed:', error.message, '\n');
  }
}

async function checkTriggers() {
  console.log('🔍 Checking triggers...');

  try {
    const triggers = await prisma.$queryRaw<Array<{ tgname: string, tgrelid: string }>>`
      SELECT tgname, tgrelid::regclass as table_name
      FROM pg_trigger
      WHERE tgname NOT LIKE 'RI_%'
        AND tgname NOT LIKE 'pg_%'
      ORDER BY tgname
    `;

    console.log(`  ✅ Found ${triggers.length} custom triggers:`);

    const expectedTriggers = [
      'ayah_search_vector_update',
      'hadith_search_vector_update',
      'dua_search_vector_update',
      'hadith_count_trigger',
    ];

    for (const expected of expectedTriggers) {
      const found = triggers.some(t => t.tgname === expected);
      console.log(`    ${found ? '✅' : '❌'} ${expected}`);
    }
    console.log();

  } catch (error) {
    console.error('  ❌ Trigger check failed:', error.message, '\n');
  }
}

async function checkArrayFields() {
  console.log('🔍 Checking array fields...');

  try {
    // Check if tags are arrays
    const duaWithTags = await prisma.$queryRaw<Array<{ id: number, tags: string[] }>>`
      SELECT id, tags FROM duas WHERE array_length(tags, 1) > 0 LIMIT 1
    `;

    if (duaWithTags.length > 0) {
      console.log(`  ✅ Array fields working correctly`);
      console.log(`    Sample tags: ${JSON.stringify(duaWithTags[0].tags)}\n`);
    } else {
      console.log(`  ⚠️  No data with tags found (this is OK if you haven't added tags yet)\n`);
    }

  } catch (error) {
    console.error('  ❌ Array field check failed:', error.message);
    console.error('     You may need to migrate existing comma-separated tags\n');
  }
}

async function main() {
  console.log('🔍 PostgreSQL Optimizations Verification\n');
  console.log('=' .repeat(60) + '\n');

  try {
    await prisma.$connect();

    await checkFTS();
    await checkIndexes();
    await checkMaterializedViews();
    await checkTriggers();
    await checkArrayFields();

    console.log('=' .repeat(60));
    console.log('\n✅ Verification complete!\n');
    console.log('If any checks failed, review the error messages and:');
    console.log('  1. Ensure migrations have been applied');
    console.log('  2. Run: npx tsx scripts/apply-sql-optimizations.ts');
    console.log('  3. Check the MIGRATION_GUIDE.md for troubleshooting\n');

  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
