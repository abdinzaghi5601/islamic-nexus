const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN embedding_english_jsonb IS NOT NULL THEN 1 END) as with_embeddings
      FROM hadiths;
    `;
    console.log('Database connection: OK');
    console.log('Total hadiths:', result[0].total);
    console.log('With embeddings:', result[0].with_embeddings);
    console.log('Remaining:', Number(result[0].total) - Number(result[0].with_embeddings));
  } catch (error) {
    console.log('Database connection: FAILED');
    console.log('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
