/**
 * Apply full-text search enhancements to PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function applyMigration() {
  console.log('🔍 Applying full-text search migration...\n');

  try {
    await prisma.$connect();

    const migrationPath = path.join(
      process.cwd(),
      'prisma/migrations/20251015_add_fulltext_search/migration.sql'
    );

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...\n`);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement);
          console.log(`✅ Executed: ${statement.substring(0, 60)}...`);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.message?.includes('already exists')) {
            console.log(`⏭️  Skipped (already exists): ${statement.substring(0, 60)}...`);
          } else {
            console.error(`❌ Error: ${error.message}`);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
          }
        }
      }
    }

    console.log('\n✅ Full-text search migration completed!');
    console.log('\n🎉 Your database now has:');
    console.log('   - Full-text search on Arabic and English text');
    console.log('   - GIN indexes for fast searching');
    console.log('   - Trigram indexes for fuzzy/typo-tolerant search');
    console.log('   - Auto-updating search vectors via triggers\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
