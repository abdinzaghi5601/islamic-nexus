import { PrismaClient } from '@prisma/client';
import { generateEmbeddingsChunked } from '../src/lib/utils/embeddings';

const prisma = new PrismaClient();

const BATCH_SIZE = 2000; // Process 2000 hadiths at a time

async function generateHadithEmbeddingsBatched() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   HADITH EMBEDDINGS - BATCH PROCESSING SCRIPT         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  try {
    // Get total count of hadiths without embeddings
    const totalCount = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM hadiths
      WHERE embedding_arabic_jsonb IS NULL
    `;

    const total = Number(totalCount[0].count);
    console.log(`📊 Total Hadiths to process: ${total}`);
    console.log(`📦 Batch size: ${BATCH_SIZE}\n`);

    if (total === 0) {
      console.log('✅ All Hadiths already have embeddings!');
      return;
    }

    let processedTotal = 0;
    let batchNumber = 1;

    while (processedTotal < total) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📿 Batch ${batchNumber} - Processing hadiths ${processedTotal + 1}-${Math.min(processedTotal + BATCH_SIZE, total)}`);
      console.log('='.repeat(60) + '\n');

      // Fetch current batch
      const hadiths: any[] = await prisma.$queryRaw`
        SELECT id, "textArabic" as text_arabic, "textEnglish" as text_english
        FROM hadiths
        WHERE embedding_arabic_jsonb IS NULL
        ORDER BY id ASC
        LIMIT ${BATCH_SIZE}
      `;

      if (hadiths.length === 0) {
        console.log('✅ No more hadiths to process!');
        break;
      }

      console.log(`✓ Fetched ${hadiths.length} hadiths from database\n`);

      // Generate Arabic embeddings
      console.log('🔤 Generating Arabic embeddings...');
      const arabicTexts = hadiths.map(h => h.text_arabic);
      const arabicEmbeddings = await generateEmbeddingsChunked(
        arabicTexts,
        (processed, total) => {
          process.stdout.write(`\r   Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
        }
      );
      console.log('\n   ✅ Complete!\n');

      // Generate English embeddings
      console.log('🔤 Generating English embeddings...');
      const englishTexts = hadiths.map(h => h.text_english);
      const englishEmbeddings = await generateEmbeddingsChunked(
        englishTexts,
        (processed, total) => {
          process.stdout.write(`\r   Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
        }
      );
      console.log('\n   ✅ Complete!\n');

      // Save to database
      console.log('💾 Saving to database...');
      for (let i = 0; i < hadiths.length; i++) {
        if (arabicEmbeddings[i] && englishEmbeddings[i]) {
          await prisma.$executeRaw`
            UPDATE hadiths
            SET embedding_arabic_jsonb = ${JSON.stringify(arabicEmbeddings[i])}::jsonb,
                embedding_english_jsonb = ${JSON.stringify(englishEmbeddings[i])}::jsonb
            WHERE id = ${hadiths[i].id}
          `;

          if ((i + 1) % 100 === 0) {
            process.stdout.write(`\r   Saved: ${i + 1}/${hadiths.length}`);
          }
        }
      }
      console.log(`\n   ✅ Saved ${hadiths.length} hadiths!\n`);

      processedTotal += hadiths.length;
      batchNumber++;

      console.log(`📈 Overall Progress: ${processedTotal}/${total} (${((processedTotal / total) * 100).toFixed(1)}%)`);
    }

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                  BATCH PROCESSING COMPLETE             ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n✅ Total Processed: ${processedTotal}`);
    console.log(`💰 Estimated Cost: $${(processedTotal * 50 * 2 * 1.0 / 1_000_000 * 0.02).toFixed(4)}\n`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

generateHadithEmbeddingsBatched();
