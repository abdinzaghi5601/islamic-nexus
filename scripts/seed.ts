import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Translators
  console.log('📖 Seeding translators...');
  const translators = await prisma.translator.createMany({
    data: [
      {
        name: 'Sahih International',
        language: 'English',
        description: 'Modern English translation',
      },
      {
        name: 'Yusuf Ali',
        language: 'English',
        description: 'Classical English translation',
      },
      {
        name: 'Pickthall',
        language: 'English',
        description: 'English translation by Muhammad Marmaduke Pickthall',
      },
      {
        name: 'Dr. Mustafa Khattab',
        language: 'English',
        description: 'Clear Quran - Contemporary English translation',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${translators.count} translators`);

  // Seed Tafsir Books
  console.log('📚 Seeding tafsir books...');
  const tafsirBooks = await prisma.tafsirBook.createMany({
    data: [
      {
        name: 'Tafsir Ibn Kathir',
        authorName: 'Ismail ibn Kathir',
        language: 'English',
        description: 'Classical tafsir translated to English',
      },
      {
        name: 'Tafsir al-Jalalayn',
        authorName: 'Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti',
        language: 'English',
        description: 'Concise classical tafsir',
      },
      {
        name: 'Tafsir Maarif-ul-Quran',
        authorName: 'Mufti Muhammad Shafi',
        language: 'English',
        description: 'Comprehensive contemporary tafsir',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${tafsirBooks.count} tafsir books`);

  // Seed Hadith Books
  console.log('📕 Seeding hadith books...');
  const hadithBooks = await prisma.hadithBook.createMany({
    data: [
      {
        name: 'Sahih al-Bukhari',
        nameArabic: 'صحيح البخاري',
        author: 'Imam Muhammad al-Bukhari',
        description: 'The most authentic hadith collection',
        totalHadiths: 7563,
      },
      {
        name: 'Sahih Muslim',
        nameArabic: 'صحيح مسلم',
        author: 'Imam Muslim ibn al-Hajjaj',
        description: 'Second most authentic hadith collection',
        totalHadiths: 7190,
      },
      {
        name: 'Sunan Abu Dawud',
        nameArabic: 'سنن أبي داود',
        author: 'Imam Abu Dawud',
        description: 'Collection focused on legal hadiths',
        totalHadiths: 5274,
      },
      {
        name: 'Jami at-Tirmidhi',
        nameArabic: 'جامع الترمذي',
        author: 'Imam at-Tirmidhi',
        description: 'Collection with grading of hadiths',
        totalHadiths: 3956,
      },
      {
        name: 'Sunan an-Nasa\'i',
        nameArabic: 'سنن النسائي',
        author: 'Imam an-Nasa\'i',
        description: 'Rigorous collection of hadiths',
        totalHadiths: 5758,
      },
      {
        name: 'Sunan Ibn Majah',
        nameArabic: 'سنن ابن ماجه',
        author: 'Imam Ibn Majah',
        description: 'Final book of the six major collections',
        totalHadiths: 4341,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${hadithBooks.count} hadith books`);

  console.log('✅ Database seed completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Run import scripts to populate Quran data');
  console.log('2. Run import scripts to populate Hadith data');
  console.log('3. Run import scripts to populate Tafsir data');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
