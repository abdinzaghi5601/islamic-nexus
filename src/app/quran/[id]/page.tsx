import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import SurahDisplay from '@/components/surah-display';

async function getSurah(id: string) {
  const surahNumber = parseInt(id);

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error('Invalid surah number. Must be between 1 and 114');
  }

  const translatorIds = [1, 2, 3, 4];

  const surah = await prisma.surah.findUnique({
    where: { number: surahNumber },
    include: {
      ayahs: {
        orderBy: { ayahNumber: 'asc' },
        include: {
          translations: {
            where: { translatorId: { in: translatorIds } },
            include: {
              translator: true,
            },
          },
          tafsirs: {
            include: {
              tafsirBook: true,
            },
          },
        },
      },
    },
  });

  if (!surah) {
    throw new Error('Surah not found');
  }

  return surah;
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surah = await getSurah(id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/quran"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Surahs
        </Link>

        <div className="glass-card p-6 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">{surah.nameEnglish}</h1>
              <p className="text-muted-foreground text-lg">
                {surah.nameTranslation} • {surah.numberOfAyahs} Ayahs • {surah.revelationType}
              </p>
            </div>
            <div className="text-5xl font-arabic" dir="rtl">
              {surah.nameArabic}
            </div>
          </div>
        </div>

        {/* Bismillah */}
        {surah.bismillahPre && surah.number !== 1 && surah.number !== 9 && (
          <div className="glass-card text-center text-4xl font-arabic py-10 rounded-2xl" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>

      {/* Ayahs with Tabs */}
      <SurahDisplay ayahs={surah.ayahs} surahNumber={surah.number} />
    </div>
  );
}
