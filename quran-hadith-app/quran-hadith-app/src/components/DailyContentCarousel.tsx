'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Library, Heart, RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DailyContent {
  ayah: {
    id: number;
    arabic: string;
    translation: string;
    translator: string;
    reference: string;
    referenceArabic: string;
    surahName: string;
    surahNumber: number;
    ayahNumber: number;
    link: string;
  };
  hadith: {
    id: number;
    arabic: string;
    english: string;
    reference: string;
    bookName: string;
    bookNameArabic: string | null;
    chapterName: string | null;
    grade: string;
    link: string;
  };
  dua: {
    id: number;
    title: string;
    titleArabic: string | null;
    arabic: string;
    transliteration: string;
    english: string;
    category: string;
    reference: string;
    benefits: string;
    occasion: string;
    link: string;
  };
  metadata: {
    generatedAt: string;
    totalAyahs: number;
    totalHadiths: number;
    totalDuas: number;
  };
}

const gradients = [
  'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
  'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
  'from-rose-500/20 via-pink-500/20 to-fuchsia-500/20',
];

const icons = [BookOpen, Library, Heart];

export default function DailyContentCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const slides = dailyContent
    ? [
        {
          type: 'Verse of the Moment',
          title: dailyContent.ayah.surahName,
          content: dailyContent.ayah.arabic,
          translation: dailyContent.ayah.translation,
          reference: dailyContent.ayah.reference,
          link: dailyContent.ayah.link,
          metadata: `Translator: ${dailyContent.ayah.translator}`,
        },
        {
          type: 'Hadith of the Moment',
          title: dailyContent.hadith.bookName,
          content: dailyContent.hadith.arabic,
          translation: dailyContent.hadith.english,
          reference: dailyContent.hadith.reference,
          link: dailyContent.hadith.link,
          metadata: `Grade: ${dailyContent.hadith.grade}`,
        },
        {
          type: 'Dua of the Moment',
          title: dailyContent.dua.title,
          content: dailyContent.dua.arabic,
          translation: dailyContent.dua.english,
          transliteration: dailyContent.dua.transliteration,
          reference: dailyContent.dua.reference || dailyContent.dua.category,
          link: dailyContent.dua.link,
          metadata: dailyContent.dua.occasion || dailyContent.dua.category,
        },
      ]
    : [];

  // Fetch daily content
  const fetchDailyContent = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/daily-content', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch daily content');
      }

      const data = await response.json();
      setDailyContent(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching daily content:', err);
      setError('Failed to load daily content. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyContent();
  }, [fetchDailyContent]);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || !dailyContent) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [isPaused, dailyContent]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleRefresh = async () => {
    setIsPaused(true);
    await fetchDailyContent();
    setCurrentSlide(0);
    setTimeout(() => setIsPaused(false), 1000);
  };

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl glass-card">
        <div className="flex items-center justify-center h-[500px] md:h-[600px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading daily inspiration...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dailyContent) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl glass-card">
        <div className="flex items-center justify-center h-[500px] md:h-[600px]">
          <div className="text-center p-8">
            <p className="text-destructive mb-4">{error || 'Failed to load content'}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl glass-card group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => {
          const Icon = icons[index];
          const gradient = gradients[index];
          const isActive = currentSlide === index;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
            >
              <div className={`h-full bg-gradient-to-br ${gradient} backdrop-blur-sm p-8 md:p-12 flex flex-col justify-between`}>
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm bg-background/80 backdrop-blur-sm">
                      <Icon className="h-4 w-4 mr-2" />
                      {slide.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold gradient-text">
                    {slide.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center space-y-6 py-8">
                  {/* Arabic Text */}
                  <div className="text-center">
                    <p
                      className="text-3xl md:text-4xl lg:text-5xl leading-loose font-arabic text-foreground/90"
                      dir="rtl"
                      lang="ar"
                    >
                      {slide.content}
                    </p>
                  </div>

                  {/* Transliteration (for Dua) */}
                  {slide.transliteration && (
                    <div className="text-center">
                      <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                        {slide.transliteration}
                      </p>
                    </div>
                  )}

                  {/* Translation */}
                  <div className="text-center">
                    <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-4xl mx-auto">
                      {slide.translation}
                    </p>
                  </div>

                  {/* Reference & Link */}
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {slide.reference}
                    </p>
                    {slide.metadata && (
                      <p className="text-xs text-muted-foreground">
                        {slide.metadata}
                      </p>
                    )}
                    <Link href={slide.link}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      >
                        Read Full Context
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              currentSlide === index
                ? 'w-12 h-3 bg-primary'
                : 'w-3 h-3 bg-background/60 hover:bg-background/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
