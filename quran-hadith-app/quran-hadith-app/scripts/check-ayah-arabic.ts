import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAyahArabic() {
  console.log('Checking Arabic text in Ayah table...\n');

  // Check first ayah
  const ayah = await prisma.ayah.findFirst({
    where: {
      surah: { number: 1 },
      ayahNumber: 1,
    },
    include: {
      surah: true,
    },
  });

  if (ayah) {
    console.log(`Surah ${ayah.surah.number}:${ayah.ayahNumber}`);
    console.log(`Arabic Text: ${ayah.textArabic}`);
    console.log(`\nWords in this ayah should be:`);
    const words = ayah.textArabic.split(' ');
    words.forEach((word, idx) => {
      console.log(`  Word ${idx + 1}: ${word}`);
    });
  } else {
    console.log('❌ No ayah found');
  }

  await prisma.$disconnect();
}

checkAyahArabic()
  .then(() => {
    console.log('\n✅ Check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
