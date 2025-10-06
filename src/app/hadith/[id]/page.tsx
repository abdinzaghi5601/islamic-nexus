import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

async function getHadithBook(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/hadith/books/${id}?includeHadiths=true&limit=20`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch hadith book');
  }

  const data = await res.json();
  return data.data;
}

export default async function HadithBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getHadithBook(id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/hadith"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-1">{book.name}</h1>
          {book.nameArabic && (
            <p className="text-2xl font-arabic mb-2" dir="rtl">
              {book.nameArabic}
            </p>
          )}
          <p className="text-muted-foreground">
            By {book.author} • {book.totalHadiths.toLocaleString()} Hadiths
          </p>
        </div>

        {book.description && (
          <p className="text-muted-foreground mb-4">{book.description}</p>
        )}

        {/* Chapters */}
        {book.chapters && book.chapters.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Chapters</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {book.chapters.slice(0, 10).map((chapter: any) => (
                <div key={chapter.id} className="p-3 border rounded text-sm">
                  <span className="font-medium">Chapter {chapter.chapterNumber}:</span>{' '}
                  {chapter.nameEnglish}
                </div>
              ))}
            </div>
            {book.chapters.length > 10 && (
              <p className="text-sm text-muted-foreground mt-2">
                +{book.chapters.length - 10} more chapters
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sample Hadiths */}
      {book.hadiths && book.hadiths.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sample Hadiths</h2>
          <div className="space-y-6">
            {book.hadiths.map((hadith: any) => (
              <div key={hadith.id} className="border rounded-lg p-6">
                {/* Hadith Number & Chapter */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    Hadith #{hadith.hadithNumber}
                    {hadith.chapter && ` • ${hadith.chapter.nameEnglish}`}
                  </div>
                  {hadith.grade && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {hadith.grade}
                    </span>
                  )}
                </div>

                {/* Arabic Text */}
                <div className="text-2xl font-arabic leading-loose mb-4 text-right" dir="rtl">
                  {hadith.textArabic}
                </div>

                {/* English Translation */}
                <div className="pl-4 border-l-2 border-muted">
                  <p className="leading-relaxed">{hadith.textEnglish}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing first 20 hadiths • Total: {book.totalHadiths.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
