import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// PATCH: Update a vocabulary item (mastery, review, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth();

    const { itemId } = params;

    // Verify the item belongs to a list owned by the user
    const item = await prisma.vocabularyItem.findFirst({
      where: {
        id: itemId,
      },
      include: {
        list: true,
      },
    });

    if (!item || item.list.userId !== user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { mastery, markReviewed } = body;

    const updateData: any = {};

    if (typeof mastery === 'number') {
      updateData.mastery = Math.min(100, Math.max(0, mastery));
    }

    if (markReviewed) {
      updateData.lastReviewed = new Date();
      updateData.reviewCount = item.reviewCount + 1;
    }

    const updatedItem = await prisma.vocabularyItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        root: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating vocabulary item:', error);
    return NextResponse.json(
      { error: 'Failed to update vocabulary item' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a vocabulary item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth();

    const { itemId } = params;

    // Verify the item belongs to a list owned by the user
    const item = await prisma.vocabularyItem.findFirst({
      where: {
        id: itemId,
      },
      include: {
        list: true,
      },
    });

    if (!item || item.list.userId !== user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await prisma.vocabularyItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vocabulary item:', error);
    return NextResponse.json(
      { error: 'Failed to delete vocabulary item' },
      { status: 500 }
    );
  }
}
