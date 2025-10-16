import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/words/[wordId]/analysis
 *
 * Fetches comprehensive morphological analysis for a specific word
 *
 * Returns:
 * - Word details (Arabic text, transliteration, position)
 * - Morphological breakdown (stem, lemma, prefix, suffix)
 * - Grammatical features (part of speech, root)
 * - Root information and occurrence statistics
 * - Dictionary definition
 * - All occurrences of this root in the Quran
 * - Word translations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wordId: string }> }
) {
  try {
    const { wordId: wordIdStr } = await params;
    const wordId = parseInt(wordIdStr);

    if (isNaN(wordId)) {
      return NextResponse.json(
        { error: 'Invalid word ID' },
        { status: 400 }
      );
    }

    // Fetch word with all related data
    const word = await prisma.ayahWord.findUnique({
      where: { id: wordId },
      include: {
        ayah: {
          include: {
            surah: {
              select: {
                id: true,
                number: true,
                nameArabic: true,
                nameEnglish: true,
              },
            },
          },
        },
        morphology: true,
        grammar: true,
        root: {
          include: {
            words: {
              take: 10, // Limit to 10 other occurrences for performance
              include: {
                ayah: {
                  include: {
                    surah: {
                      select: {
                        number: true,
                        nameEnglish: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                ayah: {
                  surahId: 'asc',
                },
              },
            },
          },
        },
        translations: true,
      },
    });

    if (!word) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      );
    }

    // Find dictionary entry for this word
    let dictionaryEntry = null;
    if (word.textSimplified) {
      dictionaryEntry = await prisma.arabicDictionary.findFirst({
        where: {
          OR: [
            { arabic: { contains: word.textSimplified } },
            { arabic: { contains: word.textArabic } },
          ],
        },
      });
    }

    // Find verb conjugation if this is a verb
    let verbConjugation = null;
    if (word.grammar?.partOfSpeech?.toLowerCase().includes('verb') && word.rootId) {
      verbConjugation = await prisma.verbConjugation.findFirst({
        where: { rootId: word.rootId },
        include: { root: true },
      });
    }

    // Format the response
    const analysis = {
      word: {
        id: word.id,
        arabic: word.textArabic,
        simplified: word.textSimplified,
        transliteration: word.transliteration,
        position: word.position,
        ayah: {
          id: word.ayah.id,
          number: word.ayah.ayahNumber,
          text: word.ayah.textArabic,
          surah: word.ayah.surah,
        },
      },
      morphology: word.morphology ? {
        stem: word.morphology.stem,
        lemma: word.morphology.lemma,
        prefix: word.morphology.prefix,
        suffix: word.morphology.suffix,
        pattern: word.morphology.pattern,
        arabicPattern: word.morphology.arabicPattern,
        englishPattern: word.morphology.englishPattern,
        aspects: word.morphology.aspects,
      } : null,
      grammar: word.grammar ? {
        partOfSpeech: word.grammar.partOfSpeech,
        root: word.grammar.root,
        gender: word.grammar.gender,
        number: word.grammar.number,
        person: word.grammar.person,
        case: word.grammar.case,
        state: word.grammar.state,
        mood: word.grammar.mood,
        voice: word.grammar.voice,
        form: word.grammar.form,
      } : null,
      root: word.root ? {
        id: word.root.id,
        root: word.root.root,
        rootSimple: word.root.rootSimple,
        meaning: word.root.meaning,
        occurrences: word.root.occurrences,
        examples: word.root.words
          .filter(w => w.id !== wordId) // Exclude current word
          .slice(0, 5) // Limit to 5 examples
          .map(w => ({
            id: w.id,
            arabic: w.textArabic,
            transliteration: w.transliteration,
            surah: w.ayah.surah.number,
            surahName: w.ayah.surah.nameEnglish,
            ayah: w.ayah.ayahNumber,
          })),
      } : null,
      dictionary: dictionaryEntry ? {
        arabic: dictionaryEntry.arabic,
        root: dictionaryEntry.root,
        definition: dictionaryEntry.definition,
        examples: dictionaryEntry.examples,
        partOfSpeech: dictionaryEntry.partOfSpeech,
        usageNotes: dictionaryEntry.usageNotes,
      } : null,
      verbConjugation: verbConjugation ? {
        form: verbConjugation.form,
        tense: verbConjugation.tense,
        person: verbConjugation.person,
        number: verbConjugation.number,
        gender: verbConjugation.gender,
        conjugation: verbConjugation.conjugation,
      } : null,
      translations: word.translations.map(t => ({
        id: t.id,
        text: t.text,
        language: t.language,
      })),
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching word analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word analysis' },
      { status: 500 }
    );
  }
}
