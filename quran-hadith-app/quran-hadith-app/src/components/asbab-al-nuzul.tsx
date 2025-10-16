'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, X } from 'lucide-react';

interface AsbabAlNuzulProps {
  surahNumber: number;
  ayahNumber: number;
}

export default function AsbabAlNuzul({ surahNumber, ayahNumber }: AsbabAlNuzulProps) {
  const [asbabText, setAsbabText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(false);

  const loadAsbabAlNuzul = async () => {
    if (asbabText) {
      setIsVisible(!isVisible);
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch('/api/tafsir/asbab-al-nuzul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber,
          ayahNumber,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.text) {
        setAsbabText(data.data.text);
        setIsVisible(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error loading Asbab Al-Nuzul:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Button to load/toggle */}
      <div className="flex justify-center">
        <Button
          onClick={loadAsbabAlNuzul}
          disabled={isLoading}
          variant="outline"
          className="gap-2 border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading Historical Context...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-medium">Why Was This Revealed?</span>
              <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-700">
                NEW
              </Badge>
            </>
          )}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <Card className="p-4 bg-muted/50 border-muted text-center">
          <p className="text-sm text-muted-foreground">
            Historical context not available for this verse.
          </p>
        </Card>
      )}

      {/* Asbab Al-Nuzul content */}
      {isVisible && asbabText && (
        <Card className="relative p-6 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">
                Historical Context of Revelation
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Asbab Al-Nuzul • By Al-Wahidi
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-50 whitespace-pre-wrap">
              {asbabText}
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-300 italic">
              This explains the historical circumstances and events that led to the revelation of this verse,
              helping us understand the context in which it was sent down.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
