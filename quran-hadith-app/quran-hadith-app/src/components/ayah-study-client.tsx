'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Book, Tag, MessageSquare, Plus, Settings, Globe, BookOpen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TranslationSelector from '@/components/translation-selector';
import AsbabAlNuzul from '@/components/asbab-al-nuzul';
import ExternalTafsirSelector from '@/components/external-tafsir-selector';
import AyahDisplay from '@/components/AyahDisplay';

interface AyahStudyClientProps {
  ayahData: any;
  navigation: any;
  metadata: any;
}

export default function AyahStudyClient({ ayahData, navigation, metadata }: AyahStudyClientProps) {
  // Single tafsir selection state (either local index or external tafsir)
  const [selectedTafsirType, setSelectedTafsirType] = useState<'local' | 'external'>('local');
  const [selectedLocalTafsirIndex, setSelectedLocalTafsirIndex] = useState<number>(0);
  const [selectedExternalTafsir, setSelectedExternalTafsir] = useState<any | null>(null);

  // Single translation selection state
  const [selectedTranslationType, setSelectedTranslationType] = useState<'local' | 'external'>('local');
  const [selectedLocalTranslationIndex, setSelectedLocalTranslationIndex] = useState<number>(0);
  const [selectedExternalTranslation, setSelectedExternalTranslation] = useState<any | null>(null);

  const [isAddingContent, setIsAddingContent] = useState(false);
  const [contentType, setContentType] = useState<'hadith' | 'lesson'>('hadith');

  // External translations list (available external translations)
  const [availableExternalTranslations, setAvailableExternalTranslations] = useState<any[]>([]);

  // External tafsirs list (available external tafsirs)
  const [availableExternalTafsirs, setAvailableExternalTafsirs] = useState<any[]>([]);

  // Form states
  const [hadithForm, setHadithForm] = useState({
    bookName: '',
    hadithNumber: '',
    textArabic: '',
    textEnglish: '',
    relevance: '',
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    lessonText: '',
    category: 'Faith',
    source: '',
  });

  // Handle translation selection change
  const handleTranslationChange = (type: 'local' | 'external', localIndex?: number, externalTranslation?: any) => {
    setSelectedTranslationType(type);
    if (type === 'local' && localIndex !== undefined) {
      setSelectedLocalTranslationIndex(localIndex);
    } else if (type === 'external' && externalTranslation) {
      setSelectedExternalTranslation(externalTranslation);
    }
  };

  // Handle external translations
  const handleTranslationsAdded = (newTranslations: any[]) => {
    setAvailableExternalTranslations((prev) => [...prev, ...newTranslations]);
    // Auto-select the first newly added translation
    if (newTranslations.length > 0) {
      setSelectedTranslationType('external');
      setSelectedExternalTranslation(newTranslations[0]);
    }
  };

  // Handle tafsir selection change
  const handleTafsirChange = (type: 'local' | 'external', localIndex?: number, externalTafsir?: any) => {
    setSelectedTafsirType(type);
    if (type === 'local' && localIndex !== undefined) {
      setSelectedLocalTafsirIndex(localIndex);
    } else if (type === 'external' && externalTafsir) {
      setSelectedExternalTafsir(externalTafsir);
    }
  };

  // Handle adding external tafsir to available list
  const handleExternalTafsirAdded = (tafsir: any) => {
    setAvailableExternalTafsirs((prev) => [...prev, tafsir]);
    // Auto-select the newly added tafsir
    setSelectedTafsirType('external');
    setSelectedExternalTafsir(tafsir);
  };

  const handleAddHadith = async () => {
    try {
      const response = await fetch('/api/admin/add-hadith-to-ayah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ayahId: ayahData.id,
          ...hadithForm,
        }),
      });

      if (response.ok) {
        alert('Hadith added successfully! Page will refresh.');
        window.location.reload();
      } else {
        alert('Failed to add hadith. Please try again.');
      }
    } catch (error) {
      alert('Error adding hadith: ' + error);
    }
  };

  const handleAddLesson = async () => {
    try {
      const response = await fetch('/api/admin/add-lesson-to-ayah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ayahId: ayahData.id,
          ...lessonForm,
        }),
      });

      if (response.ok) {
        alert('Lesson added successfully! Page will refresh.');
        window.location.reload();
      } else {
        alert('Failed to add lesson. Please try again.');
      }
    } catch (error) {
      alert('Error adding lesson: ' + error);
    }
  };

  const handleDeleteHadith = async (hadithId: number) => {
    if (!confirm('Are you sure you want to remove this hadith from this ayah?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-hadith-from-ayah', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hadithId,
          ayahId: ayahData.id,
        }),
      });

      if (response.ok) {
        alert('Hadith removed successfully! Page will refresh.');
        window.location.reload();
      } else {
        alert('Failed to remove hadith. Please try again.');
      }
    } catch (error) {
      alert('Error removing hadith: ' + error);
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-lesson-from-ayah', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
        }),
      });

      if (response.ok) {
        alert('Lesson deleted successfully! Page will refresh.');
        window.location.reload();
      } else {
        alert('Failed to delete lesson. Please try again.');
      }
    } catch (error) {
      alert('Error deleting lesson: ' + error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/quran/${ayahData.surahNumber}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to {ayahData.surah.name}
        </Link>

        {/* Admin Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Content to This Ayah</DialogTitle>
              <DialogDescription>
                Add hadiths or lessons to {ayahData.surah.name} {ayahData.ayahNumber}
              </DialogDescription>
            </DialogHeader>

            {/* Content Type Selector */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={contentType === 'hadith' ? 'default' : 'outline'}
                onClick={() => setContentType('hadith')}
              >
                Add Hadith
              </Button>
              <Button
                variant={contentType === 'lesson' ? 'default' : 'outline'}
                onClick={() => setContentType('lesson')}
              >
                Add Lesson
              </Button>
            </div>

            {/* Hadith Form */}
            {contentType === 'hadith' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Book Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Sahih al-Bukhari"
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
                    value={hadithForm.bookName}
                    onChange={(e) => setHadithForm({ ...hadithForm, bookName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hadith Number</label>
                  <input
                    type="text"
                    placeholder="e.g., 2311"
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
                    value={hadithForm.hadithNumber}
                    onChange={(e) => setHadithForm({ ...hadithForm, hadithNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Arabic Text</label>
                  <textarea
                    placeholder="Arabic hadith text..."
                    className="w-full mt-1 px-3 py-2 border rounded-md h-24 bg-background text-foreground border-border"
                    value={hadithForm.textArabic}
                    onChange={(e) => setHadithForm({ ...hadithForm, textArabic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">English Translation</label>
                  <textarea
                    placeholder="English hadith text..."
                    className="w-full mt-1 px-3 py-2 border rounded-md h-32 bg-background text-foreground border-border"
                    value={hadithForm.textEnglish}
                    onChange={(e) => setHadithForm({ ...hadithForm, textEnglish: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Relevance Note</label>
                  <input
                    type="text"
                    placeholder="How it relates to this ayah..."
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
                    value={hadithForm.relevance}
                    onChange={(e) => setHadithForm({ ...hadithForm, relevance: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddHadith} className="w-full">
                  Add Hadith
                </Button>
              </div>
            )}

            {/* Lesson Form */}
            {contentType === 'lesson' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Lesson Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Allah's Complete Knowledge"
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Lesson Text</label>
                  <textarea
                    placeholder="Detailed teaching or lesson from this ayah..."
                    className="w-full mt-1 px-3 py-2 border rounded-md h-32 bg-background text-foreground border-border"
                    value={lessonForm.lessonText}
                    onChange={(e) => setLessonForm({ ...lessonForm, lessonText: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
                    value={lessonForm.category}
                    onChange={(e) => setLessonForm({ ...lessonForm, category: e.target.value })}
                  >
                    <option>Faith</option>
                    <option>Morals</option>
                    <option>Worship</option>
                    <option>Life Guidance</option>
                    <option>Stories</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Source (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Tafsir Ibn Kathir"
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
                    value={lessonForm.source}
                    onChange={(e) => setLessonForm({ ...lessonForm, source: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddLesson} className="w-full">
                  Add Lesson
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Surah & Ayah Info */}
      <div className="glass-card p-8 rounded-2xl mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {ayahData.surah.name} - Ayah {ayahData.ayahNumber}
            </h1>
            <p className="text-muted-foreground">
              {ayahData.surah.nameTranslation} • {ayahData.surah.revelationType} •
              Juz {ayahData.juz} • Page {ayahData.page}
            </p>
          </div>
          <div className="text-4xl font-arabic" dir="rtl">
            {ayahData.surah.nameArabic}
          </div>
        </div>

        {/* Arabic Text */}
        <div className="mb-8">
          <AyahDisplay
            ayahNumber={ayahData.ayahNumber}
            arabicText={ayahData.arabicText}
            fontStyle="uthmani"
            className="py-4"
          />
        </div>

        {/* Themes */}
        {ayahData.themes && ayahData.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            {ayahData.themes.map((theme: any) => (
              <Badge key={theme.id} variant="secondary" className="text-sm">
                {theme.name}
                {theme.relevance >= 8 && ' ⭐'}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Asbab Al-Nuzul (Why Was This Revealed?) */}
      <div className="mb-8">
        <AsbabAlNuzul
          surahNumber={ayahData.surahNumber}
          ayahNumber={ayahData.ayahNumber}
        />
      </div>

      {/* Metadata Info Card */}
      <div className="glass-card p-8 rounded-2xl mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <BookOpen className="h-6 w-6 mr-2" />
          Ayah Information
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-card border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Juz</p>
            <p className="text-2xl font-bold">{ayahData.juz}</p>
          </div>
          <div className="p-4 bg-card border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Page</p>
            <p className="text-2xl font-bold">{ayahData.page}</p>
          </div>
          <div className="p-4 bg-card border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Hizb</p>
            <p className="text-2xl font-bold">{ayahData.hizb || 'N/A'}</p>
          </div>
          <div className="p-4 bg-card border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Ruku</p>
            <p className="text-2xl font-bold">{ayahData.ruku || 'N/A'}</p>
          </div>
          <div className="p-4 bg-card border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Manzil</p>
            <p className="text-2xl font-bold">{ayahData.manzil || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revelation Place:</span>
              <span className="font-medium capitalize">{ayahData.surah.revelationType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ayah in Quran:</span>
              <span className="font-medium">{ayahData.numberInQuran} of 6236</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ayah in Surah:</span>
              <span className="font-medium">{ayahData.ayahNumber} of {ayahData.surah.totalAyahs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Surah Order:</span>
              <span className="font-medium">{ayahData.surahNumber} of 114</span>
            </div>
          </div>
        </div>
      </div>

      {/* Translations */}
      <div className="glass-card p-8 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Book className="h-6 w-6 mr-2" />
            Translations
          </h2>

          <div className="flex gap-2 flex-wrap">
            {/* Dropdown Selector for Translations */}
            <select
              value={selectedTranslationType === 'local' ? `local-${selectedLocalTranslationIndex}` : `external-${availableExternalTranslations.findIndex(t => t.translatorName === selectedExternalTranslation?.translatorName)}`}
              onChange={(e) => {
                const value = e.target.value;
                if (value.startsWith('local-')) {
                  const index = parseInt(value.replace('local-', ''));
                  handleTranslationChange('local', index);
                } else if (value.startsWith('external-')) {
                  const index = parseInt(value.replace('external-', ''));
                  handleTranslationChange('external', undefined, availableExternalTranslations[index]);
                }
              }}
              className="px-3 py-2 border rounded-lg bg-background text-sm min-w-[200px] text-foreground border-border"
            >
              <optgroup label="Local Translations">
                {ayahData.translations.map((translation: any, index: number) => (
                  <option key={`local-${index}`} value={`local-${index}`}>
                    {translation.translator.name}
                  </option>
                ))}
              </optgroup>
              {availableExternalTranslations.length > 0 && (
                <optgroup label="External Translations">
                  {availableExternalTranslations.map((translation: any, index: number) => (
                    <option key={`external-${index}`} value={`external-${index}`}>
                      {translation.translatorName}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            {/* Add More Translations Button */}
            <TranslationSelector
              surahNumber={ayahData.surahNumber}
              ayahNumber={ayahData.ayahNumber}
              onTranslationsAdded={handleTranslationsAdded}
            />
          </div>
        </div>

        {/* Display Single Selected Translation */}
        {selectedTranslationType === 'local' ? (
          <div className="p-6 bg-card border rounded-lg">
            <p className="text-lg leading-relaxed">{ayahData.translations[selectedLocalTranslationIndex]?.text}</p>
            <p className="text-sm text-muted-foreground mt-4">
              — {ayahData.translations[selectedLocalTranslationIndex]?.translator.name}
            </p>
          </div>
        ) : selectedExternalTranslation ? (
          <div className="p-6 bg-card border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" />
                Quran.com
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {selectedExternalTranslation.language}
              </Badge>
            </div>
            <p className="text-lg leading-relaxed">{selectedExternalTranslation.text}</p>
            <p className="text-sm text-muted-foreground mt-4">
              — {selectedExternalTranslation.translatorName}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No translation selected
          </p>
        )}
      </div>

      {/* Tafsir with Selector */}
      {ayahData.tafsirs && ayahData.tafsirs.length > 0 && (
        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Tafsir (Commentary)
            </h2>

            <div className="flex gap-2 flex-wrap">
              {/* Dropdown Selector for Tafsirs */}
              <select
                value={selectedTafsirType === 'local' ? `local-${selectedLocalTafsirIndex}` : `external-${availableExternalTafsirs.findIndex(t => t.identifier === selectedExternalTafsir?.identifier)}`}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('local-')) {
                    const index = parseInt(value.replace('local-', ''));
                    handleTafsirChange('local', index);
                  } else if (value.startsWith('external-')) {
                    const index = parseInt(value.replace('external-', ''));
                    handleTafsirChange('external', undefined, availableExternalTafsirs[index]);
                  }
                }}
                className="px-3 py-2 border rounded-lg bg-background text-sm min-w-[200px] text-foreground border-border"
              >
                <optgroup label="Local Tafsirs">
                  {ayahData.tafsirs.map((tafsir: any, index: number) => (
                    <option key={`local-${index}`} value={`local-${index}`}>
                      {tafsir.tafsirBook.authorName}
                    </option>
                  ))}
                </optgroup>
                {availableExternalTafsirs.length > 0 && (
                  <optgroup label="External Tafsirs">
                    {availableExternalTafsirs.map((tafsir: any, index: number) => (
                      <option key={`external-${index}`} value={`external-${index}`}>
                        {tafsir.author}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {/* Add More Tafsirs Button */}
              <ExternalTafsirSelector
                surahNumber={ayahData.surahNumber}
                ayahNumber={ayahData.ayahNumber}
                onTafsirAdded={handleExternalTafsirAdded}
              />
            </div>
          </div>

          {/* Display Single Selected Tafsir */}
          {selectedTafsirType === 'local' ? (
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{ayahData.tafsirs[selectedLocalTafsirIndex]?.tafsirBook.name}</h3>
                <Badge variant="outline" className="text-xs">Local</Badge>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {ayahData.tafsirs[selectedLocalTafsirIndex]?.text}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                — {ayahData.tafsirs[selectedLocalTafsirIndex]?.tafsirBook.name} by {ayahData.tafsirs[selectedLocalTafsirIndex]?.tafsirBook.authorName}
              </p>
            </div>
          ) : selectedExternalTafsir ? (
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-start gap-2 mb-3 flex-wrap">
                <h3 className="font-semibold text-lg">{selectedExternalTafsir.name}</h3>
                <Badge variant="outline" className="text-xs">External</Badge>
                {selectedExternalTafsir.category === 'historical' && (
                  <Badge variant="default" className="text-xs bg-amber-500">
                    Historical Context
                  </Badge>
                )}
                {selectedExternalTafsir.category === 'mystical' && (
                  <Badge variant="secondary" className="text-xs">
                    ✨ Mystical
                  </Badge>
                )}
                {selectedExternalTafsir.category === 'companion' && (
                  <Badge variant="secondary" className="text-xs">
                    👥 Companion
                  </Badge>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedExternalTafsir.text}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                — {selectedExternalTafsir.name} by {selectedExternalTafsir.author}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No tafsir selected
            </p>
          )}
        </div>
      )}

      {/* Related Hadiths */}
      {ayahData.relatedHadiths && ayahData.relatedHadiths.length > 0 && (
        <div className="glass-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Related Authentic Hadiths</h2>

          <div className="space-y-6">
            {ayahData.relatedHadiths.map((hadith: any) => (
              <div key={hadith.id} className="border-l-4 border-primary pl-6 py-4 relative group">
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteHadith(hadith.id)}
                  title="Remove hadith from this ayah"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-sm">
                    {hadith.book.name} {hadith.hadithNumber}
                  </Badge>
                  {hadith.chapter && (
                    <span className="text-xs text-muted-foreground">
                      {hadith.chapter.title}
                    </span>
                  )}
                </div>

                {hadith.textArabic && (
                  <p className="text-xl font-arabic leading-loose mb-4" dir="rtl">
                    {hadith.textArabic}
                  </p>
                )}

                <p className="text-base leading-relaxed text-muted-foreground">
                  {hadith.textEnglish}
                </p>

                <p className="text-sm text-muted-foreground mt-3">
                  — {hadith.book.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lessons */}
      {ayahData.lessons && ayahData.lessons.length > 0 && (
        <div className="glass-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Key Lessons & Teachings</h2>

          <div className="space-y-4">
            {ayahData.lessons.map((lesson: any) => (
              <div key={lesson.id} className="p-4 bg-card border rounded-lg relative group">
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteLesson(lesson.id)}
                  title="Delete this lesson"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <h3 className="font-semibold text-lg mb-2 pr-8">{lesson.title}</h3>
                <p className="text-muted-foreground mb-2">{lesson.lessonText}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {lesson.category}
                  </Badge>
                  {lesson.source && (
                    <span className="text-xs text-muted-foreground">
                      Source: {lesson.source}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duas */}
      {ayahData.duas && ayahData.duas.length > 0 && (
        <div className="glass-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Duas from This Ayah</h2>

          <div className="space-y-6">
            {ayahData.duas.map((dua: any) => (
              <div key={dua.id} className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <p className="text-2xl font-arabic leading-loose mb-3" dir="rtl">
                  {dua.arabicText}
                </p>

                {dua.transliteration && (
                  <p className="text-sm text-muted-foreground italic mb-3">
                    {dua.transliteration}
                  </p>
                )}

                <p className="text-base font-medium mb-3">{dua.translation}</p>

                {dua.occasion && (
                  <Badge variant="outline" className="text-xs mb-2">
                    {dua.occasion}
                  </Badge>
                )}

                {dua.benefits && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Benefits: {dua.benefits}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12">
        {navigation.previous ? (
          <Link
            href={`/quran/study/${navigation.previous.surah}/${navigation.previous.ayah}`}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous Ayah</span>
          </Link>
        ) : (
          <div></div>
        )}

        {navigation.next ? (
          <Link
            href={`/quran/study/${navigation.next.surah}/${navigation.next.ayah}`}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <span>Next Ayah</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Metadata Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Ayah {ayahData.numberInQuran} of 6236 • {metadata.totalTranslations} Translations •
          {metadata.totalTafsirs} Tafsir Sources • {metadata.totalThemes} Themes
          {metadata.totalRelatedHadiths > 0 && ` • ${metadata.totalRelatedHadiths} Related Hadiths`}
        </p>
      </div>
    </div>
  );
}
