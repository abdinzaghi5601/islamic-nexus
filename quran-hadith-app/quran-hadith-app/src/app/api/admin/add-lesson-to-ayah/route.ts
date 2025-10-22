import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { withAdminAuth } from '@/middleware/admin-auth';

/**
 * POST /api/admin/add-lesson-to-ayah
 * Add a lesson or teaching to a specific ayah
 * PROTECTED: Requires admin authentication
 */
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { ayahId, title, lessonText, category, source } = body;

    // Validate required fields
    if (!ayahId || !title || !lessonText) {
      return errorResponse('Missing required fields: ayahId, title, lessonText');
    }

    // Create the lesson
    const lesson = await prisma.ayahLesson.create({
      data: {
        ayahId: ayahId,
        title: title,
        lessonText: lessonText,
        category: category || 'General',
        source: source || null,
      },
    });

    return successResponse({
      message: 'Lesson added successfully',
      lesson,
    });
  } catch (error) {
    console.error('Error adding lesson to ayah:', error);
    return errorResponse('Failed to add lesson', 500);
  }
});
