import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * POST /api/admin/add-hadith-to-ayah
 * Add a hadith reference to a specific ayah
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ayahId, bookName, hadithNumber, textArabic, textEnglish, relevance } = body;

    // Validate required fields
    if (!ayahId || !bookName || !hadithNumber || !textEnglish) {
      return errorResponse('Missing required fields: ayahId, bookName, hadithNumber, textEnglish');
    }

    // Find or create the hadith book
    let hadithBook = await prisma.hadithBook.findFirst({
      where: { name: bookName },
    });

    if (!hadithBook) {
      // Create new book if it doesn't exist
      hadithBook = await prisma.hadithBook.create({
        data: {
          name: bookName,
          author: 'Unknown', // Default author
          totalHadiths: 0,
        },
      });
    }

    // Check if hadith already exists in the database
    let hadith = await prisma.hadith.findFirst({
      where: {
        bookId: hadithBook.id,
        hadithNumber: hadithNumber,
      },
    });

    if (!hadith) {
      // Create the hadith if it doesn't exist
      hadith = await prisma.hadith.create({
        data: {
          bookId: hadithBook.id,
          hadithNumber: hadithNumber,
          textArabic: textArabic || '',
          textEnglish: textEnglish,
          grade: 'Unknown', // Default grade
        },
      });
    }

    // Check if this hadith-ayah reference already exists
    const existingReference = await prisma.hadithAyahReference.findFirst({
      where: {
        hadithId: hadith.id,
        ayahId: ayahId,
      },
    });

    if (existingReference) {
      return errorResponse('This hadith is already linked to this ayah', 400);
    }

    // Create the hadith-ayah reference
    const reference = await prisma.hadithAyahReference.create({
      data: {
        hadithId: hadith.id,
        ayahId: ayahId,
      },
    });

    return successResponse({
      message: 'Hadith added successfully',
      reference,
      hadith,
    });
  } catch (error) {
    console.error('Error adding hadith to ayah:', error);
    return errorResponse('Failed to add hadith', 500);
  }
}
