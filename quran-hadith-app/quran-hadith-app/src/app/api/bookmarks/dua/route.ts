import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.duaBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        dua: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Dua bookmarks GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, duaId, note } = body;

    if (!userId || !duaId) {
      return NextResponse.json(
        { error: 'userId and duaId are required' },
        { status: 400 }
      );
    }

    // Check if bookmark already exists
    const existing = await prisma.duaBookmark.findUnique({
      where: {
        userId_duaId: {
          userId,
          duaId,
        },
      },
    });

    let bookmark;

    if (existing) {
      // Update note if bookmark exists
      bookmark = await prisma.duaBookmark.update({
        where: {
          userId_duaId: {
            userId,
            duaId,
          },
        },
        data: {
          note: note || null,
        },
        include: {
          dua: {
            include: {
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Create new bookmark
      bookmark = await prisma.duaBookmark.create({
        data: {
          userId,
          duaId,
          note: note || null,
        },
        include: {
          dua: {
            include: {
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true, bookmark });
  } catch (error) {
    console.error('Dua bookmark POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, duaId } = body;

    if (!userId || !duaId) {
      return NextResponse.json(
        { error: 'userId and duaId are required' },
        { status: 400 }
      );
    }

    await prisma.duaBookmark.delete({
      where: {
        userId_duaId: {
          userId,
          duaId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Dua bookmark DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
