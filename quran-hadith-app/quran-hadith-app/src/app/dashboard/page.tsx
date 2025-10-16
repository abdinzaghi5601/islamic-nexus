'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BookOpen,
  Library,
  Heart,
  TrendingUp,
  BookMarked,
  Clock,
  Award,
  Target,
  Activity,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DashboardStats {
  totalBookmarks: number;
  bookmarksCount: number;
  hadithBookmarksCount: number;
  duaBookmarksCount: number;
  readingHistoryCount: number;
}

interface ReadingStats {
  streak: number;
  todayReads: number;
  todayUniqueAyahs: number;
  totalUniqueAyahs: number;
  weeklyReads: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: string;
}

interface Bookmark {
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      if (!session?.user?.id) return;

      // Fetch all data in parallel
      const [statsRes, readingStatsRes, achievementsRes] = await Promise.all([
        fetch(`/api/dashboard/stats?userId=${session.user.id}`),
        fetch(`/api/reading-history/stats?userId=${session.user.id}`),
        fetch(`/api/achievements?userId=${session.user.id}`),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setRecentBookmarks(data.recentBookmarks || []);
      }

      if (readingStatsRes.ok) {
        const data = await readingStatsRes.json();
        setReadingStats(data);
      }

      if (achievementsRes.ok) {
        const data = await achievementsRes.json();
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {session.user.name || 'User'}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Continue your Islamic learning journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 glass-card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Bookmarks
              </p>
              <p className="text-3xl font-bold gradient-text">
                {stats?.totalBookmarks || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <BookMarked className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unique Ayahs</p>
              <p className="text-3xl font-bold gradient-text">
                {readingStats?.totalUniqueAyahs || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Reading Streak
              </p>
              <p className="text-3xl font-bold gradient-text">
                {readingStats?.streak || 0} {readingStats?.streak === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Achievements
              </p>
              <p className="text-3xl font-bold gradient-text">{achievements.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bookmarks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <BookMarked className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Recent Bookmarks</h2>
              </div>
            </div>

            {recentBookmarks.length > 0 ? (
              <div className="space-y-4">
                {recentBookmarks.map((bookmark) => (
                  <Link
                    key={bookmark.id}
                    href={`/quran/${bookmark.ayah.surah.number}#ayah-${bookmark.ayah.ayahNumber}`}
                    className="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {bookmark.ayah.surah.nameEnglish}{' '}
                        {bookmark.ayah.surah.number}:
                        {bookmark.ayah.ayahNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {bookmark.ayah.translations[0]?.text ||
                        'No translation available'}
                    </p>
                    {bookmark.note && (
                      <p className="text-xs text-primary mt-2 italic">
                        Note: {bookmark.note}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No bookmarks yet
                </p>
                <Link href="/quran">
                  <Button>Start Reading Quran</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Daily Goals */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Daily Goals</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Read 5 Ayahs Today
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.min(readingStats?.todayUniqueAyahs || 0, 5)}/5
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{
                      width: `${Math.min(((readingStats?.todayUniqueAyahs || 0) / 5) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Maintain Reading Streak
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {readingStats?.streak || 0} days
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style={{
                      width: `${Math.min(((readingStats?.streak || 0) / 7) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Total Bookmarks
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.totalBookmarks || 0}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-300"
                    style={{
                      width: `${Math.min(((stats?.totalBookmarks || 0) / 10) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/quran">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Reading Quran
                </Button>
              </Link>
              <Link href="/hadith">
                <Button className="w-full justify-start" variant="outline">
                  <Library className="h-4 w-4 mr-2" />
                  Browse Hadith
                </Button>
              </Link>
              <Link href="/duas">
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Learn Duas
                </Button>
              </Link>
              <Link href="/search">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Search Content
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Recent Activity</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          </div>

          {/* Achievements Preview */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-bold">Achievements</h3>
            </div>
            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {achievement.tier}
                    </Badge>
                  </div>
                ))}
                {achievements.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    +{achievements.length - 5} more achievements
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Start reading to unlock achievements!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
