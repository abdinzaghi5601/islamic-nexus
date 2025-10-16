'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  BookmarkPlus,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  textUthmani?: string;
  juz: number;
  translations: Translation[];
}

interface InteractiveAyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  surahName: string;
  showTafsir?: boolean;
}

export default function InteractiveAyahCard({
  ayah,
  surahNumber,
  surahName,
  showTafsir = true,
}: InteractiveAyahCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTranslations, setSelectedTranslations] = useState<number[]>(
    ayah.translations.map((t) => t.id)
  );

  // Toggle translation visibility
  const toggleTranslation = (translationId: number) => {
    setSelectedTranslations((prev) =>
      prev.includes(translationId)
        ? prev.filter((id) => id !== translationId)
        : [...prev, translationId]
    );
  };

  // Copy ayah to clipboard
  const handleCopy = async () => {
    const arabicText = ayah.textUthmani || ayah.textArabic;
    const translations = ayah.translations
      .filter((t) => selectedTranslations.includes(t.id))
      .map((t) => `${t.translator.name}: ${t.text}`)
      .join('\n\n');

    const fullText = `${arabicText}\n\n${translations}\n\nReference: ${surahName} ${surahNumber}:${ayah.ayahNumber}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share ayah
  const handleShare = async () => {
    const arabicText = ayah.textUthmani || ayah.textArabic;
    const shareData = {
      title: `${surahName} ${surahNumber}:${ayah.ayahNumber}`,
      text: `${arabicText}\n\n${ayah.translations[0]?.text || ''}`,
      url: window.location.origin + `/quran/${surahNumber}#ayah-${ayah.ayahNumber}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const visibleTranslations = ayah.translations.filter((t) =>
    selectedTranslations.includes(t.id)
  );

  return (
    <div
      id={`ayah-${ayah.ayahNumber}`}
      className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover-lift group"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-base font-bold text-primary-foreground shadow-md">
              {ayah.ayahNumber}
            </div>
            <div>
              <div className="font-semibold text-sm">
                {surahName} {surahNumber}:{ayah.ayahNumber}
              </div>
              <div className="text-xs text-muted-foreground">Juz {ayah.juz}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-9 w-9"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-9 w-9"
              title="Share ayah"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              title="Bookmark (Coming soon)"
              disabled
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>

            <Link href={`/quran/study/${surahNumber}/${ayah.ayahNumber}`}>
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Study in detail">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Arabic Text */}
        <div
          className="text-3xl md:text-4xl font-arabic leading-loose mb-6 text-right p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl transition-all duration-300 hover:bg-muted/40"
          dir="rtl"
          lang="ar"
        >
          {ayah.textUthmani || ayah.textArabic}
        </div>

        {/* Translation Controls */}
        {ayah.translations.length > 1 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">Translations:</span>
            {ayah.translations.map((translation) => (
              <Badge
                key={translation.id}
                variant={selectedTranslations.includes(translation.id) ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleTranslation(translation.id)}
              >
                {translation.translator.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Translations */}
        <div className={`space-y-4 transition-all duration-300 ${isExpanded ? '' : 'hidden'}`}>
          {visibleTranslations.length > 0 ? (
            visibleTranslations.map((translation) => (
              <div
                key={translation.id}
                className="pl-4 border-l-4 border-primary/30 transition-all duration-300 hover:border-primary/60 hover:pl-5"
              >
                <p className="text-sm text-primary font-semibold mb-2">
                  {translation.translator.name}
                </p>
                <p className="leading-relaxed text-muted-foreground">{translation.text}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Select at least one translation to display
            </p>
          )}
        </div>

        {/* Expand/Collapse Toggle */}
        {ayah.translations.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Translations
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Translations
              </>
            )}
          </Button>
        )}

        {/* Additional Features */}
        {showTafsir && (
          <div className="mt-6 pt-6 border-t border-primary/10">
            <Link href={`/quran/study/${surahNumber}/${ayah.ayahNumber}`}>
              <Button variant="outline" className="w-full" size="sm">
                <Lightbulb className="h-4 w-4 mr-2" />
                View Tafsir & Detailed Study
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
