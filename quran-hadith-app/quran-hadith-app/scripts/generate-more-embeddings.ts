import { PrismaClient } from '@prisma/client';
import { generateEmbeddingsChunked } from '../src/lib/utils/embeddings';

const prisma = new PrismaClient();

async function generateMoreEmbeddings(limit = 50) {
  console.log(`\n🚀 Generating embeddings for ${limit} ayahs...\n`);

  try {
    // Get ayahs without embeddings
    const ayahs: any[] = await prisma.$queryRaw`
      SELECT a.id, a."textArabic" as text_arabic, t.text as text_english
      FROM ayahs a
      LEFT JOIN translations t ON a.id = t."ayahId" AND t."translatorId" = 1
      WHERE a.embedding_arabic_jsonb IS NULL
      ORDER BY a."numberInQuran" ASC
      LIMIT ${limit}
    `;

    if (ayahs.length === 0) {
      console.log('✅ All ayahs already have embeddings!');
      return;
    }

    console.log(`📊 Processing ${ayahs.length} ayahs...\n`);

    // Estimate cost
    const estimatedCost = (ayahs.length * 30 * 2 * 0.75 / 1_000_000) * 0.02;
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}\n`);

    // Generate Arabic embeddings
    console.log('🔤 Generating Arabic embeddings...');
    const arabicTexts = ayahs.map(a => a.text_arabic);
    const arabicEmbeddings = await generateEmbeddingsChunked(
      arabicTexts,
      (processed, total) => {
        process.stdout.write(`\r   Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n   ✅ Complete!\n');

    // Generate English embeddings
    console.log('🔤 Generating English embeddings...');
    const englishTexts = ayahs.map(a => a.text_english || 'No translation');
    const englishEmbeddings = await generateEmbeddingsChunked(
      englishTexts,
      (processed, total) => {
        process.stdout.write(`\r   Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n   ✅ Complete!\n');

    // Save to database
    console.log('💾 Saving to database...');
    let saved = 0;
    for (let i = 0; i < ayahs.length; i++) {
      if (arabicEmbeddings[i] && englishEmbeddings[i]) {
        await prisma.$executeRaw`
          UPDATE ayahs
          SET embedding_arabic_jsonb = ${JSON.stringify(arabicEmbeddings[i])}::jsonb,
              embedding_english_jsonb = ${JSON.stringify(englishEmbeddings[i])}::jsonb
          WHERE id = ${ayahs[i].id}
        `;
        saved++;
        if ((i + 1) % 10 === 0) {
          process.stdout.write(`\r   Saved: ${i + 1}/${ayahs.length}`);
        }
      }
    }
    console.log(`\n   ✅ Saved ${saved} ayahs!\n`);

    console.log('✨ Done! Testing search...\n');

    // Quick search test
    const { searchAyahsSemantic } = await import('../src/lib/utils/semantic-search');
    const testResults = await searchAyahsSemantic('patience', {
      language: 'english',
      similarityThreshold: 0.6,
      maxResults: 5,
    });

    if (testResults.length > 0) {
      console.log(`🎉 Found ${testResults.length} results for "patience":`);
      testResults.forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.content.reference} (${(r.similarity * 100).toFixed(1)}%)`);
        console.log(`      ${r.content.textEnglish.substring(0, 80)}...`);
      });
    } else {
      console.log('ℹ️  No results yet - may need more ayahs or lower threshold');
    }

    console.log('\n✅ All done! Semantic search is ready to use.\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

const limit = parseInt(process.argv[2] || '50');
generateMoreEmbeddings(limit);
