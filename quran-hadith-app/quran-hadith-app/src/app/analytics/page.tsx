// app/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/tabs';

interface OverviewData {
  totals: {
    surahs: number;
    ayahs: number;
    uniqueWords: number;
    totalWords: number;
  };
  revelation: {
    meccan: { surahs: number; ayahs: number };
    medinan: { surahs: number; ayahs: number };
  };
  longestSurahs: Array<{ name: string; arabic: string; number: number; ayahs: number }>;
  shortestSurahs: Array<{ name: string; arabic: string; number: number; ayahs: number }>;
}

interface ProphetData {
  prophets: Array<{
    key: string;
    name: string;
    nameArabic: string;
    mentions: number;
    surahsAppearing: number;
    taggedAyahs: number;
    relatedTopics: string[];
  }>;
  summary: {
    totalProphets: number;
    totalMentions: number;
    avgMentions: number;
    mostMentioned: { name: string; nameArabic: string; mentions: number };
    leastMentioned: { name: string; nameArabic: string; mentions: number };
  };
  topProphets: Array<any>;
}

interface ThemeData {
  themes: Array<{
    id: number;
    name: string;
    nameArabic: string;
    ayahCount: number;
    subThemeCount: number;
    subThemes: Array<{ name: string; ayahCount: number }>;
  }>;
  statistics: {
    totalMainThemes: number;
    totalSubThemes: number;
    totalAyahsTagged: number;
    avgAyahsPerTheme: number;
  };
  topThemes: Array<any>;
}

interface WordData {
  topConcepts: Array<{
    word: string;
    wordArabic: string;
    count: number;
    category: string;
  }>;
  categoryDistribution: Array<{
    category: string;
    totalMentions: number;
    uniqueWords: number;
  }>;
  statistics: {
    totalMentions: number;
    uniqueConcepts: number;
    mostMentionedWord: { word: string; wordArabic: string; count: number };
  };
}

interface StatisticsData {
  quranStructure: {
    totalSurahs: number;
    totalAyahs: number;
    totalWords: number;
    totalLetters: number;
    totalUniqueWords: number;
    totalJuz: number;
  };
  surahStats: {
    avgAyahsPerSurah: number;
    longestSurah: { name: string; nameArabic: string; ayahs: number };
    shortestSurah: { name: string; nameArabic: string; ayahs: number };
  };
  revelation: {
    meccan: { surahs: number; ayahs: number; percentage: number };
    medinan: { surahs: number; ayahs: number; percentage: number };
  };
  interestingFacts: Array<{ fact: string; value: string; category: string }>;
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [prophets, setProphets] = useState<ProphetData | null>(null);
  const [themes, setThemes] = useState<ThemeData | null>(null);
  const [words, setWords] = useState<WordData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, prophetsRes, themesRes, wordsRes, statsRes] = await Promise.all([
          fetch('/api/analytics/overview'),
          fetch('/api/analytics/prophets'),
          fetch('/api/analytics/themes'),
          fetch('/api/analytics/words'),
          fetch('/api/analytics/statistics'),
        ]);

        const [overviewData, prophetsData, themesData, wordsData, statsData] = await Promise.all([
          overviewRes.json(),
          prophetsRes.json(),
          themesRes.json(),
          wordsRes.json(),
          statsRes.json(),
        ]);

        if (overviewData.success) setOverview(overviewData.data);
        if (prophetsData.success) setProphets(prophetsData.data);
        if (themesData.success) setThemes(themesData.data);
        if (wordsData.success) setWords(wordsData.data);
        if (statsData.success) setStatistics(statsData.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Quran Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Explore comprehensive insights and statistics from the Holy Quran
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex flex-wrap gap-2 border-b pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'statistics', label: 'Statistics', icon: '📈' },
          { id: 'prophets', label: 'Prophets', icon: '👥' },
          { id: 'themes', label: 'Themes', icon: '📚' },
          { id: 'words', label: 'Word Analysis', icon: '🔤' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Surahs" value={overview.totals.surahs} icon="📖" />
            <StatCard title="Total Ayahs" value={overview.totals.ayahs.toLocaleString()} icon="📝" />
            <StatCard title="Total Words" value={overview.totals.totalWords.toLocaleString()} icon="🔤" />
            <StatCard title="Unique Words" value={overview.totals.uniqueWords.toLocaleString()} icon="✨" />
          </div>

          {/* Revelation Distribution */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Revelation Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">Meccan</h3>
                <p className="text-3xl font-bold mb-1">{overview.revelation.meccan.surahs} Surahs</p>
                <p className="text-muted-foreground">{overview.revelation.meccan.ayahs.toLocaleString()} Ayahs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">Medinan</h3>
                <p className="text-3xl font-bold mb-1">{overview.revelation.medinan.surahs} Surahs</p>
                <p className="text-muted-foreground">{overview.revelation.medinan.ayahs.toLocaleString()} Ayahs</p>
              </div>
            </div>
          </div>

          {/* Longest & Shortest Surahs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="content-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Longest Surahs</h2>
              <div className="space-y-2">
                {overview.longestSurahs.slice(0, 5).map((surah, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-semibold">{surah.number}. {surah.name}</p>
                      <p className="text-sm text-muted-foreground font-arabic" dir="rtl">{surah.arabic}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">{surah.ayahs}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Shortest Surahs</h2>
              <div className="space-y-2">
                {overview.shortestSurahs.slice(0, 5).map((surah, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-semibold">{surah.number}. {surah.name}</p>
                      <p className="text-sm text-muted-foreground font-arabic" dir="rtl">{surah.arabic}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">{surah.ayahs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'statistics' && statistics && (
        <div className="space-y-6">
          {/* Quran Structure */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Quran Structure</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MiniStatCard label="Surahs" value={statistics.quranStructure.totalSurahs} />
              <MiniStatCard label="Ayahs" value={statistics.quranStructure.totalAyahs.toLocaleString()} />
              <MiniStatCard label="Words" value={statistics.quranStructure.totalWords.toLocaleString()} />
              <MiniStatCard label="Letters" value={statistics.quranStructure.totalLetters.toLocaleString()} />
              <MiniStatCard label="Juz" value={statistics.quranStructure.totalJuz} />
              <MiniStatCard label="Unique Words" value={statistics.quranStructure.totalUniqueWords.toLocaleString()} />
            </div>
          </div>

          {/* Surah Statistics */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Surah Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Longest Surah</h3>
                <p className="text-2xl font-bold">{statistics.surahStats.longestSurah.name}</p>
                <p className="text-sm font-arabic" dir="rtl">{statistics.surahStats.longestSurah.nameArabic}</p>
                <p className="text-primary font-bold mt-2">{statistics.surahStats.longestSurah.ayahs} Ayahs</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Shortest Surah</h3>
                <p className="text-2xl font-bold">{statistics.surahStats.shortestSurah.name}</p>
                <p className="text-sm font-arabic" dir="rtl">{statistics.surahStats.shortestSurah.nameArabic}</p>
                <p className="text-primary font-bold mt-2">{statistics.surahStats.shortestSurah.ayahs} Ayahs</p>
              </div>
            </div>
          </div>

          {/* Interesting Facts */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Interesting Facts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.interestingFacts.map((fact, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">{fact.fact}</p>
                  <p className="text-lg font-bold text-primary">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prophets Tab */}
      {activeTab === 'prophets' && prophets && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Prophets" value={prophets.summary.totalProphets} icon="👥" />
            <StatCard title="Total Mentions" value={prophets.summary.totalMentions.toLocaleString()} icon="📊" />
            <StatCard title="Avg Mentions" value={prophets.summary.avgMentions} icon="📈" />
            <StatCard
              title="Most Mentioned"
              value={prophets.summary.mostMentioned.name}
              subtitle={`${prophets.summary.mostMentioned.mentions} times`}
              icon="⭐"
            />
          </div>

          {/* Prophet Name Frequency Chart */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-2">Frequency of Prophet Names in Quran</h2>
            <p className="text-sm text-muted-foreground mb-6">Distribution of prophet mentions across all 114 surahs</p>

            <div className="space-y-3">
              {prophets.prophets.map((prophet, idx) => {
                const maxMentions = prophets.summary.mostMentioned.mentions;
                const percentage = (prophet.mentions / maxMentions) * 100;

                // Color palette inspired by seaborn 'husl'
                const colors = [
                  'from-rose-500 to-pink-600',
                  'from-orange-500 to-amber-600',
                  'from-yellow-500 to-lime-600',
                  'from-green-500 to-emerald-600',
                  'from-teal-500 to-cyan-600',
                  'from-blue-500 to-indigo-600',
                  'from-violet-500 to-purple-600',
                  'from-fuchsia-500 to-pink-600',
                ];
                const colorClass = colors[idx % colors.length];

                return (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-32 flex-shrink-0">
                        <p className="text-sm font-medium truncate">{prophet.name}</p>
                        <p className="text-xs font-arabic text-muted-foreground" dir="rtl">{prophet.nameArabic}</p>
                      </div>
                      <div className="flex-1">
                        <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out flex items-center justify-end pr-3`}
                            style={{ width: `${percentage}%`, minWidth: prophet.mentions > 0 ? '40px' : '0' }}
                          >
                            <span className="text-white font-bold text-sm drop-shadow-lg">
                              {prophet.mentions}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-24 text-right flex-shrink-0">
                        <p className="text-sm text-muted-foreground">
                          {prophet.surahsAppearing} surah{prophet.surahsAppearing !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                * Counts may vary based on different translations and interpretations
              </p>
            </div>
          </div>

          {/* Top Prophets Detailed Analysis */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Detailed Prophet Analysis</h2>
            <div className="space-y-3">
              {prophets.topProphets.map((prophet, idx) => (
                <div key={idx} className="p-4 bg-secondary rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{prophet.name}</h3>
                      <p className="text-sm font-arabic text-muted-foreground" dir="rtl">{prophet.nameArabic}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{prophet.mentions}</p>
                      <p className="text-xs text-muted-foreground">mentions</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📖 {prophet.surahsAppearing} Surahs</span>
                    {prophet.taggedAyahs > 0 && <span>🏷️ {prophet.taggedAyahs} Tagged Ayahs</span>}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60"
                      style={{ width: `${(prophet.mentions / prophets.summary.mostMentioned.mentions) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Themes Tab */}
      {activeTab === 'themes' && themes && (
        <div className="space-y-6">
          {/* Theme Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Main Themes" value={themes.statistics.totalMainThemes} icon="📚" />
            <StatCard title="Sub-Themes" value={themes.statistics.totalSubThemes} icon="📖" />
            <StatCard title="Tagged Ayahs" value={themes.statistics.totalAyahsTagged.toLocaleString()} icon="🏷️" />
            <StatCard title="Avg per Theme" value={themes.statistics.avgAyahsPerTheme} icon="📊" />
          </div>

          {/* Top Themes */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Theme Distribution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {themes.topThemes.map((theme, idx) => (
                <div key={idx} className="p-4 bg-secondary rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{theme.name}</h3>
                      <p className="text-sm font-arabic text-muted-foreground" dir="rtl">{theme.nameArabic}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{theme.ayahCount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{theme.description}</p>
                  {theme.subThemeCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {theme.subThemeCount} sub-theme{theme.subThemeCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Words Tab */}
      {activeTab === 'words' && words && (
        <div className="space-y-6">
          {/* Word Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Mentions" value={words.statistics.totalMentions.toLocaleString()} icon="🔢" />
            <StatCard title="Unique Concepts" value={words.statistics.uniqueConcepts} icon="💡" />
            <StatCard
              title="Most Mentioned"
              value={words.statistics.mostMentionedWord.word}
              subtitle={`${words.statistics.mostMentionedWord.count} times`}
              icon="⭐"
            />
          </div>

          {/* Category Distribution */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Concept Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.categoryDistribution.map((cat, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">{cat.category}</h3>
                  <p className="text-2xl font-bold text-primary">{cat.totalMentions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{cat.uniqueWords} unique words</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Concepts */}
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Most Mentioned Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {words.topConcepts.map((concept, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-semibold">{concept.word}</p>
                    <p className="text-sm font-arabic text-muted-foreground" dir="rtl">{concept.wordArabic}</p>
                    <p className="text-xs text-muted-foreground">{concept.category}</p>
                  </div>
                  <span className="text-xl font-bold text-primary">{concept.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
}) {
  return (
    <div className="content-card p-6 rounded-2xl">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

// Mini Stat Card Component
function MiniStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-secondary rounded-lg text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
