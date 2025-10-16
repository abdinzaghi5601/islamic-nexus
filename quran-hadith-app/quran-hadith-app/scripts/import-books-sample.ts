import prisma from '../src/lib/db/prisma';

/**
 * Sample Book Import Script
 *
 * This script demonstrates how to import books into the database.
 * For full PDF text extraction, you'll need to:
 * 1. Install pdf-parse: npm install pdf-parse
 * 2. Extract text from PDFs page by page
 * 3. Store chunks in BookChunk model for search
 *
 * See README for detailed PDF processing instructions.
 */

const sampleBooks = [
  {
    title: 'Tafsir Ibn Kathir (Abridged)',
    titleArabic: 'تفسير ابن كثير',
    author: 'Ismail Ibn Kathir',
    authorArabic: 'إسماعيل بن كثير',
    category: 'Tafsir',
    language: 'English',
    description: 'One of the most respected and accepted explanations of the Quran. This abridged version makes the classic tafsir more accessible to modern readers.',
    pdfUrl: 'https://example.com/tafsir-ibn-kathir.pdf', // Replace with actual URL
    pdfPath: '/books/tafsir-ibn-kathir.pdf', // Place PDF in public/books/ folder
    totalPages: 850,
    fileSize: BigInt(15000000), // 15 MB in bytes
    publisher: 'Darussalam',
    publishYear: 2000,
    isbn: '9789960892733',
    tags: 'tafsir, quran commentary, classical, ibn kathir, exegesis',
  },
  {
    title: 'Riyadh as-Salihin',
    titleArabic: 'رياض الصالحين',
    author: 'Imam Nawawi',
    authorArabic: 'الإمام النووي',
    category: 'Hadith Commentary',
    language: 'English',
    description: 'A collection of hadith compiled by Imam Nawawi, organized by topic, focusing on righteous conduct and spiritual development.',
    pdfUrl: 'https://example.com/riyadh-as-salihin.pdf',
    pdfPath: '/books/riyadh-as-salihin.pdf',
    totalPages: 600,
    fileSize: BigInt(8000000), // 8 MB
    publisher: 'Islamic Foundation',
    publishYear: 1999,
    isbn: '9780860373216',
    tags: 'hadith, imam nawawi, righteousness, spiritual development, conduct',
  },
  {
    title: 'The Sealed Nectar',
    titleArabic: 'الرحيق المختوم',
    author: 'Safiur Rahman Mubarakpuri',
    authorArabic: 'صفي الرحمن المباركفوري',
    category: 'Seerah',
    language: 'English',
    description: 'A comprehensive biography of Prophet Muhammad (peace be upon him), winner of first prize in the worldwide competition on the biography of the Prophet.',
    pdfUrl: 'https://example.com/sealed-nectar.pdf',
    pdfPath: '/books/sealed-nectar.pdf',
    totalPages: 590,
    fileSize: BigInt(10000000), // 10 MB
    publisher: 'Darussalam',
    publishYear: 2002,
    isbn: '9789960899558',
    tags: 'seerah, prophet muhammad, biography, history, life of prophet',
  },
];

async function main() {
  console.log('Starting sample book import...\n');

  try {
    // Clear existing sample books (optional - remove this in production)
    console.log('Note: This script imports sample metadata only.');
    console.log('For full PDF text search, you need to extract and import BookChunks.\n');

    for (const bookData of sampleBooks) {
      // Check if book already exists
      const existingBook = await prisma.book.findFirst({
        where: {
          title: bookData.title,
          author: bookData.author,
        },
      });

      if (existingBook) {
        console.log(`⚠ Book already exists: ${bookData.title}`);
        continue;
      }

      // Create book
      const book = await prisma.book.create({
        data: bookData,
      });

      console.log(`✓ Created book: ${book.title}`);
      console.log(`  Author: ${book.author}`);
      console.log(`  Category: ${book.category}`);
      console.log(`  Pages: ${book.totalPages}`);
      console.log('');
    }

    console.log('✓ Sample book import completed!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('NEXT STEPS FOR PDF TEXT SEARCH:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1. Install PDF parser:');
    console.log('   npm install pdf-parse');
    console.log('');
    console.log('2. Place PDF files in: public/books/');
    console.log('');
    console.log('3. Create extraction script to:');
    console.log('   - Read PDF files');
    console.log('   - Extract text page by page');
    console.log('   - Create BookChunk records with:');
    console.log('     * bookId');
    console.log('     * pageNumber');
    console.log('     * content (extracted text)');
    console.log('');
    console.log('4. Example PDF extraction code:');
    console.log('');
    console.log('   ```typescript');
    console.log('   import fs from "fs";');
    console.log('   import pdf from "pdf-parse";');
    console.log('');
    console.log('   const dataBuffer = fs.readFileSync("public/books/book.pdf");');
    console.log('   const data = await pdf(dataBuffer);');
    console.log('   ');
    console.log('   // Split pages and create chunks');
    console.log('   for (let i = 0; i < data.numpages; i++) {');
    console.log('     await prisma.bookChunk.create({');
    console.log('       data: {');
    console.log('         bookId: book.id,');
    console.log('         pageNumber: i + 1,');
    console.log('         chunkNumber: 1,');
    console.log('         content: pageText,');
    console.log('       },');
    console.log('     });');
    console.log('   }');
    console.log('   ```');
    console.log('');
    console.log('5. Once chunks are created, books become searchable!');
    console.log('');

  } catch (error) {
    console.error('Error importing books:', error);
    throw error;
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
