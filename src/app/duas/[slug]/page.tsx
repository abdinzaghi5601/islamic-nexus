import Link from 'next/link';
import { ChevronLeft, Heart, BookOpen } from 'lucide-react';
import prisma from '@/lib/db/prisma';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

async function getCategoryDuas(slug: string) {
  const category = await prisma.duaCategory.findUnique({
    where: { slug },
    include: {
      duas: {
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
}

export default async function CategoryDuasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryDuas(slug);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/duas"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Duas
        </Link>

        <div className="glass-card p-6 rounded-2xl mb-6">
          <h1 className="text-4xl font-bold mb-2 gradient-text">{category.name}</h1>
          {category.nameArabic && (
            <p className="text-3xl font-arabic mb-3" dir="rtl">
              {category.nameArabic}
            </p>
          )}
          <p className="text-muted-foreground text-lg">
            {category.duas.length} {category.duas.length === 1 ? 'Dua' : 'Duas'}
          </p>
        </div>

        {category.description && (
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Duas */}
      {category.duas.length === 0 ? (
        <div className="glass-card text-center py-16 rounded-2xl">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold text-muted-foreground">
            No duas in this category yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {category.duas.map((dua) => (
            <div key={dua.id} className="glass-card p-6 rounded-xl">
              {/* Title */}
              <div className="mb-5">
                <h3 className="text-2xl font-semibold mb-2 text-primary">
                  {dua.title}
                </h3>
                {dua.titleArabic && (
                  <p className="text-xl font-arabic" dir="rtl">
                    {dua.titleArabic}
                  </p>
                )}
                {dua.occasion && (
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    <span className="font-semibold">Occasion:</span> {dua.occasion}
                  </p>
                )}
              </div>

              {/* Arabic Text */}
              <div className="text-3xl font-arabic leading-loose mb-6 text-right p-4 bg-muted/30 rounded-lg" dir="rtl">
                {dua.textArabic}
              </div>

              {/* Transliteration */}
              {dua.transliteration && (
                <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-2">Transliteration:</p>
                  <p className="leading-relaxed italic text-muted-foreground">{dua.transliteration}</p>
                </div>
              )}

              {/* English Translation */}
              <div className="pl-5 border-l-4 border-primary/30 mb-6">
                <p className="text-sm font-semibold text-primary mb-2">Translation:</p>
                <p className="leading-relaxed text-muted-foreground">{dua.textEnglish}</p>
              </div>

              {/* Benefits */}
              {dua.benefits && (
                <div className="mb-6 p-4 bg-accent/5 rounded-lg">
                  <p className="text-sm font-semibold text-accent mb-2">Benefits:</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{dua.benefits}</p>
                </div>
              )}

              {/* Reference & Tags */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-border">
                {dua.reference && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{dua.reference}</span>
                  </div>
                )}
                {dua.tags && (
                  <div className="flex flex-wrap gap-2">
                    {dua.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
