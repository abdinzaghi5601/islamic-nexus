/**
 * Database Fix Script - Remove Bismillah from Ayahs
 *
 * This script cleans the database by removing Bismillah from ayah text where it shouldn't be.
 *
 * Islamic Rules:
 * - Surah 1 (Al-Fatiha): Keep Bismillah in Ayah 1 (it IS the first ayah)
 * - Surah 9 (At-Tawbah): No Bismillah at all
 * - Surahs 2-8, 10-114: Remove Bismillah from ayah text (it's shown as header)
 *
 * Run: npx tsx scripts/fix-bismillah-in-database.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Comprehensive Bismillah patterns to match various Unicode representations
 * Note: Using RegExp constructor to create truly fresh instances
 * IMPORTANT: Database has diacritics in order: Shadda (ّ) then Fatha (َ), not the reverse!
 */
function getBismillahPatterns() {
  return [
    // Exact database format: ل + ّ + َ (Shadda BEFORE Fatha)
    new RegExp('بِسْمِ\\s*[اٱ]لل[ّ][َ]هِ\\s*[اٱ]لر[ّ][َ]حْمَٰنِ\\s*[اٱ]لر[ّ][َ]حِيمِ\\s*', 'g'),

    // Flexible patterns with optional diacritics in any order
    new RegExp('بِسْمِ\\s*[اٱ]لل[َّ][َّ]?هِ\\s*[اٱ]لر[َّ][َّ]?ح[ْ]?م[َ][ٰ]?نِ\\s*[اٱ]لر[َّ][َّ]?حِيمِ\\s*', 'g'),

    // Even more flexible - match base letters and any diacritics between them
    new RegExp('بِ?سْ?مِ?\\s*[اٱ]لل[َّـ]*هِ?\\s*[اٱ]لر[َّـ]*ح[ْـ]*م[َٰـ]*نِ?\\s*[اٱ]لر[َّـ]*حِ?يمِ?\\s*', 'g'),

    // Simple pattern focusing on key letters
    new RegExp('بسم\\s*[اٱ]لله\\s*[اٱ]لرحم[نٰ]+ن?\\s*[اٱ]لرحيم\\s*', 'gi'),

    // Pattern matching بسم ... الرحيم (everything between)
    new RegExp('بِ?سْ?مِ?[^ي]*[اٱ]لر[^ي]*حِ?يمِ?\\s*', 'g'),
  ];
}

function getStartPatterns() {
  return [
    new RegExp('^[بِسْمِ\\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرَّحِيمِ\\s*'),
    new RegExp('^[بِسْمِ\\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرحيم\\s*'),
    new RegExp('^[بسم\\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرَّحِيمِ\\s*'),
    new RegExp('^[بسم\\s]*[اٱ]للَّهِ[^ي]*[اٱ]لرحيم\\s*'),
  ];
}

/**
 * Remove Bismillah from text
 */
function removeBismillah(text: string): string {
  if (!text) return text;

  let cleanedText = text;

  // Try each pattern and remove matches (get fresh patterns each time)
  for (const pattern of getBismillahPatterns()) {
    cleanedText = cleanedText.replace(pattern, '');
  }

  // Additional cleanup for Bismillah-like text at the beginning
  for (const pattern of getStartPatterns()) {
    cleanedText = cleanedText.replace(pattern, '');
  }

  return cleanedText.trim();
}

/**
 * Check if text contains Bismillah
 * Note: Get fresh patterns to avoid regex state issues
 */
function containsBismillah(text: string, debug = false): boolean {
  if (!text) return false;

  // Get fresh pattern instances for each check
  const patterns = getBismillahPatterns();

  if (debug) {
    console.log('  DEBUG: Checking text:', text.substring(0, 60));
    console.log('  DEBUG: Text length:', text.length);
    console.log('  DEBUG: First char codes:', [...text.substring(0, 5)].map(c => c.charCodeAt(0)));
  }

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const matches = pattern.test(text);

    if (debug && i < 3) {
      console.log(`  DEBUG: Pattern ${i} test result:`, matches);
    }

    if (matches) {
      if (debug) console.log(`  DEBUG: MATCH FOUND with pattern ${i}`);
      return true;
    }
  }

  if (debug) console.log('  DEBUG: NO MATCH FOUND');
  return false;
}

async function fixBismillahInDatabase() {
  console.log('🔍 Scanning database for ayahs with Bismillah...\n');

  try {
    // Find all ayahs that might have Bismillah (excluding Surah 1 and 9)
    const ayahsWithPossibleBismillah = await prisma.ayah.findMany({
      where: {
        surahId: {
          notIn: [1, 9], // Exclude Al-Fatiha and At-Tawbah
        },
        textArabic: {
          contains: 'بِسْمِ', // Quick filter for performance
        },
      },
      orderBy: [
        { surahId: 'asc' },
        { ayahNumber: 'asc' },
      ],
    });

    console.log(`Found ${ayahsWithPossibleBismillah.length} ayahs with potential Bismillah text\n`);

    if (ayahsWithPossibleBismillah.length === 0) {
      console.log('✅ No ayahs need cleaning! Database is already correct.\n');
      return;
    }

    // Filter to only those that actually have Bismillah
    const ayahsToFix = ayahsWithPossibleBismillah.filter(ayah =>
      containsBismillah(ayah.textArabic)
    );

    console.log(`📝 ${ayahsToFix.length} ayahs actually contain Bismillah and need fixing:\n`);

    // Show preview of what will be changed
    let previewCount = 0;
    for (const ayah of ayahsToFix) {
      if (previewCount < 5) { // Show first 5 as preview
        const cleaned = removeBismillah(ayah.textArabic);
        console.log(`   Surah ${ayah.surahId}, Ayah ${ayah.ayahNumber}:`);
        console.log(`   Before: ${ayah.textArabic.substring(0, 80)}...`);
        console.log(`   After:  ${cleaned.substring(0, 80)}...`);
        console.log(`   Removed ${ayah.textArabic.length - cleaned.length} characters\n`);
        previewCount++;
      }
    }

    if (ayahsToFix.length > 5) {
      console.log(`   ... and ${ayahsToFix.length - 5} more ayahs\n`);
    }

    // Confirm before proceeding
    console.log('⚠️  This will update the database. Continue? (yes/no)');
    console.log('   Or run in test mode first with: DRY_RUN=true npx tsx scripts/fix-bismillah-in-database.ts\n');

    const isDryRun = process.env.DRY_RUN === 'true';
    const autoConfirm = process.env.AUTO_CONFIRM === 'true';

    if (isDryRun) {
      console.log('🧪 DRY RUN MODE - No changes will be made\n');
    } else if (!autoConfirm) {
      console.log('💡 To auto-confirm, run: AUTO_CONFIRM=true npx tsx scripts/fix-bismillah-in-database.ts\n');
      console.log('⏸️  Exiting. Run with AUTO_CONFIRM=true to apply changes.\n');
      return;
    }

    if (!isDryRun) {
      console.log('🔄 Updating database...\n');

      let successCount = 0;
      let errorCount = 0;

      for (const ayah of ayahsToFix) {
        try {
          const cleanedText = removeBismillah(ayah.textArabic);

          await prisma.ayah.update({
            where: { id: ayah.id },
            data: { textArabic: cleanedText },
          });

          successCount++;

          if (successCount <= 3) { // Show first 3 updates
            console.log(`   ✅ Updated Surah ${ayah.surahId}, Ayah ${ayah.ayahNumber}`);
          } else if (successCount % 10 === 0) {
            console.log(`   ✅ Updated ${successCount} ayahs so far...`);
          }
        } catch (error) {
          errorCount++;
          console.error(`   ❌ Failed to update Surah ${ayah.surahId}, Ayah ${ayah.ayahNumber}:`, error);
        }
      }

      console.log('\n📊 Summary:');
      console.log(`   ✅ Successfully updated: ${successCount} ayahs`);
      console.log(`   ❌ Failed: ${errorCount} ayahs`);
      console.log(`   📝 Total processed: ${ayahsToFix.length} ayahs\n`);
    }

    // Verification
    console.log('🔍 Verifying fix...\n');

    const stillHaveBismillah = await prisma.ayah.findMany({
      where: {
        surahId: {
          notIn: [1, 9],
        },
        textArabic: {
          contains: 'بِسْمِ',
        },
      },
      take: 5,
    });

    const actuallyStillHaveBismillah = stillHaveBismillah.filter(ayah =>
      containsBismillah(ayah.textArabic)
    );

    if (actuallyStillHaveBismillah.length === 0) {
      console.log('✅ SUCCESS! All ayahs are now clean. No Bismillah found in inappropriate places.\n');
    } else {
      console.log(`⚠️  Warning: ${actuallyStillHaveBismillah.length} ayahs still contain Bismillah.`);
      console.log('   These might be edge cases. Manual review recommended.\n');

      for (const ayah of actuallyStillHaveBismillah.slice(0, 3)) {
        console.log(`   Surah ${ayah.surahId}, Ayah ${ayah.ayahNumber}: ${ayah.textArabic.substring(0, 60)}...\n`);
      }
    }

    // Test specific ayah
    console.log('🧪 Testing Surah Al-Baqarah (2), Ayah 1:\n');
    const testAyah = await prisma.ayah.findFirst({
      where: {
        surahId: 2,
        ayahNumber: 1,
      },
    });

    if (testAyah) {
      console.log(`   Text: ${testAyah.textArabic}`);
      console.log(`   Length: ${testAyah.textArabic.length} characters`);
      console.log(`\n   First 20 Unicode characters:`);
      for (let i = 0; i < Math.min(20, testAyah.textArabic.length); i++) {
        const char = testAyah.textArabic[i];
        const code = char.charCodeAt(0);
        const hex = code.toString(16).toUpperCase().padStart(4, '0');
        console.log(`   [${i}] '${char}' = U+${hex} (${code})`);
      }

      console.log(`\n   Checking with DEBUG enabled:\n`);
      const hasBismillah = containsBismillah(testAyah.textArabic, true);
      console.log(`\n   Contains Bismillah: ${hasBismillah ? '❌ YES (Problem!)' : '✅ NO (Good!)'}`);
      console.log(`   Starts with: ${testAyah.textArabic.substring(0, 10)}`);
      console.log(`   Expected to start with: الٓمٓ\n`);

      // Test manual regex
      console.log(`   Manual regex test:`);
      const manualPattern = new RegExp('بِسْمِ\\s*[اٱ]للَّهِ\\s*[اٱ]لرَّحْمَٰنِ\\s*[اٱ]لرَّحِيمِ\\s*', 'g');
      const manualResult = manualPattern.test(testAyah.textArabic);
      console.log(`   Result: ${manualResult}`);
    }

    console.log('✨ Done!\n');

  } catch (error) {
    console.error('❌ Error during database fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixBismillahInDatabase()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
