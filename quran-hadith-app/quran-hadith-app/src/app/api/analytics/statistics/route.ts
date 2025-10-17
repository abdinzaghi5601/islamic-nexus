// app/api/analytics/statistics/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch comprehensive statistics
    const [
      totalSurahs,
      totalAyahs,
      totalTranslations,
      surahDetails,
      revelationStats,
    ] = await Promise.all([
      // Basic counts
      prisma.surah.count(),
      prisma.ayah.count(),
      prisma.translation.count(),

      // Surah details
      prisma.surah.findMany({
        select: {
          number: true,
          nameEnglish: true,
          nameArabic: true,
          numberOfAyahs: true,
          revelationType: true,
          order: true,
          _count: {
            select: {
              ayahs: true,
            },
          },
        },
        orderBy: {
          number: 'asc',
        },
      }),

      // Revelation statistics
      prisma.surah.groupBy({
        by: ['revelationType'],
        _count: {
          _all: true,
        },
        _sum: {
          numberOfAyahs: true,
        },
      }),
    ]);

    // Calculate ayah distribution statistics
    const ayahCounts = surahDetails.map(s => s.numberOfAyahs);
    const avgAyahsPerSurah = Math.round(
      ayahCounts.reduce((sum, count) => sum + count, 0) / ayahCounts.length
    );
    const medianAyahs = ayahCounts.sort((a, b) => a - b)[Math.floor(ayahCounts.length / 2)];

    // Revelation breakdown
    const meccanStats = revelationStats.find(r => r.revelationType === 'Meccan');
    const medinanStats = revelationStats.find(r => r.revelationType === 'Medinan');

    // Interesting facts
    const longestSurah = surahDetails.reduce((max, s) =>
      s.numberOfAyahs > max.numberOfAyahs ? s : max
    );
    const shortestSurah = surahDetails.reduce((min, s) =>
      s.numberOfAyahs < min.numberOfAyahs ? s : min
    );

    // Juz information (30 parts)
    const ayahsPerJuz = Math.round(totalAyahs / 30);

    return NextResponse.json({
      success: true,
      data: {
        quranStructure: {
          totalSurahs,
          totalAyahs,
          totalWords: 77797,
          totalLetters: 323015,
          totalUniqueWords: 14870,
          totalJuz: 30,
          totalManzils: 7,
          totalRukus: 558,
        },
        surahStats: {
          avgAyahsPerSurah,
          medianAyahs,
          longestSurah: {
            number: longestSurah.number,
            name: longestSurah.nameEnglish,
            nameArabic: longestSurah.nameArabic,
            ayahs: longestSurah.numberOfAyahs,
          },
          shortestSurah: {
            number: shortestSurah.number,
            name: shortestSurah.nameEnglish,
            nameArabic: shortestSurah.nameArabic,
            ayahs: shortestSurah.numberOfAyahs,
          },
        },
        revelation: {
          meccan: {
            surahs: meccanStats?._count._all || 0,
            ayahs: meccanStats?._sum.numberOfAyahs || 0,
            percentage: Math.round(((meccanStats?._count._all || 0) / totalSurahs) * 100),
          },
          medinan: {
            surahs: medinanStats?._count._all || 0,
            ayahs: medinanStats?._sum.numberOfAyahs || 0,
            percentage: Math.round(((medinanStats?._count._all || 0) / totalSurahs) * 100),
          },
        },
        resources: {
          translations: totalTranslations,
          tafsirs: 0, // Tafsir model structure differs
          themes: 8, // Static theme count
        },
        divisions: {
          juz: {
            total: 30,
            avgAyahsPerJuz: ayahsPerJuz,
          },
          manzils: {
            total: 7,
            avgAyahsPerManzil: Math.round(totalAyahs / 7),
          },
          rukus: {
            total: 558,
            avgAyahsPerRuku: Math.round(totalAyahs / 558),
          },
        },
        interestingFacts: [
          {
            fact: 'Most Mentioned Word',
            value: 'Allah (2,699 times)',
            category: 'Words',
          },
          {
            fact: 'Most Mentioned Prophet',
            value: 'Prophet Moses (136 times)',
            category: 'Prophets',
          },
          {
            fact: 'Number of Prostration Verses',
            value: '15 Sajdah verses',
            category: 'Worship',
          },
          {
            fact: 'Middle Surah',
            value: 'Surah 57: Al-Hadid',
            category: 'Structure',
          },
          {
            fact: 'Verses of Quran mentioning the Quran',
            value: 'Over 50 verses',
            category: 'Self-reference',
          },
          {
            fact: 'Revealed over',
            value: '23 years',
            category: 'Revelation',
          },
          {
            fact: 'Languages translated to',
            value: 'Over 100 languages',
            category: 'Reach',
          },
          {
            fact: 'Bismillah appears',
            value: '114 times',
            category: 'Phrases',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
