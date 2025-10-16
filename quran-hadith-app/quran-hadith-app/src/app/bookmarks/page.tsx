'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookMarked,
  BookOpen,
  Library,
  Heart,
  Loader2,
  Trash2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AyahBookmark {
  id: string;
  createdAt: string;
  note: string | null;
  ayah: {
    ayahNumber: number;
    surah: {
      nameEnglish: string;
      number: number;
    };
    translations: Array<{
      text: string;
    }>;
  };
}

interface HadithBookmark {
  id: string;
  createdAt: string;
  note: string | null;
  hadith: {
    textEnglish: string;
    textArabic?: string;
    chapter: {
      nameEnglish: string;
      number: number;
    };
    book: {
      name: string;
      slug: string;
    };
  };
}

interface DuaBookmark {
  id: string;
  createdAt: string;
  note: string | null;
  dua: {
    title: string;
    textEnglish: string;
    textArabic: string;
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ayahBookmarks, setAyahBookmarks] = useState<AyahBookmark[]>([]);
  const [hadithBookmarks, setHadithBookmarks] = useState<HadithBookmark[]>([]);
  const [duaBookmarks, setDuaBookmarks] = useState<DuaBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/bookmarks');
    } else if (status === 'authenticated') {
      fetchBookmarks();
    }
  }, [status, router]);

  const fetchBookmarks = async () => {
    try {
      if (!session?.user?.id) return;

      const [ayahRes, hadithRes, duaRes] = await Promise.all([
        fetch(`/api/bookmarks/ayah?userId=${session.user.id}`),
        fetch(`/api/bookmarks/hadith?userId=${session.user.id}`),
        fetch(`/api/bookmarks/dua?userId=${session.user.id}`),
      ]);

      if (ayahRes.ok) {
        const data = await ayahRes.json();
        setAyahBookmarks(data.bookmarks || []);
      }

      if (hadithRes.ok) {
        const data = await hadithRes.json();
        setHadithBookmarks(data.bookmarks || []);
      }

      if (duaRes.ok) {
        const data = await duaRes.json();
        setDuaBookmarks(data.bookmarks || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAyahBookmark = async (ayahId: number) => {
    try {
      const response = await fetch('/api/bookmarks/ayah', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          ayahId: ayahId.toString(),
        }),
      });

      if (response.ok) {
        setAyahBookmarks((prev) =>
          prev.filter((b) => b.ayah.ayahNumber !== ayahId)
        );
      }
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const totalBookmarks = ayahBookmarks.length + hadithBookmarks.length + duaBookmarks.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
            <BookMarked className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold">My Bookmarks</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          View and manage all your saved content
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 glass-card">
          <p className="text-sm text-muted-foreground mb-1">Total Bookmarks</p>
          <p className="text-3xl font-bold gradient-text">{totalBookmarks}</p>
        </Card>
        <Card className="p-6 glass-card">
          <p className="text-sm text-muted-foreground mb-1">Quran Ayahs</p>
          <p className="text-3xl font-bold gradient-text">{ayahBookmarks.length}</p>
        </Card>
        <Card className="p-6 glass-card">
          <p className="text-sm text-muted-foreground mb-1">Hadiths</p>
          <p className="text-3xl font-bold gradient-text">{hadithBookmarks.length}</p>
        </Card>
        <Card className="p-6 glass-card">
          <p className="text-sm text-muted-foreground mb-1">Duas</p>
          <p className="text-3xl font-bold gradient-text">{duaBookmarks.length}</p>
        </Card>
      </div>

      {/* Bookmarks Tabs */}
      <Tabs defaultValue="ayahs" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
          <TabsTrigger value="ayahs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Ayahs ({ayahBookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="hadiths" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Hadiths ({hadithBookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="duas" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Duas ({duaBookmarks.length})
          </TabsTrigger>
        </TabsList>

        {/* Ayahs Tab */}
        <TabsContent value="ayahs">
          {ayahBookmarks.length > 0 ? (
            <div className="space-y-4">
              {ayahBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {bookmark.ayah.surah.nameEnglish}{' '}
                        {bookmark.ayah.surah.number}:{bookmark.ayah.ayahNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/quran/${bookmark.ayah.surah.number}#ayah-${bookmark.ayah.ayahNumber}`}
                      >
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteAyahBookmark(bookmark.ayah.ayahNumber)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {bookmark.ayah.translations[0]?.text || 'No translation available'}
                  </p>
                  {bookmark.note && (
                    <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-primary font-semibold mb-1">
                        Your Note:
                      </p>
                      <p className="text-sm">{bookmark.note}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 glass-card text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No Quran bookmarks yet</p>
              <Link href="/quran">
                <Button>Start Reading Quran</Button>
              </Link>
            </Card>
          )}
        </TabsContent>

        {/* Hadiths Tab */}
        <TabsContent value="hadiths">
          {hadithBookmarks.length > 0 ? (
            <div className="space-y-4">
              {hadithBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {bookmark.hadith.book.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Chapter {bookmark.hadith.chapter.number}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {bookmark.hadith.textEnglish}
                  </p>
                  {bookmark.note && (
                    <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-primary font-semibold mb-1">
                        Your Note:
                      </p>
                      <p className="text-sm">{bookmark.note}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 glass-card text-center">
              <Library className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No Hadith bookmarks yet</p>
              <Link href="/hadith">
                <Button>Browse Hadiths</Button>
              </Link>
            </Card>
          )}
        </TabsContent>

        {/* Duas Tab */}
        <TabsContent value="duas">
          {duaBookmarks.length > 0 ? (
            <div className="space-y-4">
              {duaBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {bookmark.dua.category.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/duas/${bookmark.dua.category.slug}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{bookmark.dua.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {bookmark.dua.textEnglish}
                  </p>
                  {bookmark.note && (
                    <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-primary font-semibold mb-1">
                        Your Note:
                      </p>
                      <p className="text-sm">{bookmark.note}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 glass-card text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No Dua bookmarks yet</p>
              <Link href="/duas">
                <Button>Learn Duas</Button>
              </Link>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
