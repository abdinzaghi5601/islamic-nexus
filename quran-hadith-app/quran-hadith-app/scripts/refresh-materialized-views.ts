/**
 * Script to refresh all materialized views
 * Run with: npx tsx scripts/refresh-materialized-views.ts
 *
 * Set this up as a daily cron job or scheduled task
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function refreshViews() {
  console.log('🔄 Refreshing materialized views...\n');

  const views = [
    'user_reading_stats',
    'user_memorization_progress',
    'user_vocabulary_mastery',
    'user_learning_streaks',
    'popular_content_stats',
    'hadith_book_stats',
  ];

  try {
    await prisma.$connect();

    for (const view of views) {
      try {
        const startTime = Date.now();
        await prisma.$executeRawUnsafe(
          `REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`
        );
        const duration = Date.now() - startTime;
        console.log(`  ✅ ${view.padEnd(30)} (${duration}ms)`);
      } catch (error) {
        console.error(`  ❌ ${view.padEnd(30)} - ${error.message}`);
      }
    }

    console.log('\n🎉 All materialized views refreshed successfully!');
    console.log(`⏰ Last refresh: ${new Date().toISOString()}\n`);

  } catch (error) {
    console.error('\n❌ Error refreshing views:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

refreshViews();
