import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';
import { withAdminAuth } from '@/middleware/admin-auth';

/**
 * POST /api/admin/books/import-archive
 * Import a book from Archive.org
 * PROTECTED: Requires admin authentication
 */
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { identifier, title, author, description, publishYear } = body;

    if (!identifier || !title) {
      return errorResponse('Identifier and title are required', 400);
    }

    // Check if book already exists
    const existingBook = await prisma.book.findFirst({
      where: {
        OR: [
          { pdfUrl: { contains: identifier } },
          {
            AND: [
              { title: { contains: title.substring(0, 50) } },
              { author: author || '' },
            ],
          },
        ],
      },
    });

    if (existingBook) {
      return errorResponse('Book already exists in library', 400);
    }

    // Archive.org PDF URL format
    const pdfUrl = `https://archive.org/download/${identifier}/${identifier}.pdf`;

    // Determine category based on title/description
    let category = 'General';
    const text = `${title} ${description || ''}`.toLowerCase();

    if (text.includes('tafsir') || text.includes('commentary') || text.includes('exegesis')) {
      category = 'Tafsir';
    } else if (text.includes('hadith') || text.includes('bukhari') || text.includes('muslim')) {
      category = 'Hadith Commentary';
    } else if (text.includes('seerah') || text.includes('biography') || text.includes('prophet')) {
      category = 'Seerah';
    } else if (text.includes('fiqh') || text.includes('jurisprudence')) {
      category = 'Fiqh';
    } else if (text.includes('aqeedah') || text.includes('creed') || text.includes('theology')) {
      category = 'Aqeedah';
    } else if (text.includes('history')) {
      category = 'Islamic History';
    } else if (text.includes('arabic') || text.includes('grammar') || text.includes('language')) {
      category = 'Arabic Language';
    }

    // Create book in database
    const book = await prisma.book.create({
      data: {
        title,
        author: author || 'Unknown Author',
        category,
        language: 'English', // Most Archive.org books are English
        description: description || null,
        pdfUrl,
        publishYear: publishYear || null,
        tags: `archive.org, ${category.toLowerCase()}, public domain`,
      },
    });

    // Note: Text extraction should be done separately via the extract-pdf-text script
    // because downloading and processing large PDFs can timeout in API routes

    return successResponse({
      message: 'Book imported successfully. Run extract-pdf-text script to make it searchable.',
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        pdfUrl: book.pdfUrl,
      },
      nextSteps: [
        `Download the PDF from: ${pdfUrl}`,
        `Place it in: public/books/${identifier}.pdf`,
        `Run: npm run extract:pdf ${book.id}`,
      ],
    });
  } catch (error) {
    console.error('Archive import error:', error);
    return errorResponse('Failed to import book from Archive.org', 500);
  }
});
