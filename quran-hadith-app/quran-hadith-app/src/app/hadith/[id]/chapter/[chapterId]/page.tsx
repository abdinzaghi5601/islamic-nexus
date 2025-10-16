import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import prisma from '@/lib/db/prisma';

async function getChapterHadiths(bookId: string, chapterId: string) {
  const bookIdInt = parseInt(bookId);
  const chapterIdInt = parseInt(chapterId);

  if (isNaN(bookIdInt) || isNaN(chapterIdInt)) {
    throw new Error('Invalid book or chapter ID');
  }

  // Fetch chapter with its book and hadiths
  const chapter = await prisma.hadithChapter.findUnique({
    where: { id: chapterIdInt },
    include: {
      book: true,
      hadiths: {
        orderBy: {
          hadithInChapter: 'asc',
        },
      },
    },
  });

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  if (chapter.bookId !== bookIdInt) {
    throw new Error('Chapter does not belong to this book');
  }

  return chapter;
}

export default async function ChapterPage({
  params
}: {
  params: Promise<{ id: string; chapterId: string }>
}) {
  const { id, chapterId } = await params;
  const chapter = await getChapterHadiths(id, chapterId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <Link
          href={`/hadith/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to {chapter.book.name}
        </Link>

        <div className="glass-card p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-lg font-bold text-sm">
              Chapter {chapter.chapterNumber}
            </div>
            <h1 className="text-3xl font-bold gradient-text">{chapter.nameEnglish}</h1>
          </div>
          {chapter.nameArabic && (
            <p className="text-2xl font-arabic quran-text-enhanced animate-float mb-3" dir="rtl">
              {chapter.nameArabic}
            </p>
          )}
          <p className="text-muted-foreground">
            {chapter.book.name} • {chapter.hadiths?.length || 0} Hadiths in this chapter
          </p>
        </div>

        {chapter.intro && (
          <div className="glass-card p-6 rounded-xl mb-6">
            <h3 className="font-semibold text-lg mb-3 text-primary">Chapter Introduction</h3>
            <p className="text-muted-foreground leading-relaxed">{chapter.intro}</p>
          </div>
        )}
      </div>

      {/* Hadiths */}
      {chapter.hadiths && chapter.hadiths.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Hadiths</h2>
          <div className="space-y-8">
            {chapter.hadiths.map((hadith: any, index: number) => (
              <div key={hadith.id}>
                <div id={`hadith-${hadith.id}`} className="content-card p-6 rounded-xl scroll-mt-24">
                  {/* Hadith Number & Grade */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-sm text-muted-foreground font-medium">
                      Hadith #{hadith.hadithNumber}
                      {hadith.hadithInChapter && ` • #${hadith.hadithInChapter} in chapter`}
                    </div>
                    {hadith.grade && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                        {hadith.grade}
                      </span>
                    )}
                  </div>

                  {/* Arabic Text */}
                  {hadith.textArabic && (
                    <div className="quran-text-enhanced text-2xl font-arabic leading-loose mb-6 text-right p-4 bg-muted/30 rounded-lg" dir="rtl">
                      {hadith.textArabic}
                    </div>
                  )}

                  {/* English Translation */}
                  <div className="pl-5 border-l-4 border-primary/30">
                    <p className="leading-relaxed text-muted-foreground">{hadith.textEnglish}</p>
                  </div>

                  {/* Narrator Chain */}
                  {hadith.narratorChain && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Chain of Narration:</span> {hadith.narratorChain}
                      </p>
                    </div>
                  )}
                </div>

                {/* Islamic Divider between hadiths */}
                {index < chapter.hadiths.length - 1 && (
                  <div className="islamic-divider my-6">
                    <span className="inline-block px-4 text-xs text-muted-foreground">✦</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!chapter.hadiths || chapter.hadiths.length === 0) && (
        <div className="glass-card text-center py-16 rounded-2xl">
          <p className="text-xl font-semibold text-muted-foreground">
            No hadiths found in this chapter
          </p>
        </div>
      )}
    </div>
  );
}
