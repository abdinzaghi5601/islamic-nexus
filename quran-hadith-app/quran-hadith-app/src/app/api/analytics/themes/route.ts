// app/api/analytics/themes/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Static theme data (Theme model doesn't exist in schema yet)
const MOCK_THEMES = [
  {
    id: 1,
    name: 'Faith & Belief',
    nameArabic: 'الإيمان والعقيدة',
    slug: 'faith-belief',
    description: 'Verses about faith, belief in Allah, and the pillars of Iman',
    ayahCount: 850,
    directAyahCount: 650,
    subThemeCount: 5,
    subThemes: [
      { id: 11, name: 'Tawhid', nameArabic: 'التوحيد', slug: 'tawhid', ayahCount: 200 },
      { id: 12, name: 'Prophethood', nameArabic: 'النبوة', slug: 'prophethood', ayahCount: 150 },
    ],
  },
  {
    id: 2,
    name: 'Worship & Prayer',
    nameArabic: 'العبادة والصلاة',
    slug: 'worship-prayer',
    description: 'Verses about Salah, fasting, Hajj, and other acts of worship',
    ayahCount: 720,
    directAyahCount: 520,
    subThemeCount: 4,
    subThemes: [
      { id: 21, name: 'Salah', nameArabic: 'الصلاة', slug: 'salah', ayahCount: 200 },
      { id: 22, name: 'Fasting', nameArabic: 'الصيام', slug: 'fasting', ayahCount: 100 },
    ],
  },
  {
    id: 3,
    name: 'Stories of Prophets',
    nameArabic: 'قصص الأنبياء',
    slug: 'prophet-stories',
    description: 'Narratives about prophets and messengers',
    ayahCount: 680,
    directAyahCount: 680,
    subThemeCount: 0,
    subThemes: [],
  },
  {
    id: 4,
    name: 'Paradise & Hellfire',
    nameArabic: 'الجنة والنار',
    slug: 'paradise-hellfire',
    description: 'Descriptions of the Hereafter',
    ayahCount: 550,
    directAyahCount: 550,
    subThemeCount: 2,
    subThemes: [
      { id: 41, name: 'Paradise', nameArabic: 'الجنة', slug: 'paradise', ayahCount: 300 },
      { id: 42, name: 'Hellfire', nameArabic: 'النار', slug: 'hellfire', ayahCount: 250 },
    ],
  },
  {
    id: 5,
    name: 'Social Justice',
    nameArabic: 'العدالة الاجتماعية',
    slug: 'social-justice',
    description: 'Verses about justice, equity, and social welfare',
    ayahCount: 420,
    directAyahCount: 420,
    subThemeCount: 0,
    subThemes: [],
  },
  {
    id: 6,
    name: 'Family & Relations',
    nameArabic: 'الأسرة والعلاقات',
    slug: 'family-relations',
    description: 'Guidance on family matters and relationships',
    ayahCount: 380,
    directAyahCount: 380,
    subThemeCount: 3,
    subThemes: [],
  },
  {
    id: 7,
    name: 'Knowledge & Wisdom',
    nameArabic: 'العلم والحكمة',
    slug: 'knowledge-wisdom',
    description: 'Verses encouraging seeking knowledge',
    ayahCount: 340,
    directAyahCount: 340,
    subThemeCount: 0,
    subThemes: [],
  },
  {
    id: 8,
    name: 'Creation & Nature',
    nameArabic: 'الخلق والطبيعة',
    slug: 'creation-nature',
    description: 'Signs of Allah in creation',
    ayahCount: 310,
    directAyahCount: 310,
    subThemeCount: 0,
    subThemes: [],
  },
];

export async function GET() {
  try {
    const themeDistribution = MOCK_THEMES;
    const totalAyahsTagged = themeDistribution.reduce((sum, t) => sum + t.ayahCount, 0);
    const avgAyahsPerTheme = Math.round(totalAyahsTagged / themeDistribution.length);
    const topThemes = themeDistribution.slice(0, 8);
    const mainThemes = themeDistribution.filter((t) => t.subThemeCount === 0 || t.subThemes.length === 0);
    const subThemes = themeDistribution.flatMap((t) => t.subThemes);
    const mostDetailed = [...themeDistribution].sort((a, b) => b.subThemeCount - a.subThemeCount)[0];

    return NextResponse.json({
      success: true,
      data: {
        themes: themeDistribution,
        statistics: {
          totalMainThemes: mainThemes.length,
          totalSubThemes: subThemes.length,
          totalThemes: themeDistribution.length,
          totalAyahsTagged,
          avgAyahsPerTheme,
          mostPopularTheme: topThemes[0],
          mostDetailedTheme: {
            name: mostDetailed.name,
            nameArabic: mostDetailed.nameArabic,
            subThemeCount: mostDetailed.subThemeCount,
          },
        },
        topThemes,
      },
    });
  } catch (error) {
    console.error('Error fetching theme analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme analytics' }, { status: 500 });
  }
}
