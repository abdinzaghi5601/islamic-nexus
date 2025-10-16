import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.hadithBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        hadith: {
          include: {
            chapter: {
              select: {
                nameEnglish: true,
                nameArabic: true,
                number: true,
              },
            },
            book: {
              select: {
                name: true,
                nameArabic: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Hadith bookmarks GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, hadithId, note } = body;

    if (!userId || !hadithId) {
      return NextResponse.json(
        { error: 'userId and hadithId are required' },
        { status: 400 }
      );
    }

    // Check if bookmark already exists
    const existing = await prisma.hadithBookmark.findUnique({
      where: {
        userId_hadithId: {
          userId,
          hadithId,
        },
      },
    });

    let bookmark;

    if (existing) {
      // Update note if bookmark exists
      bookmark = await prisma.hadithBookmark.update({
        where: {
          userId_hadithId: {
            userId,
            hadithId,
          },
        },
        data: {
          note: note || null,
        },
        include: {
          hadith: {
            include: {
              chapter: {
                select: {
                  nameEnglish: true,
                  number: true,
                },
              },
              book: {
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
      bookmark = await prisma.hadithBookmark.create({
        data: {
          userId,
          hadithId,
          note: note || null,
        },
        include: {
          hadith: {
            include: {
              chapter: {
                select: {
                  nameEnglish: true,
                  number: true,
                },
              },
              book: {
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
    console.error('Hadith bookmark POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, hadithId } = body;

    if (!userId || !hadithId) {
      return NextResponse.json(
        { error: 'userId and hadithId are required' },
        { status: 400 }
      );
    }

    await prisma.hadithBookmark.delete({
      where: {
        userId_hadithId: {
          userId,
          hadithId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hadith bookmark DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
