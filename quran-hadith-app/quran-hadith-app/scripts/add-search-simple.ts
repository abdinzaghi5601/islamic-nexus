/**
 * Add full-text search capabilities (simplified version)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addFullTextSearch() {
  console.log('🔍 Adding full-text search capabilities...\n');

  try {
    await prisma.$connect();

    // Step 1: Add search columns
    console.log('1️⃣ Adding search vector columns...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE ayahs
      ADD COLUMN IF NOT EXISTS search_vector_arabic tsvector,
      ADD COLUMN IF NOT EXISTS search_vector_english tsvector
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE translations
      ADD COLUMN IF NOT EXISTS search_vector tsvector
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE hadiths
      ADD COLUMN IF NOT EXISTS search_vector_arabic tsvector,
      ADD COLUMN IF NOT EXISTS search_vector_english tsvector
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE tafsir_verses
      ADD COLUMN IF NOT EXISTS search_vector tsvector
    `);
    console.log('✅ Search columns added\n');

    // Step 2: Create GIN indexes
    console.log('2️⃣ Creating GIN indexes...');
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_ayahs_search_arabic ON ayahs USING GIN(search_vector_arabic)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_ayahs_search_english ON ayahs USING GIN(search_vector_english)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_translations_search ON translations USING GIN(search_vector)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_hadiths_search_arabic ON hadiths USING GIN(search_vector_arabic)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_hadiths_search_english ON hadiths USING GIN(search_vector_english)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_tafsir_search ON tafsir_verses USING GIN(search_vector)`);
    console.log('✅ GIN indexes created\n');

    // Step 3: Enable trigram extension
    console.log('3️⃣ Enabling trigram extension...');
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    console.log('✅ Trigram extension enabled\n');

    // Step 4: Create trigram indexes for fuzzy search
    console.log('4️⃣ Creating trigram indexes...');
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_ayahs_arabic_trgm ON ayahs USING GIN("textArabic" gin_trgm_ops)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_hadiths_arabic_trgm ON hadiths USING GIN("textArabic" gin_trgm_ops)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_translations_text_trgm ON translations USING GIN(text gin_trgm_ops)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_hadiths_english_trgm ON hadiths USING GIN("textEnglish" gin_trgm_ops)`);
    console.log('✅ Trigram indexes created\n');

    // Step 5: Populate search vectors
    console.log('5️⃣ Populating search vectors (this may take a moment)...');

    await prisma.$executeRawUnsafe(`
      UPDATE ayahs
      SET search_vector_arabic = to_tsvector('arabic', COALESCE("textArabic", '') || ' ' || COALESCE("textUthmani", ''))
    `);
    console.log('  ✅ Ayahs Arabic vectors populated');

    await prisma.$executeRawUnsafe(`
      UPDATE translations
      SET search_vector = to_tsvector('english', COALESCE(text, ''))
    `);
    console.log('  ✅ Translation vectors populated');

    await prisma.$executeRawUnsafe(`
      UPDATE hadiths
      SET search_vector_arabic = to_tsvector('arabic', COALESCE("textArabic", ''))
    `);
    console.log('  ✅ Hadiths Arabic vectors populated');

    await prisma.$executeRawUnsafe(`
      UPDATE hadiths
      SET search_vector_english = to_tsvector('english', COALESCE("textEnglish", ''))
    `);
    console.log('  ✅ Hadiths English vectors populated');

    await prisma.$executeRawUnsafe(`
      UPDATE tafsir_verses
      SET search_vector = to_tsvector('english', COALESCE(text, ''))
    `);
    console.log('  ✅ Tafsir vectors populated\n');

    console.log('🎉 Full-text search setup complete!\n');
    console.log('Your database now supports:');
    console.log('  ✅ Fast full-text search in Arabic and English');
    console.log('  ✅ Fuzzy/typo-tolerant search');
    console.log('  ✅ Ranked search results\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addFullTextSearch()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
