import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { withAdminAuth } from '@/middleware/admin-auth';

/**
 * POST /api/admin/duas/create
 * Create a new dua
 * PROTECTED: Requires admin authentication
 */
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const {
      categoryId,
      title,
      titleArabic,
      textArabic,
      textEnglish,
      transliteration,
      reference,
      tags,
      benefits,
      occasion,
    } = body;

    // Validate required fields
    if (!categoryId || !title || !textArabic || !textEnglish) {
      return errorResponse('Category, title, Arabic text, and English text are required', 400);
    }

    // Verify category exists
    const category = await prisma.duaCategory.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    // Create dua
    const dua = await prisma.dua.create({
      data: {
        categoryId: parseInt(categoryId),
        title,
        titleArabic: titleArabic || null,
        textArabic,
        textEnglish,
        transliteration: transliteration || null,
        reference: reference || null,
        tags: tags || null,
        benefits: benefits || null,
        occasion: occasion || null,
      },
      include: {
        category: true,
      },
    });

    return successResponse({
      message: 'Dua created successfully',
      dua: {
        id: dua.id,
        title: dua.title,
        category: dua.category.name,
      },
    });
  } catch (error) {
    console.error('Error creating dua:', error);
    return errorResponse('Failed to create dua', 500);
  }
});
