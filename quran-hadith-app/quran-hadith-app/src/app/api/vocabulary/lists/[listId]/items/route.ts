import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// GET: Fetch all items in a vocabulary list
export async function GET(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const user = await requireAuth();

    const { listId } = params;

    // Verify the list belongs to the user
    const list = await prisma.vocabularyList.findFirst({
      where: {
        id: listId,
        userId: user.id,
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    const items = await prisma.vocabularyItem.findMany({
      where: { listId },
      include: {
        root: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching vocabulary items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary items' },
      { status: 500 }
    );
  }
}

// POST: Add a new item to a vocabulary list
export async function POST(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const user = await requireAuth();

    const { listId } = params;

    // Verify the list belongs to the user
    const list = await prisma.vocabularyList.findFirst({
      where: {
        id: listId,
        userId: user.id,
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      wordId,
      rootId,
      arabicText,
      transliteration,
      meaning,
      example,
    } = body;

    if (!arabicText || !meaning) {
      return NextResponse.json(
        { error: 'Arabic text and meaning are required' },
        { status: 400 }
      );
    }

    const item = await prisma.vocabularyItem.create({
      data: {
        listId,
        wordId: wordId ? parseInt(wordId) : null,
        rootId: rootId ? parseInt(rootId) : null,
        arabicText: arabicText.trim(),
        transliteration: transliteration?.trim() || null,
        meaning: meaning.trim(),
        example: example?.trim() || null,
        mastery: 0,
        reviewCount: 0,
      },
      include: {
        root: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding vocabulary item:', error);
    return NextResponse.json(
      { error: 'Failed to add vocabulary item' },
      { status: 500 }
    );
  }
}
