/**
 * Import Cross-References Script
 *
 * This script imports:
 * 1. Ayah themes and theme mappings
 * 2. Hadith-Ayah cross-references
 *
 * Usage:
 *   npm run import:cross-references
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load data files
const themesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/ayah-themes.json'), 'utf-8')
);
const linksData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/hadith-ayah-links.json'), 'utf-8')
);

async function importThemes() {
  console.log('\n📚 Step 1: Importing Ayah Themes...');

  let themeCount = 0;
  const themeMap = new Map<string, number>(); // slug -> id

  for (const parentTheme of themesData) {
    // Create parent theme
    const parent = await prisma.ayahTheme.upsert({
      where: { slug: parentTheme.slug },
      update: {},
      create: {
        name: parentTheme.name,
        nameArabic: parentTheme.nameArabic,
        slug: parentTheme.slug,
        description: parentTheme.description,
      },
    });
    themeMap.set(parent.slug, parent.id);
    themeCount++;
    console.log(`   ✅ ${parentTheme.name}`);

    // Create child themes
    if (parentTheme.children && parentTheme.children.length > 0) {
      for (const childTheme of parentTheme.children) {
        const child = await prisma.ayahTheme.upsert({
          where: { slug: childTheme.slug },
          update: {},
          create: {
            name: childTheme.name,
            nameArabic: childTheme.nameArabic,
            slug: childTheme.slug,
            description: childTheme.description,
            parentThemeId: parent.id,
          },
        });
        themeMap.set(child.slug, child.id);
        themeCount++;
        console.log(`      ↳ ${childTheme.name}`);
      }
    }
  }

  console.log(`\n   ✅ Imported ${themeCount} themes`);
  return themeMap;
}

async function importHadithAyahLinks(themeMap: Map<string, number>) {
  console.log('\n🔗 Step 2: Importing Hadith-Ayah Cross-References...');

  let linkCount = 0;
  let themeMappingCount = 0;

  // Get all ayahs and hadiths
  const allAyahs = await prisma.ayah.findMany({
    include: { surah: true },
  });
  const allHadiths = await prisma.hadith.findMany({
    include: { book: true },
  });

  for (const linkData of linksData) {
    console.log(`\n   📖 Processing: ${linkData.name} (${linkData.surah}:${linkData.ayahStart})`);

    try {
      // Find ayahs in range
      const ayahs = allAyahs.filter(
        (a) =>
          a.surah.number === linkData.surah &&
          a.ayahNumber >= linkData.ayahStart &&
          a.ayahNumber <= linkData.ayahEnd
      );

      if (ayahs.length === 0) {
        console.log(`      ⚠️  Ayah not found: ${linkData.surah}:${linkData.ayahStart}-${linkData.ayahEnd}`);
        continue;
      }

      console.log(`      ✅ Found ${ayahs.length} ayah(s)`);

      // Add theme mappings for each ayah
      if (linkData.themes && linkData.themes.length > 0) {
        for (const ayah of ayahs) {
          for (const themeSlug of linkData.themes) {
            const themeId = themeMap.get(themeSlug);
            if (themeId) {
              try {
                await prisma.ayahThemeMapping.create({
                  data: {
                    ayahId: ayah.id,
                    themeId: themeId,
                    relevance: 8, // Default high relevance for manually curated themes
                  },
                });
                themeMappingCount++;
              } catch (error) {
                // Skip if already exists
              }
            }
          }
        }
        console.log(`      ✅ Added ${linkData.themes.length} theme(s)`);
      }

      // Add hadith references
      if (linkData.hadithReferences && linkData.hadithReferences.length > 0) {
        for (const hadithRef of linkData.hadithReferences) {
          // Find the hadith
          const hadith = allHadiths.find(
            (h) =>
              h.book.name === hadithRef.bookName &&
              h.hadithNumber === hadithRef.hadithNumber
          );

          if (hadith) {
            // Link to all ayahs in the range
            for (const ayah of ayahs) {
              try {
                await prisma.hadithAyahReference.create({
                  data: {
                    hadithId: hadith.id,
                    ayahId: ayah.id,
                  },
                });
                linkCount++;
              } catch (error) {
                // Skip if already exists
              }
            }
            console.log(`      ✅ Linked hadith: ${hadithRef.bookName} ${hadithRef.hadithNumber}`);
          } else {
            console.log(`      ⚠️  Hadith not found: ${hadithRef.bookName} ${hadithRef.hadithNumber}`);
          }
        }
      }
    } catch (error: any) {
      console.error(`      ❌ Error processing ${linkData.name}:`, error.message);
    }
  }

  console.log(`\n   ✅ Created ${linkCount} hadith-ayah links`);
  console.log(`   ✅ Created ${themeMappingCount} theme mappings`);
}

async function importCrossReferences() {
  console.log('🔗 Starting Cross-References Import...\n');

  try {
    const themeMap = await importThemes();
    await importHadithAyahLinks(themeMap);

    console.log('\n🎉 Cross-References Import Completed!\n');
    console.log('Summary:');
    console.log('- Themes imported with hierarchical structure');
    console.log('- Ayahs tagged with relevant themes');
    console.log('- Hadiths linked to related ayahs');
    console.log('\n✅ Your ayah-centric database is now fully connected!');
    console.log('💡 Test it: GET /api/quran/ayah-complete/2/255');
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

importCrossReferences()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
