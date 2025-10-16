import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request
export const revalidate = 0; // Disable caching for truly random content

/**
 * GET /api/daily-content
 * Returns random daily content: one ayah, one hadith, and one dua
 * This endpoint provides engaging daily Islamic content for the homepage carousel
 */
export async function GET() {
  try {
    // Get total counts for random selection
    const [ayahCount, hadithCount, duaCount] = await Promise.all([
      prisma.ayah.count(),
      prisma.hadith.count(),
      prisma.dua.count(),
    ]);

    // Generate random offsets
    const randomAyahOffset = Math.floor(Math.random() * ayahCount);
    const randomHadithOffset = Math.floor(Math.random() * hadithCount);
    const randomDuaOffset = Math.floor(Math.random() * duaCount);

    // Fetch random content using skip
    const [randomAyah, randomHadith, randomDua] = await Promise.all([
      // Random Ayah with Surah info and translation
      prisma.ayah.findFirst({
        skip: randomAyahOffset,
        include: {
          surah: {
            select: {
              nameArabic: true,
              nameEnglish: true,
              number: true,
            },
          },
          translations: {
            take: 1,
            include: {
              translator: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),

      // Random Hadith with book info
      prisma.hadith.findFirst({
        skip: randomHadithOffset,
        include: {
          book: {
            select: {
              name: true,
              nameArabic: true,
            },
          },
          chapter: {
            select: {
              nameEnglish: true,
              nameArabic: true,
            },
          },
        },
      }),

      // Random Dua with category
      prisma.dua.findFirst({
        skip: randomDuaOffset,
        include: {
          category: {
            select: {
              name: true,
              nameArabic: true,
            },
          },
        },
      }),
    ]);

    // Handle case where no content found
    if (!randomAyah || !randomHadith || !randomDua) {
      return NextResponse.json(
        {
          error: 'Failed to fetch daily content',
          details: {
            ayahFound: !!randomAyah,
            hadithFound: !!randomHadith,
            duaFound: !!randomDua,
          }
        },
        { status: 500 }
      );
    }

    // Format response
    const dailyContent = {
      ayah: {
        id: randomAyah.id,
        arabic: randomAyah.textUthmani || randomAyah.textArabic,
        translation: randomAyah.translations[0]?.text || '',
        translator: randomAyah.translations[0]?.translator.name || 'Unknown',
        reference: `${randomAyah.surah.nameEnglish} ${randomAyah.surah.number}:${randomAyah.ayahNumber}`,
        referenceArabic: `${randomAyah.surah.nameArabic} ${randomAyah.surah.number}:${randomAyah.ayahNumber}`,
        surahName: randomAyah.surah.nameEnglish,
        surahNumber: randomAyah.surah.number,
        ayahNumber: randomAyah.ayahNumber,
        link: `/quran/${randomAyah.surah.number}#ayah-${randomAyah.ayahNumber}`,
      },
      hadith: {
        id: randomHadith.id,
        arabic: randomHadith.textArabic,
        english: randomHadith.textEnglish,
        reference: `${randomHadith.book.name}${randomHadith.hadithNumber ? ` ${randomHadith.hadithNumber}` : ''}`,
        bookName: randomHadith.book.name,
        bookNameArabic: randomHadith.book.nameArabic || null,
        chapterName: randomHadith.chapter?.nameEnglish || null,
        grade: randomHadith.grade || 'Not graded',
        link: randomHadith.chapterId
          ? `/hadith/${randomHadith.bookId}/chapter/${randomHadith.chapterId}#hadith-${randomHadith.id}`
          : `/hadith/${randomHadith.bookId}`,
      },
      dua: {
        id: randomDua.id,
        title: randomDua.title,
        titleArabic: randomDua.titleArabic,
        arabic: randomDua.textArabic,
        transliteration: randomDua.transliteration || '',
        english: randomDua.textEnglish,
        category: randomDua.category.name,
        reference: randomDua.reference || '',
        benefits: randomDua.benefits || '',
        occasion: randomDua.occasion || '',
        link: `/duas#dua-${randomDua.id}`,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        totalAyahs: ayahCount,
        totalHadiths: hadithCount,
        totalDuas: duaCount,
      },
    };

    return NextResponse.json(dailyContent, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching daily content:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
