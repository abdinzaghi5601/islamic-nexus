import prisma from '../src/lib/db/prisma';

// Sample duas data - curated from authentic sources
const categories = [
  {
    name: 'Morning & Evening',
    nameArabic: 'أذكار الصباح والمساء',
    description: 'Daily supplications to recite in the morning and evening',
    icon: 'sun',
    slug: 'morning-evening',
  },
  {
    name: 'Health & Healing',
    nameArabic: 'الصحة والشفاء',
    description: 'Duas for health, healing from illness, and protection from diseases',
    icon: 'activity',
    slug: 'health-healing',
  },
  {
    name: 'Travel',
    nameArabic: 'السفر',
    description: 'Supplications for safe journey and protection while traveling',
    icon: 'plane',
    slug: 'travel',
  },
  {
    name: 'Daily Life',
    nameArabic: 'الحياة اليومية',
    description: 'Duas for various daily activities and situations',
    icon: 'home',
    slug: 'daily-life',
  },
  {
    name: 'Worship',
    nameArabic: 'العبادة',
    description: 'Supplications related to prayers and worship',
    icon: 'heart',
    slug: 'worship',
  },
];

const duas = [
  // Morning & Evening Duas
  {
    categorySlug: 'morning-evening',
    title: 'Morning Protection',
    titleArabic: 'أذكار الصباح',
    textArabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    textEnglish: 'We have entered the morning and the dominion belongs to Allah, and all praise is for Allah',
    transliteration: "Asbahna wa-asbaha l-mulku lillah, wa-l-hamdu lillah",
    reference: 'Muslim 2723',
    tags: 'morning, protection, daily',
    benefits: 'Recited in the morning for protection and blessings throughout the day',
    occasion: 'Upon waking up in the morning',
  },
  {
    categorySlug: 'morning-evening',
    title: 'Evening Protection',
    titleArabic: 'أذكار المساء',
    textArabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    textEnglish: 'We have entered the evening and the dominion belongs to Allah, and all praise is for Allah',
    transliteration: "Amsayna wa-amsa l-mulku lillah, wa-l-hamdu lillah",
    reference: 'Muslim 2723',
    tags: 'evening, protection, daily',
    benefits: 'Recited in the evening for protection and blessings throughout the night',
    occasion: 'Upon entering the evening',
  },

  // Health & Healing Duas
  {
    categorySlug: 'health-healing',
    title: 'Healing Dua',
    titleArabic: 'دعاء الشفاء',
    textArabic: 'أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ، اشْفِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    textEnglish: 'Remove the hardship, Lord of mankind, heal, You are the Healer. There is no cure except Your cure, a cure that does not leave any disease behind',
    transliteration: "Adh-hibi l-basa rabba n-nas, ishfi wa-anta sh-shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama",
    reference: 'Bukhari 5675, Muslim 2191',
    tags: 'health, healing, cure, illness, medicine',
    benefits: 'A powerful dua for healing from any illness or disease',
    occasion: 'When sick or visiting the sick',
  },
  {
    categorySlug: 'health-healing',
    title: 'Protection from Illness',
    titleArabic: 'الحماية من المرض',
    textArabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ، وَالْجُنُونِ، وَالْجُذَامِ، وَمِنْ سَيِّئِ الْأَسْقَامِ',
    textEnglish: 'O Allah, I seek refuge in You from leprosy, insanity, elephantiasis, and evil diseases',
    transliteration: "Allahumma inni a'udhu bika min al-barasi, wa-l-jununi, wa-l-judhami, wa min sayyi'i l-asqam",
    reference: 'Abu Dawud 1554',
    tags: 'health, protection, disease, prevention',
    benefits: 'Protection from various illnesses and diseases',
    occasion: 'Daily, especially in morning and evening',
  },

  // Travel Duas
  {
    categorySlug: 'travel',
    title: 'Dua When Starting Journey',
    titleArabic: 'دعاء السفر',
    textArabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    textEnglish: 'Glory is to Him Who has subjected this to us, and we could never have it (by our efforts). And verily, to Our Lord we indeed are to return!',
    transliteration: "Subhana lladhi sakhkhara lana hadha wa-ma kunna lahu muqrinin, wa-inna ila rabbina la-munqalibun",
    reference: 'Quran 43:13-14, Abu Dawud 2602',
    tags: 'travel, journey, protection, safety',
    benefits: 'Protection and safety during travel',
    occasion: 'When boarding vehicle or starting journey',
  },

  // Daily Life Duas
  {
    categorySlug: 'daily-life',
    title: 'Before Eating',
    titleArabic: 'دعاء قبل الطعام',
    textArabic: 'بِسْمِ اللَّهِ',
    textEnglish: 'In the name of Allah',
    transliteration: "Bismillah",
    reference: 'Bukhari 5376, Muslim 2017',
    tags: 'food, eating, daily, meal',
    benefits: 'Blessing in food and protection from harm',
    occasion: 'Before every meal',
  },
  {
    categorySlug: 'daily-life',
    title: 'After Eating',
    titleArabic: 'دعاء بعد الطعام',
    textArabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
    textEnglish: 'All praise is due to Allah who has fed us and given us drink, and made us Muslims',
    transliteration: "Al-hamdu lillahi lladhi at'amana wa-saqana wa-ja'alana min al-muslimin",
    reference: 'Abu Dawud 3850, Tirmidhi 3457',
    tags: 'food, eating, daily, gratitude',
    benefits: 'Showing gratitude for sustenance',
    occasion: 'After finishing meal',
  },

  // Worship Duas
  {
    categorySlug: 'worship',
    title: 'After Wudu',
    titleArabic: 'دعاء بعد الوضوء',
    textArabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    textEnglish: 'I bear witness that there is no deity worthy of worship except Allah alone with no partner, and I bear witness that Muhammad is His servant and messenger',
    transliteration: "Ash-hadu an la ilaha illa llahu wahdahu la sharika lah, wa-ash-hadu anna Muhammadan 'abduhu wa-rasuluh",
    reference: 'Muslim 234',
    tags: 'wudu, ablution, prayer, worship',
    benefits: 'Opens the eight gates of Paradise',
    occasion: 'After completing wudu (ablution)',
  },
];

async function main() {
  console.log('Starting dua import...');

  try {
    // Clear existing data
    console.log('Clearing existing dua data...');
    await prisma.dua.deleteMany();
    await prisma.duaCategory.deleteMany();

    // Import categories
    console.log('Importing categories...');
    for (const category of categories) {
      await prisma.duaCategory.create({
        data: category,
      });
      console.log(`✓ Created category: ${category.name}`);
    }

    // Import duas
    console.log('\nImporting duas...');
    for (const dua of duas) {
      const category = await prisma.duaCategory.findUnique({
        where: { slug: dua.categorySlug },
      });

      if (!category) {
        console.log(`✗ Category not found: ${dua.categorySlug}`);
        continue;
      }

      await prisma.dua.create({
        data: {
          categoryId: category.id,
          title: dua.title,
          titleArabic: dua.titleArabic,
          textArabic: dua.textArabic,
          textEnglish: dua.textEnglish,
          transliteration: dua.transliteration,
          reference: dua.reference,
          tags: dua.tags,
          benefits: dua.benefits,
          occasion: dua.occasion,
        },
      });
      console.log(`✓ Created dua: ${dua.title}`);
    }

    console.log(`\n✓ Successfully imported ${categories.length} categories and ${duas.length} duas!`);
  } catch (error) {
    console.error('Error importing duas:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
