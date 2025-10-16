const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProgress() {
  try {
    const stats = await prisma.$queryRaw`
      SELECT
        COUNT(*) as total_hadiths,
        COUNT(CASE WHEN embedding_english_jsonb IS NOT NULL THEN 1 END) as with_english_embeddings,
        COUNT(CASE WHEN embedding_arabic_jsonb IS NOT NULL THEN 1 END) as with_arabic_embeddings
      FROM hadiths;
    `;

    const total = Number(stats[0].total_hadiths);
    const english = Number(stats[0].with_english_embeddings);
    const arabic = Number(stats[0].with_arabic_embeddings);
    const englishPercent = ((english / total) * 100).toFixed(2);
    const arabicPercent = ((arabic / total) * 100).toFixed(2);

    console.log('\n📊 EMBEDDING GENERATION PROGRESS');
    console.log('='.repeat(50));
    console.log(`Total Hadiths: ${total.toLocaleString()}`);
    console.log(`English Embeddings: ${english.toLocaleString()} (${englishPercent}%)`);
    console.log(`Arabic Embeddings: ${arabic.toLocaleString()} (${arabicPercent}%)`);
    console.log('='.repeat(50));

    const latest = await prisma.hadith.findFirst({
      where: { embeddingEnglishJsonb: { not: null } },
      orderBy: { id: 'desc' },
      select: { id: true, hadithNumber: true, book: { select: { name: true } } }
    });

    if (latest) {
      console.log(`\nLatest embedded: ${latest.book.name} #${latest.hadithNumber} (ID: ${latest.id})\n`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProgress();
