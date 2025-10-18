// app/api/analytics/corpus/words/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filterType = searchParams.get('type'); // 'root', 'pos', 'gender', 'number', 'form'
    const filterValue = searchParams.get('value');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!filterType || !filterValue) {
      return NextResponse.json(
        { success: false, error: 'Missing filter parameters' },
        { status: 400 }
      );
    }

    let words: any[] = [];

    switch (filterType) {
      case 'root': {
        // Find words by root
        words = await prisma.ayahWord.findMany({
          where: {
            root: {
              root: filterValue,
            },
          },
          include: {
            root: true,
            ayah: {
              include: {
                surah: true,
              },
            },
            grammar: true,
            morphology: true,
            translations: {
              where: { language: 'en' },
            },
          },
          take: limit,
          orderBy: [
            { ayah: { surah: { number: 'asc' } } },
            { ayah: { ayahNumber: 'asc' } },
            { position: 'asc' },
          ],
        });
        break;
      }

      case 'pos': {
        // Find words by part of speech
        words = await prisma.ayahWord.findMany({
          where: {
            grammar: {
              partOfSpeech: filterValue,
            },
          },
          include: {
            root: true,
            ayah: {
              include: {
                surah: true,
              },
            },
            grammar: true,
            morphology: true,
            translations: {
              where: { language: 'en' },
            },
          },
          take: limit,
          orderBy: [
            { ayah: { surah: { number: 'asc' } } },
            { ayah: { ayahNumber: 'asc' } },
            { position: 'asc' },
          ],
        });
        break;
      }

      case 'gender': {
        // Find words by gender
        words = await prisma.ayahWord.findMany({
          where: {
            grammar: {
              gender: filterValue,
            },
          },
          include: {
            root: true,
            ayah: {
              include: {
                surah: true,
              },
            },
            grammar: true,
            morphology: true,
            translations: {
              where: { language: 'en' },
            },
          },
          take: limit,
          orderBy: [
            { ayah: { surah: { number: 'asc' } } },
            { ayah: { ayahNumber: 'asc' } },
            { position: 'asc' },
          ],
        });
        break;
      }

      case 'number': {
        // Find words by number (singular/dual/plural)
        words = await prisma.ayahWord.findMany({
          where: {
            grammar: {
              number: filterValue,
            },
          },
          include: {
            root: true,
            ayah: {
              include: {
                surah: true,
              },
            },
            grammar: true,
            morphology: true,
            translations: {
              where: { language: 'en' },
            },
          },
          take: limit,
          orderBy: [
            { ayah: { surah: { number: 'asc' } } },
            { ayah: { ayahNumber: 'asc' } },
            { position: 'asc' },
          ],
        });
        break;
      }

      case 'form': {
        // Find verbs by form
        words = await prisma.ayahWord.findMany({
          where: {
            grammar: {
              form: filterValue,
            },
          },
          include: {
            root: true,
            ayah: {
              include: {
                surah: true,
              },
            },
            grammar: true,
            morphology: true,
            translations: {
              where: { language: 'en' },
            },
          },
          take: limit,
          orderBy: [
            { ayah: { surah: { number: 'asc' } } },
            { ayah: { ayahNumber: 'asc' } },
            { position: 'asc' },
          ],
        });
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid filter type' },
          { status: 400 }
        );
    }

    // Format the response
    const formattedWords = words.map((word) => ({
      id: word.id,
      arabic: word.textArabic,
      simplified: word.textSimplified,
      transliteration: word.transliteration,
      translation: word.translations[0]?.translation || null,
      root: word.root
        ? {
            root: word.root.root,
            meaning: word.root.meaning,
          }
        : null,
      location: {
        surah: word.ayah.surah.number,
        surahName: word.ayah.surah.name,
        ayah: word.ayah.ayahNumber,
        position: word.position,
      },
      grammar: word.grammar
        ? {
            pos: word.grammar.partOfSpeech,
            form: word.grammar.form,
            gender: word.grammar.gender,
            number: word.grammar.number,
            person: word.grammar.person,
            tense: word.grammar.tense,
            mood: word.grammar.mood,
            case: word.grammar.case_,
          }
        : null,
      morphology: word.morphology
        ? {
            stem: word.morphology.stem,
            lemma: word.morphology.lemma,
            prefix: word.morphology.prefix,
            suffix: word.morphology.suffix,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        words: formattedWords,
        count: formattedWords.length,
        filter: {
          type: filterType,
          value: filterValue,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching corpus words:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch words',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
