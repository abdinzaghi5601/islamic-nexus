'use client';

import { useState } from 'react';
import { getAllDuas, getAllCategories, getCategoryMetadata, getDuasByCategory } from '@/lib/api/dua-service';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function DuasPage() {
  const categories = getAllCategories();
  const allDuas = getAllDuas();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter duas based on selected category
  const displayedDuas = selectedCategory === 'All'
    ? allDuas
    : getDuasByCategory(selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Islamic Duas & Azkar
        </h1>
        <p className="text-muted-foreground">
          Collection of authentic supplications and remembrances
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">{allDuas.length}</p>
          <p className="text-sm text-muted-foreground">Total Duas</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">{categories.length}</p>
          <p className="text-sm text-muted-foreground">Categories</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">📿</p>
          <p className="text-sm text-muted-foreground">Daily Azkar</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">✨</p>
          <p className="text-sm text-muted-foreground">For All Occasions</p>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                : 'glass-card hover:bg-muted/80'
            }`}
          >
            <span>📚</span>
            All Duas
            <span className="text-xs opacity-80">({allDuas.length})</span>
          </button>
          {categories.map((category) => {
            const meta = getCategoryMetadata(category.name);
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'glass-card hover:bg-muted/80'
                }`}
              >
                <span>{meta.icon}</span>
                <span className="hidden md:inline">{category.name}</span>
                <span className="md:hidden">{category.name.split(' ')[0]}</span>
                <span className="text-xs opacity-80">({category.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duas Display */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory === 'All' ? 'All Supplications' : selectedCategory}
          <span className="text-muted-foreground font-normal text-lg ml-3">
            ({displayedDuas.length} duas)
          </span>
        </h2>
        <div className="space-y-6">
          {displayedDuas.map((dua) => {
            const meta = getCategoryMetadata(dua.category);
            return (
              <Card key={dua.id} id={`dua-${dua.id}`} className="p-6 scroll-mt-24">
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant="outline" className={meta.color}>
                    {meta.icon} {dua.category}
                  </Badge>
                  {dua.count && <Badge variant="secondary">{dua.count}x</Badge>}
                </div>

                <div className="text-2xl md:text-3xl font-arabic leading-loose text-center mb-6 p-4 bg-muted/30 rounded-lg" dir="rtl">
                  {dua.zikr}
                </div>

                {dua.transliteration && (
                  <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground italic">{dua.transliteration}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-base leading-relaxed">{dua.translation}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-3">
                  {dua.reference && <span><b>Ref:</b> {dua.reference}</span>}
                  {dua.benefits && <span><b>Benefits:</b> {dua.benefits}</span>}
                </div>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {displayedDuas.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤲</div>
            <h3 className="text-xl font-semibold mb-2">No duas found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
