import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

/**
 * GET /api/quran/ayah-complete/[surah]/[ayah]
 * Get a complete ayah with all related data:
 * - Arabic text
 * - Translations
 * - Tafsirs
 * - Themes
 * - Related Hadiths
 * - Duas (if any)
 * - Lessons (if any)
 *
 * Query params:
 *   - translations: comma-separated translator IDs (e.g., ?translations=1,2)
 *   - tafsir: comma-separated tafsir book IDs (e.g., ?tafsir=1,2)
 *   - includeThemes: include theme tags (default: true)
 *   - includeHadiths: include related hadiths (default: true)
 *   - includeDuas: include duas from ayah (default: true)
 *   - includeLessons: include lessons from ayah (default: true)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surah: string; ayah: string }> }
) {
  try {
    const { surah, ayah } = await params;
    const surahNumber = parseInt(surah);
    const ayahNumber = parseInt(ayah);

    // Validate surah and ayah numbers
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return errorResponse('Invalid surah number. Must be between 1 and 114');
    }

    if (isNaN(ayahNumber) || ayahNumber < 1) {
      return errorResponse('Invalid ayah number. Must be greater than 0');
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;

    // Translation filter
    const translationsParam = searchParams.get('translations');
    const translatorIds = translationsParam
      ? translationsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      : undefined;

    // Tafsir filter
    const tafsirParam = searchParams.get('tafsir');
    const tafsirIds = tafsirParam
      ? tafsirParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      : undefined;

    // Include options
    const includeThemes = searchParams.get('includeThemes') !== 'false';
    const includeHadiths = searchParams.get('includeHadiths') !== 'false';
    const includeDuas = searchParams.get('includeDuas') !== 'false';
    const includeLessons = searchParams.get('includeLessons') !== 'false';

    // Fetch the ayah with all related data
    const ayahData = await prisma.ayah.findFirst({
      where: {
        surahId: surahNumber,
        ayahNumber: ayahNumber,
      },
      include: {
        surah: true,
        translations: {
          where: translatorIds ? { translatorId: { in: translatorIds } } : undefined,
          include: {
            translator: true,
          },
          orderBy: {
            translatorId: 'asc',
          },
        },
        tafsirs: {
          where: tafsirIds ? { tafsirBookId: { in: tafsirIds } } : undefined,
          include: {
            tafsirBook: true,
          },
          orderBy: {
            tafsirBookId: 'asc',
          },
        },
        themes: includeThemes ? {
          include: {
            theme: {
              include: {
                parentTheme: true,
              },
            },
          },
          orderBy: {
            relevance: 'desc',
          },
        } : false,
        duas: includeDuas ? {
          include: {
            dua: true,
          },
        } : false,
        lessons: includeLessons ? {
          orderBy: {
            createdAt: 'desc',
          },
        } : false,
      },
    });

    if (!ayahData) {
      return errorResponse(
        `Ayah not found: Surah ${surahNumber}, Ayah ${ayahNumber}`,
        404
      );
    }

    // Fetch related hadiths if requested
    let relatedHadiths = [];
    if (includeHadiths) {
      const hadithReferences = await prisma.hadithAyahReference.findMany({
        where: {
          ayahId: ayahData.id,
        },
        include: {
          hadith: {
            include: {
              book: true,
              chapter: true,
            },
          },
        },
        take: 10, // Limit to 10 most relevant hadiths
      });

      relatedHadiths = hadithReferences.map(ref => ref.hadith);
    }

    // Build the response
    const response = {
      ayah: {
        // Basic ayah info
        id: ayahData.id,
        surahNumber: ayahData.surahId,
        ayahNumber: ayahData.ayahNumber,
        numberInQuran: ayahData.numberInQuran,
        arabicText: ayahData.textArabic,
        juz: ayahData.juz,
        manzil: ayahData.manzil,
        page: ayahData.page,
        hizbQuarter: ayahData.hizbQuarter,
        sajda: ayahData.sajdah,

        // Surah info
        surah: {
          number: ayahData.surah.number,
          name: ayahData.surah.name,
          nameArabic: ayahData.surah.nameArabic,
          nameTranslation: ayahData.surah.nameTranslation,
          revelationType: ayahData.surah.revelationType,
          totalAyahs: ayahData.surah.totalAyahs,
        },

        // Translations
        translations: ayahData.translations.map(t => ({
          id: t.id,
          text: t.text,
          translator: {
            id: t.translator.id,
            name: t.translator.name,
            language: t.translator.language,
          },
        })),

        // Tafsirs
        tafsirs: ayahData.tafsirs.map(t => ({
          id: t.id,
          text: t.text,
          tafsirBook: {
            id: t.tafsirBook.id,
            name: t.tafsirBook.name,
            authorName: t.tafsirBook.authorName,
            language: t.tafsirBook.language,
          },
        })),

        // Themes
        themes: includeThemes ? ayahData.themes.map(tm => ({
          id: tm.theme.id,
          name: tm.theme.name,
          nameArabic: tm.theme.nameArabic,
          slug: tm.theme.slug,
          description: tm.theme.description,
          relevance: tm.relevance,
          parentTheme: tm.theme.parentTheme ? {
            id: tm.theme.parentTheme.id,
            name: tm.theme.parentTheme.name,
            slug: tm.theme.parentTheme.slug,
          } : null,
        })) : undefined,

        // Related Hadiths
        relatedHadiths: includeHadiths ? relatedHadiths.map(h => ({
          id: h.id,
          hadithNumber: h.hadithNumber,
          textArabic: h.textArabic,
          textEnglish: h.textEnglish,
          book: {
            id: h.book.id,
            name: h.book.name,
            arabicName: h.book.arabicName,
          },
          chapter: h.chapter ? {
            id: h.chapter.id,
            title: h.chapter.title,
            arabicTitle: h.chapter.arabicTitle,
          } : null,
        })) : undefined,

        // Duas
        duas: includeDuas ? ayahData.duas.map(d => ({
          id: d.id,
          arabicText: d.arabicText,
          transliteration: d.transliteration,
          translation: d.translation,
          occasion: d.occasion,
          benefits: d.benefits,
        })) : undefined,

        // Lessons
        lessons: includeLessons ? ayahData.lessons.map(l => ({
          id: l.id,
          title: l.title,
          lessonText: l.lessonText,
          category: l.category,
          tags: l.tags,
          source: l.source,
        })) : undefined,
      },

      // Navigation helpers
      navigation: {
        previous: ayahNumber > 1 ? {
          surah: surahNumber,
          ayah: ayahNumber - 1,
        } : (surahNumber > 1 ? {
          surah: surahNumber - 1,
          ayah: null, // Need to get last ayah of previous surah
        } : null),
        next: ayahNumber < ayahData.surah.totalAyahs ? {
          surah: surahNumber,
          ayah: ayahNumber + 1,
        } : (surahNumber < 114 ? {
          surah: surahNumber + 1,
          ayah: 1,
        } : null),
      },

      // Metadata
      metadata: {
        totalTranslations: ayahData.translations.length,
        totalTafsirs: ayahData.tafsirs.length,
        totalThemes: includeThemes ? ayahData.themes.length : undefined,
        totalRelatedHadiths: includeHadiths ? relatedHadiths.length : undefined,
        totalDuas: includeDuas ? ayahData.duas.length : undefined,
        totalLessons: includeLessons ? ayahData.lessons.length : undefined,
      },
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error fetching complete ayah data:', error);
    return errorResponse('Failed to fetch ayah data', 500);
  }
}
