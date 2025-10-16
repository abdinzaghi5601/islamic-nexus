import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// Helper function to get start of day in UTC
function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// Calculate reading streak
async function calculateStreak(userId: string): Promise<number> {
  const today = getStartOfDay(new Date());
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Check if user read anything on this day
    const readCount = await prisma.readingHistory.count({
      where: {
        userId,
        readAt: {
          gte: currentDate,
          lt: nextDay,
        },
      },
    });

    if (readCount > 0) {
      streak++;
      // Check previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Streak broken
      break;
    }

    // Safety limit: don't calculate more than 365 days
    if (streak >= 365) break;
  }

  return streak;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate streak
    const streak = await calculateStreak(userId);

    // Get today's reading count
    const today = getStartOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReads = await prisma.readingHistory.count({
      where: {
        userId,
        readAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Get unique ayahs read today
    const todayUniqueAyahs = await prisma.readingHistory.findMany({
      where: {
        userId,
        readAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      distinct: ['ayahId'],
      select: {
        ayahId: true,
      },
    });

    // Get total unique ayahs ever read
    const totalUniqueAyahs = await prisma.readingHistory.findMany({
      where: { userId },
      distinct: ['ayahId'],
      select: {
        ayahId: true,
      },
    });

    // Get this week's stats (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyReads = await prisma.readingHistory.count({
      where: {
        userId,
        readAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return NextResponse.json({
      streak,
      todayReads,
      todayUniqueAyahs: todayUniqueAyahs.length,
      totalUniqueAyahs: totalUniqueAyahs.length,
      weeklyReads,
    });
  } catch (error) {
    console.error('Reading stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
