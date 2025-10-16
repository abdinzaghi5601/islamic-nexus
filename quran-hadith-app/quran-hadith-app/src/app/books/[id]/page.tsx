import Link from 'next/link';
import { ChevronLeft, Download, FileText, Calendar, Building, Hash, Eye, Search } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { notFound } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getBook(id: number) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      chunks: {
        select: {
          pageNumber: true,
        },
        distinct: ['pageNumber'],
        orderBy: { pageNumber: 'asc' },
      },
    },
  });

  return book;
}

function formatFileSize(bytes: bigint | null): string {
  if (!bytes) return 'N/A';
  const mb = Number(bytes) / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(parseInt(id));

  if (!book) {
    notFound();
  }

  const downloadUrl = book.pdfUrl || (book.pdfPath ? book.pdfPath : null);
  const hasSearchableContent = book.chunks.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Link */}
      <Link
        href="/books"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Books
      </Link>

      {/* Book Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {book.category}
            </Badge>
            {book.language && (
              <Badge variant="outline" className="text-sm">
                {book.language}
              </Badge>
            )}
            {hasSearchableContent && (
              <Badge variant="default" className="text-sm">
                <Search className="h-3 w-3 mr-1" />
                Searchable
              </Badge>
            )}
          </div>

          <CardTitle className="text-4xl mb-3">{book.title}</CardTitle>

          {book.titleArabic && (
            <p className="text-3xl font-arabic mb-4" dir="rtl">
              {book.titleArabic}
            </p>
          )}

          <CardDescription className="text-lg">
            by <span className="font-semibold">{book.author}</span>
            {book.authorArabic && (
              <span className="font-arabic" dir="rtl"> • {book.authorArabic}</span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {downloadUrl && (
              <Button asChild>
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            )}
            {downloadUrl && (
              <Button variant="outline" asChild>
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Online
                </a>
              </Button>
            )}
            {hasSearchableContent && (
              <Button variant="outline" asChild>
                <Link href={`/search?q=${encodeURIComponent(book.title)}&type=book`}>
                  <Search className="h-4 w-4 mr-2" />
                  Search in Book
                </Link>
              </Button>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {book.description}
              </p>
            </>
          )}

          <Separator className="my-6" />

          {/* Book Details */}
          <h3 className="text-xl font-semibold mb-4">Book Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {book.totalPages && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Total Pages</p>
                  <p className="text-sm text-muted-foreground">{book.totalPages} pages</p>
                </div>
              </div>
            )}

            {book.fileSize && (
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">File Size</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(book.fileSize)}</p>
                </div>
              </div>
            )}

            {book.publisher && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Publisher</p>
                  <p className="text-sm text-muted-foreground">{book.publisher}</p>
                </div>
              </div>
            )}

            {book.publishYear && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Publication Year</p>
                  <p className="text-sm text-muted-foreground">{book.publishYear}</p>
                </div>
              </div>
            )}

            {book.isbn && (
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">ISBN</p>
                  <p className="text-sm text-muted-foreground">{book.isbn}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {book.tags && (
            <>
              <Separator className="my-6" />
              <h3 className="text-xl font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Searchable Content Notice */}
          {hasSearchableContent && (
            <>
              <Separator className="my-6" />
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Searchable Content Available
                  </CardTitle>
                  <CardDescription>
                    This book's content has been indexed and is fully searchable. Use the search feature to find specific topics, verses, or keywords within the book.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {book.chunks.length} pages indexed • Full-text search enabled
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
