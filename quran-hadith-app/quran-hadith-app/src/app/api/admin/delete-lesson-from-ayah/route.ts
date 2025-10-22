import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { withAdminAuth } from '@/middleware/admin-auth';

/**
 * DELETE /api/admin/delete-lesson-from-ayah
 * Deletes a lesson from a specific ayah
 * PROTECTED: Requires admin authentication
 */
export const DELETE = withAdminAuth(async (request: Request) => {
  try {
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Missing lessonId' },
        { status: 400 }
      );
    }

    // Delete the lesson
    await prisma.ayahLesson.delete({
      where: {
        id: parseInt(lessonId),
      },
    });

    return NextResponse.json(
      { message: 'Lesson deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
});
