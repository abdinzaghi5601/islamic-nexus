'use client';

import { useState } from 'react';
import { Search as SearchIcon, BookOpen, Library, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: number;
  type: 'quran' | 'hadith';
  textArabic: string;
  textEnglish: string;
  reference: string;
  link: string;
  metadata?: any;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'quran' | 'hadith'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  const handleSearch = async (pageNum = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setPage(pageNum);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        type,
        page: pageNum.toString(),
        limit: '20',
      });

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.data.results);
        setTotalResults(data.data.total);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground">
          Search across the Quran and Hadith collections
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for verses, hadiths, or keywords..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => handleSearch(1)}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setType('quran')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'quran'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <BookOpen className="inline h-4 w-4 mr-1" />
            Quran
          </button>
          <button
            onClick={() => setType('hadith')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'hadith'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Library className="inline h-4 w-4 mr-1" />
            Hadith
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            No results found for "{query}"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try different keywords or search terms
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Found {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''}
          </div>

          <div className="space-y-6">
            {results.map((result) => (
              <div key={`${result.type}-${result.id}`} className="border rounded-lg p-6">
                {/* Result Type & Reference */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {result.type === 'quran' ? (
                      <BookOpen className="h-4 w-4" />
                    ) : (
                      <Library className="h-4 w-4" />
                    )}
                    <span className="capitalize">{result.type}</span>
                    <span>•</span>
                    <Link
                      href={result.link}
                      className="text-primary hover:underline"
                    >
                      {result.reference}
                    </Link>
                  </div>
                </div>

                {/* Arabic Text */}
                {result.textArabic && (
                  <div className="text-2xl font-arabic leading-loose mb-4 text-right" dir="rtl">
                    {result.textArabic}
                  </div>
                )}

                {/* English Translation */}
                <div className="pl-4 border-l-2 border-muted">
                  <p className="leading-relaxed">{result.textEnglish}</p>
                </div>

                {/* Metadata */}
                {result.metadata && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    {result.type === 'quran' && result.metadata.translator && (
                      <span>Translation by {result.metadata.translator}</span>
                    )}
                    {result.type === 'hadith' && result.metadata.chapter && (
                      <span>{result.metadata.chapter}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalResults > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handleSearch(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="px-4 py-2 border rounded-lg bg-muted">
                Page {page} of {Math.ceil(totalResults / 20)}
              </div>
              <button
                onClick={() => handleSearch(page + 1)}
                disabled={page >= Math.ceil(totalResults / 20)}
                className="px-4 py-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
