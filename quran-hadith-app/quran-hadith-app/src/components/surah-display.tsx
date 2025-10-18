'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, BookOpen, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TajweedText from '@/components/TajweedText';
import AyahDisplay from '@/components/AyahDisplay';
import ReadingSettings, { ReadingSettingsConfig } from '@/components/ReadingSettings';
import BookmarkButton from '@/components/BookmarkButton';
import { getCleanedAyahText } from '@/lib/utils/bismillah';

interface Translation {
  id: number;
  text: string;
  translator: {
    name: string;
  };
}

interface Ayah {
  id: number;
  ayahNumber: number;
  textArabic: string;
  juz: number;
  translations: Translation[];
}

interface SurahDisplayProps {
  ayahs: Ayah[];
  surahNumber: number;
  surahName?: string;
}

interface TajweedApplication {
  id: number;
  startPosition: number;
  endPosition: number;
  affectedText: string;
  notes?: string | null;
  rule: {
    id: number;
    ruleId: string;
    name: string;
    nameArabic: string;
    category: string;
    description: string;
    color: string | null;
    textColor: string | null;
    examples: string[];
  };
}

export default function SurahDisplay({ ayahs, surahNumber, surahName = 'Surah' }: SurahDisplayProps) {
  const [tajweedEnabled, setTajweedEnabled] = useState(false);
  const [tajweedData, setTajweedData] = useState<Record<number, TajweedApplication[]>>({});
  const [loadingTajweed, setLoadingTajweed] = useState(false);

  // Reading settings state
  const [readingSettings, setReadingSettings] = useState<ReadingSettingsConfig>({
    fontSize: 32,
    lineSpacing: 2.2,
    fontStyle: 'uthmani',
    showTranslations: true,
  });

  // Fetch tajweed data when tajweed mode is enabled
  useEffect(() => {
    if (tajweedEnabled && Object.keys(tajweedData).length === 0) {
      fetchTajweedData();
    }
  }, [tajweedEnabled]);

  const fetchTajweedData = async () => {
    setLoadingTajweed(true);
    try {
      // Fetch tajweed applications for all ayahs
      const promises = ayahs.map(ayah =>
        fetch(`/api/tajweed/ayah/${ayah.id}`)
          .then(res => res.json())
          .catch(() => [])
      );

      const results = await Promise.all(promises);

      // Map results to ayah IDs
      const dataMap: Record<number, TajweedApplication[]> = {};
      ayahs.forEach((ayah, index) => {
        dataMap[ayah.id] = results[index] || [];
      });

      setTajweedData(dataMap);
    } catch (error) {
      console.error('Error fetching tajweed data:', error);
    } finally {
      setLoadingTajweed(false);
    }
  };

  // Helper function to get the display text for an ayah
  const getArabicText = (ayah: Ayah) => {
    return getCleanedAyahText(ayah.textArabic, surahNumber, ayah.ayahNumber);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {ayahs.length} Ayahs
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Reading Settings */}
          <ReadingSettings
            config={readingSettings}
            onChange={setReadingSettings}
          />

          {/* Tajweed Toggle */}
          <Button
            onClick={() => setTajweedEnabled(!tajweedEnabled)}
            variant={tajweedEnabled ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {tajweedEnabled ? 'Hide' : 'Show'} Tajweed
          </Button>
        </div>
      </div>

      {ayahs.map((ayah) => {
        const arabicText = getArabicText(ayah);
        const applications = tajweedData[ayah.id] || [];

        return (
          <div
            key={ayah.id}
            id={`ayah-${ayah.ayahNumber}`}
            className="group scroll-mt-24"
          >
            {/* Content Card with Enhanced Styling */}
            <div className="content-card p-6 rounded-2xl mb-6">
              {/* Header - Ayah info and actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    Ayah {ayah.ayahNumber}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Juz {ayah.juz}
                  </span>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BookmarkButton
                    ayahId={ayah.id}
                    variant="ghost"
                    size="sm"
                  />

                  <Link href={`/quran/study/${surahNumber}/${ayah.ayahNumber}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Study
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Arabic Text with Enhanced Styling */}
              {tajweedEnabled && !loadingTajweed ? (
                <div
                  className="mb-6 p-6 bg-muted/20 rounded-2xl quran-text-enhanced"
                  style={{
                    fontSize: `${readingSettings.fontSize}px`,
                    lineHeight: readingSettings.lineSpacing,
                  }}
                >
                  <TajweedText
                    text={arabicText}
                    applications={applications}
                    className={readingSettings.fontStyle === 'uthmani' ? 'font-arabic-uthmani' : 'font-arabic-simple'}
                  />
                </div>
              ) : (
                <div
                  className="quran-text-enhanced"
                  style={{
                    fontSize: `${readingSettings.fontSize}px`,
                    lineHeight: readingSettings.lineSpacing,
                  }}
                >
                  <AyahDisplay
                    ayahNumber={ayah.ayahNumber}
                    arabicText={loadingTajweed && tajweedEnabled ? 'Loading tajweed...' : arabicText}
                    fontStyle={readingSettings.fontStyle}
                    className="mb-6"
                  />
                </div>
              )}

              {/* Translations */}
              {readingSettings.showTranslations && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  {ayah.translations.map((translation) => (
                    <div key={translation.id} className="space-y-1.5">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {translation.translator.name}
                      </p>
                      <p className="text-base leading-relaxed text-foreground/90">
                        {translation.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Islamic Divider */}
            <div className="islamic-divider my-8">
              <span className="inline-block px-4 text-xs text-muted-foreground">✦</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
