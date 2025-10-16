import Link from 'next/link';
import { BookOpen, Download, Eye, Calendar, FileText } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getBooks() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { chunks: true },
      },
    },
  });

  return books;
}

async function getBooksByCategory() {
  const books = await getBooks();

  const categories = books.reduce((acc, book) => {
    if (!acc[book.category]) {
      acc[book.category] = [];
    }
    acc[book.category].push(book);
    return acc;
  }, {} as Record<string, typeof books>);

  return categories;
}

function formatFileSize(bytes: bigint | null): string {
  if (!bytes) return 'N/A';
  const mb = Number(bytes) / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default async function BooksPage() {
  const booksByCategory = await getBooksByCategory();
  const allBooks = await getBooks();
  const categories = Object.keys(booksByCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Islamic Books Library</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive collection of Islamic literature with searchable content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">{allBooks.length}</CardTitle>
            <CardDescription>Total Books</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">{categories.length}</CardTitle>
            <CardDescription>Categories</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">
              {allBooks.reduce((sum, book) => sum + (book.totalPages || 0), 0)}
            </CardTitle>
            <CardDescription>Total Pages</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">
              {allBooks.filter(b => b.language === 'English').length}
            </CardTitle>
            <CardDescription>English Books</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {allBooks.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl font-semibold text-muted-foreground mb-2">
              No books available yet
            </p>
            <p className="text-sm text-muted-foreground">
              Books will appear here once they are added to the library
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Books</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBooks.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{book.category}</Badge>
                        {book.language && (
                          <Badge variant="outline">{book.language}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                        {book.title}
                      </CardTitle>
                      {book.titleArabic && (
                        <p className="text-lg font-arabic mt-2" dir="rtl">
                          {book.titleArabic}
                        </p>
                      )}
                      <CardDescription className="text-sm">
                        by {book.author}
                        {book.authorArabic && ` • ${book.authorArabic}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {book.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {book.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {book.totalPages && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {book.totalPages} pages
                          </div>
                        )}
                        {book.fileSize && (
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {formatFileSize(book.fileSize)}
                          </div>
                        )}
                        {book.publishYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {book.publishYear}
                          </div>
                        )}
                      </div>

                      {book.tags && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {book.tags.split(',').slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {booksByCategory[category].map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{book.category}</Badge>
                          {book.language && (
                            <Badge variant="outline">{book.language}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                          {book.title}
                        </CardTitle>
                        {book.titleArabic && (
                          <p className="text-lg font-arabic mt-2" dir="rtl">
                            {book.titleArabic}
                          </p>
                        )}
                        <CardDescription className="text-sm">
                          by {book.author}
                          {book.authorArabic && ` • ${book.authorArabic}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {book.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {book.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {book.totalPages && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {book.totalPages} pages
                            </div>
                          )}
                          {book.fileSize && (
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {formatFileSize(book.fileSize)}
                            </div>
                          )}
                          {book.publishYear && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {book.publishYear}
                            </div>
                          )}
                        </div>

                        {book.tags && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {book.tags.split(',').slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
