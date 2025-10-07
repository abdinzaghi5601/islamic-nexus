import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse, getPaginationParams, paginatedResponse } from '@/lib/api/helpers';

// Keyword expansion map for semantic search
const KEYWORD_MAP: { [key: string]: string[] } = {
  'health': ['health', 'healing', 'cure', 'medicine', 'illness', 'disease', 'sick', 'recover', 'remedy'],
  'prayer': ['prayer', 'pray', 'salah', 'salat', 'worship', 'prostration', 'ruku'],
  'dua': ['dua', 'supplication', 'invocation', 'prayer', 'ask', 'calling'],
  'forgiveness': ['forgiveness', 'forgive', 'pardon', 'mercy', 'repentance', 'repent', 'sin'],
  'patience': ['patience', 'patient', 'perseverance', 'endurance', 'steadfast', 'sabr'],
  'charity': ['charity', 'sadaqah', 'zakat', 'give', 'giving', 'alms', 'donate'],
  'fasting': ['fasting', 'fast', 'sawm', 'ramadan', 'abstain'],
  'marriage': ['marriage', 'marry', 'wife', 'husband', 'spouse', 'nikah', 'wedding'],
  'death': ['death', 'die', 'dying', 'grave', 'burial', 'funeral', 'deceased'],
  'heaven': ['heaven', 'paradise', 'jannah', 'garden', 'eternal'],
  'hell': ['hell', 'hellfire', 'jahannam', 'punishment', 'fire'],
  'angel': ['angel', 'angels', 'malak', 'jibril', 'gabriel', 'michael'],
  'prophet': ['prophet', 'messenger', 'rasul', 'nabi', 'muhammad', 'moses', 'jesus', 'abraham'],
  'faith': ['faith', 'believe', 'belief', 'iman', 'trust', 'conviction'],
  'knowledge': ['knowledge', 'know', 'wisdom', 'learn', 'understanding', 'ilm', 'scholar'],
  'fear': ['fear', 'afraid', 'terror', 'frighten', 'dread', 'awe'],
  'love': ['love', 'beloved', 'loving', 'affection', 'devotion'],
  'guidance': ['guidance', 'guide', 'straight path', 'direction', 'hidayah'],
  'righteousness': ['righteousness', 'righteous', 'pious', 'good deed', 'virtue', 'taqwa'],
  'blessing': ['blessing', 'blessed', 'grace', 'favor', 'barakah'],
};

// Expand search query with related keywords
function expandSearchTerms(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/);
  const expandedTerms = new Set<string>(terms);

  terms.forEach(term => {
    // Check if this term matches any key in our keyword map
    Object.entries(KEYWORD_MAP).forEach(([key, synonyms]) => {
      if (key.includes(term) || synonyms.some(syn => syn.includes(term))) {
        synonyms.forEach(syn => expandedTerms.add(syn));
      }
    });
  });

  return Array.from(expandedTerms);
}

/**
 * GET /api/search
 * Search across Quran, Hadith, Duas, and Books with semantic understanding
 * Query params:
 *   - q: search query (required)
 *   - type: 'quran' | 'hadith' | 'dua' | 'book' | 'all' (default: 'all')
 *   - page: page number
 *   - limit: items per page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const { page, limit, skip } = getPaginationParams(searchParams);

    if (!query || query.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters');
    }

    // Expand search terms with related keywords
    const searchTerms = expandSearchTerms(query.trim());
    const results: any[] = [];

    // Search Quran translations with expanded terms
    // Note: MySQL is case-insensitive by default with utf8mb4_general_ci collation
    if (type === 'all' || type === 'quran') {
      // Search in translations
      const quranResults = await prisma.translation.findMany({
        where: {
          OR: searchTerms.map(term => ({
            text: {
              contains: term,
            },
          })),
        },
        take: limit,
        skip: type === 'quran' ? skip : 0,
        include: {
          ayah: {
            include: {
              surah: true,
              tafsirs: {
                include: {
                  tafsirBook: true,
                },
              },
            },
          },
          translator: true,
        },
        orderBy: {
          ayahId: 'asc',
        },
      });

      // Also search in tafsir text directly
      const tafsirResults = await prisma.tafsirVerse.findMany({
        where: {
          OR: searchTerms.map(term => ({
            text: {
              contains: term,
            },
          })),
        },
        take: Math.floor(limit / 2), // Take half the limit for tafsir results
        include: {
          ayah: {
            include: {
              surah: true,
              translations: {
                where: { translatorId: { in: [1, 2, 3, 4] } },
                include: {
                  translator: true,
                },
              },
              tafsirs: {
                include: {
                  tafsirBook: true,
                },
              },
            },
          },
          tafsirBook: true,
        },
        orderBy: {
          ayahId: 'asc',
        },
      });

      // Combine results, prioritizing translation matches
      const combinedQuranResults = [...quranResults];

      // Add tafsir-only results (ayahs not already in translation results)
      const existingAyahIds = new Set(quranResults.map(r => r.ayah.id));
      tafsirResults.forEach(tafsir => {
        if (!existingAyahIds.has(tafsir.ayah.id)) {
          // Create a pseudo-translation result for UI compatibility
          const primaryTranslation = tafsir.ayah.translations[0];
          if (primaryTranslation) {
            combinedQuranResults.push({
              ...primaryTranslation,
              ayah: tafsir.ayah,
              matchedInTafsir: true, // Flag to highlight tafsir match
            } as any);
            existingAyahIds.add(tafsir.ayah.id);
          }
        }
      });

      // For each ayah result, fetch related hadiths
      const quranResultsWithHadiths = await Promise.all(
        combinedQuranResults.map(async (result) => {
          // Search for hadiths that mention the same keywords (with expanded terms)
          const relatedHadiths = await prisma.hadith.findMany({
            where: {
              OR: searchTerms.map(term => ({
                textEnglish: {
                  contains: term,
                },
              })),
            },
            take: 5, // Increased to 5 related hadiths per ayah
            include: {
              book: true,
              chapter: true,
            },
          });

          return {
            type: 'ayah',
            id: result.ayah.id,
            text: result.text,
            textArabic: result.ayah.textArabic,
            reference: `${result.ayah.surah.nameEnglish} ${result.ayah.ayahNumber}:${result.ayah.surah.number}`,
            surah: {
              id: result.ayah.surah.id,
              number: result.ayah.surah.number,
              nameEnglish: result.ayah.surah.nameEnglish,
              nameArabic: result.ayah.surah.nameArabic,
            },
            ayahNumber: result.ayah.ayahNumber,
            translator: result.translator.name,
            matchedInTafsir: (result as any).matchedInTafsir || false,
            tafsirs: result.ayah.tafsirs.map(tafsir => ({
              id: tafsir.id,
              text: tafsir.text,
              tafsirBook: tafsir.tafsirBook.name,
              author: tafsir.tafsirBook.authorName,
            })),
            relatedHadiths: relatedHadiths.map(hadith => ({
              id: hadith.id,
              textArabic: hadith.textArabic,
              textEnglish: hadith.textEnglish,
              reference: `${hadith.book.name} ${hadith.hadithNumber}`,
              book: {
                id: hadith.book.id,
                name: hadith.book.name,
              },
              chapter: hadith.chapter ? {
                nameEnglish: hadith.chapter.nameEnglish,
              } : null,
              grade: hadith.grade,
            })),
          };
        })
      );

      results.push(...quranResultsWithHadiths);
    }

    // Search Hadith with expanded terms
    // Note: MySQL is case-insensitive by default
    if (type === 'all' || type === 'hadith') {
      const hadithResults = await prisma.hadith.findMany({
        where: {
          OR: [
            ...searchTerms.map(term => ({
              textEnglish: {
                contains: term,
              },
            })),
            ...searchTerms.map(term => ({
              textArabic: {
                contains: term,
              },
            })),
          ],
        },
        take: limit,
        skip: type === 'hadith' ? skip : 0,
        include: {
          book: true,
          chapter: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      results.push(
        ...hadithResults.map(result => ({
          type: 'hadith',
          id: result.id,
          text: result.textEnglish,
          textArabic: result.textArabic,
          reference: `${result.book.name} ${result.hadithNumber}`,
          book: {
            id: result.book.id,
            name: result.book.name,
            nameArabic: result.book.nameArabic,
          },
          chapter: result.chapter ? {
            id: result.chapter.id,
            nameEnglish: result.chapter.nameEnglish,
          } : null,
          hadithNumber: result.hadithNumber,
          grade: result.grade,
        }))
      );
    }

    // Search Duas with expanded terms
    if (type === 'all' || type === 'dua') {
      const duaResults = await prisma.dua.findMany({
        where: {
          OR: [
            ...searchTerms.map(term => ({
              title: {
                contains: term,
              },
            })),
            ...searchTerms.map(term => ({
              textEnglish: {
                contains: term,
              },
            })),
            ...searchTerms.map(term => ({
              tags: {
                contains: term,
              },
            })),
          ],
        },
        take: limit,
        skip: type === 'dua' ? skip : 0,
        include: {
          category: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      results.push(
        ...duaResults.map(result => ({
          type: 'dua',
          id: result.id,
          text: result.textEnglish,
          textArabic: result.textArabic,
          title: result.title,
          titleArabic: result.titleArabic,
          transliteration: result.transliteration,
          reference: result.reference || result.category.name,
          category: {
            id: result.category.id,
            name: result.category.name,
            slug: result.category.slug,
          },
          tags: result.tags,
          occasion: result.occasion,
          benefits: result.benefits,
        }))
      );
    }

    // Search Books with expanded terms
    if (type === 'all' || type === 'book') {
      const bookChunkResults = await prisma.bookChunk.findMany({
        where: {
          OR: searchTerms.map(term => ({
            content: {
              contains: term,
            },
          })),
        },
        take: limit,
        skip: type === 'book' ? skip : 0,
        include: {
          book: true,
        },
        orderBy: {
          pageNumber: 'asc',
        },
      });

      // Group chunks by book and get first matching chunk from each
      const bookMap = new Map();
      bookChunkResults.forEach(chunk => {
        if (!bookMap.has(chunk.bookId)) {
          bookMap.set(chunk.bookId, {
            type: 'book',
            id: chunk.book.id,
            title: chunk.book.title,
            titleArabic: chunk.book.titleArabic,
            author: chunk.book.author,
            authorArabic: chunk.book.authorArabic,
            category: chunk.book.category,
            language: chunk.book.language,
            description: chunk.book.description,
            pageNumber: chunk.pageNumber,
            excerpt: chunk.content.substring(0, 300) + '...',
            reference: `${chunk.book.title} - Page ${chunk.pageNumber}`,
            totalPages: chunk.book.totalPages,
            pdfUrl: chunk.book.pdfUrl,
            pdfPath: chunk.book.pdfPath,
          });
        }
      });

      results.push(...Array.from(bookMap.values()));
    }

    // Calculate total (this is approximate for 'all' type)
    const total = results.length;

    return paginatedResponse(results, page, limit, total);
  } catch (error) {
    console.error('Error searching:', error);
    return errorResponse('Search failed', 500);
  }
}
