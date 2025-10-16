'use client';

import { useState, useEffect } from 'react';
import { Shuffle, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Dua } from '@/lib/api/dua-service';
import { getCategoryMetadata } from '@/lib/api/dua-service';

interface RandomDuaProps {
  initialDua?: Dua;
  className?: string;
  showCategoryFilter?: boolean;
}

export default function RandomDua({ initialDua, className = '', showCategoryFilter = false }: RandomDuaProps) {
  const [dua, setDua] = useState<Dua | null>(initialDua || null);
  const [isLoading, setIsLoading] = useState(!initialDua);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories on mount if filter is enabled
  useEffect(() => {
    if (showCategoryFilter) {
      fetch('/api/duas/categories')
        .then(res => res.json())
        .then(data => {
          setCategories(data.categories.map((c: any) => c.name));
        })
        .catch(err => console.error('Failed to load categories:', err));
    }
  }, [showCategoryFilter]);

  // Load initial dua if not provided
  useEffect(() => {
    if (!initialDua) {
      fetchRandomDua();
    }
  }, [initialDua]);

  const fetchRandomDua = async (category?: string) => {
    setIsLoading(true);
    try {
      const url = category && category !== 'all'
        ? `/api/duas/random?category=${encodeURIComponent(category)}`
        : '/api/duas/random';

      const response = await fetch(url);
      const data = await response.json();

      if (data.dua) {
        setDua(data.dua);
      }
    } catch (error) {
      console.error('Failed to fetch random dua:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = () => {
    fetchRandomDua(selectedCategory !== 'all' ? selectedCategory : undefined);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchRandomDua(category !== 'all' ? category : undefined);
  };

  if (isLoading && !dua) {
    return (
      <Card className={`p-6 animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!dua) {
    return (
      <Card className={`p-6 ${className}`}>
        <p className="text-muted-foreground text-center">No dua available</p>
      </Card>
    );
  }

  const meta = getCategoryMetadata(dua.category);

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Random Dua</h3>
        </div>
        <Button
          onClick={handleShuffle}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <Shuffle className="h-4 w-4" />
          {isLoading ? 'Loading...' : 'New Dua'}
        </Button>
      </div>

      {/* Category Filter */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleCategoryChange('all')}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className={meta.color}>
          {meta.icon} {dua.category}
        </Badge>
        {dua.count && <Badge variant="secondary">{dua.count}x</Badge>}
      </div>

      {/* Arabic Text */}
      <div
        className="text-2xl md:text-3xl font-arabic leading-loose text-center mb-6 p-4 bg-muted/30 rounded-lg"
        dir="rtl"
      >
        {dua.zikr}
      </div>

      {/* Transliteration */}
      {dua.transliteration && (
        <div className="mb-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground italic">{dua.transliteration}</p>
        </div>
      )}

      {/* Translation */}
      <div className="mb-4">
        <p className="text-base leading-relaxed">{dua.translation}</p>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-3">
        {dua.reference && (
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {dua.reference}
          </span>
        )}
        {dua.benefits && <span><b>Benefits:</b> {dua.benefits}</span>}
      </div>

      {/* Description */}
      {dua.description && (
        <div className="mt-3 text-sm text-muted-foreground italic">
          {dua.description}
        </div>
      )}
    </Card>
  );
}
