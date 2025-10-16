'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { TAFSIR_EDITIONS_ENHANCED, TAFSIR_CATEGORIES, type TafsirCategory } from '@/lib/api/tafsir-api-service';

interface ExternalTafsirSelectorProps {
  surahNumber: number;
  ayahNumber: number;
  onTafsirAdded: (tafsir: { identifier: string; name: string; author: string; text: string; category: string }) => void;
}

export default function ExternalTafsirSelector({
  surahNumber,
  ayahNumber,
  onTafsirAdded,
}: ExternalTafsirSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TafsirCategory | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Get unique languages
  const languages = ['all', ...Array.from(new Set(TAFSIR_EDITIONS_ENHANCED.map(e => e.language)))];

  // Filter editions
  const filteredEditions = TAFSIR_EDITIONS_ENHANCED.filter(edition => {
    const matchesSearch = searchQuery === '' ||
      edition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      edition.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || edition.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || edition.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  // Group by category for display
  const categorizedEditions = Object.entries(TAFSIR_CATEGORIES).map(([key, value]) => ({
    key: key as TafsirCategory,
    ...value,
    editions: filteredEditions.filter(e => e.category === key),
  }));

  const handleAddTafsir = async (editionIdentifier: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tafsir/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber,
          ayahNumber,
          editionIdentifier,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.text) {
        const edition = TAFSIR_EDITIONS_ENHANCED.find(e => e.identifier === editionIdentifier);
        onTafsirAdded({
          identifier: editionIdentifier,
          name: edition?.name || 'Unknown',
          author: edition?.author || 'Unknown',
          text: data.data.text,
          category: edition?.category || 'general',
        });
        setIsOpen(false);
      } else {
        alert(data.error || 'Failed to load tafsir');
      }
    } catch (error) {
      console.error('Error fetching tafsir:', error);
      alert('Error loading tafsir. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add More Tafsirs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Browse Tafsir Collection (29 Editions)
          </DialogTitle>
          <DialogDescription>
            Choose from classical, mystical, companion perspectives, and historical context
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Language Filter */}
          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <Badge
                key={lang}
                variant={selectedLanguage === lang ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang === 'all' ? 'All Languages' : lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tafsir Categories */}
        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-7 mb-3">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
              All
            </TabsTrigger>
            <TabsTrigger value="historical" onClick={() => setSelectedCategory('historical')}>
              📜 Historical
            </TabsTrigger>
            <TabsTrigger value="classical" onClick={() => setSelectedCategory('classical')}>
              📚 Classical
            </TabsTrigger>
            <TabsTrigger value="mystical" onClick={() => setSelectedCategory('mystical')}>
              ✨ Mystical
            </TabsTrigger>
            <TabsTrigger value="companion" onClick={() => setSelectedCategory('companion')}>
              👥 Companion
            </TabsTrigger>
            <TabsTrigger value="concise" onClick={() => setSelectedCategory('concise')}>
              📝 Concise
            </TabsTrigger>
            <TabsTrigger value="general" onClick={() => setSelectedCategory('general')}>
              📖 General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-y-auto space-y-6 mt-0">
            {categorizedEditions.map((category) =>
              category.editions.length > 0 ? (
                <div key={category.key}>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.editions.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {category.editions.map((edition) => (
                      <button
                        key={edition.identifier}
                        onClick={() => handleAddTafsir(edition.identifier)}
                        disabled={isLoading}
                        className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 border-border transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{edition.name}</p>
                              <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                                {edition.language}
                              </Badge>
                              {edition.identifier === 'en-asbab-al-nuzul-by-al-wahidi' && (
                                <Badge variant="default" className="text-xs gap-1 bg-amber-500 flex-shrink-0">
                                  <Sparkles className="h-3 w-3" />
                                  UNIQUE
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">by {edition.author}</p>
                            {edition.description && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                {edition.description}
                              </p>
                            )}
                          </div>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                          ) : (
                            <Plus className="h-4 w-4 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </TabsContent>

          {/* Individual category tabs */}
          {Object.entries(TAFSIR_CATEGORIES).map(([key, value]) => {
            const categoryEditions = filteredEditions.filter(e => e.category === key);
            return (
              <TabsContent key={key} value={key} className="flex-1 overflow-y-auto space-y-2 mt-0">
                <p className="text-sm text-muted-foreground mb-3">{value.description}</p>
                {categoryEditions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No tafsirs found in this category with current filters.
                  </p>
                ) : (
                  categoryEditions.map((edition) => (
                    <button
                      key={edition.identifier}
                      onClick={() => handleAddTafsir(edition.identifier)}
                      disabled={isLoading}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 border-border transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{edition.name}</p>
                            <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                              {edition.language}
                            </Badge>
                            {edition.identifier === 'en-asbab-al-nuzul-by-al-wahidi' && (
                              <Badge variant="default" className="text-xs gap-1 bg-amber-500 flex-shrink-0">
                                <Sparkles className="h-3 w-3" />
                                UNIQUE
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">by {edition.author}</p>
                          {edition.description && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {edition.description}
                            </p>
                          )}
                        </div>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                        ) : (
                          <Plus className="h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
