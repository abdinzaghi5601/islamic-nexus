import prisma from '../src/lib/db/prisma';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import pdf from 'pdf-parse';

/**
 * PDF Text Extraction Script
 *
 * This script extracts text from existing PDFs in the database
 * and creates searchable BookChunk records.
 *
 * Usage:
 * 1. Ensure PDFs are in public/books/ directory
 * 2. Run: npm run extract:pdf [bookId]
 * 3. If no bookId provided, processes all books without chunks
 */

async function extractTextFromBook(bookId: number) {
  console.log(`\n🔍 Processing book ID: ${bookId}...`);

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      _count: {
        select: { chunks: true },
      },
    },
  });

  if (!book) {
    console.error(`❌ Book with ID ${bookId} not found`);
    return;
  }

  console.log(`📖 Book: ${book.title}`);
  console.log(`👤 Author: ${book.author}`);

  if (book._count.chunks > 0) {
    console.log(`⚠️  Book already has ${book._count.chunks} chunks. Skipping...`);
    return;
  }

  // Get PDF path
  const pdfPath = book.pdfPath || book.pdfUrl;
  if (!pdfPath) {
    console.error(`❌ No PDF path found for book`);
    return;
  }

  // If pdfPath is a local path, read from public directory
  let dataBuffer: Buffer;

  if (pdfPath.startsWith('/books/')) {
    const localPath = path.join(process.cwd(), 'public', pdfPath);

    if (!fs.existsSync(localPath)) {
      console.error(`❌ PDF file not found at: ${localPath}`);
      console.log(`   Please place the PDF in public/books/ directory`);
      return;
    }

    dataBuffer = fs.readFileSync(localPath);
  } else if (pdfPath.startsWith('http')) {
    console.error(`❌ Remote PDF URLs not supported yet. Please download and place in public/books/`);
    return;
  } else {
    console.error(`❌ Invalid PDF path: ${pdfPath}`);
    return;
  }

  console.log(`📄 Extracting text from PDF...`);

  try {
    const data = await pdf(dataBuffer);
    const extractedText = data.text || '';
    const totalPages = data.numpages || 0;

    console.log(`✓ Extracted ${extractedText.length} characters from ${totalPages} pages`);

    if (!extractedText) {
      console.error(`❌ No text could be extracted from PDF`);
      return;
    }

    // Update total pages if not set
    if (!book.totalPages && totalPages > 0) {
      await prisma.book.update({
        where: { id: bookId },
        data: { totalPages },
      });
    }

    // Create chunks
    console.log(`📦 Creating searchable chunks...`);

    const chunkSize = 5000; // characters per chunk
    const chunks = [];

    for (let i = 0; i < extractedText.length; i += chunkSize) {
      chunks.push(extractedText.slice(i, i + chunkSize));
    }

    // Estimate page number for each chunk
    const charsPerPage = extractedText.length / (totalPages || 1);

    let created = 0;
    for (let i = 0; i < chunks.length; i++) {
      const estimatedPage = Math.floor((i * chunkSize) / charsPerPage) + 1;

      await prisma.bookChunk.create({
        data: {
          bookId: book.id,
          pageNumber: Math.min(estimatedPage, totalPages || 999),
          chunkNumber: i + 1,
          content: chunks[i],
        },
      });

      created++;

      // Progress indicator
      if (created % 10 === 0) {
        process.stdout.write(`\r   Created ${created}/${chunks.length} chunks...`);
      }
    }

    console.log(`\n✅ Successfully created ${created} searchable chunks!`);
    console.log(`🔎 Book is now fully searchable in the platform`);

  } catch (error) {
    console.error(`❌ Error extracting text:`, error);
    throw error;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('📚 PDF Text Extraction Tool');
  console.log('═══════════════════════════════════════════════════');

  const bookIdArg = process.argv[2];

  if (bookIdArg) {
    // Process specific book
    const bookId = parseInt(bookIdArg);

    if (isNaN(bookId)) {
      console.error('❌ Invalid book ID. Please provide a number.');
      process.exit(1);
    }

    await extractTextFromBook(bookId);
  } else {
    // Process all books without chunks
    console.log('\n🔍 Finding books without text chunks...\n');

    const books = await prisma.book.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    const booksToProcess = books.filter(b => b._count.chunks === 0);

    if (booksToProcess.length === 0) {
      console.log('✓ All books already have text extracted!');
      return;
    }

    console.log(`Found ${booksToProcess.length} books to process:\n`);

    booksToProcess.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author}`);
    });

    console.log('\n');

    for (const book of booksToProcess) {
      try {
        await extractTextFromBook(book.id);
      } catch (error) {
        console.error(`Failed to process book ${book.id}:`, error);
        // Continue with next book
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ Extraction complete!');
    console.log('═══════════════════════════════════════════════════\n');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
