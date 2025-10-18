import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const words = await prisma.ayahWord.count();
  const roots = await prisma.wordRoot.count();
  const grammar = await prisma.wordGrammar.count();
  const morphology = await prisma.wordMorphology.count();

  console.log('Current database status:');
  console.log(`  AyahWords: ${words.toLocaleString()}`);
  console.log(`  WordRoots: ${roots.toLocaleString()}`);
  console.log(`  WordGrammar: ${grammar.toLocaleString()}`);
  console.log(`  WordMorphology: ${morphology.toLocaleString()}`);

  if (words > 0) {
    const sampleWords = await prisma.ayahWord.findMany({
      take: 5,
      include: {
        root: true,
        grammar: true,
        morphology: true,
      },
    });

    console.log('\nSample words:');
    sampleWords.forEach((w) => {
      console.log(`  ${w.textArabic} (${w.transliteration}) - Root: ${w.root?.root || 'N/A'}`);
    });
  }

  await prisma.$disconnect();
}

checkData();
