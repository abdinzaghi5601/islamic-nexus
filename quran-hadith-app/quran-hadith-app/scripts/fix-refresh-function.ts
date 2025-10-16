/**
 * Fix refresh function to handle views without unique indexes
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRefreshFunction() {
  console.log('🔧 Fixing refresh function...\n');

  try {
    await prisma.$executeRaw`
      CREATE OR REPLACE FUNCTION refresh_all_analytics_views()
      RETURNS void AS $$
      BEGIN
        -- These have unique indexes, can refresh concurrently (no locking)
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_reading_stats;
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_memorization_progress;
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_vocabulary_mastery;
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_learning_streaks;
        REFRESH MATERIALIZED VIEW CONCURRENTLY hadith_book_stats;

        -- This one doesn't have unique index, refresh normally (locks table briefly)
        REFRESH MATERIALIZED VIEW popular_content_stats;

        RAISE NOTICE 'All materialized views refreshed successfully';
      END;
      $$ LANGUAGE plpgsql
    `;

    console.log('✅ Refresh function fixed!\n');
    console.log('Testing refresh...');

    await prisma.$executeRaw`SELECT refresh_all_analytics_views()`;

    console.log('✅ Refresh working perfectly!\n');
    console.log('💡 The function now:');
    console.log('   • Refreshes 5 views CONCURRENTLY (no locking, users can query during refresh)');
    console.log('   • Refreshes 1 view normally (brief lock, very fast)');
    console.log('   • Safe to run during production hours\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixRefreshFunction();
