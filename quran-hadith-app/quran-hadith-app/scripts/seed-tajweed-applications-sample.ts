/**
 * Seed Sample Tajweed Applications
 *
 * This script adds sample tajweed applications for Surah Al-Fatiha (first 7 ayahs)
 * to demonstrate the tajweed visualization feature.
 *
 * Note: Full Quran tajweed mapping would require either:
 * 1. Integration with a tajweed API service
 * 2. Manual annotation by tajweed experts
 * 3. AI-assisted annotation with expert verification
 *
 * This is a SAMPLE implementation for demonstration purposes.
 */

import prisma from '../src/lib/db/prisma';

interface TajweedMapping {
  ayahNumber: number;
  surahNumber: number;
  startPosition: number;
  endPosition: number;
  ruleId: string;
  affectedText: string;
  notes?: string;
}

// Sample tajweed applications for Surah Al-Fatiha
// These are approximate positions and would need expert verification
const SAMPLE_MAPPINGS: TajweedMapping[] = [
  // Ayah 1: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
  {
    ayahNumber: 1,
    surahNumber: 1,
    startPosition: 10,
    endPosition: 16,
    ruleId: 'lam-qamariyyah',
    affectedText: 'اللَّهِ',
    notes: 'Lam is pronounced clearly before "لـ"'
  },
  {
    ayahNumber: 1,
    surahNumber: 1,
    startPosition: 18,
    endPosition: 27,
    ruleId: 'madd-tabii',
    affectedText: 'الرَّحْمَٰنِ',
    notes: 'Natural elongation with ا'
  },
  {
    ayahNumber: 1,
    surahNumber: 1,
    startPosition: 29,
    endPosition: 37,
    ruleId: 'madd-tabii',
    affectedText: 'الرَّحِيمِ',
    notes: 'Natural elongation with ي'
  },

  // Ayah 2: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
  {
    ayahNumber: 2,
    surahNumber: 1,
    startPosition: 10,
    endPosition: 15,
    ruleId: 'lam-qamariyyah',
    affectedText: 'لِلَّهِ',
    notes: 'Lam is pronounced clearly'
  },
  {
    ayahNumber: 2,
    surahNumber: 1,
    startPosition: 21,
    endPosition: 31,
    ruleId: 'madd-tabii',
    affectedText: 'الْعَالَمِينَ',
    notes: 'Natural elongation with ا'
  },
  {
    ayahNumber: 2,
    surahNumber: 1,
    startPosition: 0,
    endPosition: 8,
    ruleId: 'lam-qamariyyah',
    affectedText: 'الْحَمْدُ',
    notes: 'Lam Qamariyyah - Lam is pronounced'
  },

  // Ayah 3: الرَّحْمَٰنِ الرَّحِيمِ
  {
    ayahNumber: 3,
    surahNumber: 1,
    startPosition: 0,
    endPosition: 9,
    ruleId: 'lam-shamsiyyah',
    affectedText: 'الرَّحْمَٰنِ',
    notes: 'Lam is assimilated into Ra'
  },
  {
    ayahNumber: 3,
    surahNumber: 1,
    startPosition: 10,
    endPosition: 18,
    ruleId: 'lam-shamsiyyah',
    affectedText: 'الرَّحِيمِ',
    notes: 'Lam is assimilated into Ra'
  },
  {
    ayahNumber: 3,
    surahNumber: 1,
    startPosition: 3,
    endPosition: 7,
    ruleId: 'madd-tabii',
    affectedText: 'حْمَٰنِ',
    notes: 'Natural elongation'
  },

  // Ayah 4: مَالِكِ يَوْمِ الدِّينِ
  {
    ayahNumber: 4,
    surahNumber: 1,
    startPosition: 0,
    endPosition: 5,
    ruleId: 'madd-tabii',
    affectedText: 'مَالِكِ',
    notes: 'Natural elongation with ا'
  },
  {
    ayahNumber: 4,
    surahNumber: 1,
    startPosition: 11,
    endPosition: 18,
    ruleId: 'lam-shamsiyyah',
    affectedText: 'الدِّينِ',
    notes: 'Lam merges with Dal'
  },

  // Ayah 5: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
  {
    ayahNumber: 5,
    surahNumber: 1,
    startPosition: 0,
    endPosition: 6,
    ruleId: 'madd-tabii',
    affectedText: 'إِيَّاكَ',
    notes: 'Natural elongation with ي'
  },
  {
    ayahNumber: 5,
    surahNumber: 1,
    startPosition: 16,
    endPosition: 22,
    ruleId: 'madd-tabii',
    affectedText: 'إِيَّاكَ',
    notes: 'Natural elongation with ي'
  },
  {
    ayahNumber: 5,
    surahNumber: 1,
    startPosition: 23,
    endPosition: 32,
    ruleId: 'madd-tabii',
    affectedText: 'نَسْتَعِينُ',
    notes: 'Natural elongation with ي'
  },

  // Ayah 6: اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
  {
    ayahNumber: 6,
    surahNumber: 1,
    startPosition: 7,
    endPosition: 16,
    ruleId: 'lam-shamsiyyah',
    affectedText: 'الصِّرَاطَ',
    notes: 'Lam merges with Sad'
  },
  {
    ayahNumber: 6,
    surahNumber: 1,
    startPosition: 9,
    endPosition: 14,
    ruleId: 'madd-tabii',
    affectedText: 'صِّرَاطَ',
    notes: 'Natural elongation with ا'
  },
  {
    ayahNumber: 6,
    surahNumber: 1,
    startPosition: 24,
    endPosition: 33,
    ruleId: 'madd-tabii',
    affectedText: 'الْمُسْتَقِيمَ',
    notes: 'Natural elongation with ي'
  },

  // Ayah 7: صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 0,
    endPosition: 5,
    ruleId: 'madd-tabii',
    affectedText: 'صِرَاطَ',
    notes: 'Natural elongation with ا'
  },
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 7,
    endPosition: 14,
    ruleId: 'lam-shamsiyyah',
    affectedText: 'الَّذِينَ',
    notes: 'Lam merges with Dal'
  },
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 30,
    endPosition: 33,
    ruleId: 'ghunnah',
    affectedText: 'هِمْ',
    notes: 'Ghunnah on Meem Sakinah'
  },
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 35,
    endPosition: 39,
    ruleId: 'madd-tabii',
    affectedText: 'غَيْرِ',
    notes: 'Natural elongation'
  },
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 56,
    endPosition: 59,
    ruleId: 'ghunnah',
    affectedText: 'هِمْ',
    notes: 'Ghunnah on Meem Sakinah'
  },
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 64,
    endPosition: 72,
    ruleId: 'lam-shamsiyyah',
    affectedText: 'الضَّالِّينَ',
    notes: 'Lam merges with Dhad'
  },
  {
    ayahNumber: 7,
    surahNumber: 1,
    startPosition: 60,
    endPosition: 63,
    ruleId: 'madd-tabii',
    affectedText: 'وَلَا',
    notes: 'Natural elongation with ا'
  },
];

async function seedTajweedApplications() {
  console.log('🌱 Starting Tajweed Applications seeding for Surah Al-Fatiha...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const mapping of SAMPLE_MAPPINGS) {
    try {
      // Find the ayah
      const ayah = await prisma.ayah.findFirst({
        where: {
          surahId: mapping.surahNumber,
          ayahNumber: mapping.ayahNumber,
        },
      });

      if (!ayah) {
        console.log(`⚠️  Ayah not found: Surah ${mapping.surahNumber}, Ayah ${mapping.ayahNumber}`);
        errorCount++;
        continue;
      }

      // Find the tajweed rule
      const rule = await prisma.tajweedRule.findUnique({
        where: { ruleId: mapping.ruleId },
      });

      if (!rule) {
        console.log(`⚠️  Rule not found: ${mapping.ruleId}`);
        errorCount++;
        continue;
      }

      // Check if application already exists
      const existing = await prisma.tajweedApplication.findFirst({
        where: {
          ayahId: ayah.id,
          ruleId: rule.id,
          startPosition: mapping.startPosition,
          endPosition: mapping.endPosition,
        },
      });

      if (existing) {
        console.log(`⏭  Skipping existing: Surah ${mapping.surahNumber}:${mapping.ayahNumber} - ${mapping.ruleId}`);
        continue;
      }

      // Create the application
      await prisma.tajweedApplication.create({
        data: {
          ayahId: ayah.id,
          ruleId: rule.id,
          startPosition: mapping.startPosition,
          endPosition: mapping.endPosition,
          affectedText: mapping.affectedText,
          notes: mapping.notes,
        },
      });

      console.log(`✓ Created: Surah ${mapping.surahNumber}:${mapping.ayahNumber} - ${rule.name} (${mapping.affectedText})`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to create application:`, error);
      errorCount++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ Seeding complete!');
  console.log(`   Successfully created: ${successCount} applications`);
  console.log(`   Errors/Skipped: ${errorCount}`);
  console.log(`   Total mappings processed: ${SAMPLE_MAPPINGS.length}`);
  console.log('═══════════════════════════════════════');
  console.log('\n📚 Sample data added for Surah Al-Fatiha (1:1-7)');
  console.log('🔗 Visit /quran/1 and click "Show Tajweed" to see it in action!');
  console.log('\n⚠️  Note: This is sample data for demonstration.');
  console.log('   Full Quran coverage requires expert tajweed annotation.');
}

seedTajweedApplications()
  .catch((error) => {
    console.error('Error seeding tajweed applications:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
