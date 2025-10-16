'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Play, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FlashcardReview from './FlashcardReview';

interface VocabularyItem {
  id: string;
  arabicText: string;
  transliteration?: string;
  meaning: string;
  example?: string;
  mastery: number;
  reviewCount: number;
  lastReviewed?: string;
  root?: {
    root: string;
    meaning: string;
  };
}

interface VocabularyListViewProps {
  listId: string;
}

export default function VocabularyListView({ listId }: VocabularyListViewProps) {
  const router = useRouter();
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [adding, setAdding] = useState(false);

  // New word form state
  const [arabicText, setArabicText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');

  useEffect(() => {
    fetchItems();
  }, [listId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vocabulary/lists/${listId}/items`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push('/vocabulary');
          return;
        }
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!arabicText.trim() || !meaning.trim()) return;

    try {
      setAdding(true);
      const response = await fetch(`/api/vocabulary/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arabicText,
          transliteration,
          meaning,
          example,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add word');
      }

      // Refresh items
      await fetchItems();

      // Reset form
      setArabicText('');
      setTransliteration('');
      setMeaning('');
      setExample('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding word:', error);
    } finally {
      setAdding(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this word?')) return;

    try {
      const response = await fetch(`/api/vocabulary/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh items
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">Loading vocabulary...</div>
      </div>
    );
  }

  if (reviewMode && items.length > 0) {
    return (
      <FlashcardReview
        items={items}
        onComplete={() => {
          setReviewMode(false);
          fetchItems();
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/vocabulary')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Vocabulary List</h1>
            <p className="text-muted-foreground">{items.length} words</p>
          </div>
        </div>

        <div className="flex gap-2">
          {items.length > 0 && (
            <Button onClick={() => setReviewMode(true)} className="gap-2">
              <Play className="h-4 w-4" />
              Start Review
            </Button>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Word
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={addWord}>
                <DialogHeader>
                  <DialogTitle>Add New Word</DialogTitle>
                  <DialogDescription>
                    Add a new Arabic word to your vocabulary list
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label htmlFor="arabicText" className="text-sm font-medium mb-2 block">
                      Arabic Text *
                    </label>
                    <Input
                      id="arabicText"
                      placeholder="كَلِمَة"
                      value={arabicText}
                      onChange={(e) => setArabicText(e.target.value)}
                      className="font-arabic text-xl"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="transliteration" className="text-sm font-medium mb-2 block">
                      Transliteration
                    </label>
                    <Input
                      id="transliteration"
                      placeholder="kalimah"
                      value={transliteration}
                      onChange={(e) => setTransliteration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="meaning" className="text-sm font-medium mb-2 block">
                      Meaning *
                    </label>
                    <Input
                      id="meaning"
                      placeholder="word"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="example" className="text-sm font-medium mb-2 block">
                      Example Usage
                    </label>
                    <Input
                      id="example"
                      placeholder="Example sentence or phrase"
                      value={example}
                      onChange={(e) => setExample(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={adding || !arabicText.trim() || !meaning.trim()}>
                    {adding ? 'Adding...' : 'Add Word'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Words List */}
      {items.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl">
          <h3 className="text-lg font-semibold mb-2">No Words Yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first Arabic word to start building your vocabulary
          </p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Word
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-3xl font-arabic" dir="rtl">
                      {item.arabicText}
                    </h3>
                    {item.transliteration && (
                      <span className="text-sm text-muted-foreground italic">
                        {item.transliteration}
                      </span>
                    )}
                  </div>

                  <p className="text-lg font-semibold mb-2">{item.meaning}</p>

                  {item.example && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Example:</span> {item.example}
                    </p>
                  )}

                  {item.root && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Root:</span>{' '}
                      <span className="font-arabic">{item.root.root}</span> - {item.root.meaning}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${item.mastery}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.mastery}% mastered
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <RotateCcw className="h-3 w-3" />
                      Reviewed {item.reviewCount} times
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
