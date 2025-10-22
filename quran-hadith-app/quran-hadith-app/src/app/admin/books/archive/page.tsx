'use client';

import { useState, useEffect } from 'react';
import { Search, Download, BookOpen, Loader2, ExternalLink, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ArchiveBook {
  identifier: string;
  title: string;
  creator?: string;
  description?: string;
  year?: string;
  mediatype: string;
  downloads?: number;
  collection?: string[];
}

export default function ArchiveOrgPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<ArchiveBook[]>([]);
  const [importing, setImporting] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    // @ts-ignore
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const searchArchive = async () => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      // Archive.org API endpoint
      const searchQuery = `${query} AND mediatype:texts AND (subject:islam OR subject:quran OR subject:hadith)`;
      const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(searchQuery)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=year&fl[]=mediatype&fl[]=downloads&fl[]=collection&rows=20&page=1&output=json`;

      const response = await fetch(url);
      const data = await response.json();

      setResults(data.response?.docs || []);
    } catch (error) {
      console.error('Archive.org search error:', error);
      alert('Failed to search Archive.org');
    } finally {
      setSearching(false);
    }
  };

  const importBook = async (book: ArchiveBook) => {
    setImporting(book.identifier);

    try {
      const response = await fetch('/api/admin/books/import-archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: book.identifier,
          title: book.title,
          author: book.creator || 'Unknown',
          description: book.description,
          publishYear: book.year ? parseInt(book.year) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Import failed');
      }

      setImported(new Set([...imported, book.identifier]));
      alert('Book imported successfully! Text extraction will happen in the background.');
    } catch (error: any) {
      console.error('Import error:', error);
      alert(error.message || 'Failed to import book');
    } finally {
      setImporting(null);
    }
  };

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render if not admin
  // @ts-ignore
  if (!session || session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link
          href="/books"
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-bold mb-3 gradient-text">Archive.org Integration</h1>
        <p className="text-muted-foreground text-lg">
          Search and import public domain Islamic books from Internet Archive
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Archive.org</CardTitle>
          <CardDescription>
            Find Islamic books, tafsir, hadith commentary, and classical texts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search for Islamic books, tafsir, hadith..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchArchive()}
              className="flex-1"
            />
            <Button onClick={searchArchive} disabled={searching}>
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground w-full mb-2">Quick searches:</p>
            {['Tafsir Ibn Kathir', 'Sahih Bukhari', 'Riyadh Salihin', 'Islamic History', 'Arabic Grammar'].map(
              (term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    setQuery(term);
                    setTimeout(() => searchArchive(), 100);
                  }}
                >
                  {term}
                </Badge>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Search Results ({results.length})
          </h2>

          <div className="space-y-4">
            {results.map((book) => (
              <Card key={book.identifier}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{book.title}</h3>
                      </div>

                      {book.creator && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold">Author:</span> {book.creator}
                        </p>
                      )}

                      {book.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {book.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 items-center">
                        {book.year && (
                          <Badge variant="secondary">Year: {book.year}</Badge>
                        )}
                        {book.downloads && (
                          <Badge variant="outline">{book.downloads} downloads</Badge>
                        )}
                        <a
                          href={`https://archive.org/details/${book.identifier}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View on Archive.org
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {imported.has(book.identifier) ? (
                        <Button variant="outline" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Imported
                        </Button>
                      ) : (
                        <Button
                          onClick={() => importBook(book)}
                          disabled={importing === book.identifier}
                        >
                          {importing === book.identifier ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Import
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!searching && results.length === 0 && query && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No results found. Try different keywords.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
