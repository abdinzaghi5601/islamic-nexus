'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuranWordByWord from './QuranWordByWord';

interface WordData {
  id?: number;
  position: number;
  text: string;
  transliteration?: string;
  translation?: string;
}

interface AyahDisplayProps {
  ayahNumber: number;
  arabicText: string;
  words?: WordData[];
  showWordByWord?: boolean;
  fontStyle?: 'uthmani' | 'simple';
  showCopyButton?: boolean;
  className?: string;
}

// Arabic-Indic numerals (Eastern Arabic numerals)
const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert Western numerals to Arabic-Indic numerals
 */
function toArabicNumerals(num: number): string {
  return num
    .toString()
    .split('')
    .map(digit => ARABIC_NUMERALS[parseInt(digit)])
    .join('');
}

/**
 * AyahDisplay Component
 *
 * Displays a single Quranic ayah with proper Uthmani styling and
 * Arabic verse number markers (like quran.com).
 *
 * Features:
 * - Uthmani or simple font styles
 * - Arabic verse number markers (۞ ١ ٢ ٣)
 * - Word-by-word mode with tooltips
 * - Clean, spacious layout
 * - RTL text direction
 */
export default function AyahDisplay({
  ayahNumber,
  arabicText,
  words = [],
  showWordByWord = false,
  fontStyle = 'uthmani',
  showCopyButton = true,
  className = '',
}: AyahDisplayProps) {
  const [copied, setCopied] = useState(false);
  const arabicAyahNumber = toArabicNumerals(ayahNumber);
  const fontClass = fontStyle === 'uthmani' ? 'quran-text-uthmani' : 'quran-text';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(arabicText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Copy Button - Hidden by default, shows on hover */}
      {showCopyButton && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            title="Copy ayah"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      <div
        className={`
          ${fontClass}
          p-6
          md:p-8
          bg-gradient-to-br
          from-muted/20
          to-transparent
          rounded-2xl
          transition-all
          duration-300
          hover:from-muted/30
        `}
      >
        {showWordByWord && words.length > 0 ? (
          // Word-by-word mode
          <div className="flex flex-wrap justify-end items-center gap-3">
            <QuranWordByWord
              text={arabicText}
              words={words}
              fontStyle={fontStyle}
              className="flex-1"
            />
            <AyahMarker number={arabicAyahNumber} />
          </div>
        ) : (
          // Standard text mode
          <div className="flex items-center justify-end gap-4">
            <div className="flex-1 text-right" dir="rtl" lang="ar">
              {arabicText}
            </div>
            <AyahMarker number={arabicAyahNumber} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Ayah Number Marker
 * Displays the verse number in a decorative circular badge with Arabic numerals
 */
function AyahMarker({ number }: { number: string }) {
  return (
    <div
      className="
        relative
        flex
        items-center
        justify-center
        w-12
        h-12
        flex-shrink-0
        text-lg
        font-bold
        text-primary
      "
    >
      {/* Decorative circle background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/30"
        />
        <circle
          cx="24"
          cy="24"
          r="18"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary/20"
        />
      </svg>

      {/* Arabic verse number */}
      <span className="relative z-10 font-arabic text-base">
        {number}
      </span>
    </div>
  );
}
