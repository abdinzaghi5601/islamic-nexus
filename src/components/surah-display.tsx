'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Translation {
  id: number;
  text: string;
  translator: {
    name: string;
  };
}

interface Tafsir {
  id: number;
  text: string;
  tafsirBook: {
    name: string;
    authorName: string;
  };
}

interface Ayah {
  id: number;
  ayahNumber: number;
  textArabic: string;
  juz: number;
  translations: Translation[];
  tafsirs: Tafsir[];
}

interface SurahDisplayProps {
  ayahs: Ayah[];
  surahNumber: number;
}

// Remove Bismillah from text if present
function removeBismillah(text: string): string {
  const bismillah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
  return text.replace(bismillah, '').trim();
}

export default function SurahDisplay({ ayahs, surahNumber }: SurahDisplayProps) {
  // Helper function to get the display text for an ayah
  const getArabicText = (ayah: Ayah) => {
    // Remove Bismillah from first ayah if it's not Surah 1 or 9
    if (ayah.ayahNumber === 1 && surahNumber !== 1 && surahNumber !== 9) {
      return removeBismillah(ayah.textArabic);
    }
    return ayah.textArabic;
  };

  return (
    <Tabs defaultValue="quran" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="quran">Quran</TabsTrigger>
        <TabsTrigger value="tafsir">Tafsir</TabsTrigger>
      </TabsList>

      {/* Quran Tab */}
      <TabsContent value="quran" className="space-y-6">
        {ayahs.map((ayah) => (
          <div key={ayah.id} className="glass-card p-6 rounded-xl">
            {/* Ayah Number */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                {ayah.ayahNumber}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Ayah {ayah.ayahNumber} • Juz {ayah.juz}
              </div>
            </div>

            {/* Arabic Text */}
            <div
              className="text-3xl font-arabic leading-loose mb-8 text-right p-4 bg-muted/30 rounded-lg"
              dir="rtl"
            >
              {getArabicText(ayah)}
            </div>

            {/* Translations */}
            <div className="space-y-5">
              {ayah.translations.map((translation) => (
                <div key={translation.id} className="pl-5 border-l-4 border-primary/30">
                  <p className="text-sm text-primary font-semibold mb-2">
                    {translation.translator.name}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">{translation.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </TabsContent>

      {/* Tafsir Tab */}
      <TabsContent value="tafsir" className="space-y-6">
        {ayahs.map((ayah) => (
          <div key={ayah.id} className="glass-card p-6 rounded-xl">
            {/* Ayah Number */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                {ayah.ayahNumber}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Ayah {ayah.ayahNumber} • Juz {ayah.juz}
              </div>
            </div>

            {/* Arabic Text */}
            <div
              className="text-3xl font-arabic leading-loose mb-8 text-right p-4 bg-muted/30 rounded-lg"
              dir="rtl"
            >
              {getArabicText(ayah)}
            </div>

            {/* Tafsir */}
            {ayah.tafsirs.length > 0 ? (
              <div className="space-y-5">
                {ayah.tafsirs.map((tafsir) => (
                  <div key={tafsir.id} className="pl-5 border-l-4 border-accent/30">
                    <p className="text-sm text-accent font-semibold mb-2">
                      {tafsir.tafsirBook.name} - {tafsir.tafsirBook.authorName}
                    </p>
                    <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                      {tafsir.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No tafsir available for this ayah
              </div>
            )}
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
