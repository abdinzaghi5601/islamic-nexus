import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Translation Insights API
 * Provides analytics on translations cross-referenced with scholarly data
 */
export async function GET() {
  try {
    // Get translation statistics
    const translationStats = await prisma.$queryRaw<Array<{
      translator_name: string;
      translation_count: bigint;
      language: string;
    }>>`
      SELECT
        t.name as translator_name,
        t.language,
        COUNT(tr.id) as translation_count
      FROM translators t
      LEFT JOIN translations tr ON tr."translatorId" = t.id
      GROUP BY t.id, t.name, t.language
      ORDER BY translation_count DESC
    `;

    // Get ayahs with multiple translations (shows scholarly diversity)
    const multiTranslationAyahs = await prisma.$queryRaw<Array<{
      surah_number: number;
      ayah_number: number;
      translation_count: bigint;
    }>>`
      SELECT
        s.number as surah_number,
        a."ayahNumber" as ayah_number,
        COUNT(tr.id) as translation_count
      FROM ayahs a
      JOIN surahs s ON s.id = a."surahId"
      JOIN translations tr ON tr."ayahId" = a.id
      GROUP BY s.number, a."ayahNumber"
      HAVING COUNT(tr.id) > 1
      ORDER BY translation_count DESC
      LIMIT 10
    `;

    // Get key terms analysis across translations
    const keyTermsAnalysis = await analyzeKeyTerms();

    // Get prophet mentions with scholarly context
    const prophetMentions = await analyzeProphetMentions();

    // Format response
    const insights = {
      translators: translationStats.map(t => ({
        name: t.translator_name,
        language: t.language,
        translationCount: Number(t.translation_count)
      })),
      scholarlydiversity: {
        ayahsWithMultipleTranslations: multiTranslationAyahs.length,
        topDivergeAyahs: multiTranslationAyahs.map(a => ({
          surah: Number(a.surah_number),
          ayah: Number(a.ayah_number),
          translationCount: Number(a.translation_count)
        }))
      },
      keyTerms: keyTermsAnalysis,
      prophets: prophetMentions
    };

    return NextResponse.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error fetching translation insights:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translation insights' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Analyze key Islamic terms across translations
 */
async function analyzeKeyTerms() {
  const keyTerms = [
    'Allah', 'God', 'Lord', 'Mercy', 'Merciful', 'Compassion',
    'Believe', 'Faith', 'Prayer', 'Guidance', 'Righteous',
    'Paradise', 'Heaven', 'Hell', 'Fire', 'Punishment'
  ];

  const termStats = [];

  for (const term of keyTerms) {
    const count = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM translations
      WHERE LOWER(text) LIKE LOWER(${'%' + term + '%'})
    `;

    if (count[0] && Number(count[0].count) > 0) {
      termStats.push({
        term,
        occurrences: Number(count[0].count)
      });
    }
  }

  return termStats.sort((a, b) => b.occurrences - a.occurrences);
}

/**
 * Analyze prophet mentions with scholarly context
 */
async function analyzeProphetMentions() {
  const prophets = [
    { name: 'Moses', variations: ['Moses', 'Musa'] },
    { name: 'Abraham', variations: ['Abraham', 'Ibrahim'] },
    { name: 'Jesus', variations: ['Jesus', 'Isa', 'Christ'] },
    { name: 'Noah', variations: ['Noah', 'Nuh'] },
    { name: 'Adam', variations: ['Adam'] },
    { name: 'Joseph', variations: ['Joseph', 'Yusuf'] },
    { name: 'David', variations: ['David', 'Dawud'] },
    { name: 'Solomon', variations: ['Solomon', 'Sulaiman'] },
  ];

  const prophetStats = [];

  for (const prophet of prophets) {
    let totalCount = 0;
    const ayahRefs = [];

    for (const variation of prophet.variations) {
      const result = await prisma.$queryRaw<Array<{
        surah_number: number;
        ayah_number: number;
        count: bigint;
      }>>`
        SELECT
          s.number as surah_number,
          a."ayahNumber" as ayah_number,
          COUNT(*) as count
        FROM translations tr
        JOIN ayahs a ON a.id = tr."ayahId"
        JOIN surahs s ON s.id = a."surahId"
        WHERE LOWER(tr.text) LIKE LOWER(${'%' + variation + '%'})
        GROUP BY s.number, a."ayahNumber"
        LIMIT 5
      `;

      totalCount += result.reduce((sum, r) => sum + Number(r.count), 0);
      ayahRefs.push(...result.map(r => ({
        surah: Number(r.surah_number),
        ayah: Number(r.ayah_number)
      })));
    }

    if (totalCount > 0) {
      prophetStats.push({
        name: prophet.name,
        mentions: totalCount,
        ayahReferences: ayahRefs.slice(0, 5), // Top 5 references
        scholaryNote: getScholarlyNote(prophet.name)
      });
    }
  }

  return prophetStats.sort((a, b) => b.mentions - a.mentions);
}

/**
 * Get scholarly notes for prophets (can be expanded with actual hadith references)
 */
function getScholarlyNote(prophetName: string): string {
  const notes: Record<string, string> = {
    'Moses': 'Most mentioned prophet in the Quran. Emphasized by scholars for lessons in leadership and trust in Allah.',
    'Abraham': 'Father of the prophets. Scholars highlight his unwavering monotheism and submission to Allah.',
    'Jesus': 'One of the greatest messengers. Salaf scholars emphasize his miraculous birth and prophetic mission.',
    'Noah': 'Prophet of patience. Scholars note his 950 years of calling his people to Allah.',
    'Adam': 'First human and prophet. Scholars discuss the concept of khilafah (vicegerency) on earth.',
    'Joseph': 'Prophet of dreams and patience. Scholars highlight his story as a complete narrative in Surah Yusuf.',
    'David': 'Prophet-king. Scholars note the gift of the Psalms (Zabur) and his beautiful voice in worship.',
    'Solomon': 'Prophet-king with knowledge of birds and jinn. Scholars discuss his wisdom and justice.'
  };

  return notes[prophetName] || 'Mentioned in the Quran as a righteous prophet of Allah.';
}
