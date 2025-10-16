import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicateBooks() {
  try {
    console.log('Cleaning up duplicate hadith books...\n');

    // Delete books with IDs 1-8 (empty or partial books)
    const deleteResult = await prisma.hadithBook.deleteMany({
      where: {
        id: {
          in: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      },
    });

    console.log(`✅ Deleted ${deleteResult.count} duplicate hadith books`);

    // Verify remaining books
    const remainingBooks = await prisma.hadithBook.findMany({
      orderBy: { id: 'asc' },
    });

    console.log(`\n📚 Remaining hadith books:`);
    for (const book of remainingBooks) {
      const hadithCount = await prisma.hadith.count({ where: { bookId: book.id } });
      console.log(`  - ID ${book.id}: ${book.name} (${hadithCount} hadiths)`);
    }

    console.log('\n✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateBooks();
