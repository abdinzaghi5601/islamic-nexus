// app/api/analytics/overview/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Total counts
    const [
      totalSurahs,
      totalAyahs,
      meccanSurahs,
      medinanSurahs,
      longestSurahs,
      shortestSurahs,
    ] = await Promise.all([
      // Total Surahs
      prisma.surah.count(),

      // Total Ayahs
      prisma.ayah.count(),

      // Meccan stats
      prisma.surah.findMany({
        where: { revelationType: 'Meccan' },
        include: {
          _count: {
            select: { ayahs: true }
          }
        }
      }),

      // Medinan stats
      prisma.surah.findMany({
        where: { revelationType: 'Medinan' },
        include: {
          _count: {
            select: { ayahs: true }
          }
        }
      }),

      // Longest Surahs
      prisma.surah.findMany({
        orderBy: { numberOfAyahs: 'desc' },
        take: 10,
        select: {
          nameEnglish: true,
          nameArabic: true,
          number: true,
          numberOfAyahs: true,
        }
      }),

      // Shortest Surahs
      prisma.surah.findMany({
        orderBy: { numberOfAyahs: 'asc' },
        take: 10,
        select: {
          nameEnglish: true,
          nameArabic: true,
          number: true,
          numberOfAyahs: true,
        }
      }),
    ]);

    // Calculate Meccan/Medinan ayah counts
    const meccanAyahs = meccanSurahs.reduce((sum, surah) => sum + surah._count.ayahs, 0);
    const medinanAyahs = medinanSurahs.reduce((sum, surah) => sum + surah._count.ayahs, 0);

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          surahs: totalSurahs,
          ayahs: totalAyahs,
          uniqueWords: 14870, // Approximate from Quran corpus
          totalWords: 77797,  // Total words in Quran
        },
        revelation: {
          meccan: {
            surahs: meccanSurahs.length,
            ayahs: meccanAyahs,
          },
          medinan: {
            surahs: medinanSurahs.length,
            ayahs: medinanAyahs,
          },
        },
        longestSurahs: longestSurahs.map(s => ({
          name: s.nameEnglish,
          arabic: s.nameArabic,
          number: s.number,
          ayahs: s.numberOfAyahs,
        })),
        shortestSurahs: shortestSurahs.map(s => ({
          name: s.nameEnglish,
          arabic: s.nameArabic,
          number: s.number,
          ayahs: s.numberOfAyahs,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch overview analytics' },
      { status: 500 }
    );
  }
}
