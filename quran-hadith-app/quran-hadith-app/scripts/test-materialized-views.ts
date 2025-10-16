/**
 * Test materialized views
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testViews() {
  console.log('🔍 Testing Materialized Views...\n');

  try {
    // 1. List all views
    const views = await prisma.$queryRaw<Array<{ matviewname: string }>>`
      SELECT matviewname FROM pg_matviews WHERE schemaname = 'public' ORDER BY matviewname
    `;
    console.log(`✅ Found ${views.length} materialized views:`);
    views.forEach(v => console.log(`   • ${v.matviewname}`));

    // 2. Test user_reading_stats
    console.log('\n📖 Testing user_reading_stats...');
    const readingStats = await prisma.$queryRaw<Array<any>>`
      SELECT * FROM user_reading_stats LIMIT 3
    `;
    console.log(`   Found ${readingStats.length} users with reading stats`);
    readingStats.forEach((s, i) => {
      console.log(`   ${i + 1}. User: Surahs=${s.surahs_read}, Ayahs=${s.ayahs_read}, Hadiths=${s.hadiths_read}`);
    });

    // 3. Test popular_content_stats
    console.log('\n🔥 Testing popular_content_stats (Top 5 popular ayahs)...');
    const popularAyahs = await prisma.$queryRaw<Array<any>>`
      SELECT * FROM popular_content_stats
      WHERE content_type = 'ayah'
      ORDER BY popularity_score DESC
      LIMIT 5
    `;
    console.log(`   Found ${popularAyahs.length} popular ayahs`);
    popularAyahs.forEach((a, i) => {
      console.log(`   ${i + 1}. ${a.surah_name} ${a.ayahNumber} - Score: ${a.popularity_score} (${a.bookmark_count} bookmarks)`);
    });

    // 4. Test hadith_book_stats
    console.log('\n📚 Testing hadith_book_stats...');
    const bookStats = await prisma.$queryRaw<Array<any>>`
      SELECT * FROM hadith_book_stats ORDER BY total_hadiths DESC LIMIT 5
    `;
    console.log(`   Found ${bookStats.length} hadith books`);
    bookStats.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.book_name} - ${b.total_hadiths} hadiths (${b.sahih_count} Sahih)`);
    });

    // 5. Test user_memorization_progress
    console.log('\n🧠 Testing user_memorization_progress...');
    const memProgress = await prisma.$queryRaw<Array<any>>`
      SELECT * FROM user_memorization_progress LIMIT 3
    `;
    console.log(`   Found ${memProgress.length} users with memorization data`);
    memProgress.forEach((m, i) => {
      console.log(`   ${i + 1}. Goals: ${m.total_goals} (${m.active_goals} active), Practiced: ${m.ayahs_practiced} ayahs`);
    });

    // 6. Test refresh function
    console.log('\n🔄 Testing refresh function...');
    await prisma.$executeRaw`SELECT refresh_all_analytics_views()`;
    console.log('   ✅ All views refreshed successfully!');

    console.log('\n✅ All materialized views are working perfectly!\n');
    console.log('💡 Usage examples:');
    console.log('   • Get user stats: SELECT * FROM user_reading_stats WHERE "userId" = \'user123\';');
    console.log('   • Top popular: SELECT * FROM popular_content_stats ORDER BY popularity_score DESC LIMIT 10;');
    console.log('   • Refresh: SELECT refresh_all_analytics_views();\n');
    console.log('⚠️  Remember to refresh daily for up-to-date analytics!');
    console.log('   Run: npx tsx scripts/refresh-materialized-views.ts\n');

  } catch (error) {
    console.error('\n❌ Error testing views:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testViews();
