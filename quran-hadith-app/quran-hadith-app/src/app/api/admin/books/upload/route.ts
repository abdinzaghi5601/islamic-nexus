import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

// Configure larger body size limit for file uploads (50MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

// For App Router, use maxDuration instead
export const maxDuration = 300; // 5 minutes for large PDF processing

/**
 * POST /api/admin/books/upload
 * Upload a PDF book and extract its text for search
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get form fields
    const title = formData.get('title') as string;
    const titleArabic = formData.get('titleArabic') as string || null;
    const author = formData.get('author') as string;
    const authorArabic = formData.get('authorArabic') as string || null;
    const category = formData.get('category') as string;
    const language = formData.get('language') as string;
    const description = formData.get('description') as string || null;
    const publisher = formData.get('publisher') as string || null;
    const publishYearStr = formData.get('publishYear') as string;
    const publishYear = publishYearStr ? parseInt(publishYearStr) : null;
    const isbn = formData.get('isbn') as string || null;
    const tags = formData.get('tags') as string || null;

    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return errorResponse('PDF file is required', 400);
    }

    if (!title || !author || !category || !language) {
      return errorResponse('Title, author, category, and language are required', 400);
    }

    // Validate file type
    if (pdfFile.type !== 'application/pdf') {
      return errorResponse('File must be a PDF', 400);
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (pdfFile.size > maxSize) {
      return errorResponse('File size must be less than 50MB', 400);
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'books');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${sanitizedTitle}-${timestamp}.pdf`;
    const filepath = path.join(uploadDir, filename);
    const publicPath = `/books/${filename}`;

    // Convert file to buffer and save
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Extract PDF metadata
    let totalPages = 0;
    let extractedText = '';

    try {
      // Dynamic import for pdf-parse (CommonJS module)
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      totalPages = data.numpages || 0;
      extractedText = data.text || '';
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      // Continue without text extraction if parsing fails
    }

    // Create book in database
    const book = await prisma.book.create({
      data: {
        title,
        titleArabic,
        author,
        authorArabic,
        category,
        language,
        description,
        pdfPath: publicPath,
        totalPages,
        fileSize: BigInt(pdfFile.size),
        publisher,
        publishYear,
        isbn,
        tags,
      },
    });

    // Process text extraction in chunks (by page if possible)
    if (extractedText) {
      try {
        // For now, create one chunk with all text
        // In production, you'd want to split by page or paragraphs
        const chunkSize = 5000; // characters per chunk
        const textChunks = [];

        for (let i = 0; i < extractedText.length; i += chunkSize) {
          textChunks.push(extractedText.slice(i, i + chunkSize));
        }

        // Create chunks in database
        const chunkPromises = textChunks.map((content, index) => {
          return prisma.bookChunk.create({
            data: {
              bookId: book.id,
              pageNumber: Math.floor(index * chunkSize / (extractedText.length / (totalPages || 1))) + 1,
              chunkNumber: index + 1,
              content,
            },
          });
        });

        await Promise.all(chunkPromises);
      } catch (chunkError) {
        console.error('Error creating chunks:', chunkError);
        // Book is still created even if chunking fails
      }
    }

    return successResponse({
      message: 'Book uploaded successfully',
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        totalPages,
        chunksCreated: extractedText ? Math.ceil(extractedText.length / 5000) : 0,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Failed to upload book', 500);
  }
}
