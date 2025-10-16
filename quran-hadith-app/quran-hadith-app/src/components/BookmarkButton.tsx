'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookmarkPlus, Bookmark, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface BookmarkButtonProps {
  ayahId: number;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showLabel?: boolean;
}

export default function BookmarkButton({
  ayahId,
  variant = 'ghost',
  size = 'icon',
  className = '',
  showLabel = false,
}: BookmarkButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [note, setNote] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if ayah is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/bookmarks/ayah');
          if (response.ok) {
            const data = await response.json();
            const bookmark = data.bookmarks.find(
              (b: any) => b.ayahId === ayahId
            );
            setIsBookmarked(!!bookmark);
            if (bookmark) {
              setNote(bookmark.note || '');
            }
          }
        } catch (error) {
          console.error('Error checking bookmark:', error);
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    checkBookmark();
  }, [ayahId, status, session]);

  const handleBookmark = async () => {
    if (status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/ayah?ayahId=${ayahId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsBookmarked(false);
          setNote('');
          setDialogOpen(false);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to remove bookmark');
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks/ayah', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ayahId,
            note: note.trim() || null,
          }),
        });

        if (response.ok) {
          setIsBookmarked(true);
          setDialogOpen(false);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to add bookmark');
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBookmark = async () => {
    if (status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isBookmarked) {
      // If already bookmarked, open dialog to edit note
      setDialogOpen(true);
    } else {
      // Quick bookmark without note
      setLoading(true);
      try {
        const response = await fetch('/api/bookmarks/ayah', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ayahId,
            note: null,
          }),
        });

        if (response.ok) {
          setIsBookmarked(true);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to add bookmark');
        }
      } catch (error) {
        console.error('Bookmark error:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (checking) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {showLabel && <span className="ml-2">Loading...</span>}
      </Button>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex items-center gap-2">
        {/* Quick bookmark button */}
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleQuickBookmark}
          disabled={loading}
          title={isBookmarked ? 'Edit bookmark' : 'Bookmark this ayah'}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBookmarked ? (
            <Bookmark className="h-4 w-4 fill-current" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
          {showLabel && (
            <span className="ml-2">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          )}
        </Button>

        {/* Dialog trigger for adding note */}
        {!isBookmarked && (
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              disabled={loading}
            >
              + Add Note
            </Button>
          </DialogTrigger>
        )}
      </div>

      {/* Bookmark Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isBookmarked ? 'Edit Bookmark' : 'Add Bookmark'}
          </DialogTitle>
          <DialogDescription>
            {isBookmarked
              ? 'Update your note or remove this bookmark'
              : 'Add a personal note to this ayah (optional)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Personal Note
            </label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your thoughts or reflection..."
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            {isBookmarked ? (
              <>
                <Button
                  onClick={handleBookmark}
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove Bookmark'
                  )}
                </Button>
                <Button
                  onClick={handleBookmark}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Note'
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleBookmark}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Bookmark'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
