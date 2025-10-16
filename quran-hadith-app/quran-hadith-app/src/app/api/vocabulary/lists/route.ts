import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// GET: Fetch all vocabulary lists for the user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const lists = await prisma.vocabularyList.findMany({
      where: { userId: user.id },
      include: {
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to include item count
    const listsWithCount = lists.map((list) => ({
      id: list.id,
      name: list.name,
      description: list.description,
      isPublic: list.isPublic,
      itemCount: list.items.length,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    }));

    return NextResponse.json(listsWithCount);
  } catch (error) {
    console.error('Error fetching vocabulary lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary lists' },
      { status: 500 }
    );
  }
}

// POST: Create a new vocabulary list
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { name, description, isPublic } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      );
    }

    const list = await prisma.vocabularyList.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error('Error creating vocabulary list:', error);
    return NextResponse.json(
      { error: 'Failed to create vocabulary list' },
      { status: 500 }
    );
  }
}
