import Link from 'next/link';
import prisma from '@/lib/db/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getSurahs() {
  const surahs = await prisma.surah.findMany({
    orderBy: { number: 'asc' },
    select: {
      id: true,
      number: true,
      nameArabic: true,
      nameEnglish: true,
      nameTranslation: true,
      revelationType: true,
      numberOfAyahs: true,
      order: true,
    },
  });

  return surahs;
}

export default async function QuranPage() {
  const surahs = await getSurahs();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 gradient-text">The Holy Quran</h1>
        <p className="text-muted-foreground text-lg">
          Browse all 114 surahs with translations and tafsir
        </p>
      </div>

      <div className="grid gap-4">
        {surahs.map((surah) => (
          <Link
            key={surah.id}
            href={`/quran/${surah.number}`}
            className="group glass-card hover-lift p-5 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                {/* Surah Number */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-primary-foreground shadow-md">
                  {surah.number}
                </div>

                {/* Surah Info */}
                <div>
                  <h3 className="font-semibold text-xl mb-1 group-hover:text-primary transition-colors">
                    {surah.nameEnglish}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {surah.nameTranslation} • {surah.numberOfAyahs} Ayahs • {surah.revelationType}
                  </p>
                </div>
              </div>

              {/* Arabic Name */}
              <div className="text-3xl font-arabic" dir="rtl">
                {surah.nameArabic}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
