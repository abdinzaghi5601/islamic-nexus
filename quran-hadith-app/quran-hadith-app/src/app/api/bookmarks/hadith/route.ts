import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// GET /api/bookmarks/hadith - Get all hadith bookmarks for current user
export async function GET() {
  try {
    const user = await requireAuth();

    const bookmarks = await prisma.hadithBookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        hadith: {
          include: {
            chapter: {
              select: {
                nameEnglish: true,
                nameArabic: true,
                chapterNumber: true,
              },
            },
            book: {
              select: {
                name: true,
                nameArabic: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching hadith bookmarks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/bookmarks/hadith - Create a new hadith bookmark
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { hadithId, note } = body;

    if (!hadithId) {
      return NextResponse.json(
        { error: 'Hadith ID is required' },
        { status: 400 }
      );
    }

    // Check if hadith exists
    const hadith = await prisma.hadith.findUnique({
      where: { id: hadithId },
    });

    if (!hadith) {
      return NextResponse.json(
        { error: 'Hadith not found' },
        { status: 404 }
      );
    }

    // Check if already bookmarked
    const existing = await prisma.hadithBookmark.findUnique({
      where: {
        userId_hadithId: {
          userId: user.id,
          hadithId,
        },
      },
    });

    if (existing) {
      // Update existing bookmark
      const updated = await prisma.hadithBookmark.update({
        where: { id: existing.id },
        data: { note },
      });

      return NextResponse.json({ bookmark: updated, updated: true });
    }

    // Create new bookmark
    const bookmark = await prisma.hadithBookmark.create({
      data: {
        userId: user.id,
        hadithId,
        note,
      },
    });

    return NextResponse.json({ bookmark, updated: false }, { status: 201 });
  } catch (error) {
    console.error('Error creating hadith bookmark:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE /api/bookmarks/hadith - Delete a hadith bookmark
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const hadithId = searchParams.get('hadithId');

    if (!hadithId) {
      return NextResponse.json(
        { error: 'Hadith ID is required' },
        { status: 400 }
      );
    }

    const bookmark = await prisma.hadithBookmark.findUnique({
      where: {
        userId_hadithId: {
          userId: user.id,
          hadithId: parseInt(hadithId),
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    await prisma.hadithBookmark.delete({
      where: { id: bookmark.id },
    });

    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting hadith bookmark:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
