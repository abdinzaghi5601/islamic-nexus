import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from '../src/lib/utils/embeddings';

const prisma = new PrismaClient();

async function testEmbeddings() {
  console.log('🧪 Testing Semantic Search Setup\n');

  try {
    // Test 1: Check database columns
    console.log('1️⃣ Checking database columns...');
    const columns: any[] = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='ayahs' AND column_name LIKE '%embedding%'
    `;
    console.log(`   ✅ Found ${columns.length} embedding columns:`, columns.map(c => c.column_name).join(', '));

    // Test 2: Test OpenAI connection
    console.log('\n2️⃣ Testing OpenAI API connection...');
    const testEmbedding = await generateEmbedding('test');
    console.log(`   ✅ Generated test embedding: ${testEmbedding.length} dimensions`);

    // Test 3: Get ayahs to process
    console.log('\n3️⃣ Getting ayahs without embeddings...');
    const count: any = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM ayahs
      WHERE embedding_arabic_jsonb IS NULL
    `;
    console.log(`   ✅ Found ${count[0].count} ayahs without embeddings`);

    // Test 4: Process first 3 ayahs
    console.log('\n4️⃣ Processing first 3 ayahs...');
    const ayahs: any[] = await prisma.$queryRaw`
      SELECT a.id, a."textArabic" as text_arabic, t.text as text_english
      FROM ayahs a
      LEFT JOIN translations t ON a.id = t."ayahId" AND t."translatorId" = 1
      WHERE a.embedding_arabic_jsonb IS NULL
      LIMIT 3
    `;

    for (let i = 0; i < ayahs.length; i++) {
      const ayah = ayahs[i];
      console.log(`\n   Processing Ayah ${i + 1}/${ayahs.length} (ID: ${ayah.id})...`);

      // Generate embeddings
      const arabicEmbedding = await generateEmbedding(ayah.text_arabic);
      const englishEmbedding = await generateEmbedding(ayah.text_english || 'No translation');

      console.log(`   ✅ Generated embeddings (${arabicEmbedding.length}D)`);

      // Save to database
      await prisma.$executeRaw`
        UPDATE ayahs
        SET embedding_arabic_jsonb = ${JSON.stringify(arabicEmbedding)}::jsonb,
            embedding_english_jsonb = ${JSON.stringify(englishEmbedding)}::jsonb
        WHERE id = ${ayah.id}
      `;

      console.log(`   ✅ Saved to database`);
    }

    console.log('\n✨ Test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Database columns: OK`);
    console.log(`   • OpenAI API: OK`);
    console.log(`   • Embedding generation: OK`);
    console.log(`   • Database storage: OK`);
    console.log(`\n🚀 Ready to generate embeddings for all content!`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testEmbeddings();
