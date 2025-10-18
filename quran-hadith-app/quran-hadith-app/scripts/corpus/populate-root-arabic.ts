import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buckwalter to Arabic conversion map
const buckwalterMap: { [key: string]: string } = {
  // Consonants
  'A': 'ا', 'b': 'ب', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح', 'x': 'خ',
  'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س', '$': 'ش', 'S': 'ص',
  'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع', 'g': 'غ', 'f': 'ف', 'q': 'ق',
  'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'y': 'ي',

  // Hamza forms
  '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ', '{': 'ٱ',

  // Vowels and diacritics
  'a': 'َ', 'u': 'ُ', 'i': 'ِ', '~': 'ّ', 'o': 'ْ', '`': 'ٰ', 'Y': 'ى',

  // Special
  'F': 'ً', 'N': 'ٌ', 'K': 'ٍ', 'p': 'ة', '_': '',
};

function buckwalterToArabic(text: string): string {
  let arabic = '';
  for (const char of text) {
    arabic += buckwalterMap[char] || char;
  }
  return arabic;
}

async function populateRootArabic() {
  console.log('📝 Converting root words from Buckwalter to Arabic...\n');

  try {
    // Get all unique roots
    const roots = await prisma.wordRoot.findMany({
      orderBy: { id: 'asc' }
    });

    console.log(`Found ${roots.length} roots to convert\n`);

    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < roots.length; i += batchSize) {
      const batch = roots.slice(i, i + batchSize);

      // Update each root in the batch
      await Promise.all(
        batch.map(async (root) => {
          // Convert the Buckwalter root to Arabic
          const arabicRoot = buckwalterToArabic(root.root);
          const arabicRootSimple = buckwalterToArabic(root.rootSimple);

          // Show a sample conversion
          if (i < 10) {
            console.log(`  Converting: ${root.root} → ${arabicRoot}`);
          }

          await prisma.wordRoot.update({
            where: { id: root.id },
            data: {
              root: arabicRoot,
              rootSimple: arabicRootSimple
            }
          });
        })
      );

      updated += batch.length;
      console.log(`✅ Updated ${updated}/${roots.length} roots`);
    }

    console.log('\n✅ Root Arabic text population complete!');
    console.log(`Total roots updated: ${updated}`);

    // Show sample of converted roots
    console.log('\nSample conversions (Top 10 by frequency):');
    const samples = await prisma.wordRoot.findMany({
      take: 10,
      orderBy: { occurrences: 'desc' }
    });

    for (const sample of samples) {
      console.log(`  ${sample.root} (${sample.occurrences} occurrences)`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

populateRootArabic();
