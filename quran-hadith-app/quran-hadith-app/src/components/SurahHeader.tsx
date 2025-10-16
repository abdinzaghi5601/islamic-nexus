'use client';

import { BookOpen, MapPin, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BismillahDisplay from './BismillahDisplay';

interface SurahHeaderProps {
  surahNumber: number;
  nameArabic: string;
  nameEnglish: string;
  nameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  totalAyahs: number;
  revelationOrder?: number;
  showBismillah?: boolean;
  className?: string;
}

/**
 * SurahHeader Component
 *
 * Beautiful header display for a Surah with metadata and optional Bismillah
 *
 * Features:
 * - Surah name in Arabic and English
 * - Revelation info (Meccan/Medinan)
 * - Total ayahs count
 * - Optional Bismillah display
 * - Clean, modern design
 */
export default function SurahHeader({
  surahNumber,
  nameArabic,
  nameEnglish,
  nameTranslation,
  revelationType,
  totalAyahs,
  revelationOrder,
  showBismillah = true,
  className = '',
}: SurahHeaderProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Header */}
      <div className="glass-card p-8 md:p-10 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: English Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="default" className="text-sm font-semibold">
                Surah {surahNumber}
              </Badge>
              <Badge
                variant={revelationType === 'Meccan' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {revelationType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Hash className="h-3 w-3 mr-1" />
                {totalAyahs} Ayahs
              </Badge>
              {revelationOrder && (
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Revelation #{revelationOrder}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {nameEnglish}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground">
              {nameTranslation}
            </p>
          </div>

          {/* Right: Arabic Name */}
          <div className="flex items-center justify-center md:justify-end">
            <div className="relative animate-float">
              <p
                className="
                  text-5xl
                  md:text-6xl
                  lg:text-7xl
                  font-arabic-uthmani
                  quran-text-enhanced
                  text-primary
                  transition-all
                  duration-300
                  hover:scale-105
                "
                dir="rtl"
                lang="ar"
              >
                {nameArabic}
              </p>

              {/* Decorative glow */}
              <div
                className="absolute inset-0 blur-3xl opacity-20 -z-10"
                style={{
                  background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bismillah - Skip for Surah 1 (Al-Fatiha) and Surah 9 (At-Tawbah) */}
      {showBismillah && surahNumber !== 1 && surahNumber !== 9 && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <BismillahDisplay showDecoration={false} />
        </div>
      )}

      {/* Special Note for At-Tawbah (Surah 9) */}
      {surahNumber === 9 && (
        <div className="glass-card rounded-xl p-4 border-l-4 border-primary/50">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Surah At-Tawbah is the only surah
            that does not begin with Bismillah (بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ).
          </p>
        </div>
      )}
    </div>
  );
}
