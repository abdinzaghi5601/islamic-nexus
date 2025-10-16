import Link from 'next/link';
import { Library } from 'lucide-react';
import prisma from '@/lib/db/prisma';

async function getHadithBooks() {
  const books = await prisma.hadithBook.findMany({
    select: {
      id: true,
      name: true,
      nameArabic: true,
      author: true,
      description: true,
      totalHadiths: true,
    },
    orderBy: { id: 'asc' },
  });

  return books;
}

export default async function HadithPage() {
  const books = await getHadithBooks();

  // Get unique books (filter duplicates)
  const uniqueBooks = books.filter(
    (book, index, self) => index === self.findIndex((b) => b.name === book.name && b.totalHadiths > 0)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Hadith Collections</h1>
        <p className="text-muted-foreground text-lg">
          Browse the six major hadith books with authentic narrations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {uniqueBooks.map((book) => (
          <Link
            key={book.id}
            href={`/hadith/${book.id}`}
            className="group glass-card hover-lift p-8 rounded-xl"
          >
            <div className="flex items-start space-x-5">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl group-hover:shadow-lg transition-all duration-300">
                <Library className="h-7 w-7 text-primary-foreground" />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {book.name}
                </h3>
                {book.nameArabic && (
                  <p className="text-xl font-arabic mb-3" dir="rtl">
                    {book.nameArabic}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  By {book.author}
                </p>
                <p className="text-sm mb-4 leading-relaxed text-muted-foreground">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {book.totalHadiths.toLocaleString()} Hadiths
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                    View Collection →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
