import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// GET /api/bookmarks/ayah - Get all ayah bookmarks for current user
export async function GET() {
  try {
    const user = await requireAuth();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
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
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/bookmarks/ayah - Create a new ayah bookmark
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { ayahId, note } = body;

    if (!ayahId) {
      return NextResponse.json(
        { error: 'Ayah ID is required' },
        { status: 400 }
      );
    }

    // Check if ayah exists
    const ayah = await prisma.ayah.findUnique({
      where: { id: ayahId },
    });

    if (!ayah) {
      return NextResponse.json(
        { error: 'Ayah not found' },
        { status: 404 }
      );
    }

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_ayahId: {
          userId: user.id,
          ayahId,
        },
      },
    });

    if (existing) {
      // Update existing bookmark
      const updated = await prisma.bookmark.update({
        where: { id: existing.id },
        data: { note },
      });

      return NextResponse.json({ bookmark: updated, updated: true });
    }

    // Create new bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        ayahId,
        note,
      },
    });

    return NextResponse.json({ bookmark, updated: false }, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE /api/bookmarks/ayah - Delete an ayah bookmark
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const ayahId = searchParams.get('ayahId');

    if (!ayahId) {
      return NextResponse.json(
        { error: 'Ayah ID is required' },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_ayahId: {
          userId: user.id,
          ayahId: parseInt(ayahId),
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    });

    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
