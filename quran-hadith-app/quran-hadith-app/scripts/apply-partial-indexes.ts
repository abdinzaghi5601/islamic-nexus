/**
 * Apply partial indexes with correct camelCase column names
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applyIndexes() {
  console.log('🔧 Applying partial indexes...\n');

  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_active_memorization_goals
     ON memorization_goals("userId", status, "targetDate")
     WHERE status = 'active'`,

    `CREATE INDEX IF NOT EXISTS idx_completed_memorization_goals
     ON memorization_goals("userId", "updatedAt")
     WHERE status = 'completed'`,

    `CREATE INDEX IF NOT EXISTS idx_bookmarks_with_notes
     ON bookmarks("userId", "createdAt" DESC)
     WHERE note IS NOT NULL`,

    `CREATE INDEX IF NOT EXISTS idx_hadith_bookmarks_with_notes
     ON hadith_bookmarks("userId", "createdAt" DESC)
     WHERE note IS NOT NULL`,

    `CREATE INDEX IF NOT EXISTS idx_sahih_hadiths
     ON hadiths("bookId", "chapterId")
     WHERE grade = 'Sahih'`,

    `CREATE INDEX IF NOT EXISTS idx_hasan_hadiths
     ON hadiths("bookId", "chapterId")
     WHERE grade = 'Hasan'`,

    `CREATE INDEX IF NOT EXISTS idx_weak_hadiths
     ON hadiths("bookId", "chapterId")
     WHERE grade IN ('Daif', 'Mawdu', 'Munkar')`,

    `CREATE INDEX IF NOT EXISTS idx_sajdah_ayahs
     ON ayahs("surahId", "ayahNumber")
     WHERE sajdah = true`,

    `CREATE INDEX IF NOT EXISTS idx_recent_reading_history
     ON reading_history("userId", "readAt" DESC)
     WHERE "readAt" > NOW() - INTERVAL '30 days'`,

    `CREATE INDEX IF NOT EXISTS idx_upcoming_reviews
     ON memorization_reviews("userId", "nextReviewDate")
     WHERE "nextReviewDate" <= NOW() + INTERVAL '7 days'
       AND "nextReviewDate" >= NOW()`,

    `CREATE INDEX IF NOT EXISTS idx_overdue_reviews
     ON memorization_reviews("userId", "nextReviewDate" DESC)
     WHERE "nextReviewDate" < NOW()`,

    `CREATE INDEX IF NOT EXISTS idx_vocab_needs_review
     ON vocabulary_items("listId", mastery, "lastReviewed")
     WHERE mastery < 70`,

    `CREATE INDEX IF NOT EXISTS idx_vocab_mastered
     ON vocabulary_items("listId", mastery DESC)
     WHERE mastery >= 90`,

    `CREATE INDEX IF NOT EXISTS idx_books_with_pdf
     ON books(category, language, title)
     WHERE "pdfUrl" IS NOT NULL OR "pdfPath" IS NOT NULL`,
  ];

  for (let i = 0; i < indexes.length; i++) {
    try {
      await prisma.$executeRawUnsafe(indexes[i]);
      console.log(`  ✅ Index ${i + 1}/${indexes.length} created`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ℹ️  Index ${i + 1}/${indexes.length} already exists`);
      } else {
        console.error(`  ❌ Index ${i + 1}/${indexes.length} failed:`, error.message);
      }
    }
  }

  console.log('\n✅ Partial indexes applied successfully!\n');
  await prisma.$disconnect();
}

applyIndexes();
