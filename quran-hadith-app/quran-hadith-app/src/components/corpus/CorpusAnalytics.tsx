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

interface WordData {
  id: number;
  arabic: string;
  simplified: string;
  transliteration: string | null;
  translation: string | null;
  root: {
    root: string;
    meaning: string;
  } | null;
  location: {
    surah: number;
    surahName: string;
    ayah: number;
    position: number;
  };
  grammar: {
    pos: string;
    form: string | null;
    gender: string | null;
    number: string | null;
    person: string | null;
    tense: string | null;
    mood: string | null;
    case: string | null;
  } | null;
  morphology: {
    stem: string;
    lemma: string;
    prefix: string | null;
    suffix: string | null;
  } | null;
}

export default function CorpusAnalytics() {
  const [data, setData] = useState<CorpusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalWords, setModalWords] = useState<WordData[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');

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

  const fetchWords = async (type: string, value: string, title: string, subtitle: string) => {
    setModalTitle(title);
    setModalSubtitle(subtitle);
    setModalOpen(true);
    setModalLoading(true);
    setModalWords([]);

    try {
      const response = await fetch(
        `/api/analytics/corpus/words?type=${encodeURIComponent(type)}&value=${encodeURIComponent(value)}&limit=50`
      );
      const result = await response.json();

      if (result.success) {
        setModalWords(result.data.words);
      } else {
        console.error('Error fetching words:', result.error);
      }
    } catch (err) {
      console.error('Error fetching words:', err);
    } finally {
      setModalLoading(false);
    }
  };

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
          Top 20 root words by occurrence in the Quran (click to see words)
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
              <div
                key={idx}
                className="group cursor-pointer"
                onClick={() =>
                  fetchWords(
                    'root',
                    root.root,
                    `Root: ${root.root}`,
                    `${root.meaning} • ${root.occurrences.toLocaleString()} occurrences`
                  )
                }
              >
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
                        className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out flex items-center justify-end pr-3 group-hover:opacity-90`}
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
          <p className="text-xs text-muted-foreground mb-4">Click to see words</p>
          <div className="space-y-3">
            {data.partOfSpeech.map((pos, idx) => {
              const percentage = (pos.count / maxPOSCount) * 100;
              return (
                <div
                  key={idx}
                  className="cursor-pointer bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/50 p-2 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 z-[1000] relative transition-all duration-300 ease-in-out hover:scale-[1.02]"
                  onClick={() =>
                    fetchWords('pos', pos.partOfSpeech, `Part of Speech: ${pos.partOfSpeech}`, `${pos.count.toLocaleString()} words`)
                  }
                  style={{
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}
                >
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
              Arabic verb forms (Forms I-X) - Click to see words
            </p>
            <div className="space-y-2">
              {data.verbForms.map((form, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-green-50/80 dark:bg-green-900/30 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 z-[1000] relative transition-all duration-300 ease-in-out hover:scale-[1.02]"
                  onClick={() =>
                    fetchWords('form', form.form, `Verb Form ${form.form}`, `${form.count.toLocaleString()} words`)
                  }
                  style={{
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}
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
            <p className="text-xs text-muted-foreground mb-3">Click to see words</p>
            <div className="space-y-3">
              {data.genderDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center cursor-pointer bg-purple-50/80 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 p-2 border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 z-[1000] relative transition-all duration-300 ease-in-out hover:scale-[1.02]"
                  onClick={() =>
                    fetchWords('gender', item.gender, `Gender: ${item.gender}`, `${item.count.toLocaleString()} words`)
                  }
                  style={{
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}
                >
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
            <p className="text-xs text-muted-foreground mb-3">Click to see words</p>
            <div className="space-y-3">
              {data.numberDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center cursor-pointer bg-orange-50/80 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 p-2 border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 z-[1000] relative transition-all duration-300 ease-in-out hover:scale-[1.02]"
                  onClick={() =>
                    fetchWords('number', item.number, `Number: ${item.number}`, `${item.count.toLocaleString()} words`)
                  }
                  style={{
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}
                >
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

      {/* Words Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ease-in-out"
          onClick={() => setModalOpen(false)}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <div
            className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{modalTitle}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{modalSubtitle}</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out"
                  style={{ borderRadius: '12px' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
              {modalLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : modalWords.length === 0 ? (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No words found
                </div>
              ) : (
                <div className="space-y-4">
                  {modalWords.map((word) => (
                    <div
                      key={word.id}
                      className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:scale-[1.01]"
                      style={{
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Arabic Word */}
                        <div className="flex-shrink-0">
                          <p className="text-3xl font-arabic mb-1 text-gray-900 dark:text-white" dir="rtl">
                            {word.arabic}
                          </p>
                          {word.transliteration && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{word.transliteration}</p>
                          )}
                        </div>

                        {/* Word Details */}
                        <div className="flex-1 min-w-0">
                          {/* Location */}
                          <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            {word.location.surahName} {word.location.surah}:{word.location.ayah} (Word {word.location.position})
                          </p>

                          {/* Translation */}
                          {word.translation && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{word.translation}</p>
                          )}

                          {/* Root */}
                          {word.root && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 font-medium" style={{ borderRadius: '12px' }}>
                                Root: <span className="font-arabic">{word.root.root}</span>
                              </span>
                              {word.root.meaning && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">({word.root.meaning})</span>
                              )}
                            </div>
                          )}

                          {/* Grammar */}
                          {word.grammar && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 font-medium" style={{ borderRadius: '12px' }}>
                                {word.grammar.pos}
                              </span>
                              {word.grammar.form && (
                                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 font-medium" style={{ borderRadius: '12px' }}>
                                  Form {word.grammar.form}
                                </span>
                              )}
                              {word.grammar.gender && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 font-medium" style={{ borderRadius: '12px' }}>
                                  {word.grammar.gender}
                                </span>
                              )}
                              {word.grammar.number && (
                                <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 font-medium" style={{ borderRadius: '12px' }}>
                                  {word.grammar.number}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Morphology */}
                          {word.morphology && (word.morphology.prefix || word.morphology.suffix) && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {word.morphology.prefix && <span>Prefix: {word.morphology.prefix} • </span>}
                              {word.morphology.stem && <span>Stem: {word.morphology.stem}</span>}
                              {word.morphology.suffix && <span> • Suffix: {word.morphology.suffix}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">
              Showing {modalWords.length} word{modalWords.length !== 1 ? 's' : ''}
            </div>
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
