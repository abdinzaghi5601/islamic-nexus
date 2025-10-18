'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Library,
  Heart,
  Book,
  Sparkles,
  BookText,
  Search,
  ChevronDown,
  TrendingUp,
  Star,
  Clock,
  BarChart3,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MegaMenuProps {
  className?: string;
}

const menuSections = [
  {
    title: 'Quran',
    icon: BookOpen,
    href: '/quran',
    color: 'from-emerald-500 to-teal-600',
    description: 'Complete Quran with translations and tafsir',
    items: [
      { label: 'Browse All Surahs', href: '/quran', badge: '114 Surahs' },
      { label: 'Popular Surahs', href: '/quran#popular', icon: Star },
      { label: 'Continue Reading', href: '/quran#continue', icon: Clock },
    ],
    popularSurahs: [
      { number: 1, name: 'Al-Fatihah', translation: 'The Opening' },
      { number: 36, name: 'Yasin', translation: 'Ya-Sin' },
      { number: 55, name: 'Ar-Rahman', translation: 'The Most Merciful' },
      { number: 67, name: 'Al-Mulk', translation: 'The Sovereignty' },
    ],
  },
  {
    title: 'Hadith',
    icon: Library,
    href: '/hadith',
    color: 'from-blue-500 to-indigo-600',
    description: 'Authentic narrations from six major books',
    items: [
      { label: 'Browse Collections', href: '/hadith', badge: '6 Books' },
      { label: 'Sahih Bukhari', href: '/hadith/1' },
      { label: 'Sahih Muslim', href: '/hadith/2' },
      { label: 'Search Hadith', href: '/search?type=hadith', icon: Search },
    ],
    books: [
      { id: 1, name: 'Sahih Bukhari', count: '7,563' },
      { id: 2, name: 'Sahih Muslim', count: '7,190' },
      { id: 3, name: 'Sunan Abu Dawud', count: '5,274' },
      { id: 4, name: 'Jami at-Tirmidhi', count: '3,956' },
    ],
  },
  {
    title: 'Salah',
    icon: Handshake,
    href: '/salah',
    color: 'from-amber-500 to-orange-600',
    description: 'Learn the complete method of Islamic prayer',
    items: [
      { label: 'Complete Guide', href: '/salah/guide', badge: 'Step-by-Step' },
      { label: 'Wisdom & Meaning', href: '/salah/wisdom', icon: Heart },
      { label: 'Prayer Times', href: '/salah#times', icon: Clock },
    ],
    guides: [
      { name: 'Step-by-Step Guide', description: 'Learn the correct method', href: '/salah/guide' },
      { name: 'Wisdom Behind Movements', description: 'Understand the spiritual meaning', href: '/salah/wisdom' },
      { name: 'Prayer Times & Rak\'ahs', description: 'Daily prayer schedule', href: '/salah#times' },
    ],
  },
  {
    title: 'Duas & More',
    icon: Heart,
    href: '/duas',
    color: 'from-rose-500 to-pink-600',
    description: 'Supplications, Names of Allah, and Stories',
    items: [
      { label: 'Islamic Duas', href: '/duas', badge: '50+' },
      { label: '99 Names of Allah', href: '/names', badge: '99' },
      { label: 'Islamic Stories', href: '/stories', badge: '22' },
      { label: 'PDF Books', href: '/books', icon: Book },
    ],
    categories: [
      { name: 'Morning & Evening', href: '/duas#morning-evening' },
      { name: 'Before Meals', href: '/duas#meals' },
      { name: 'Travel Duas', href: '/duas#travel' },
      { name: 'Protection', href: '/duas#protection' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    color: 'from-purple-500 to-violet-600',
    description: 'Explore insights and statistics from the Quran',
    items: [
      { label: 'Overview Dashboard', href: '/analytics', icon: BarChart3 },
      { label: 'Prophet Analysis', href: '/analytics#prophets', badge: '20+' },
      { label: 'Theme Distribution', href: '/analytics#themes', badge: '50+' },
      { label: 'Word Frequencies', href: '/analytics#words', badge: '100+' },
    ],
    stats: [
      { label: 'Total Surahs', value: '114' },
      { label: 'Total Ayahs', value: '6,236' },
      { label: 'Total Words', value: '77,797' },
      { label: 'Unique Words', value: '14,870' },
    ],
  },
];

export default function MegaMenu({ className = '' }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className={`hidden md:flex items-center gap-2 ${className}`}>
      {menuSections.map((section) => {
        const Icon = section.icon;
        const isActive = activeMenu === section.title;

        return (
          <div
            key={section.title}
            className="relative"
            onMouseEnter={() => setActiveMenu(section.title)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {/* Menu Button */}
            <Link href={section.href}>
              <Button
                variant="ghost"
                className={`gap-2 transition-all duration-200 ${
                  isActive ? 'bg-muted' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.title}
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    isActive ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </Link>

            {/* Dropdown Panel */}
            {isActive && (
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#34495e] dark:bg-[#2c3e50] border-2 border-[#d4af37]/20 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.3)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Main Links */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${section.color}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{section.title}</h3>
                        <p className="text-xs text-gray-300">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c3e50] dark:hover:bg-[#1a5f3f] transition-all duration-300 group hover:pl-4"
                          >
                            <div className="flex items-center gap-2">
                              {ItemIcon && <ItemIcon className="h-4 w-4 text-gray-300 group-hover:text-[#d4af37]" />}
                              <span className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                                {item.label}
                              </span>
                            </div>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column - Dynamic Content */}
                  <div className="bg-[#2c3e50]/50 dark:bg-[#1a5f3f]/30 rounded-lg p-4 border border-[#d4af37]/10">
                    {/* Quran Section - Popular Surahs */}
                    {section.title === 'Quran' && section.popularSurahs && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-4 w-4 text-[#d4af37]" />
                          <h4 className="font-semibold text-sm text-white">Popular Surahs</h4>
                        </div>
                        <div className="space-y-2">
                          {section.popularSurahs.map((surah) => (
                            <Link
                              key={surah.number}
                              href={`/quran/${surah.number}`}
                              className="block p-2 rounded hover:bg-[#1a5f3f] transition-all duration-300 group"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                                  {surah.number}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                                    {surah.name}
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {surah.translation}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hadith Section - Books */}
                    {section.title === 'Hadith' && section.books && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-[#d4af37]" />
                          <h4 className="font-semibold text-sm text-white">Major Collections</h4>
                        </div>
                        <div className="space-y-2">
                          {section.books.map((book) => (
                            <Link
                              key={book.id}
                              href={`/hadith/${book.id}`}
                              className="block p-2 rounded hover:bg-[#1a5f3f] transition-all duration-300 group"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                                  {book.name}
                                </p>
                                <Badge variant="outline" className="text-xs border-gray-400 text-gray-300">
                                  {book.count}
                                </Badge>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Duas Section - Categories */}
                    {section.title === 'Duas & More' && section.categories && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="h-4 w-4 text-[#d4af37]" />
                          <h4 className="font-semibold text-sm text-white">Dua Categories</h4>
                        </div>
                        <div className="space-y-2">
                          {section.categories.map((category) => (
                            <Link
                              key={category.href}
                              href={category.href}
                              className="block p-2 rounded hover:bg-[#1a5f3f] transition-all duration-300 group"
                            >
                              <p className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                                {category.name}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Salah Section - Prayer Guides */}
                    {section.title === 'Salah' && section.guides && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Handshake className="h-4 w-4 text-[#d4af37]" />
                          <h4 className="font-semibold text-sm text-white">Prayer Guides</h4>
                        </div>
                        <div className="space-y-2">
                          {section.guides.map((guide) => (
                            <Link
                              key={guide.href}
                              href={guide.href}
                              className="block p-2 rounded hover:bg-[#1a5f3f] transition-all duration-300 group"
                            >
                              <p className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                                {guide.name}
                              </p>
                              <p className="text-xs text-gray-300">
                                {guide.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analytics Section - Stats */}
                    {section.title === 'Analytics' && section.stats && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="h-4 w-4 text-[#d4af37]" />
                          <h4 className="font-semibold text-sm text-white">Quick Stats</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {section.stats.map((stat) => (
                            <div
                              key={stat.label}
                              className="p-2 rounded bg-[#1a5f3f]/50 hover:bg-[#1a5f3f] transition-colors text-center"
                            >
                              <p className="text-lg font-bold text-[#d4af37]">
                                {stat.value}
                              </p>
                              <p className="text-xs text-gray-300">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Action Footer */}
                <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                  <Link href="/search">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-[#d4af37]/50 text-white hover:bg-[#1a5f3f] hover:text-[#d4af37] hover:border-[#d4af37]"
                    >
                      <Search className="h-4 w-4" />
                      Search All Content
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
