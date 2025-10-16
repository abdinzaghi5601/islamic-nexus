/**
 * Import Duas from fitrahive/dua-dhikr API
 *
 * This script imports authentic Sunnah duas and dhikr from the fitrahive API
 *
 * Data Source: https://github.com/fitrahive/dua-dhikr
 * API: https://dua-dhikr.vercel.app
 *
 * Usage:
 *   npm run import:duas-full
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API configuration
const API_BASE = 'https://dua-dhikr.vercel.app';

// Fetch JSON data from API
async function fetchJSON(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return await response.json();
}

interface DuaItem {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  notes?: string;
  fawaid?: string;
  source?: string;
}

interface Category {
  id: number;
  slug: string;
  title: string;
  duas?: DuaItem[];
}

async function importDuasData() {
  console.log('🤲 Starting Duas data import from fitrahive API...\n');

  try {
    // Step 1: Fetch all categories
    console.log('📋 Step 1: Fetching categories...');
    const categoriesResponse = await fetchJSON(`${API_BASE}/categories`);
    const categories: Category[] = categoriesResponse.data || [];
    console.log(`   ✅ Found ${categories.length} categories\n`);

    let totalDuasImported = 0;
    let totalCategoriesImported = 0;

    // Step 2: Import each category and its duas
    for (const category of categories) {
      console.log(`\n📖 Processing category: ${category.title} (${category.slug})`);

      try {
        // Create or find category
        let duaCategory = await prisma.duaCategory.findFirst({
          where: { slug: category.slug },
        });

        if (!duaCategory) {
          duaCategory = await prisma.duaCategory.create({
            data: {
              name: category.title,
              slug: category.slug,
              description: `Authentic duas for ${category.title}`,
            },
          });
          console.log(`   ✅ Created category: ${category.title}`);
        } else {
          console.log(`   ⏭️  Category already exists: ${category.title}`);
        }

        // Fetch duas for this category
        console.log(`   📥 Fetching duas for ${category.slug}...`);
        const categoryResponse = await fetchJSON(`${API_BASE}/categories/${category.slug}`);
        const duas: DuaItem[] = categoryResponse.data || [];

        if (duas.length === 0) {
          console.log(`   ⚠️  No duas found for ${category.title}`);
          continue;
        }

        console.log(`   ✅ Found ${duas.length} duas`);

        // Import duas in batches
        let importedCount = 0;
        for (const duaItem of duas) {
          try {
            // Check if already exists
            const existing = await prisma.dua.findFirst({
              where: {
                categoryId: duaCategory.id,
                textArabic: duaItem.arabic,
              },
            });

            if (!existing) {
              await prisma.dua.create({
                data: {
                  categoryId: duaCategory.id,
                  title: duaItem.title || 'Untitled Dua',
                  textArabic: duaItem.arabic || '',
                  textEnglish: duaItem.translation || '',
                  transliteration: duaItem.latin || null,
                  reference: duaItem.source || null,
                  benefits: duaItem.fawaid || null,
                  tags: duaItem.notes ? duaItem.notes.substring(0, 500) : null,
                },
              });
              importedCount++;
            }
          } catch (duaError: any) {
            console.error(`   ⚠️  Error importing dua: ${duaError.message}`);
          }
        }

        console.log(`   ✅ Imported ${importedCount}/${duas.length} duas for ${category.title}`);
        totalDuasImported += importedCount;
        totalCategoriesImported++;

        // Small delay to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (categoryError: any) {
        console.error(`   ❌ Error processing category ${category.title}:`, categoryError.message);
      }
    }

    console.log('\n🎉 Duas data import completed!\n');
    console.log('Summary:');
    console.log(`- Categories processed: ${categories.length}`);
    console.log(`- Categories imported: ${totalCategoriesImported}`);
    console.log(`- Total duas imported: ${totalDuasImported}`);
    console.log('\n✅ You can now access authentic Sunnah duas in your app!');
    console.log('💡 View duas: npm run db:studio -> dua_categories & duas tables');
  } catch (error: any) {
    console.error('❌ Error during import:', error.message);
    throw error;
  }
}

importDuasData()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
