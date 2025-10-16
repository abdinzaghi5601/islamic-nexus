import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    // For demonstration, we'll make this endpoint public during development
    // In production, you should properly validate the session token from cookies

    // Get user ID from query params for now (client will send it)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user statistics
    const [
      bookmarksCount,
      hadithBookmarksCount,
      duaBookmarksCount,
      readingHistoryCount,
      recentBookmarks,
      recentHistory,
    ] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.hadithBookmark.count({ where: { userId } }),
      prisma.duaBookmark.count({ where: { userId } }),
      prisma.readingHistory.count({ where: { userId } }),
      prisma.bookmark.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          ayah: {
            include: {
              surah: {
                select: {
                  nameEnglish: true,
                  number: true,
                },
              },
              translations: {
                take: 1,
                include: {
                  translator: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.readingHistory.findMany({
        where: { userId },
        take: 5,
        orderBy: { readAt: 'desc' },
      }),
    ]);

    const totalBookmarks =
      bookmarksCount + hadithBookmarksCount + duaBookmarksCount;

    return NextResponse.json({
      stats: {
        totalBookmarks,
        bookmarksCount,
        hadithBookmarksCount,
        duaBookmarksCount,
        readingHistoryCount,
      },
      recentBookmarks,
      recentHistory,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
