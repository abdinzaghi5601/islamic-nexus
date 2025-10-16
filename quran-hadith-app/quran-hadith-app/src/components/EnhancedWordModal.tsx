'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { BookOpen, Languages, Network, BookMarked, Text } from 'lucide-react';

interface WordAnalysis {
  word: {
    id: number;
    arabic: string;
    simplified: string;
    transliteration: string;
    position: number;
    ayah: {
      id: number;
      number: number;
      text: string;
      surah: {
        id: number;
        number: number;
        name: string;
        nameArabic: string;
        nameEnglish: string;
      };
    };
  };
  morphology: {
    stem: string;
    lemma: string;
    prefix: string | null;
    suffix: string | null;
    pattern: string | null;
    arabicPattern: string | null;
    englishPattern: string | null;
    aspects: string | null;
  } | null;
  grammar: {
    partOfSpeech: string;
    root: string | null;
    gender: string | null;
    number: string | null;
    person: string | null;
    case: string | null;
    state: string | null;
    mood: string | null;
    voice: string | null;
    form: string | null;
  } | null;
  root: {
    id: number;
    root: string;
    rootSimple: string;
    meaning: string;
    occurrences: number;
    examples: Array<{
      id: number;
      arabic: string;
      transliteration: string;
      surah: number;
      surahName: string;
      ayah: number;
    }>;
  } | null;
  dictionary: {
    arabic: string;
    root: string;
    definition: string;
    examples: string | null;
    partOfSpeech: string;
    usageNotes: string | null;
  } | null;
  verbConjugation: {
    form: string;
    tense: string;
    person: string;
    number: string;
    gender: string;
    conjugation: string;
  } | null;
  translations: Array<{
    id: number;
    text: string;
    language: string;
  }>;
}

interface EnhancedWordModalProps {
  wordId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EnhancedWordModal({
  wordId,
  open,
  onOpenChange,
}: EnhancedWordModalProps) {
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wordId && open) {
      fetchWordAnalysis(wordId);
    }
  }, [wordId, open]);

  const fetchWordAnalysis = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/words/${id}/analysis`);
      if (!response.ok) {
        throw new Error('Failed to fetch word analysis');
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching word analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Word Analysis
          </DialogTitle>
          <DialogDescription>
            Comprehensive linguistic analysis and morphological breakdown
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6">
            {/* Word Header */}
            <div className="text-center space-y-2 bg-muted/50 rounded-lg p-6">
              <div
                className="text-5xl font-arabic-uthmani mb-2"
                dir="rtl"
                lang="ar"
              >
                {analysis.word.arabic}
              </div>
              <div className="text-lg text-muted-foreground italic">
                {analysis.word.transliteration}
              </div>
              <div className="text-sm text-muted-foreground">
                Surah {analysis.word.ayah.surah.number} (
                {analysis.word.ayah.surah.nameEnglish}), Ayah{' '}
                {analysis.word.ayah.number}, Word {analysis.word.position}
              </div>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  <Text className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="morphology">
                  <BookMarked className="w-4 h-4 mr-2" />
                  Morphology
                </TabsTrigger>
                <TabsTrigger value="grammar">
                  <Languages className="w-4 h-4 mr-2" />
                  Grammar
                </TabsTrigger>
                <TabsTrigger value="root">
                  <Network className="w-4 h-4 mr-2" />
                  Root
                </TabsTrigger>
                <TabsTrigger value="examples">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Examples
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Part of Speech */}
                {analysis.grammar && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Part of Speech</h3>
                    <Badge variant="secondary" className="text-sm">
                      {analysis.grammar.partOfSpeech}
                    </Badge>
                  </Card>
                )}

                {/* Translations */}
                {analysis.translations.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Meaning</h3>
                    <div className="space-y-2">
                      {analysis.translations.map((t) => (
                        <div key={t.id} className="text-sm">
                          {t.text}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Dictionary Definition */}
                {analysis.dictionary && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Dictionary</h3>
                    <div className="space-y-2">
                      <p className="text-sm">{analysis.dictionary.definition}</p>
                      {analysis.dictionary.usageNotes && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {analysis.dictionary.usageNotes}
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Root Info */}
                {analysis.root && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Root</h3>
                    <div className="space-y-2">
                      <div
                        className="text-2xl font-arabic"
                        dir="rtl"
                        lang="ar"
                      >
                        {analysis.root.root}
                      </div>
                      {analysis.root.meaning && (
                        <p className="text-sm text-muted-foreground">
                          {analysis.root.meaning}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Appears {analysis.root.occurrences} times in the Quran
                      </p>
                    </div>
                  </Card>
                )}
              </TabsContent>

              {/* Morphology Tab */}
              <TabsContent value="morphology" className="space-y-4">
                {analysis.morphology ? (
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Stem</h3>
                        <div className="text-2xl font-arabic" dir="rtl" lang="ar">
                          {analysis.morphology.stem}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-2">Lemma (Base Form)</h3>
                        <div className="text-2xl font-arabic" dir="rtl" lang="ar">
                          {analysis.morphology.lemma}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        {analysis.morphology.prefix && (
                          <div>
                            <h3 className="font-semibold mb-2 text-sm">
                              Prefix
                            </h3>
                            <div className="text-xl font-arabic" dir="rtl" lang="ar">
                              {analysis.morphology.prefix}
                            </div>
                          </div>
                        )}

                        {analysis.morphology.suffix && (
                          <div>
                            <h3 className="font-semibold mb-2 text-sm">
                              Suffix
                            </h3>
                            <div className="text-xl font-arabic" dir="rtl" lang="ar">
                              {analysis.morphology.suffix}
                            </div>
                          </div>
                        )}
                      </div>

                      {analysis.morphology.pattern && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="font-semibold mb-2">Pattern</h3>
                            <div className="space-y-1">
                              {analysis.morphology.arabicPattern && (
                                <div className="text-xl font-arabic" dir="rtl" lang="ar">
                                  {analysis.morphology.arabicPattern}
                                </div>
                              )}
                              {analysis.morphology.englishPattern && (
                                <div className="text-sm text-muted-foreground">
                                  {analysis.morphology.englishPattern}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No morphological data available
                  </div>
                )}
              </TabsContent>

              {/* Grammar Tab */}
              <TabsContent value="grammar" className="space-y-4">
                {analysis.grammar ? (
                  <Card className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Part of Speech
                        </h3>
                        <p className="text-base">{analysis.grammar.partOfSpeech}</p>
                      </div>

                      {analysis.grammar.gender && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Gender
                          </h3>
                          <p className="text-base">{analysis.grammar.gender}</p>
                        </div>
                      )}

                      {analysis.grammar.number && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Number
                          </h3>
                          <p className="text-base">{analysis.grammar.number}</p>
                        </div>
                      )}

                      {analysis.grammar.person && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Person
                          </h3>
                          <p className="text-base">{analysis.grammar.person}</p>
                        </div>
                      )}

                      {analysis.grammar.case && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Case
                          </h3>
                          <p className="text-base">{analysis.grammar.case}</p>
                        </div>
                      )}

                      {analysis.grammar.state && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            State
                          </h3>
                          <p className="text-base">{analysis.grammar.state}</p>
                        </div>
                      )}

                      {analysis.grammar.mood && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Mood
                          </h3>
                          <p className="text-base">{analysis.grammar.mood}</p>
                        </div>
                      )}

                      {analysis.grammar.voice && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Voice
                          </h3>
                          <p className="text-base">{analysis.grammar.voice}</p>
                        </div>
                      )}

                      {analysis.grammar.form && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Form
                          </h3>
                          <p className="text-base">{analysis.grammar.form}</p>
                        </div>
                      )}
                    </div>

                    {analysis.verbConjugation && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <h3 className="font-semibold mb-3">Verb Conjugation</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-muted-foreground">
                                Tense
                              </h4>
                              <p className="text-base">
                                {analysis.verbConjugation.tense}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-muted-foreground">
                                Form
                              </h4>
                              <p className="text-base">
                                {analysis.verbConjugation.form}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No grammatical data available
                  </div>
                )}
              </TabsContent>

              {/* Root Tab */}
              <TabsContent value="root" className="space-y-4">
                {analysis.root ? (
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                            Root Letters
                          </h3>
                          <div className="text-4xl font-arabic" dir="rtl" lang="ar">
                            {analysis.root.root}
                          </div>
                        </div>

                        {analysis.root.meaning && (
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                              Meaning
                            </h3>
                            <p>{analysis.root.meaning}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {analysis.root.occurrences} occurrences in Quran
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    {analysis.root.examples.length > 0 && (
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">
                          Other Words from this Root
                        </h3>
                        <div className="space-y-3">
                          {analysis.root.examples.map((example) => (
                            <div
                              key={example.id}
                              className="flex items-start justify-between gap-4 p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div
                                  className="text-xl font-arabic mb-1"
                                  dir="rtl"
                                  lang="ar"
                                >
                                  {example.arabic}
                                </div>
                                <div className="text-sm text-muted-foreground italic">
                                  {example.transliteration}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">
                                  {example.surahName}
                                </div>
                                <div className="text-sm font-medium">
                                  {example.surah}:{example.ayah}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No root information available
                  </div>
                )}
              </TabsContent>

              {/* Examples Tab */}
              <TabsContent value="examples" className="space-y-4">
                {analysis.dictionary?.examples ? (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Usage Examples</h3>
                    <div className="prose prose-sm max-w-none">
                      {typeof analysis.dictionary.examples === 'string'
                        ? JSON.parse(analysis.dictionary.examples).map(
                            (example: string, index: number) => (
                              <div key={index} className="mb-3">
                                <div
                                  className="text-lg font-arabic mb-1"
                                  dir="rtl"
                                  lang="ar"
                                >
                                  {example}
                                </div>
                              </div>
                            )
                          )
                        : null}
                    </div>
                  </Card>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No usage examples available
                  </div>
                )}

                {analysis.root && analysis.root.examples.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">
                      Occurrences in the Quran
                    </h3>
                    <div className="space-y-2">
                      {analysis.root.examples.map((example) => (
                        <div
                          key={example.id}
                          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <div
                            className="text-lg font-arabic"
                            dir="rtl"
                            lang="ar"
                          >
                            {example.arabic}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {example.surah}:{example.ayah}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
