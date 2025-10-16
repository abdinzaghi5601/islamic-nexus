// app/api/test-db/route.ts
// Test database connectivity and data

import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: any = {};
  const errors: any = {};

  try {
    // Test 1: Count surahs
    try {
      const surahCount = await prisma.surah.count();
      results.surahs = { count: surahCount, status: '✅' };
    } catch (err: any) {
      errors.surahs = err.message;
      results.surahs = { status: '❌', error: err.message };
    }

    // Test 2: Count ayahs
    try {
      const ayahCount = await prisma.ayah.count();
      results.ayahs = { count: ayahCount, status: '✅' };
    } catch (err: any) {
      errors.ayahs = err.message;
      results.ayahs = { status: '❌', error: err.message };
    }

    // Test 3: Count translations
    try {
      const translationCount = await prisma.translation.count();
      results.translations = { count: translationCount, status: '✅' };
    } catch (err: any) {
      errors.translations = err.message;
      results.translations = { status: '❌', error: err.message };
    }

    // Test 4: Count themes
    try {
      const themeCount = await prisma.ayahTheme.count();
      results.themes = { count: themeCount, status: '✅' };
    } catch (err: any) {
      errors.themes = err.message;
      results.themes = { status: '❌', error: err.message };
    }

    // Test 5: Get sample surah with revelation type
    try {
      const sampleSurah = await prisma.surah.findFirst({
        where: { number: 1 },
        select: {
          id: true,
          number: true,
          nameEnglish: true,
          nameArabic: true,
          revelationType: true,
          numberOfAyahs: true,
        },
      });
      results.sampleSurah = { data: sampleSurah, status: '✅' };
    } catch (err: any) {
      errors.sampleSurah = err.message;
      results.sampleSurah = { status: '❌', error: err.message };
    }

    // Test 6: Test groupBy on surahs (this might be failing)
    try {
      const revelationStats = await prisma.surah.groupBy({
        by: ['revelationType'],
        _count: {
          _all: true,
        },
        _sum: {
          numberOfAyahs: true,
        },
      });
      results.revelationStats = { data: revelationStats, status: '✅' };
    } catch (err: any) {
      errors.revelationStats = err.message;
      results.revelationStats = { status: '❌', error: err.message };
    }

    // Test 7: Find many surahs by revelation type
    try {
      const meccanSurahs = await prisma.surah.findMany({
        where: { revelationType: 'Meccan' },
        take: 5,
        select: {
          number: true,
          nameEnglish: true,
          numberOfAyahs: true,
          revelationType: true,
        },
      });
      results.meccanSurahs = { count: meccanSurahs.length, data: meccanSurahs, status: '✅' };
    } catch (err: any) {
      errors.meccanSurahs = err.message;
      results.meccanSurahs = { status: '❌', error: err.message };
    }

    // Test 8: Check if revelationOrder field exists
    try {
      const surahWithOrder = await prisma.surah.findFirst({
        where: { number: 1 },
        select: {
          number: true,
          revelationOrder: true,
        },
      });
      results.revelationOrder = { data: surahWithOrder, status: '✅' };
    } catch (err: any) {
      errors.revelationOrder = err.message;
      results.revelationOrder = { status: '❌', error: err.message };
    }

    return NextResponse.json({
      success: Object.keys(errors).length === 0,
      results,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      summary: {
        totalTests: 8,
        passed: Object.values(results).filter((r: any) => r.status === '✅').length,
        failed: Object.keys(errors).length,
      },
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
