'use client';

import { useState } from 'react';
import { Search as SearchIcon, BookOpen, Library, Loader2, Heart, Book, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Tafsir {
  id: number;
  text: string;
  tafsirBook: string;
  author: string;
}

interface RelatedHadith {
  id: number;
  textArabic: string;
  textEnglish: string;
  reference: string;
  book: {
    id: number;
    name: string;
  };
  chapter: {
    nameEnglish: string;
  } | null;
  grade: string | null;
}

interface SearchResult {
  id: number;
  type: 'ayah' | 'hadith';
  textArabic: string;
  text: string;
  reference: string;
  surah?: any;
  ayahNumber?: number;
  translator?: string;
  matchedInTafsir?: boolean;
  tafsirs?: Tafsir[];
  relatedHadiths?: RelatedHadith[];
  book?: any;
  chapter?: any;
  hadithNumber?: string;
  grade?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'quran' | 'hadith' | 'dua' | 'book'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedSearches, setSuggestedSearches] = useState<string[]>([]);
  const [expandedTafsirs, setExpandedTafsirs] = useState<Set<string>>(new Set());
  const [expandedHadiths, setExpandedHadiths] = useState<Set<string>>(new Set());

  const toggleTafsir = (resultId: number) => {
    const key = `tafsir-${resultId}`;
    setExpandedTafsirs(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleHadith = (resultId: number) => {
    const key = `hadith-${resultId}`;
    setExpandedHadiths(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Fetch suggestions as user types
  const fetchSuggestions = async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  // Fetch suggested searches when no results
  const fetchSuggestedSearches = async () => {
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setSuggestedSearches(data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch suggested searches:', error);
    }
  };

  const handleSearch = async (pageNum = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setPage(pageNum);
    setShowSuggestions(false);

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
        setResults(data.data || []);
        setTotalResults(data.pagination?.total || data.data?.length || 0);

        // If no results, fetch suggested searches
        if (!data.data || data.data.length === 0) {
          await fetchSuggestedSearches();
        }
      } else {
        setResults([]);
        setTotalResults(0);
        await fetchSuggestedSearches();
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setTotalResults(0);
      await fetchSuggestedSearches();
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
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Search</h1>
        <p className="text-muted-foreground text-lg">
          Search across the Quran, Hadith, Duas, and Islamic Books collections
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSuggestions(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for verses, hadiths, or keywords..."
              className="w-full pl-12 pr-4 py-3.5 glass-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />

            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      setShowSuggestions(false);
                      setTimeout(() => handleSearch(1), 100);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted/80 transition-colors border-b border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleSearch(1)}
            disabled={loading || !query.trim()}
            className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setType('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              type === 'all'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                : 'glass-card hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setType('quran')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              type === 'quran'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                : 'glass-card hover:bg-muted/80'
            }`}
          >
            <BookOpen className="inline h-4 w-4 mr-2" />
            Quran
          </button>
          <button
            onClick={() => setType('hadith')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              type === 'hadith'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                : 'glass-card hover:bg-muted/80'
            }`}
          >
            <Library className="inline h-4 w-4 mr-2" />
            Hadith
          </button>
          <button
            onClick={() => setType('dua')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              type === 'dua'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                : 'glass-card hover:bg-muted/80'
            }`}
          >
            <Heart className="inline h-4 w-4 mr-2" />
            Duas
          </button>
          <button
            onClick={() => setType('book')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              type === 'book'
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                : 'glass-card hover:bg-muted/80'
            }`}
          >
            <Book className="inline h-4 w-4 mr-2" />
            Books
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && searched && results?.length === 0 && (
        <div className="space-y-6">
          <div className="glass-card text-center py-16 rounded-2xl">
            <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl font-semibold text-muted-foreground mb-2">
              No results found for "{query}"
            </p>
            <p className="text-sm text-muted-foreground">
              Try these related searches instead
            </p>
          </div>

          {/* Suggested Searches */}
          {suggestedSearches.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <SearchIcon className="h-5 w-5 text-primary" />
                Try these searches:
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestedSearches.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      setTimeout(() => handleSearch(1), 100);
                    }}
                    className="text-left px-4 py-3 glass-card hover:bg-primary/10 hover:border-primary/30 border border-transparent rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm group-hover:text-primary transition-colors font-medium">
                        {suggestion}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground font-medium bg-muted/50 inline-block px-4 py-2 rounded-full">
              Found {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-6">
            {results.map((result) => (
              <div key={`${result.type}-${result.id}`} className="glass-card p-6 rounded-xl">
                {/* Result Type & Reference */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    {result.type === 'ayah' ? (
                      <BookOpen className="h-4 w-4" />
                    ) : (
                      <Library className="h-4 w-4" />
                    )}
                    <span className="capitalize">{result.type === 'ayah' ? 'Quran' : 'Hadith'}</span>
                    <span>•</span>
                    <Link
                      href={result.type === 'ayah' ? `/quran/${result.surah?.number}` : `/hadith/${result.book?.id}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      {result.reference}
                    </Link>
                  </div>
                  {result.type === 'hadith' && result.grade && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                      {result.grade}
                    </span>
                  )}
                </div>

                {/* Arabic Text */}
                {result.textArabic && (
                  <div className="text-2xl font-arabic leading-loose mb-6 text-right p-4 bg-muted/30 rounded-lg" dir="rtl">
                    {result.textArabic}
                  </div>
                )}

                {/* English Translation */}
                <div className="pl-5 border-l-4 border-primary/30 mb-6">
                  <p className="leading-relaxed text-muted-foreground">{result.text}</p>
                  {result.translator && (
                    <p className="text-sm text-primary mt-3 font-semibold">
                      Translation by {result.translator}
                    </p>
                  )}
                </div>

                {/* Tafsir (for Quran results) - PROMINENT DESIGN */}
                {result.type === 'ayah' && result.tafsirs && result.tafsirs.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => toggleTafsir(result.id)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border-2 border-emerald-500/30 rounded-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-lg text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                            Tafsir (Commentary)
                            {result.matchedInTafsir && (
                              <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Match Found
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {result.tafsirs.length} commentary {result.tafsirs.length > 1 ? 'sources' : 'source'} available
                          </p>
                        </div>
                      </div>
                      {expandedTafsirs.has(`tafsir-${result.id}`) ? (
                        <ChevronUp className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                      )}
                    </button>

                    {expandedTafsirs.has(`tafsir-${result.id}`) && (
                      <div className="mt-3 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {result.tafsirs.map((tafsir) => (
                          <div key={tafsir.id} className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-200 dark:border-emerald-800">
                              <BookOpen className="h-4 w-4 text-emerald-600" />
                              <span className="font-bold text-base text-emerald-700 dark:text-emerald-300">{tafsir.tafsirBook}</span>
                              <span className="text-xs text-muted-foreground">• by {tafsir.author}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90">{tafsir.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Related Hadiths (for Quran results) - PROMINENT DESIGN */}
                {result.type === 'ayah' && result.relatedHadiths && result.relatedHadiths.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => toggleHadith(result.id)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-2 border-blue-500/30 rounded-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                          <Library className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            Related Hadiths
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
                              {result.relatedHadiths.length}
                            </span>
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Authentic narrations on the same topic
                          </p>
                        </div>
                      </div>
                      {expandedHadiths.has(`hadith-${result.id}`) ? (
                        <ChevronUp className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      )}
                    </button>

                    {expandedHadiths.has(`hadith-${result.id}`) && (
                      <div className="mt-3 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {result.relatedHadiths.map((hadith) => (
                          <div key={hadith.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-200 dark:border-blue-800">
                              <Link
                                href={`/hadith/${hadith.book.id}`}
                                className="text-sm font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-2"
                              >
                                <Library className="h-4 w-4" />
                                {hadith.reference}
                              </Link>
                              {hadith.grade && (
                                <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold shadow-sm">
                                  {hadith.grade}
                                </span>
                              )}
                            </div>
                            {hadith.textArabic && (
                              <div className="text-xl font-arabic leading-loose mb-5 text-right p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-blue-100 dark:border-blue-900" dir="rtl">
                                {hadith.textArabic}
                              </div>
                            )}
                            <p className="leading-relaxed text-foreground/90 text-sm">
                              {hadith.textEnglish}
                            </p>
                            {hadith.chapter && (
                              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  Chapter: {hadith.chapter.nameEnglish}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Chapter info (for Hadith results) */}
                {result.type === 'hadith' && result.chapter && (
                  <div className="text-sm text-muted-foreground font-medium">
                    Chapter: {result.chapter.nameEnglish}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalResults > 20 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => handleSearch(page - 1)}
                disabled={page === 1}
                className="px-6 py-2.5 glass-card rounded-xl hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                Previous
              </button>
              <div className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold">
                Page {page} of {Math.ceil(totalResults / 20)}
              </div>
              <button
                onClick={() => handleSearch(page + 1)}
                disabled={page >= Math.ceil(totalResults / 20)}
                className="px-6 py-2.5 glass-card rounded-xl hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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
