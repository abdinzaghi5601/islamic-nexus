'use client';

import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WordTranslation {
  id: number;
  language: string;
  translation: string;
  context?: string;
}

interface WordGrammar {
  id: number;
  partOfSpeech: string;
  root?: string;
  form?: string;
  mood?: string;
  case_?: string;
  number?: string;
  gender?: string;
  person?: string;
  tense?: string;
}

interface WordRoot {
  id: number;
  root: string;
  rootSimple: string;
  meaning: string;
  occurrences: number;
}

interface AyahWord {
  id: number;
  position: number;
  textArabic: string;
  textSimplified?: string;
  transliteration?: string;
  translations: WordTranslation[];
  grammar?: WordGrammar;
  root?: WordRoot;
}

interface WordByWordProps {
  ayahId: number;
  defaultText: string; // Fallback to show if no word data
}

export default function WordByWord({ ayahId, defaultText }: WordByWordProps) {
  const [words, setWords] = useState<AyahWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ayah-words/${ayahId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch word data');
        }

        const data = await response.json();
        setWords(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching words:', err);
        setError('Could not load word-by-word translation');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [ayahId]);

  // If loading or error, show the default Arabic text
  if (loading || error || words.length === 0) {
    return (
      <div className="text-3xl font-arabic leading-loose text-right" dir="rtl">
        {defaultText}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-3 justify-end" dir="rtl">
        {words.map((word) => {
          // Get English translation
          const englishTranslation = word.translations.find(
            (t) => t.language === 'en'
          );

          // Build tooltip content
          const tooltipContent = (
            <div className="space-y-2 max-w-xs">
              {/* Arabic and Transliteration */}
              <div>
                <p className="text-lg font-arabic">{word.textArabic}</p>
                {word.transliteration && (
                  <p className="text-xs text-muted-foreground italic">
                    {word.transliteration}
                  </p>
                )}
              </div>

              {/* Translation */}
              {englishTranslation && (
                <div>
                  <p className="font-semibold text-sm">
                    {englishTranslation.translation}
                  </p>
                  {englishTranslation.context && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {englishTranslation.context}
                    </p>
                  )}
                </div>
              )}

              {/* Root */}
              {word.root && (
                <div className="text-xs border-t border-border pt-2">
                  <p>
                    <span className="font-semibold">Root:</span>{' '}
                    <span className="font-arabic">{word.root.root}</span> -{' '}
                    {word.root.meaning}
                  </p>
                </div>
              )}

              {/* Grammar */}
              {word.grammar && (
                <div className="text-xs border-t border-border pt-2">
                  <p>
                    <span className="font-semibold">Part of Speech:</span>{' '}
                    {word.grammar.partOfSpeech}
                  </p>
                  {word.grammar.tense && (
                    <p>
                      <span className="font-semibold">Tense:</span>{' '}
                      {word.grammar.tense}
                    </p>
                  )}
                  {word.grammar.person && (
                    <p>
                      <span className="font-semibold">Person:</span>{' '}
                      {word.grammar.person}
                    </p>
                  )}
                </div>
              )}
            </div>
          );

          return (
            <Tooltip key={word.id}>
              <TooltipTrigger asChild>
                <span
                  className="text-3xl font-arabic cursor-pointer hover:text-primary transition-colors duration-200 inline-block"
                  dir="rtl"
                >
                  {word.textArabic}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-background/95 backdrop-blur-xl border border-border shadow-lg"
              >
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
