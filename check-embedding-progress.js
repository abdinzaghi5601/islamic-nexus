const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:lyxsAemhyeZAQqrcjWaJYvfzKKfWghcQ@turntable.proxy.rlwy.net:27913/railway'
    }
  }
});

async function checkProgress() {
  try {
    const stats = await prisma.$queryRaw`
      SELECT
        COUNT(*) as total_hadiths,
        COUNT(CASE WHEN "embeddingEnglish" IS NOT NULL THEN 1 END) as with_english_embeddings,
        COUNT(CASE WHEN "embeddingArabic" IS NOT NULL THEN 1 END) as with_arabic_embeddings,
        ROUND(100.0 * COUNT(CASE WHEN "embeddingEnglish" IS NOT NULL THEN 1 END) / COUNT(*), 2) as english_percent,
        ROUND(100.0 * COUNT(CASE WHEN "embeddingArabic" IS NOT NULL THEN 1 END) / COUNT(*), 2) as arabic_percent
      FROM hadiths;
    `;

    console.log('\n📊 EMBEDDING GENERATION PROGRESS');
    console.log('='.repeat(50));
    console.log(`Total Hadiths: ${stats[0].total_hadiths}`);
    console.log(`English Embeddings: ${stats[0].with_english_embeddings} (${stats[0].english_percent}%)`);
    console.log(`Arabic Embeddings: ${stats[0].with_arabic_embeddings} (${stats[0].arabic_percent}%)`);
    console.log('='.repeat(50));

    // Get latest embedded hadith
    const latest = await prisma.hadith.findFirst({
      where: { embeddingEnglish: { not: null } },
      orderBy: { id: 'desc' },
      select: { id: true, hadithNumber: true, book: { select: { name: true } } }
    });

    if (latest) {
      console.log(`\nLatest embedded: ${latest.book.name} #${latest.hadithNumber} (ID: ${latest.id})`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProgress();
