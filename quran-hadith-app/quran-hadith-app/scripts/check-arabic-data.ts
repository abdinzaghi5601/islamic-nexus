import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkArabicData() {
  console.log('Checking Arabic data in corpus...\n');

  // Check words with Arabic text
  const words = await prisma.ayahWord.findMany({
    take: 5,
    include: {
      root: true,
      ayah: {
        include: {
          surah: true,
        },
      },
    },
  });

  console.log('Sample words from database:');
  console.log('='.repeat(80));

  words.forEach((word, idx) => {
    console.log(`\nWord ${idx + 1}:`);
    console.log(`  Location: Surah ${word.ayah.surah.number}:${word.ayah.ayahNumber}, Word ${word.position}`);
    console.log(`  Arabic Text: ${word.textArabic}`);
    console.log(`  Simplified: ${word.textSimplified}`);
    console.log(`  Transliteration: ${word.transliteration}`);
    if (word.root) {
      console.log(`  Root: ${word.root.root}`);
      console.log(`  Root Meaning: ${word.root.meaning}`);
    }
  });

  // Check roots
  console.log('\n\n' + '='.repeat(80));
  console.log('Sample roots from database:');
  console.log('='.repeat(80));

  const roots = await prisma.wordRoot.findMany({
    take: 10,
    orderBy: {
      occurrences: 'desc',
    },
  });

  roots.forEach((root, idx) => {
    console.log(`${idx + 1}. Root: "${root.root}" | Meaning: "${root.meaning}" | Occurrences: ${root.occurrences}`);
  });

  await prisma.$disconnect();
}

checkArabicData()
  .then(() => {
    console.log('\n✅ Check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
