import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { checkAchievements, ACHIEVEMENTS } from '@/lib/achievements';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user stats
    const [
      totalReads,
      uniqueAyahs,
      bookmarksCount,
      hadithBookmarksCount,
      duaBookmarksCount,
    ] = await Promise.all([
      prisma.readingHistory.count({ where: { userId } }),
      prisma.readingHistory.findMany({
        where: { userId },
        distinct: ['ayahId'],
        select: { ayahId: true },
      }),
      prisma.bookmark.count({ where: { userId } }),
      prisma.hadithBookmark.count({ where: { userId } }),
      prisma.duaBookmark.count({ where: { userId } }),
    ]);

    // Calculate streak (simplified - check consecutive days)
    let streak = 0;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const nextDay = new Date(checkDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const hasRead = await prisma.readingHistory.count({
        where: {
          userId,
          readAt: {
            gte: checkDate,
            lt: nextDay,
          },
        },
      });

      if (hasRead > 0) {
        streak++;
      } else {
        break;
      }
    }

    // Prepare stats for achievement checking
    const userStats = {
      ayahReads: totalReads,
      uniqueAyahs: uniqueAyahs.length,
      bookmarks: bookmarksCount,
      hadithBookmarks: hadithBookmarksCount,
      duaBookmarks: duaBookmarksCount,
      streak,
    };

    // Check which achievements are unlocked
    const unlockedAchievements = checkAchievements(userStats);

    return NextResponse.json({
      achievements: unlockedAchievements,
      totalAchievements: ACHIEVEMENTS.length,
      unlockedCount: unlockedAchievements.length,
      stats: userStats,
    });
  } catch (error) {
    console.error('Achievements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
