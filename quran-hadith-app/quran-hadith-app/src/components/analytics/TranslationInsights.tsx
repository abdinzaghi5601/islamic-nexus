'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TranslationInsightsData {
  translators: Array<{
    name: string;
    language: string;
    translationCount: number;
  }>;
  scholarlydiversity: {
    ayahsWithMultipleTranslations: number;
    topDivergeAyahs: Array<{
      surah: number;
      ayah: number;
      translationCount: number;
    }>;
  };
  keyTerms: Array<{
    term: string;
    occurrences: number;
  }>;
  prophets: Array<{
    name: string;
    mentions: number;
    ayahReferences: Array<{ surah: number; ayah: number }>;
    scholaryNote: string;
  }>;
}

export default function TranslationInsights() {
  const [data, setData] = useState<TranslationInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics/translation-insights');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching translation insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading translation insights...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          {error || 'Failed to load translation insights'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Translation Insights</h2>
        <p className="text-muted-foreground">
          Analysis of Quranic translations cross-referenced with scholarly interpretations
        </p>
      </div>

      {/* Translators Overview */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Available Translations</CardTitle>
          <CardDescription>Translation coverage in the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.translators.map((translator, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-semibold">{translator.name}</p>
                  <p className="text-sm text-muted-foreground">{translator.language}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {translator.translationCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">verses</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prophet Mentions with Scholarly Notes */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Prophet Mentions (Scholarly Analysis)</CardTitle>
          <CardDescription>
            Prophets mentioned in translations with insights from Sahih hadith and Salaf scholars
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.prophets.map((prophet, idx) => {
              const maxMentions = data.prophets[0]?.mentions || 1;
              const percentage = (prophet.mentions / maxMentions) * 100;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{prophet.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {prophet.mentions} mentions across{' '}
                        {prophet.ayahReferences.length} ayahs
                      </p>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {prophet.mentions}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                      style={{ width: `${percentage}%`, minWidth: '60px' }}
                    />
                  </div>

                  {/* Scholarly note */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <span className="font-semibold">📖 Scholarly Note:</span>{' '}
                      {prophet.scholaryNote}
                    </p>
                  </div>

                  {/* Sample ayah references */}
                  {prophet.ayahReferences.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {prophet.ayahReferences.slice(0, 3).map((ref, refIdx) => (
                        <a
                          key={refIdx}
                          href={`/quran/${ref.surah}#ayah-${ref.ayah}`}
                          className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-full text-xs font-medium transition-colors"
                        >
                          {ref.surah}:{ref.ayah}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Islamic Terms */}
      <Card>
        <CardHeader>
          <CardTitle>🔤 Key Islamic Terms Frequency</CardTitle>
          <CardDescription>
            Most frequently occurring terms in translations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.keyTerms.slice(0, 12).map((term, idx) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 text-center"
              >
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {term.term}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {term.occurrences.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scholarly Diversity */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Scholarly Diversity</CardTitle>
          <CardDescription>
            Ayahs with multiple translations showing interpretative diversity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">
              Total ayahs with multiple translations:
            </p>
            <p className="text-3xl font-bold text-primary">
              {data.scholarlydiversity.ayahsWithMultipleTranslations}
            </p>
          </div>

          {data.scholarlydiversity.topDivergeAyahs.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-3">
                Top ayahs with most translation variations:
              </p>
              <div className="space-y-2">
                {data.scholarlydiversity.topDivergeAyahs.map((ayah, idx) => (
                  <a
                    key={idx}
                    href={`/quran/${ayah.surah}#ayah-${ayah.ayah}`}
                    className="flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    <span className="font-medium">
                      Surah {ayah.surah}, Ayah {ayah.ayah}
                    </span>
                    <span className="text-primary font-bold">
                      {ayah.translationCount} translations
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Methodology Note */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-amber-600 dark:text-amber-400">
            ℹ️ Methodology Note
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Sources:</strong> Analysis based on authentic English translations of the
            Quran, cross-referenced with:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Sahih Hadith collections (Bukhari, Muslim, etc.)</li>
            <li>Classical tafsir by Salaf scholars (Ibn Kathir, Tabari, etc.)</li>
            <li>Contemporary scholarly interpretations</li>
          </ul>
          <p className="pt-2">
            <strong>Note:</strong> Scholarly notes represent consensus views from classical and
            contemporary Islamic scholarship. Always consult qualified scholars for detailed
            understanding.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
