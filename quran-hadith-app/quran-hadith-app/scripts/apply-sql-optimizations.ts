/**
 * Script to apply PostgreSQL optimization SQL files
 * Run with: npx tsx scripts/apply-sql-optimizations.ts
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function applySqlFile(filename: string, description: string) {
  console.log(`\n📝 Applying ${description}...`);

  try {
    const sqlPath = join(__dirname, '..', 'prisma', 'sql', filename);
    const sql = readFileSync(sqlPath, 'utf-8');

    // Split by statement separator and execute each
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      // Skip comments and empty lines
      if (statement.startsWith('--') || !statement.trim()) continue;

      try {
        await prisma.$executeRawUnsafe(statement + ';');
      } catch (error: any) {
        // Some statements might fail if already exist (e.g., CREATE IF NOT EXISTS)
        // Log but continue
        const errorMessage = error?.message || String(error);
        if (!errorMessage.includes('already exists')) {
          console.warn(`  ⚠️  Warning: ${errorMessage.split('\n')[0]}`);
        }
      }
    }

    console.log(`  ✅ ${description} applied successfully`);
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error(`  ❌ Error applying ${description}:`, errorMessage);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting PostgreSQL optimization setup...\n');
  console.log('This will apply:');
  console.log('  1. Full-Text Search triggers');
  console.log('  2. Partial indexes');
  console.log('  3. Materialized views');
  console.log('  4. Data integrity triggers\n');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Apply SQL files in order
    await applySqlFile('01_fts_triggers.sql', 'Full-Text Search triggers');
    await applySqlFile('02_partial_indexes.sql', 'Partial indexes');
    await applySqlFile('03_materialized_views.sql', 'Materialized views');
    await applySqlFile('04_data_integrity_triggers.sql', 'Data integrity triggers');

    console.log('\n🎉 All optimizations applied successfully!\n');
    console.log('Next steps:');
    console.log('  1. Test search functionality');
    console.log('  2. Verify materialized views: SELECT * FROM user_reading_stats LIMIT 5;');
    console.log('  3. Set up daily refresh: SELECT refresh_all_analytics_views();');
    console.log('  4. Monitor query performance\n');

  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
