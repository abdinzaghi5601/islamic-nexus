// app/api/analytics/corpus/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/corpus
 * Returns Quranic Arabic Corpus statistics:
 * - Word frequency analysis
 * - Root-based statistics
 * - Part-of-speech distribution
 * - Morphology insights
 */
export async function GET() {
  try {
    // Get total word count
    const totalWords = await prisma.ayahWord.count();

    // Get top 20 most frequent roots with their meanings
    const topRoots = await prisma.$queryRaw<Array<{
      root: string;
      rootSimple: string;
      meaning: string;
      occurrences: number;
    }>>`
      SELECT
        wr.root,
        wr."rootSimple",
        wr.meaning,
        COUNT(aw.id) as occurrences
      FROM word_roots wr
      INNER JOIN ayah_words aw ON aw."rootId" = wr.id
      GROUP BY wr.id, wr.root, wr."rootSimple", wr.meaning
      ORDER BY occurrences DESC
      LIMIT 20
    `;

    // Get part-of-speech distribution
    const posDistribution = await prisma.$queryRaw<Array<{
      partOfSpeech: string;
      count: number;
    }>>`
      SELECT
        wg."partOfSpeech",
        COUNT(*) as count
      FROM word_grammar wg
      WHERE wg."partOfSpeech" IS NOT NULL AND wg."partOfSpeech" != ''
      GROUP BY wg."partOfSpeech"
      ORDER BY count DESC
    `;

    // Get verb form distribution (Forms I-X)
    const verbForms = await prisma.$queryRaw<Array<{
      form: string;
      count: number;
    }>>`
      SELECT
        wg.form,
        COUNT(*) as count
      FROM word_grammar wg
      WHERE wg.form IS NOT NULL
        AND wg.form != ''
        AND wg."partOfSpeech" = 'Verb'
      GROUP BY wg.form
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get gender distribution
    const genderDistribution = await prisma.$queryRaw<Array<{
      gender: string;
      count: number;
    }>>`
      SELECT
        wg.gender,
        COUNT(*) as count
      FROM word_grammar wg
      WHERE wg.gender IS NOT NULL AND wg.gender != ''
      GROUP BY wg.gender
      ORDER BY count DESC
    `;

    // Get number distribution (Singular, Dual, Plural)
    const numberDistribution = await prisma.$queryRaw<Array<{
      number: string;
      count: number;
    }>>`
      SELECT
        wg.number,
        COUNT(*) as count
      FROM word_grammar wg
      WHERE wg.number IS NOT NULL AND wg.number != ''
      GROUP BY wg.number
      ORDER BY count DESC
    `;

    // Get total unique roots
    const totalRoots = await prisma.wordRoot.count();

    // Get words with morphology analysis count
    const wordsWithMorphology = await prisma.wordMorphology.count();

    // Get words with grammar analysis count
    const wordsWithGrammar = await prisma.wordGrammar.count();

    // Get most common patterns
    const topPatterns = await prisma.$queryRaw<Array<{
      pattern: string;
      arabicPattern: string;
      count: number;
    }>>`
      SELECT
        wm.pattern,
        wm."arabicPattern",
        COUNT(*) as count
      FROM word_morphology wm
      WHERE wm.pattern IS NOT NULL AND wm.pattern != ''
      GROUP BY wm.pattern, wm."arabicPattern"
      ORDER BY count DESC
      LIMIT 10
    `;

    // Convert BigInt to Number for JSON serialization
    const formatResults = (results: any[]) =>
      results.map(item => ({
        ...item,
        count: Number(item.count || 0),
        occurrences: Number(item.occurrences || 0),
      }));

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          totalWords,
          totalUniqueRoots: totalRoots,
          wordsWithMorphology,
          wordsWithGrammar,
          morphologyCoverage: Math.round((wordsWithMorphology / totalWords) * 100),
          grammarCoverage: Math.round((wordsWithGrammar / totalWords) * 100),
        },
        topRoots: formatResults(topRoots),
        partOfSpeech: formatResults(posDistribution),
        verbForms: formatResults(verbForms),
        genderDistribution: formatResults(genderDistribution),
        numberDistribution: formatResults(numberDistribution),
        topPatterns: formatResults(topPatterns),
      },
    });
  } catch (error) {
    console.error('Error fetching corpus analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch corpus analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
