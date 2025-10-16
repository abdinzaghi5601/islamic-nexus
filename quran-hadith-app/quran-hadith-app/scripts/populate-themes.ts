// scripts/populate-themes.ts
// Migration script to populate themes in the database based on search utils

import prisma from '../src/lib/db/prisma';
import { TOPICS, PROPHETS } from '../src/lib/utils/search-utils';

interface ThemeData {
  name: string;
  nameArabic: string | null;
  slug: string;
  description: string;
  parentThemeId?: number;
}

// Main themes structure
const MAIN_THEMES: Record<string, ThemeData> = {
  faith: {
    name: 'Faith & Belief',
    nameArabic: 'الإيمان والعقيدة',
    slug: 'faith-belief',
    description: 'Core beliefs, faith in Allah, pillars of Islam and Iman',
  },
  worship: {
    name: 'Worship & Rituals',
    nameArabic: 'العبادة والشعائر',
    slug: 'worship-rituals',
    description: 'Prayer, fasting, hajj, zakat, and other acts of worship',
  },
  prophets: {
    name: 'Prophets & Messengers',
    nameArabic: 'الأنبياء والرسل',
    slug: 'prophets-messengers',
    description: 'Stories and lessons from the prophets sent by Allah',
  },
  morality: {
    name: 'Morality & Ethics',
    nameArabic: 'الأخلاق والآداب',
    slug: 'morality-ethics',
    description: 'Islamic character, good manners, and ethical teachings',
  },
  guidance: {
    name: 'Guidance & Law',
    nameArabic: 'الهداية والشريعة',
    slug: 'guidance-law',
    description: 'Divine guidance, Islamic law, and life principles',
  },
  afterlife: {
    name: 'Afterlife & Hereafter',
    nameArabic: 'الآخرة والحساب',
    slug: 'afterlife-hereafter',
    description: 'Paradise, Hell, Day of Judgment, and the hereafter',
  },
  creation: {
    name: 'Creation & Nature',
    nameArabic: 'الخلق والطبيعة',
    slug: 'creation-nature',
    description: 'Allah\'s creation, universe, nature, and signs in creation',
  },
  social: {
    name: 'Social Life',
    nameArabic: 'الحياة الاجتماعية',
    slug: 'social-life',
    description: 'Family, community, society, and social responsibilities',
  },
};

// Sub-themes mapped to parent themes
const SUB_THEMES: Record<string, { parentKey: string; theme: ThemeData }[]> = {
  faith: [
    {
      parentKey: 'faith',
      theme: {
        name: 'Tawhid (Oneness of Allah)',
        nameArabic: 'التوحيد',
        slug: 'tawhid',
        description: 'The absolute oneness and uniqueness of Allah',
      },
    },
    {
      parentKey: 'faith',
      theme: {
        name: 'Iman (Faith)',
        nameArabic: 'الإيمان',
        slug: 'iman',
        description: 'Belief and faith in Allah and His attributes',
      },
    },
    {
      parentKey: 'faith',
      theme: {
        name: 'Taqwa (God-consciousness)',
        nameArabic: 'التقوى',
        slug: 'taqwa',
        description: 'Fear and consciousness of Allah',
      },
    },
    {
      parentKey: 'faith',
      theme: {
        name: 'Trust in Allah',
        nameArabic: 'التوكل على الله',
        slug: 'trust-in-allah',
        description: 'Reliance and trust in Allah (Tawakkul)',
      },
    },
  ],
  worship: [
    {
      parentKey: 'worship',
      theme: {
        name: 'Prayer (Salah)',
        nameArabic: 'الصلاة',
        slug: 'prayer',
        description: 'The five daily prayers and their importance',
      },
    },
    {
      parentKey: 'worship',
      theme: {
        name: 'Fasting (Sawm)',
        nameArabic: 'الصوم',
        slug: 'fasting',
        description: 'Fasting during Ramadan and its spiritual benefits',
      },
    },
    {
      parentKey: 'worship',
      theme: {
        name: 'Charity (Zakat)',
        nameArabic: 'الزكاة',
        slug: 'charity',
        description: 'Obligatory charity and voluntary giving (Sadaqah)',
      },
    },
    {
      parentKey: 'worship',
      theme: {
        name: 'Pilgrimage (Hajj)',
        nameArabic: 'الحج',
        slug: 'pilgrimage',
        description: 'The pilgrimage to Mecca',
      },
    },
    {
      parentKey: 'worship',
      theme: {
        name: 'Dua (Supplication)',
        nameArabic: 'الدعاء',
        slug: 'dua',
        description: 'Calling upon Allah and making supplications',
      },
    },
  ],
  morality: [
    {
      parentKey: 'morality',
      theme: {
        name: 'Patience (Sabr)',
        nameArabic: 'الصبر',
        slug: 'patience',
        description: 'Patience and perseverance in face of trials',
      },
    },
    {
      parentKey: 'morality',
      theme: {
        name: 'Gratitude (Shukr)',
        nameArabic: 'الشكر',
        slug: 'gratitude',
        description: 'Thankfulness and appreciation to Allah',
      },
    },
    {
      parentKey: 'morality',
      theme: {
        name: 'Forgiveness',
        nameArabic: 'المغفرة',
        slug: 'forgiveness',
        description: 'Seeking forgiveness and forgiving others',
      },
    },
    {
      parentKey: 'morality',
      theme: {
        name: 'Justice (Adl)',
        nameArabic: 'العدل',
        slug: 'justice',
        description: 'Fairness, equity, and justice in all matters',
      },
    },
    {
      parentKey: 'morality',
      theme: {
        name: 'Mercy & Compassion',
        nameArabic: 'الرحمة',
        slug: 'mercy-compassion',
        description: 'Showing mercy and kindness to all creatures',
      },
    },
    {
      parentKey: 'morality',
      theme: {
        name: 'Truthfulness',
        nameArabic: 'الصدق',
        slug: 'truthfulness',
        description: 'Honesty and truthfulness in speech and action',
      },
    },
  ],
  afterlife: [
    {
      parentKey: 'afterlife',
      theme: {
        name: 'Paradise (Jannah)',
        nameArabic: 'الجنة',
        slug: 'paradise',
        description: 'The eternal gardens of paradise',
      },
    },
    {
      parentKey: 'afterlife',
      theme: {
        name: 'Hell (Jahannam)',
        nameArabic: 'جهنم',
        slug: 'hell',
        description: 'The punishment and warning of hellfire',
      },
    },
    {
      parentKey: 'afterlife',
      theme: {
        name: 'Day of Judgment',
        nameArabic: 'يوم القيامة',
        slug: 'day-of-judgment',
        description: 'The final day of reckoning and accountability',
      },
    },
    {
      parentKey: 'afterlife',
      theme: {
        name: 'Death & Resurrection',
        nameArabic: 'الموت والبعث',
        slug: 'death-resurrection',
        description: 'Death, the grave, and resurrection',
      },
    },
  ],
  social: [
    {
      parentKey: 'social',
      theme: {
        name: 'Family & Parents',
        nameArabic: 'الأسرة والوالدين',
        slug: 'family-parents',
        description: 'Rights of parents, family relationships',
      },
    },
    {
      parentKey: 'social',
      theme: {
        name: 'Knowledge & Learning',
        nameArabic: 'العلم والتعلم',
        slug: 'knowledge-learning',
        description: 'Seeking knowledge and wisdom',
      },
    },
    {
      parentKey: 'social',
      theme: {
        name: 'Wealth & Poverty',
        nameArabic: 'الغنى والفقر',
        slug: 'wealth-poverty',
        description: 'Dealing with wealth, earning halal, helping the needy',
      },
    },
  ],
};

async function populateThemes() {
  console.log('🚀 Starting theme population...\n');

  try {
    // Step 1: Create main themes
    console.log('Creating main themes...');
    const createdMainThemes: Record<string, number> = {};

    for (const [key, themeData] of Object.entries(MAIN_THEMES)) {
      const theme = await prisma.theme.upsert({
        where: { slug: themeData.slug },
        update: themeData,
        create: themeData,
      });
      createdMainThemes[key] = theme.id;
      console.log(`  ✓ Created/Updated: ${theme.name}`);
    }

    console.log(`\n✅ Created ${Object.keys(createdMainThemes).length} main themes\n`);

    // Step 2: Create sub-themes
    console.log('Creating sub-themes...');
    let subThemeCount = 0;

    for (const [parentKey, subThemes] of Object.entries(SUB_THEMES)) {
      const parentId = createdMainThemes[parentKey];
      if (!parentId) {
        console.warn(`  ⚠️  Parent theme not found for key: ${parentKey}`);
        continue;
      }

      for (const { theme: subThemeData } of subThemes) {
        const subTheme = await prisma.theme.upsert({
          where: { slug: subThemeData.slug },
          update: {
            ...subThemeData,
            parentThemeId: parentId,
          },
          create: {
            ...subThemeData,
            parentThemeId: parentId,
          },
        });
        subThemeCount++;
        console.log(`  ✓ Created/Updated: ${subTheme.name} (under ${MAIN_THEMES[parentKey].name})`);
      }
    }

    console.log(`\n✅ Created ${subThemeCount} sub-themes\n`);

    // Step 3: Create prophet-specific themes
    console.log('Creating prophet-specific themes...');
    const prophetParentId = createdMainThemes['prophets'];
    let prophetThemeCount = 0;

    for (const [key, prophetInfo] of Object.entries(PROPHETS)) {
      const prophetName = prophetInfo.english[0];
      const prophetArabic = prophetInfo.arabic[0];
      const slug = `prophet-${key}`;

      const theme = await prisma.theme.upsert({
        where: { slug },
        update: {
          name: `Prophet ${prophetName}`,
          nameArabic: prophetArabic,
          description: `Stories and lessons from Prophet ${prophetName}`,
          parentThemeId: prophetParentId,
        },
        create: {
          name: `Prophet ${prophetName}`,
          nameArabic: prophetArabic,
          slug,
          description: `Stories and lessons from Prophet ${prophetName}`,
          parentThemeId: prophetParentId,
        },
      });
      prophetThemeCount++;
      console.log(`  ✓ Created/Updated: ${theme.name}`);
    }

    console.log(`\n✅ Created ${prophetThemeCount} prophet themes\n`);

    // Summary
    const totalThemes = await prisma.theme.count();
    console.log('╔════════════════════════════════════════╗');
    console.log(`║  ✅ Theme Population Complete!         ║`);
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  Main Themes:    ${Object.keys(createdMainThemes).length.toString().padEnd(23)}║`);
    console.log(`║  Sub Themes:     ${subThemeCount.toString().padEnd(23)}║`);
    console.log(`║  Prophet Themes: ${prophetThemeCount.toString().padEnd(23)}║`);
    console.log(`║  Total Themes:   ${totalThemes.toString().padEnd(23)}║`);
    console.log('╚════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n❌ Error populating themes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateThemes()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
