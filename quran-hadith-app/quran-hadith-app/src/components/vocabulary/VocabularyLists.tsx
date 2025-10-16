'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Clock } from 'lucide-react';
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

interface VocabularyList {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function VocabularyLists() {
  const [lists, setLists] = useState<VocabularyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vocabulary/lists');

      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newListName.trim()) return;

    try {
      setCreating(true);
      const response = await fetch('/api/vocabulary/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription,
          isPublic: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      // Refresh lists
      await fetchLists();

      // Reset form and close dialog
      setNewListName('');
      setNewListDescription('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">Loading your vocabulary lists...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Create New List Button */}
      <div className="mb-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={createList}>
              <DialogHeader>
                <DialogTitle>Create Vocabulary List</DialogTitle>
                <DialogDescription>
                  Create a new list to organize and track your Arabic vocabulary learning
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label
                    htmlFor="listName"
                    className="text-sm font-medium mb-2 block"
                  >
                    List Name
                  </label>
                  <Input
                    id="listName"
                    placeholder="e.g., Surah Al-Fatiha Words"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="listDescription"
                    className="text-sm font-medium mb-2 block"
                  >
                    Description (Optional)
                  </label>
                  <Input
                    id="listDescription"
                    placeholder="Describe what this list is for"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating || !newListName.trim()}>
                  {creating ? 'Creating...' : 'Create List'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Vocabulary Lists Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first vocabulary list to start learning Arabic words
          </p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <Link key={list.id} href={`/vocabulary/${list.id}`}>
              <div className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {list.itemCount}
                    </div>
                    <div className="text-xs text-muted-foreground">words</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {list.name}
                </h3>

                {list.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {list.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated {new Date(list.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
