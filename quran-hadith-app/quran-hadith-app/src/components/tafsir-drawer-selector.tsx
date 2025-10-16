'use client';

import { useState } from 'react';
import { X, Check, Plus, ChevronDown, Search, BookOpen, Sparkles, Star } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { TAFSIR_EDITIONS_ENHANCED, TAFSIR_CATEGORIES, type TafsirCategory } from '@/lib/api/tafsir-api-service';

interface TafsirItem {
  id: string;
  name: string;
  author: string;
  language: string;
  category: TafsirCategory;
  source: 'local' | 'external';
  identifier?: string;
  isUnique?: boolean;
  isPopular?: boolean;
}

interface TafsirDrawerSelectorProps {
  localTafsirs: any[];
  selectedLocalIndices: number[];
  externalTafsirs: any[];
  surahNumber: number;
  ayahNumber: number;
  onSelectionChange: (localIndices: number[], externalTafsirs: any[]) => void;
}

export default function TafsirDrawerSelector({
  localTafsirs,
  selectedLocalIndices,
  externalTafsirs,
  surahNumber,
  ayahNumber,
  onSelectionChange,
}: TafsirDrawerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [selectedCategories, setSelectedCategories] = useState<TafsirCategory[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Local state for temp selections (only applied on Save & Close)
  const [tempLocalIndices, setTempLocalIndices] = useState<number[]>(selectedLocalIndices);
  const [tempExternalTafsirs, setTempExternalTafsirs] = useState<any[]>(externalTafsirs);

  // Combine local and external tafsirs into unified list
  const allTafsirs: TafsirItem[] = [
    ...localTafsirs.map((t, index) => ({
      id: `local-${index}`,
      name: t.tafsirBook.name,
      author: t.tafsirBook.authorName,
      language: t.tafsirBook.language === 'ar' ? 'arabic' : 'english',
      category: 'classical' as TafsirCategory,
      source: 'local' as const,
      localIndex: index,
    })),
    ...TAFSIR_EDITIONS_ENHANCED.map((e) => ({
      id: `ext-${e.identifier}`,
      name: e.name,
      author: e.author,
      language: e.language,
      category: e.category,
      source: 'external' as const,
      identifier: e.identifier,
      isUnique: e.identifier === 'en-asbab-al-nuzul-by-al-wahidi',
      isPopular: ['en-tafisr-ibn-kathir', 'ar-tafsir-ibn-kathir', 'ar-tafseer-al-saddi', 'ru-tafseer-al-saddi'].includes(e.identifier),
    })),
  ];

  // Get unique languages
  const languages = ['english', 'arabic', 'urdu', 'bengali'];

  // Filter tafsirs
  const filteredTafsirs = allTafsirs.filter((t) => {
    const matchesSearch =
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = selectedLanguage === 'all' || t.language === selectedLanguage;

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(t.category);

    return matchesSearch && matchesLanguage && matchesCategory;
  });

  // Check if tafsir is selected
  const isTafsirSelected = (tafsir: TafsirItem): boolean => {
    if (tafsir.source === 'local' && 'localIndex' in tafsir) {
      return tempLocalIndices.includes(tafsir.localIndex as number);
    } else {
      return tempExternalTafsirs.some((t) => t.identifier === tafsir.identifier);
    }
  };

  // Toggle tafsir selection
  const toggleTafsir = async (tafsir: TafsirItem) => {
    if (tafsir.source === 'local' && 'localIndex' in tafsir) {
      const index = tafsir.localIndex as number;
      setTempLocalIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else if (tafsir.source === 'external' && tafsir.identifier) {
      const isSelected = tempExternalTafsirs.some((t) => t.identifier === tafsir.identifier);

      if (isSelected) {
        // Remove
        setTempExternalTafsirs((prev) => prev.filter((t) => t.identifier !== tafsir.identifier));
      } else {
        // Add - fetch from API
        await handleAddExternalTafsir(tafsir.identifier);
      }
    }
  };

  // Handle external tafsir addition
  const handleAddExternalTafsir = async (editionIdentifier: string) => {
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
        const edition = TAFSIR_EDITIONS_ENHANCED.find((e) => e.identifier === editionIdentifier);
        const newTafsir = {
          identifier: editionIdentifier,
          name: edition?.name || 'Unknown',
          author: edition?.author || 'Unknown',
          text: data.data.text,
          category: edition?.category || 'general',
        };
        setTempExternalTafsirs((prev) => [...prev, newTafsir]);
      }
    } catch (error) {
      console.error('Error fetching tafsir:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected tafsirs for display
  const selectedTafsirs = allTafsirs.filter(isTafsirSelected);

  // Remove selected tafsir
  const removeSelected = (tafsir: TafsirItem) => {
    if (tafsir.source === 'local' && 'localIndex' in tafsir) {
      setTempLocalIndices((prev) => prev.filter((i) => i !== (tafsir.localIndex as number)));
    } else {
      setTempExternalTafsirs((prev) => prev.filter((t) => t.identifier !== tafsir.identifier));
    }
  };

  // Toggle category filter
  const toggleCategory = (category: TafsirCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Save and close
  const handleSaveAndClose = () => {
    onSelectionChange(tempLocalIndices, tempExternalTafsirs);
    setIsOpen(false);
  };

  // Reset temp selections when opening
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempLocalIndices(selectedLocalIndices);
      setTempExternalTafsirs(externalTafsirs);
    }
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Manage Commentaries ({selectedLocalIndices.length + externalTafsirs.length})
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[450px] sm:max-w-[450px] flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Manage Commentaries (Tafsir)
          </SheetTitle>
          <SheetDescription>
            Select commentaries to display for this ayah
          </SheetDescription>
        </SheetHeader>

        {/* Active Commentaries Section */}
        {selectedTafsirs.length > 0 && (
          <div className="px-6 py-4 bg-muted/30 border-b">
            <h3 className="text-sm font-semibold mb-3">Active Commentaries ({selectedTafsirs.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTafsirs.map((tafsir) => (
                <Badge
                  key={tafsir.id}
                  variant="secondary"
                  className="gap-1 pr-1 text-xs"
                >
                  <span className="truncate max-w-[200px]">{tafsir.author}</span>
                  <button
                    onClick={() => removeSelected(tafsir)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="px-6 py-4 space-y-4 border-b">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Language Tabs */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Language</p>
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger value="english" className="text-xs px-2 py-1.5">
                  English
                </TabsTrigger>
                <TabsTrigger value="arabic" className="text-xs px-2 py-1.5">
                  Arabic
                </TabsTrigger>
                <TabsTrigger value="urdu" className="text-xs px-2 py-1.5">
                  Urdu
                </TabsTrigger>
                <TabsTrigger value="bengali" className="text-xs px-2 py-1.5">
                  Bengali
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs px-2 py-1.5">
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Filter by Type (Collapsible) */}
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
              <span>Filter by Type</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {Object.entries(TAFSIR_CATEGORIES).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded p-2 transition-colors"
                >
                  <Checkbox
                    checked={selectedCategories.includes(key as TafsirCategory)}
                    onCheckedChange={() => toggleCategory(key as TafsirCategory)}
                  />
                  <span className="text-sm flex items-center gap-1.5">
                    <span>{value.icon}</span>
                    <span>{value.name}</span>
                  </span>
                </label>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Tafsir List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs text-muted-foreground mb-3">
            {filteredTafsirs.length} commentaries available
          </p>

          <div className="space-y-2">
            {filteredTafsirs.map((tafsir) => {
              const isSelected = isTafsirSelected(tafsir);

              return (
                <button
                  key={tafsir.id}
                  onClick={() => toggleTafsir(tafsir)}
                  disabled={isLoading}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* Title Row */}
                      <div className="flex items-start gap-1.5 mb-1.5 flex-wrap">
                        <p className="font-semibold text-sm leading-snug">{tafsir.name}</p>
                        {tafsir.isUnique && (
                          <Badge
                            variant="default"
                            className="text-[10px] px-1 py-0 h-4 gap-0.5 bg-amber-500 flex-shrink-0"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            UNIQUE
                          </Badge>
                        )}
                        {tafsir.isPopular && (
                          <Badge
                            variant="default"
                            className="text-[10px] px-1 py-0 h-4 gap-0.5 bg-blue-500 flex-shrink-0"
                          >
                            <Star className="h-2.5 w-2.5" />
                            POPULAR
                          </Badge>
                        )}
                        {tafsir.category === 'classical' && !tafsir.isPopular && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 flex-shrink-0">
                            CLASSIC
                          </Badge>
                        )}
                      </div>

                      {/* Author */}
                      <p className="text-xs text-muted-foreground mb-1.5">by {tafsir.author}</p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                          {tafsir.language}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {TAFSIR_CATEGORIES[tafsir.category].icon} {TAFSIR_CATEGORIES[tafsir.category].name}
                        </Badge>
                        {tafsir.source === 'local' && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            Local
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredTafsirs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No commentaries match your filters</p>
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Save Button */}
        <SheetFooter className="px-6 py-4 border-t bg-background">
          <Button onClick={handleSaveAndClose} className="w-full" size="lg">
            Save & Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
