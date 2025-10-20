import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import prisma from '@/lib/db/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getHadithBook(id: string) {
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    throw new Error('Invalid book ID');
  }

  const book = await prisma.hadithBook.findUnique({
    where: { id: bookId },
    include: {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
    },
  });

  if (!book) {
    throw new Error('Hadith book not found');
  }

  // Fetch sample hadiths (first 20)
  const hadiths = await prisma.hadith.findMany({
    where: { bookId },
    take: 20,
    orderBy: { hadithNumber: 'asc' },
    include: {
      chapter: true,
    },
  });

  return {
    ...book,
    hadiths,
  };
}

export default async function HadithBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getHadithBook(id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/hadith"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="glass-card p-6 rounded-2xl mb-6">
          <h1 className="text-4xl font-bold mb-2 gradient-text">{book.name}</h1>
          {book.nameArabic && (
            <p className="text-3xl font-arabic mb-3" dir="rtl">
              {book.nameArabic}
            </p>
          )}
          <p className="text-muted-foreground text-lg">
            By {book.author} • {book.totalHadiths.toLocaleString()} Hadiths
          </p>
        </div>

        {book.description && (
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{book.description}</p>
        )}

        {/* Chapters */}
        {book.chapters && book.chapters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Chapters <span className="text-muted-foreground text-base font-normal">({book.chapters.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
              {book.chapters.map((chapter: any) => (
                <Link
                  key={chapter.id}
                  href={`/hadith/${book.id}/chapter/${chapter.id}`}
                  className="glass-card p-4 rounded-lg text-sm hover:bg-muted/80 transition-colors group"
                >
                  <span className="font-semibold text-primary group-hover:underline">Chapter {chapter.chapterNumber}:</span>{' '}
                  <span className="text-muted-foreground">{chapter.nameEnglish}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sample Hadiths */}
      {book.hadiths && book.hadiths.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Sample Hadiths</h2>
          <div className="space-y-6">
            {book.hadiths.map((hadith: any) => (
              <div key={hadith.id} id={`hadith-${hadith.id}`} className="glass-card p-6 rounded-xl scroll-mt-24">
                {/* Hadith Number & Chapter */}
                <div className="flex items-center justify-between mb-5">
                  <div className="text-sm text-muted-foreground font-medium">
                    Hadith #{hadith.hadithNumber}
                    {hadith.chapter && ` • ${hadith.chapter.nameEnglish}`}
                  </div>
                  {hadith.grade && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                      {hadith.grade}
                    </span>
                  )}
                </div>

                {/* Arabic Text */}
                <div className="text-2xl font-arabic leading-loose mb-6 text-right p-4 bg-muted/30 rounded-lg" dir="rtl">
                  {hadith.textArabic}
                </div>

                {/* English Translation */}
                <div className="pl-5 border-l-4 border-primary/30">
                  <p className="leading-relaxed text-muted-foreground">{hadith.textEnglish}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-medium bg-muted/50 inline-block px-4 py-2 rounded-full">
              Showing first 20 hadiths • Total: {book.totalHadiths.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
