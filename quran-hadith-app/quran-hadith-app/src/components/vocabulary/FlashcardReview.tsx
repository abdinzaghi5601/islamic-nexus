'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, X, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VocabularyItem {
  id: string;
  arabicText: string;
  transliteration?: string;
  meaning: string;
  example?: string;
  mastery: number;
  root?: {
    root: string;
    meaning: string;
  };
}

interface FlashcardReviewProps {
  items: VocabularyItem[];
  onComplete: () => void;
}

export default function FlashcardReview({ items, onComplete }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleKnow = async (mastery: number) => {
    try {
      // Update mastery level
      await fetch(`/api/vocabulary/items/${currentItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mastery: Math.min(100, currentItem.mastery + mastery),
          markReviewed: true,
        }),
      });

      // Mark as reviewed
      setReviewedItems(new Set([...reviewedItems, currentItem.id]));

      // Move to next card
      if (currentIndex < items.length - 1) {
        handleNext();
      } else {
        // Review complete
        onComplete();
      }
    } catch (error) {
      console.error('Error updating mastery:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Flashcard Review</h2>
          <p className="text-muted-foreground">
            Card {currentIndex + 1} of {items.length}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onComplete}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        className="relative h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card - Arabic word */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="glass-card h-full p-12 rounded-2xl flex flex-col items-center justify-center">
              <div className="text-6xl font-arabic mb-4" dir="rtl">
                {currentItem.arabicText}
              </div>
              {currentItem.transliteration && (
                <div className="text-lg text-muted-foreground italic mb-8">
                  {currentItem.transliteration}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                <span>Click to reveal</span>
              </div>
            </div>
          </div>

          {/* Back of card - Translation and details */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="glass-card h-full p-12 rounded-2xl flex flex-col items-center justify-center">
              <div className="text-4xl font-bold mb-4">{currentItem.meaning}</div>

              {currentItem.example && (
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Example:</p>
                  <p className="text-base">{currentItem.example}</p>
                </div>
              )}

              {currentItem.root && (
                <div className="text-center mb-8 px-4 py-2 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Root:</p>
                  <p className="font-arabic text-lg">{currentItem.root.root}</p>
                  <p className="text-sm">{currentItem.root.meaning}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                <span>Click to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Mastery Controls */}
      <div className="mt-8">
        {flipped ? (
          /* Mastery buttons when card is flipped */
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              variant="outline"
              className="gap-2 border-red-500/50 hover:bg-red-500/10 hover:border-red-500"
              onClick={() => handleKnow(-10)}
            >
              <X className="h-4 w-4 text-red-500" />
              <span>Didn't Know</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-yellow-500/50 hover:bg-yellow-500/10 hover:border-yellow-500"
              onClick={() => handleKnow(5)}
            >
              <HelpCircle className="h-4 w-4 text-yellow-500" />
              <span>Somewhat</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-green-500/50 hover:bg-green-500/10 hover:border-green-500"
              onClick={() => handleKnow(15)}
            >
              <Check className="h-4 w-4 text-green-500" />
              <span>I Knew It!</span>
            </Button>
          </div>
        ) : (
          <div className="h-20" /> /* Spacer when buttons are hidden */
        )}

        {/* Previous/Next Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {reviewedItems.size} / {items.length} reviewed
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
