import Link from 'next/link';
import { Surah } from '@/types/api';

async function getSurahs(): Promise<Surah[]> {
  const res = await fetch(`http://localhost:3000/api/quran/surahs`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch surahs');
  }

  const data = await res.json();
  return data.data;
}

export default async function QuranPage() {
  const surahs = await getSurahs();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">The Holy Quran</h1>
        <p className="text-muted-foreground">
          Browse all 114 surahs with translations and tafsir
        </p>
      </div>

      <div className="grid gap-3">
        {surahs.map((surah) => (
          <Link
            key={surah.id}
            href={`/quran/${surah.number}`}
            className="group p-4 border rounded-lg hover:shadow-md hover:border-primary transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Surah Number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {surah.number}
                </div>

                {/* Surah Info */}
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {surah.nameEnglish}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {surah.nameTranslation} • {surah.numberOfAyahs} Ayahs • {surah.revelationType}
                  </p>
                </div>
              </div>

              {/* Arabic Name */}
              <div className="text-2xl font-arabic" dir="rtl">
                {surah.nameArabic}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
