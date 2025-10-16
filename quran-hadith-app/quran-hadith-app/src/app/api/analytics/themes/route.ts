// app/api/analytics/themes/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all themes with their ayah counts
    const themes = await prisma.theme.findMany({
      include: {
        _count: {
          select: {
            ayahs: true,
          },
        },
        subThemes: {
          include: {
            _count: {
              select: {
                ayahs: true,
              },
            },
          },
        },
        parentTheme: {
          select: {
            id: true,
            name: true,
            nameArabic: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Separate main themes and sub-themes
    const mainThemes = themes.filter(t => !t.parentThemeId);
    const subThemes = themes.filter(t => t.parentThemeId);

    // Calculate distribution for main themes
    const themeDistribution = mainThemes.map(theme => {
      // Count ayahs for this theme and all its sub-themes
      const directAyahs = theme._count.ayahs;
      const subThemeAyahs = theme.subThemes.reduce(
        (sum, sub) => sum + sub._count.ayahs,
        0
      );
      const totalAyahs = directAyahs + subThemeAyahs;

      return {
        id: theme.id,
        name: theme.name,
        nameArabic: theme.nameArabic,
        slug: theme.slug,
        description: theme.description,
        ayahCount: totalAyahs,
        directAyahCount: directAyahs,
        subThemeCount: theme.subThemes.length,
        subThemes: theme.subThemes.map(sub => ({
          id: sub.id,
          name: sub.name,
          nameArabic: sub.nameArabic,
          slug: sub.slug,
          ayahCount: sub._count.ayahs,
        })),
      };
    });

    // Sort by ayah count
    themeDistribution.sort((a, b) => b.ayahCount - a.ayahCount);

    // Calculate statistics
    const totalAyahsTagged = themeDistribution.reduce(
      (sum, t) => sum + t.ayahCount,
      0
    );
    const avgAyahsPerTheme = Math.round(totalAyahsTagged / themeDistribution.length);

    // Get top themes
    const topThemes = themeDistribution.slice(0, 8);

    // Get most detailed theme (most sub-themes)
    const mostDetailed = [...themeDistribution].sort(
      (a, b) => b.subThemeCount - a.subThemeCount
    )[0];

    return NextResponse.json({
      success: true,
      data: {
        themes: themeDistribution,
        statistics: {
          totalMainThemes: mainThemes.length,
          totalSubThemes: subThemes.length,
          totalThemes: themes.length,
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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theme analytics' },
      { status: 500 }
    );
  }
}
