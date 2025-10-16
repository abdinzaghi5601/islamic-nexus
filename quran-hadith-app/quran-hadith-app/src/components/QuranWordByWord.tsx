'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import EnhancedWordModal from '@/components/EnhancedWordModal';

interface WordData {
  id?: number;
  position: number;
  text: string;
  transliteration?: string;
  translation?: string;
}

interface QuranWordByWordProps {
  text: string;
  words?: WordData[];
  className?: string;
  showTransliteration?: boolean;
  showTranslation?: boolean;
  fontStyle?: 'uthmani' | 'simple';
}

/**
 * QuranWordByWord Component
 *
 * Displays Quranic text word-by-word with interactive tooltips showing
 * transliteration and translation for each word.
 *
 * Features:
 * - Word-by-word display with proper spacing
 * - Interactive tooltips on hover
 * - Uthmani or simple font styles
 * - RTL layout support
 * - Responsive text sizing
 */
export default function QuranWordByWord({
  text,
  words = [],
  className = '',
  showTransliteration = true,
  showTranslation = true,
  fontStyle = 'uthmani',
}: QuranWordByWordProps) {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // If no word data provided, split text by spaces (fallback)
  const displayWords = words.length > 0
    ? words
    : text.split(' ').map((word, index) => ({
        position: index,
        text: word,
      }));

  const fontClass = fontStyle === 'uthmani'
    ? 'font-arabic-uthmani'
    : 'font-arabic-simple';

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={`${fontClass} text-right leading-loose ${className}`}
        dir="rtl"
        lang="ar"
      >
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-4">
          {displayWords.map((word, index) => {
            const hasTooltipContent = word.transliteration || word.translation;

            return hasTooltipContent ? (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span
                    className={`
                      cursor-pointer
                      transition-all
                      duration-200
                      px-1
                      rounded
                      ${hoveredWord === index
                        ? 'bg-primary/10 scale-110 text-primary'
                        : 'hover:bg-muted/50'
                      }
                    `}
                    onMouseEnter={() => setHoveredWord(index)}
                    onMouseLeave={() => setHoveredWord(null)}
                    onClick={() => {
                      if (word.id) {
                        setSelectedWordId(word.id);
                        setModalOpen(true);
                      }
                    }}
                  >
                    {word.text}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-card border-primary/20"
                >
                  <div className="space-y-1 text-center">
                    <p className="text-lg font-arabic" dir="rtl">
                      {word.text}
                    </p>

                    {showTransliteration && word.transliteration && (
                      <p className="text-sm font-medium text-muted-foreground italic">
                        {word.transliteration}
                      </p>
                    )}

                    {showTranslation && word.translation && (
                      <p className="text-sm text-foreground">
                        {word.translation}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span
                key={index}
                className="transition-all duration-200"
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>

      <EnhancedWordModal
        wordId={selectedWordId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </TooltipProvider>
  );
}
