import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import SurahDisplay from '@/components/surah-display';
import SurahHeader from '@/components/SurahHeader';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
      {/* Back Navigation */}
      <Link
        href="/quran"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Surahs
      </Link>

      {/* Enhanced Surah Header with Bismillah */}
      <SurahHeader
        surahNumber={surah.number}
        nameArabic={surah.nameArabic}
        nameEnglish={surah.nameEnglish}
        nameTranslation={surah.nameTranslation}
        revelationType={surah.revelationType as 'Meccan' | 'Medinan'}
        totalAyahs={surah.numberOfAyahs}
        revelationOrder={surah.order}
        showBismillah={surah.bismillahPre}
        className="mb-10"
      />

      {/* Ayahs Display */}
      <SurahDisplay
        ayahs={surah.ayahs}
        surahNumber={surah.number}
        surahName={surah.nameEnglish}
      />
    </div>
  );
}
