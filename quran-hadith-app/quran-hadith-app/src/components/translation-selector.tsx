'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Loader2, Globe } from 'lucide-react';

interface Translation {
  id: number;
  name: string;
  author: string;
  language: string;
  translatedName: string;
}

interface TranslationSelectorProps {
  surahNumber: number;
  ayahNumber: number;
  onTranslationsAdded: (translations: any[]) => void;
}

export default function TranslationSelector({
  surahNumber,
  ayahNumber,
  onTranslationsAdded,
}: TranslationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<Translation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch available translations when dialog opens
  useEffect(() => {
    if (isOpen && translations.length === 0) {
      fetchTranslations();
    }
  }, [isOpen]);

  // Filter translations based on search and language
  useEffect(() => {
    let filtered = translations;

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter((t) => t.language.toLowerCase() === selectedLanguage.toLowerCase());
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.author.toLowerCase().includes(query) ||
          t.language.toLowerCase().includes(query)
      );
    }

    setFilteredTranslations(filtered);
  }, [translations, searchQuery, selectedLanguage]);

  const fetchTranslations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resources/translations');
      const data = await response.json();

      if (data.success) {
        setTranslations(data.data.translations);
        setFilteredTranslations(data.data.translations);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranslation = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddTranslations = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one translation');
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch('/api/quran/external-translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber,
          ayahNumber,
          translationIds: selectedIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onTranslationsAdded(data.data.translations);
        setIsOpen(false);
        setSelectedIds([]);
        setSearchQuery('');
        setSelectedLanguage('all');
      } else {
        alert('Failed to fetch translations: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      alert('Error fetching translations. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  // Get unique languages
  const languages = ['all', ...Array.from(new Set(translations.map((t) => t.language)))];

  // Group translations by language for better display
  const popularLanguages = ['english', 'urdu', 'arabic'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Translation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Translations from Quran.com</DialogTitle>
          <DialogDescription>
            Select translations to add to this ayah. 100+ translations available in 50+ languages.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, author, or language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Language Filter */}
              <div className="flex gap-2 flex-wrap">
                {languages.slice(0, 10).map((lang) => (
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

              {/* Selected Count */}
              {selectedIds.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedIds.length} translation{selectedIds.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            {/* Translation List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredTranslations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No translations found matching your search.
                </div>
              ) : (
                filteredTranslations.map((translation) => (
                  <label
                    key={translation.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedIds.includes(translation.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-muted/50 border-border'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(translation.id)}
                      onChange={() => toggleTranslation(translation.id)}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{translation.name}</p>
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Globe className="h-3 w-3" />
                          {translation.language}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">by {translation.author}</p>
                    </div>
                  </label>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTranslations}
                disabled={selectedIds.length === 0 || isFetching}
              >
                {isFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>Add {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
