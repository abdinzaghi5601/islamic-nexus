import Link from 'next/link';
import { HadithBook } from '@/types/api';
import { Library } from 'lucide-react';

async function getHadithBooks(): Promise<HadithBook[]> {
  const res = await fetch(`http://localhost:3000/api/hadith/books`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch hadith books');
  }

  const data = await res.json();
  return data.data;
}

export default async function HadithPage() {
  const books = await getHadithBooks();

  // Get unique books (filter duplicates)
  const uniqueBooks = books.filter(
    (book, index, self) => index === self.findIndex((b) => b.name === book.name && b.totalHadiths > 0)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Hadith Collections</h1>
        <p className="text-muted-foreground">
          Browse the six major hadith books with authentic narrations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {uniqueBooks.map((book) => (
          <Link
            key={book.id}
            href={`/hadith/${book.id}`}
            className="group p-6 border rounded-lg hover:shadow-lg hover:border-primary transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Library className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                  {book.name}
                </h3>
                {book.nameArabic && (
                  <p className="text-lg font-arabic mb-2" dir="rtl">
                    {book.nameArabic}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  By {book.author}
                </p>
                <p className="text-sm mb-3">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {book.totalHadiths.toLocaleString()} Hadiths
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
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
