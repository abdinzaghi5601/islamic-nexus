import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get reading history
    const history = await prisma.readingHistory.findMany({
      where: { userId },
      orderBy: { readAt: 'desc' },
      take: 50,
      include: {
        ayah: {
          include: {
            surah: {
              select: {
                nameEnglish: true,
                nameArabic: true,
                number: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Reading history GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, ayahId } = body;

    if (!userId || !ayahId) {
      return NextResponse.json(
        { error: 'userId and ayahId are required' },
        { status: 400 }
      );
    }

    // Check if this ayah was read in the last 5 minutes (avoid duplicates)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentRead = await prisma.readingHistory.findFirst({
      where: {
        userId,
        ayahId,
        readAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    if (recentRead) {
      // Already recorded recently, don't duplicate
      return NextResponse.json({
        success: true,
        message: 'Already recorded',
        history: recentRead
      });
    }

    // Create reading history entry
    const history = await prisma.readingHistory.create({
      data: {
        userId,
        ayahId,
        readAt: new Date(),
      },
      include: {
        ayah: {
          include: {
            surah: {
              select: {
                nameEnglish: true,
                number: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error('Reading history POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
