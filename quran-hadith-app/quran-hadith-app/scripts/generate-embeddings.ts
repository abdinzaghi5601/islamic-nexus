import { PrismaClient } from '@prisma/client';
import {
  generateEmbeddingsChunked,
  estimateEmbeddingCost,
  formatEmbeddingForDB,
} from '../src/lib/utils/embeddings';

const prisma = new PrismaClient();

interface Stats {
  processed: number;
  skipped: number;
  errors: number;
  totalCost: number;
}

async function generateAyahEmbeddings(limit?: number) {
  console.log('\n🕌 Generating embeddings for Ayahs...\n');

  const stats: Stats = { processed: 0, skipped: 0, errors: 0, totalCost: 0 };

  try {
    // Get all ayahs without embeddings using raw SQL
    const ayahs: any[] = limit
      ? await prisma.$queryRaw`
          SELECT a.id, a."textArabic" as text_arabic, t.text as text_english
          FROM ayahs a
          LEFT JOIN translations t ON a.id = t."ayahId" AND t."translatorId" = 1
          WHERE a.embedding_arabic_jsonb IS NULL
          ORDER BY a."numberInQuran" ASC
          LIMIT ${limit}
        `
      : await prisma.$queryRaw`
          SELECT a.id, a."textArabic" as text_arabic, t.text as text_english
          FROM ayahs a
          LEFT JOIN translations t ON a.id = t."ayahId" AND t."translatorId" = 1
          WHERE a.embedding_arabic_jsonb IS NULL
          ORDER BY a."numberInQuran" ASC
        `;

    if (ayahs.length === 0) {
      console.log('✅ All Ayahs already have embeddings!');
      return stats;
    }

    console.log(`📊 Found ${ayahs.length} Ayahs to process`);

    // Estimate cost
    const avgWordsPerAyah = 25;
    const estimatedCost = estimateEmbeddingCost(ayahs.length * 2, avgWordsPerAyah); // * 2 for Arabic + English
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}\n`);

    // Generate embeddings for Arabic text
    console.log('🔤 Processing Arabic texts...');
    const arabicTexts = ayahs.map(a => a.text_arabic);
    const arabicEmbeddings = await generateEmbeddingsChunked(
      arabicTexts,
      (processed, total) => {
        process.stdout.write(`\r  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n✅ Arabic embeddings generated!\n');

    // Generate embeddings for English translations
    console.log('🔤 Processing English translations...');
    const englishTexts = ayahs.map(a => a.text_english || 'No translation');
    const englishEmbeddings = await generateEmbeddingsChunked(
      englishTexts,
      (processed, total) => {
        process.stdout.write(`\r  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n✅ English embeddings generated!\n');

    // Update database using raw SQL
    console.log('💾 Saving to database...');
    for (let i = 0; i < ayahs.length; i++) {
      try {
        if (arabicEmbeddings[i] && englishEmbeddings[i]) {
          await prisma.$executeRaw`
            UPDATE ayahs
            SET embedding_arabic_jsonb = ${JSON.stringify(arabicEmbeddings[i])}::jsonb,
                embedding_english_jsonb = ${JSON.stringify(englishEmbeddings[i])}::jsonb
            WHERE id = ${ayahs[i].id}
          `;
          stats.processed++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        console.error(`Error saving Ayah ${ayahs[i].id}:`, error);
        stats.errors++;
      }

      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r  Saved: ${i + 1}/${ayahs.length}`);
      }
    }

    console.log(`\n✅ Saved ${stats.processed} Ayah embeddings!\n`);
    stats.totalCost = estimatedCost;
  } catch (error) {
    console.error('Error generating Ayah embeddings:', error);
  }

  return stats;
}

async function generateTranslationEmbeddings(limit?: number) {
  console.log('\n📖 Generating embeddings for Translations...\n');

  const stats: Stats = { processed: 0, skipped: 0, errors: 0, totalCost: 0 };

  try {
    // Get translations without embeddings using raw SQL
    const translations: any[] = limit
      ? await prisma.$queryRaw`
          SELECT id, text
          FROM translations
          WHERE embedding_jsonb IS NULL
          ORDER BY id ASC
          LIMIT ${limit}
        `
      : await prisma.$queryRaw`
          SELECT id, text
          FROM translations
          WHERE embedding_jsonb IS NULL
          ORDER BY id ASC
        `;

    if (translations.length === 0) {
      console.log('✅ All Translations already have embeddings!');
      return stats;
    }

    console.log(`📊 Found ${translations.length} Translations to process`);

    const avgWordsPerTranslation = 30;
    const estimatedCost = estimateEmbeddingCost(translations.length, avgWordsPerTranslation);
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}\n`);

    // Generate embeddings
    console.log('🔤 Processing translations...');
    const texts = translations.map(t => t.text);
    const embeddings = await generateEmbeddingsChunked(
      texts,
      (processed, total) => {
        process.stdout.write(`\r  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n✅ Embeddings generated!\n');

    // Update database using raw SQL
    console.log('💾 Saving to database...');
    for (let i = 0; i < translations.length; i++) {
      try {
        if (embeddings[i]) {
          await prisma.$executeRaw`
            UPDATE translations
            SET embedding_jsonb = ${JSON.stringify(embeddings[i])}::jsonb
            WHERE id = ${translations[i].id}
          `;
          stats.processed++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        console.error(`Error saving Translation ${translations[i].id}:`, error);
        stats.errors++;
      }

      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r  Saved: ${i + 1}/${translations.length}`);
      }
    }

    console.log(`\n✅ Saved ${stats.processed} Translation embeddings!\n`);
    stats.totalCost = estimatedCost;
  } catch (error) {
    console.error('Error generating Translation embeddings:', error);
  }

  return stats;
}

async function generateHadithEmbeddings(limit?: number) {
  console.log('\n📿 Generating embeddings for Hadiths...\n');

  const stats: Stats = { processed: 0, skipped: 0, errors: 0, totalCost: 0 };

  try {
    // Get hadiths without embeddings using raw SQL
    const hadiths: any[] = limit
      ? await prisma.$queryRaw`
          SELECT id, "textArabic" as text_arabic, "textEnglish" as text_english
          FROM hadiths
          WHERE embedding_arabic_jsonb IS NULL
          ORDER BY id ASC
          LIMIT ${limit}
        `
      : await prisma.$queryRaw`
          SELECT id, "textArabic" as text_arabic, "textEnglish" as text_english
          FROM hadiths
          WHERE embedding_arabic_jsonb IS NULL
          ORDER BY id ASC
        `;

    if (hadiths.length === 0) {
      console.log('✅ All Hadiths already have embeddings!');
      return stats;
    }

    console.log(`📊 Found ${hadiths.length} Hadiths to process`);

    const avgWordsPerHadith = 50;
    const estimatedCost = estimateEmbeddingCost(hadiths.length * 2, avgWordsPerHadith);
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}\n`);

    // Generate Arabic embeddings
    console.log('🔤 Processing Arabic texts...');
    const arabicTexts = hadiths.map(h => h.text_arabic);
    const arabicEmbeddings = await generateEmbeddingsChunked(
      arabicTexts,
      (processed, total) => {
        process.stdout.write(`\r  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n✅ Arabic embeddings generated!\n');

    // Generate English embeddings
    console.log('🔤 Processing English texts...');
    const englishTexts = hadiths.map(h => h.text_english);
    const englishEmbeddings = await generateEmbeddingsChunked(
      englishTexts,
      (processed, total) => {
        process.stdout.write(`\r  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n✅ English embeddings generated!\n');

    // Update database using raw SQL
    console.log('💾 Saving to database...');
    for (let i = 0; i < hadiths.length; i++) {
      try {
        if (arabicEmbeddings[i] && englishEmbeddings[i]) {
          await prisma.$executeRaw`
            UPDATE hadiths
            SET embedding_arabic_jsonb = ${JSON.stringify(arabicEmbeddings[i])}::jsonb,
                embedding_english_jsonb = ${JSON.stringify(englishEmbeddings[i])}::jsonb
            WHERE id = ${hadiths[i].id}
          `;
          stats.processed++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        console.error(`Error saving Hadith ${hadiths[i].id}:`, error);
        stats.errors++;
      }

      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r  Saved: ${i + 1}/${hadiths.length}`);
      }
    }

    console.log(`\n✅ Saved ${stats.processed} Hadith embeddings!\n`);
    stats.totalCost = estimatedCost;
  } catch (error) {
    console.error('Error generating Hadith embeddings:', error);
  }

  return stats;
}

async function generateTafsirEmbeddings(limit?: number) {
  console.log('\n📚 Generating embeddings for Tafsir Verses...\n');

  const stats: Stats = { processed: 0, skipped: 0, errors: 0, totalCost: 0 };

  try {
    const tafsirs: any[] = limit
      ? await prisma.$queryRaw`
          SELECT id, text
          FROM tafsir_verses
          WHERE embedding_jsonb IS NULL
          ORDER BY id ASC
          LIMIT ${limit}
        `
      : await prisma.$queryRaw`
          SELECT id, text
          FROM tafsir_verses
          WHERE embedding_jsonb IS NULL
          ORDER BY id ASC
        `;

    if (tafsirs.length === 0) {
      console.log('✅ All Tafsir Verses already have embeddings!');
      return stats;
    }

    console.log(`📊 Found ${tafsirs.length} Tafsir Verses to process`);

    const avgWordsPerTafsir = 100;
    const estimatedCost = estimateEmbeddingCost(tafsirs.length, avgWordsPerTafsir);
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}\n`);

    // Generate embeddings
    console.log('🔤 Processing tafsir texts...');
    const texts = tafsirs.map(t => t.text);
    const embeddings = await generateEmbeddingsChunked(
      texts,
      (processed, total) => {
        process.stdout.write(`\r  Progress: ${processed}/${total} (${((processed / total) * 100).toFixed(1)}%)`);
      }
    );
    console.log('\n✅ Embeddings generated!\n');

    // Update database using raw SQL
    console.log('💾 Saving to database...');
    for (let i = 0; i < tafsirs.length; i++) {
      try {
        if (embeddings[i]) {
          await prisma.$executeRaw`
            UPDATE tafsir_verses
            SET embedding_jsonb = ${JSON.stringify(embeddings[i])}::jsonb
            WHERE id = ${tafsirs[i].id}
          `;
          stats.processed++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        console.error(`Error saving Tafsir ${tafsirs[i].id}:`, error);
        stats.errors++;
      }

      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r  Saved: ${i + 1}/${tafsirs.length}`);
      }
    }

    console.log(`\n✅ Saved ${stats.processed} Tafsir embeddings!\n`);
    stats.totalCost = estimatedCost;
  } catch (error) {
    console.error('Error generating Tafsir embeddings:', error);
  }

  return stats;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     SEMANTIC SEARCH - EMBEDDING GENERATION SCRIPT      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const args = process.argv.slice(2);
  const contentType = args[0]; // 'ayahs', 'translations', 'hadiths', 'tafsirs', 'all'
  const limit = args[1] ? parseInt(args[1]) : undefined;

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables!');
    console.error('   Add OPENAI_API_KEY="sk-..." to your .env file\n');
    process.exit(1);
  }

  const totalStats: Stats = { processed: 0, skipped: 0, errors: 0, totalCost: 0 };

  try {
    if (!contentType || contentType === 'all') {
      // Generate all embeddings
      const ayahStats = await generateAyahEmbeddings(limit);
      const translationStats = await generateTranslationEmbeddings(limit);
      const hadithStats = await generateHadithEmbeddings(limit);
      const tafsirStats = await generateTafsirEmbeddings(limit);

      totalStats.processed = ayahStats.processed + translationStats.processed + hadithStats.processed + tafsirStats.processed;
      totalStats.skipped = ayahStats.skipped + translationStats.skipped + hadithStats.skipped + tafsirStats.skipped;
      totalStats.errors = ayahStats.errors + translationStats.errors + hadithStats.errors + tafsirStats.errors;
      totalStats.totalCost = ayahStats.totalCost + translationStats.totalCost + hadithStats.totalCost + tafsirStats.totalCost;
    } else if (contentType === 'ayahs') {
      const stats = await generateAyahEmbeddings(limit);
      Object.assign(totalStats, stats);
    } else if (contentType === 'translations') {
      const stats = await generateTranslationEmbeddings(limit);
      Object.assign(totalStats, stats);
    } else if (contentType === 'hadiths') {
      const stats = await generateHadithEmbeddings(limit);
      Object.assign(totalStats, stats);
    } else if (contentType === 'tafsirs') {
      const stats = await generateTafsirEmbeddings(limit);
      Object.assign(totalStats, stats);
    } else {
      console.error(`❌ Unknown content type: ${contentType}`);
      console.log('\nUsage: npm run generate:embeddings [ayahs|translations|hadiths|tafsirs|all] [limit]');
      process.exit(1);
    }

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                    FINAL SUMMARY                       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`✅ Processed: ${totalStats.processed}`);
    console.log(`⏭️  Skipped:   ${totalStats.skipped}`);
    console.log(`❌ Errors:    ${totalStats.errors}`);
    console.log(`💰 Total Cost: $${totalStats.totalCost.toFixed(4)}`);
    console.log('');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
