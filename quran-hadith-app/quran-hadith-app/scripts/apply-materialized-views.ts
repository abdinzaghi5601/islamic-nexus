/**
 * Apply materialized views for analytics with correct camelCase column names
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applyMaterializedViews() {
  console.log('📊 Creating materialized views for analytics...\n');

  try {
    // 1. User Reading Statistics
    console.log('1. Creating user_reading_stats view...');
    await prisma.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS user_reading_stats AS
      SELECT
        "userId",
        COUNT(DISTINCT "surahId") FILTER (WHERE "surahId" IS NOT NULL) AS surahs_read,
        COUNT(DISTINCT "ayahId") FILTER (WHERE "ayahId" IS NOT NULL) AS ayahs_read,
        COUNT(DISTINCT "hadithId") FILTER (WHERE "hadithId" IS NOT NULL) AS hadiths_read,
        MAX("readAt") AS last_read_at,
        MIN("readAt") AS first_read_at,
        COUNT(*) AS total_reads,
        COUNT(DISTINCT DATE("readAt")) AS days_active
      FROM reading_history
      GROUP BY "userId"
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_reading_stats_user_id
        ON user_reading_stats("userId")
    `;
    console.log('   ✅ user_reading_stats created\n');

    // 2. User Memorization Progress
    console.log('2. Creating user_memorization_progress view...');
    await prisma.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS user_memorization_progress AS
      SELECT
        mg."userId",
        COUNT(DISTINCT mg.id) AS total_goals,
        COUNT(DISTINCT mg.id) FILTER (WHERE mg.status = 'active') AS active_goals,
        COUNT(DISTINCT mg.id) FILTER (WHERE mg.status = 'completed') AS completed_goals,
        COUNT(DISTINCT ms."ayahId") AS ayahs_practiced,
        COALESCE(SUM(ms.repetitions), 0) AS total_repetitions,
        COALESCE(AVG(ms.confidence)::NUMERIC(10,2), 0) AS avg_confidence,
        COALESCE(SUM(ms.duration), 0) AS total_practice_minutes,
        MAX(ms."sessionDate") AS last_session_date,
        COUNT(DISTINCT mr."ayahId") AS ayahs_in_review,
        COUNT(DISTINCT mr."ayahId") FILTER (WHERE mr."nextReviewDate" < NOW()) AS overdue_reviews
      FROM memorization_goals mg
      LEFT JOIN memorization_sessions ms ON mg.id = ms."goalId"
      LEFT JOIN memorization_reviews mr ON mg.id = mr."goalId"
      GROUP BY mg."userId"
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_memorization_progress_user_id
        ON user_memorization_progress("userId")
    `;
    console.log('   ✅ user_memorization_progress created\n');

    // 3. User Vocabulary Mastery
    console.log('3. Creating user_vocabulary_mastery view...');
    await prisma.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS user_vocabulary_mastery AS
      SELECT
        vl."userId",
        COUNT(DISTINCT vl.id) AS total_lists,
        COUNT(DISTINCT vi.id) AS total_words,
        COUNT(DISTINCT vi.id) FILTER (WHERE vi.mastery >= 90) AS mastered_words,
        COUNT(DISTINCT vi.id) FILTER (WHERE vi.mastery >= 70 AND vi.mastery < 90) AS proficient_words,
        COUNT(DISTINCT vi.id) FILTER (WHERE vi.mastery < 70) AS learning_words,
        COALESCE(AVG(vi.mastery)::NUMERIC(10,2), 0) AS avg_mastery,
        COUNT(DISTINCT vi.id) FILTER (WHERE vi."lastReviewed" IS NOT NULL) AS reviewed_words,
        MAX(vi."lastReviewed") AS last_review_date,
        COALESCE(SUM(vi."reviewCount"), 0) AS total_reviews
      FROM vocabulary_lists vl
      LEFT JOIN vocabulary_items vi ON vl.id = vi."listId"
      GROUP BY vl."userId"
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_vocabulary_mastery_user_id
        ON user_vocabulary_mastery("userId")
    `;
    console.log('   ✅ user_vocabulary_mastery created\n');

    // 4. User Learning Streaks
    console.log('4. Creating user_learning_streaks view...');
    await prisma.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS user_learning_streaks AS
      WITH daily_activity AS (
        SELECT
          "userId",
          DATE(date) AS activity_date,
          SUM("studyMinutes") AS total_minutes,
          SUM("wordsLearned") AS words_learned,
          SUM("ayahsMemorized") AS ayahs_memorized
        FROM learning_progress
        GROUP BY "userId", DATE(date)
      ),
      streaks AS (
        SELECT
          "userId",
          activity_date,
          activity_date - (ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY activity_date))::INTEGER AS streak_group
        FROM daily_activity
      )
      SELECT
        "userId",
        MAX(activity_date) AS last_activity_date,
        COUNT(*) AS current_streak_days,
        MIN(activity_date) AS streak_start_date
      FROM streaks
      WHERE streak_group = (
        SELECT MAX(streak_group)
        FROM streaks s2
        WHERE s2."userId" = streaks."userId"
      )
      GROUP BY "userId", streak_group
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_learning_streaks_user_id
        ON user_learning_streaks("userId")
    `;
    console.log('   ✅ user_learning_streaks created\n');

    // 5. Popular Content Analytics
    console.log('5. Creating popular_content_stats view...');
    await prisma.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS popular_content_stats AS
      SELECT
        'ayah' AS content_type,
        a.id AS content_id,
        a."surahId",
        a."ayahNumber",
        s."nameEnglish" AS surah_name,
        COUNT(DISTINCT b."userId") AS bookmark_count,
        COUNT(DISTINCT rh."userId") AS read_count,
        COUNT(DISTINCT n."userId") AS note_count,
        (COUNT(DISTINCT b."userId") * 3 +
         COUNT(DISTINCT rh."userId") +
         COUNT(DISTINCT n."userId") * 2) AS popularity_score
      FROM ayahs a
      JOIN surahs s ON a."surahId" = s.id
      LEFT JOIN bookmarks b ON a.id = b."ayahId"
      LEFT JOIN reading_history rh ON a.id = rh."ayahId"
      LEFT JOIN notes n ON a.id = n."ayahId"
      GROUP BY a.id, a."surahId", a."ayahNumber", s."nameEnglish"

      UNION ALL

      SELECT
        'hadith' AS content_type,
        h.id AS content_id,
        h."bookId" AS "surahId",
        NULL AS "ayahNumber",
        hb.name AS surah_name,
        COUNT(DISTINCT hbm."userId") AS bookmark_count,
        COUNT(DISTINCT rh."userId") AS read_count,
        COUNT(DISTINCT n."userId") AS note_count,
        (COUNT(DISTINCT hbm."userId") * 3 +
         COUNT(DISTINCT rh."userId") +
         COUNT(DISTINCT n."userId") * 2) AS popularity_score
      FROM hadiths h
      JOIN hadith_books hb ON h."bookId" = hb.id
      LEFT JOIN hadith_bookmarks hbm ON h.id = hbm."hadithId"
      LEFT JOIN reading_history rh ON h.id = rh."hadithId"
      LEFT JOIN notes n ON h.id = n."hadithId"
      GROUP BY h.id, h."bookId", hb.name
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_popular_content_stats_type_score
        ON popular_content_stats(content_type, popularity_score DESC)
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_popular_content_stats_surah
        ON popular_content_stats("surahId", popularity_score DESC)
        WHERE content_type = 'ayah'
    `;
    console.log('   ✅ popular_content_stats created\n');

    // 6. Hadith Book Statistics
    console.log('6. Creating hadith_book_stats view...');
    await prisma.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS hadith_book_stats AS
      SELECT
        hb.id AS book_id,
        hb.name AS book_name,
        hb.author,
        COUNT(DISTINCT h.id) AS total_hadiths,
        COUNT(DISTINCT h.id) FILTER (WHERE h.grade = 'Sahih') AS sahih_count,
        COUNT(DISTINCT h.id) FILTER (WHERE h.grade = 'Hasan') AS hasan_count,
        COUNT(DISTINCT h.id) FILTER (WHERE h.grade IN ('Daif', 'Mawdu')) AS weak_count,
        COUNT(DISTINCT hc.id) AS chapter_count,
        COUNT(DISTINCT hbm."userId") AS unique_bookmarkers,
        COUNT(hbm.id) AS total_bookmarks
      FROM hadith_books hb
      LEFT JOIN hadiths h ON hb.id = h."bookId"
      LEFT JOIN hadith_chapters hc ON hb.id = hc."bookId"
      LEFT JOIN hadith_bookmarks hbm ON h.id = hbm."hadithId"
      GROUP BY hb.id, hb.name, hb.author
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_hadith_book_stats_book_id
        ON hadith_book_stats(book_id)
    `;
    console.log('   ✅ hadith_book_stats created\n');

    // Create refresh function
    console.log('7. Creating refresh function...');
    await prisma.$executeRaw`
      CREATE OR REPLACE FUNCTION refresh_all_analytics_views()
      RETURNS void AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_reading_stats;
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_memorization_progress;
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_vocabulary_mastery;
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_learning_streaks;
        REFRESH MATERIALIZED VIEW CONCURRENTLY popular_content_stats;
        REFRESH MATERIALIZED VIEW CONCURRENTLY hadith_book_stats;
        RAISE NOTICE 'All materialized views refreshed successfully';
      END;
      $$ LANGUAGE plpgsql
    `;
    console.log('   ✅ refresh_all_analytics_views() function created\n');

    console.log('🎉 All materialized views created successfully!\n');
    console.log('📝 Next steps:');
    console.log('  1. Query views: SELECT * FROM user_reading_stats LIMIT 5;');
    console.log('  2. Refresh daily: SELECT refresh_all_analytics_views();');
    console.log('  3. Use: npx tsx scripts/refresh-materialized-views.ts\n');

  } catch (error) {
    console.error('\n❌ Error creating materialized views:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\nℹ️  Some views already exist. To recreate them:');
      console.log('   DROP MATERIALIZED VIEW IF EXISTS view_name CASCADE;');
    }
  } finally {
    await prisma.$disconnect();
  }
}

applyMaterializedViews();
