// components/corpus/CorpusAnalytics.tsx
'use client';

import { useEffect, useState } from 'react';

interface CorpusStatistics {
  totalWords: number;
  totalUniqueRoots: number;
  wordsWithMorphology: number;
  wordsWithGrammar: number;
  morphologyCoverage: number;
  grammarCoverage: number;
}

interface RootData {
  root: string;
  rootSimple: string;
  meaning: string;
  occurrences: number;
}

interface POSData {
  partOfSpeech: string;
  count: number;
}

interface VerbFormData {
  form: string;
  count: number;
}

interface GenderData {
  gender: string;
  count: number;
}

interface NumberData {
  number: string;
  count: number;
}

interface PatternData {
  pattern: string;
  arabicPattern: string;
  count: number;
}

interface CorpusData {
  statistics: CorpusStatistics;
  topRoots: RootData[];
  partOfSpeech: POSData[];
  verbForms: VerbFormData[];
  genderDistribution: GenderData[];
  numberDistribution: NumberData[];
  topPatterns: PatternData[];
}

export default function CorpusAnalytics() {
  const [data, setData] = useState<CorpusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/corpus');
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load corpus data');
        }
      } catch (err) {
        console.error('Error fetching corpus analytics:', err);
        setError('Network error while loading corpus data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading corpus analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Corpus Data</h3>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <p className="text-xs text-muted-foreground mt-2">
          This feature requires corpus data to be populated in the database.
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const maxRootCount = data.topRoots[0]?.occurrences || 1;
  const maxPOSCount = data.partOfSpeech[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Words"
          value={data.statistics.totalWords.toLocaleString()}
          icon="🔤"
          description="Words in the Quran"
        />
        <StatCard
          title="Unique Roots"
          value={data.statistics.totalUniqueRoots.toLocaleString()}
          icon="🌱"
          description="Arabic root words"
        />
        <StatCard
          title="Morphology Coverage"
          value={`${data.statistics.morphologyCoverage}%`}
          icon="📊"
          description={`${data.statistics.wordsWithMorphology.toLocaleString()} words analyzed`}
        />
      </div>

      {/* Top Roots */}
      <div className="content-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Most Frequent Arabic Roots</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Top 20 root words by occurrence in the Quran
        </p>
        <div className="space-y-3">
          {data.topRoots.map((root, idx) => {
            const percentage = (root.occurrences / maxRootCount) * 100;
            const colors = [
              'from-blue-500 to-cyan-600',
              'from-green-500 to-emerald-600',
              'from-purple-500 to-violet-600',
              'from-orange-500 to-amber-600',
              'from-pink-500 to-rose-600',
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <div key={idx} className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 text-center flex-shrink-0">
                    <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                  </div>
                  <div className="w-32 flex-shrink-0">
                    <p className="text-lg font-arabic" dir="rtl">{root.root}</p>
                    <p className="text-xs text-muted-foreground truncate">{root.meaning}</p>
                  </div>
                  <div className="flex-1">
                    <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out flex items-center justify-end pr-3`}
                        style={{ width: `${percentage}%`, minWidth: '50px' }}
                      >
                        <span className="text-white font-bold text-sm drop-shadow-lg">
                          {root.occurrences.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part of Speech Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="content-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Part of Speech Distribution</h2>
          <div className="space-y-3">
            {data.partOfSpeech.map((pos, idx) => {
              const percentage = (pos.count / maxPOSCount) * 100;
              return (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{pos.partOfSpeech}</span>
                    <span className="text-sm text-muted-foreground">
                      {pos.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verb Forms */}
        {data.verbForms.length > 0 && (
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Verb Form Distribution</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Arabic verb forms (Forms I-X)
            </p>
            <div className="space-y-2">
              {data.verbForms.map((form, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                >
                  <div>
                    <p className="font-semibold">Form {form.form}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {form.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grammar Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gender Distribution */}
        {data.genderDistribution.length > 0 && (
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Gender</h2>
            <div className="space-y-3">
              {data.genderDistribution.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{item.gender}</span>
                  <span className="text-lg font-bold text-primary">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Number Distribution */}
        {data.numberDistribution.length > 0 && (
          <div className="content-card p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Number</h2>
            <div className="space-y-3">
              {data.numberDistribution.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{item.number}</span>
                  <span className="text-lg font-bold text-primary">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coverage Stats */}
        <div className="content-card p-6 rounded-2xl">
          <h2 className="text-lg font-bold mb-4">Analysis Coverage</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Morphology</span>
                <span className="text-sm font-bold text-primary">
                  {data.statistics.morphologyCoverage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                  style={{ width: `${data.statistics.morphologyCoverage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Grammar</span>
                <span className="text-sm font-bold text-primary">
                  {data.statistics.grammarCoverage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600"
                  style={{ width: `${data.statistics.grammarCoverage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Morphological Patterns */}
      {data.topPatterns.length > 0 && (
        <div className="content-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Most Common Morphological Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.topPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20"
              >
                <p className="text-lg font-arabic mb-1" dir="rtl">
                  {pattern.arabicPattern || pattern.pattern}
                </p>
                <p className="text-xs text-muted-foreground mb-2">{pattern.pattern}</p>
                <p className="text-lg font-bold text-primary">
                  {pattern.count.toLocaleString()} words
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: string;
  description?: string;
}) {
  return (
    <div className="content-card p-6 rounded-2xl">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
