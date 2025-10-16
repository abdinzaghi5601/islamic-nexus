'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import asmaUlHusna from '@/lib/data/asma-ul-husna.json';

export default function NamesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNames = asmaUlHusna.filter(
    (name) =>
      name.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Asma-ul-Husna</h1>
        <p className="text-muted-foreground text-lg">
          The 99 Beautiful Names of Allah - Learn and reflect upon the divine attributes
        </p>
      </div>

      {/* Stats Banner */}
      <div className="glass-card p-6 rounded-xl mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">99</div>
            <div className="text-sm text-muted-foreground font-medium">Divine Names</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">{filteredNames.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Showing</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary mb-2">
              من حفظها دخل الجنة
            </div>
            <div className="text-xs text-muted-foreground">
              Whoever memorizes them will enter Paradise
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search by Arabic, transliteration, meaning, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass-card rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-base"
          />
        </div>
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNames.map((name) => (
          <div
            key={name.id}
            className="glass-card hover-lift p-6 rounded-xl group"
          >
            {/* Number Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                {name.id}
              </div>
            </div>

            {/* Arabic Name */}
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold mb-2 text-primary" dir="rtl">
                {name.arabic}
              </h2>
              <p className="text-lg font-semibold text-foreground mb-1">
                {name.transliteration}
              </p>
              <p className="text-sm font-medium text-accent">
                {name.meaning}
              </p>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {name.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredNames.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No names found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      )}

      {/* Hadith Section */}
      <div className="mt-12 glass-card p-8 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-2xl font-bold mb-4 text-center gradient-text">
          Virtue of Learning the Names
        </h3>
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-lg mb-4 text-primary font-arabic" dir="rtl">
            إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مِائَةً إِلَّا وَاحِدًا مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ
          </p>
          <p className="text-center text-muted-foreground leading-relaxed">
            Abu Hurairah (may Allah be pleased with him) reported that the Prophet Muhammad (peace be upon him) said:
            <span className="block mt-2 font-semibold text-foreground">
              "Allah has ninety-nine Names, one hundred less one; whoever counts them will enter Paradise."
            </span>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Sahih al-Bukhari 2736, Sahih Muslim 2677
          </p>
        </div>
      </div>
    </div>
  );
}
