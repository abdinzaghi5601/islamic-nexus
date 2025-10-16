import AyahStudyClient from '@/components/ayah-study-client';
import prisma from '@/lib/db/prisma';
import { getCleanedAyahText } from '@/lib/utils/bismillah';

interface AyahPageProps {
  params: Promise<{
    surah: string;
    ayah: string;
  }>;
}

async function getCompleteAyah(surah: string, ayah: string) {
  const surahNumber = parseInt(surah);
  const ayahNumber = parseInt(ayah);

  // Validate input
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error('Invalid surah number');
  }
  if (isNaN(ayahNumber) || ayahNumber < 1) {
    throw new Error('Invalid ayah number');
  }

  // Fetch directly from database
  const ayahData = await prisma.ayah.findFirst({
    where: {
      surahId: surahNumber,
      ayahNumber: ayahNumber,
    },
    include: {
      surah: true,
      translations: {
        include: { translator: true },
        orderBy: { translatorId: 'asc' },
      },
      tafsirs: {
        include: { tafsirBook: true },
        orderBy: { tafsirBookId: 'asc' },
      },
      themes: {
        include: {
          theme: {
            include: { parentTheme: true },
          },
        },
        orderBy: { relevance: 'desc' },
      },
      duas: true,
      lessons: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!ayahData) {
    throw new Error('Ayah not found');
  }

  // Fetch related hadiths
  const hadithReferences = await prisma.hadithAyahReference.findMany({
    where: { ayahId: ayahData.id },
    include: {
      hadith: {
        include: {
          book: true,
          chapter: true,
        },
      },
    },
    take: 10,
  });

  const relatedHadiths = hadithReferences.map(ref => ref.hadith);

  // Build response
  return {
    ayah: {
      id: ayahData.id,
      surahNumber: ayahData.surahId,
      ayahNumber: ayahData.ayahNumber,
      numberInQuran: ayahData.numberInQuran,
      arabicText: getCleanedAyahText(ayahData.textArabic, ayahData.surahId, ayahData.ayahNumber),
      juz: ayahData.juz,
      manzil: ayahData.manzil,
      page: ayahData.page,
      ruku: ayahData.ruku,
      hizb: ayahData.hizbQuarter,
      sajda: ayahData.sajdah,
      surah: {
        number: ayahData.surah.number,
        name: ayahData.surah.nameEnglish,
        nameArabic: ayahData.surah.nameArabic,
        nameTranslation: ayahData.surah.nameTranslation,
        revelationType: ayahData.surah.revelationType,
        totalAyahs: ayahData.surah.numberOfAyahs,
      },
      translations: ayahData.translations.map(t => ({
        id: t.id,
        text: t.text,
        translator: {
          id: t.translator.id,
          name: t.translator.name,
          language: t.translator.language,
        },
      })),
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
      themes: ayahData.themes.map(tm => ({
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
      })),
      relatedHadiths: relatedHadiths.map(h => ({
        id: h.id,
        hadithNumber: h.hadithNumber,
        textArabic: h.textArabic,
        textEnglish: h.textEnglish,
        book: {
          id: h.book.id,
          name: h.book.name,
          nameArabic: h.book.nameArabic,
        },
        chapter: h.chapter ? {
          id: h.chapter.id,
          title: h.chapter.nameEnglish,
          arabicTitle: h.chapter.nameArabic,
        } : null,
      })),
      duas: ayahData.duas.map(d => ({
        id: d.id,
        arabicText: d.arabicText,
        transliteration: d.transliteration,
        translation: d.translation,
        occasion: d.occasion,
        benefits: d.benefits,
      })),
      lessons: ayahData.lessons.map(l => ({
        id: l.id,
        title: l.title,
        lessonText: l.lessonText,
        category: l.category,
        tags: l.tags,
        source: l.source,
      })),
    },
    navigation: {
      previous: ayahNumber > 1 ? {
        surah: surahNumber,
        ayah: ayahNumber - 1,
      } : (surahNumber > 1 ? {
        surah: surahNumber - 1,
        ayah: null,
      } : null),
      next: ayahNumber < ayahData.surah.numberOfAyahs ? {
        surah: surahNumber,
        ayah: ayahNumber + 1,
      } : (surahNumber < 114 ? {
        surah: surahNumber + 1,
        ayah: 1,
      } : null),
    },
    metadata: {
      totalTranslations: ayahData.translations.length,
      totalTafsirs: ayahData.tafsirs.length,
      totalThemes: ayahData.themes.length,
      totalRelatedHadiths: relatedHadiths.length,
      totalDuas: ayahData.duas.length,
      totalLessons: ayahData.lessons.length,
    },
  };
}

export default async function AyahStudyPage({ params }: AyahPageProps) {
  const { surah, ayah } = await params;

  try {
    const data = await getCompleteAyah(surah, ayah);

    return (
      <AyahStudyClient
        ayahData={data.ayah}
        navigation={data.navigation}
        metadata={data.metadata}
      />
    );
  } catch (error) {
    console.error('Error loading ayah:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-red-500 font-medium">Failed to load ayah. Please try again.</p>
          <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AyahPageProps) {
  const { surah, ayah } = await params;
  const surahNum = parseInt(surah);
  const ayahNum = parseInt(ayah);

  try {
    // Quick metadata fetch without all relations
    const ayahData = await prisma.ayah.findFirst({
      where: {
        surahId: surahNum,
        ayahNumber: ayahNum,
      },
      include: {
        surah: true,
        translations: {
          take: 1,
          include: { translator: true },
        },
      },
    });

    if (!ayahData) {
      return {
        title: `Quran Study - Surah ${surah} Ayah ${ayah}`,
        description: `Study Surah ${surah}, Ayah ${ayah} with translations, tafsir, and related hadiths.`,
      };
    }

    return {
      title: `${ayahData.surah.nameEnglish} ${ayahData.ayahNumber} - ${ayahData.surah.nameTranslation} | Quran Study`,
      description: ayahData.translations[0]?.text.substring(0, 160) || `Study ${ayahData.surah.nameEnglish} ayah ${ayahData.ayahNumber} with translations, tafsir, and related hadiths.`,
    };
  } catch (error) {
    return {
      title: `Quran Study - Surah ${surah} Ayah ${ayah}`,
      description: `Study Surah ${surah}, Ayah ${ayah} with translations, tafsir, and related hadiths.`,
    };
  }
}
