import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

async function getSurah(id: string) {
  const res = await fetch(`http://localhost:3000/api/quran/surahs/${id}?translations=1,2,3,4`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch surah');
  }

  const data = await res.json();
  return data.data;
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surah = await getSurah(id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/quran"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Surahs
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{surah.nameEnglish}</h1>
            <p className="text-muted-foreground">
              {surah.nameTranslation} • {surah.numberOfAyahs} Ayahs • {surah.revelationType}
            </p>
          </div>
          <div className="text-4xl font-arabic" dir="rtl">
            {surah.nameArabic}
          </div>
        </div>

        {/* Bismillah */}
        {surah.bismillahPre && surah.number !== 1 && surah.number !== 9 && (
          <div className="text-center text-3xl font-arabic py-8" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>

      {/* Ayahs */}
      <div className="space-y-8">
        {surah.ayahs.map((ayah: any) => (
          <div key={ayah.id} className="border-b pb-6">
            {/* Ayah Number */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {ayah.ayahNumber}
              </div>
              <div className="text-xs text-muted-foreground">
                Ayah {ayah.ayahNumber} • Juz {ayah.juz}
              </div>
            </div>

            {/* Arabic Text */}
            <div
              className="text-3xl font-arabic leading-loose mb-6 text-right"
              dir="rtl"
            >
              {ayah.textArabic}
            </div>

            {/* Translations */}
            <div className="space-y-4">
              {ayah.translations.map((translation: any) => (
                <div key={translation.id} className="pl-4 border-l-2 border-muted">
                  <p className="text-sm text-muted-foreground mb-1">
                    {translation.translator.name}
                  </p>
                  <p className="leading-relaxed">{translation.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
