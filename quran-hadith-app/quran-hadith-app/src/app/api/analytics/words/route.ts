// app/api/analytics/words/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// Most frequently mentioned Islamic concepts and their approximate frequencies
const TOP_CONCEPTS = [
  { word: 'Allah', wordArabic: 'الله', count: 2699, category: 'Divine Names' },
  { word: 'Lord', wordArabic: 'رب', count: 967, category: 'Divine Names' },
  { word: 'Believers', wordArabic: 'المؤمنون', count: 1000, category: 'Faith' },
  { word: 'Prayer', wordArabic: 'صلاة', count: 99, category: 'Worship' },
  { word: 'Mercy', wordArabic: 'رحمة', count: 339, category: 'Divine Attributes' },
  { word: 'Heaven/Paradise', wordArabic: 'جنة', count: 147, category: 'Afterlife' },
  { word: 'Hell', wordArabic: 'نار', count: 145, category: 'Afterlife' },
  { word: 'Guidance', wordArabic: 'هدى', count: 319, category: 'Faith' },
  { word: 'Knowledge', wordArabic: 'علم', count: 854, category: 'Wisdom' },
  { word: 'Book', wordArabic: 'كتاب', count: 261, category: 'Scripture' },
  { word: 'Sign/Verse', wordArabic: 'آية', count: 382, category: 'Scripture' },
  { word: 'Righteous', wordArabic: 'صالح', count: 180, category: 'Morality' },
  { word: 'Forgiveness', wordArabic: 'مغفرة', count: 234, category: 'Divine Attributes' },
  { word: 'Patience', wordArabic: 'صبر', count: 103, category: 'Morality' },
  { word: 'Truth', wordArabic: 'حق', count: 287, category: 'Guidance' },
  { word: 'Disbelievers', wordArabic: 'كافرون', count: 523, category: 'Faith' },
  { word: 'People', wordArabic: 'ناس', count: 241, category: 'Society' },
  { word: 'Earth', wordArabic: 'أرض', count: 461, category: 'Creation' },
  { word: 'Heaven/Sky', wordArabic: 'سماء', count: 310, category: 'Creation' },
  { word: 'Heart', wordArabic: 'قلب', count: 168, category: 'Inner Self' },
  { word: 'Day', wordArabic: 'يوم', count: 475, category: 'Time' },
  { word: 'Messenger', wordArabic: 'رسول', count: 333, category: 'Prophets' },
  { word: 'Prophet', wordArabic: 'نبي', count: 75, category: 'Prophets' },
  { word: 'Angels', wordArabic: 'ملائكة', count: 88, category: 'Divine Creation' },
  { word: 'Reward', wordArabic: 'أجر', count: 108, category: 'Afterlife' },
  { word: 'Punishment', wordArabic: 'عذاب', count: 373, category: 'Afterlife' },
  { word: 'Gratitude', wordArabic: 'شكر', count: 75, category: 'Morality' },
  { word: 'Faith/Iman', wordArabic: 'إيمان', count: 811, category: 'Faith' },
  { word: 'Charity', wordArabic: 'صدقة', count: 32, category: 'Worship' },
  { word: 'Justice', wordArabic: 'عدل', count: 28, category: 'Morality' },
];

export async function GET() {
  try {
    // Group by category
    const categoryCounts: Record<string, { count: number; words: number }> = {};

    TOP_CONCEPTS.forEach(concept => {
      if (!categoryCounts[concept.category]) {
        categoryCounts[concept.category] = { count: 0, words: 0 };
      }
      categoryCounts[concept.category].count += concept.count;
      categoryCounts[concept.category].words += 1;
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([category, data]) => ({
      category,
      totalMentions: data.count,
      uniqueWords: data.words,
      avgMentionsPerWord: Math.round(data.count / data.words),
    })).sort((a, b) => b.totalMentions - a.totalMentions);

    // Top 20 most mentioned concepts
    const topConcepts = [...TOP_CONCEPTS]
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Calculate statistics
    const totalMentions = TOP_CONCEPTS.reduce((sum, c) => sum + c.count, 0);
    const uniqueConcepts = TOP_CONCEPTS.length;
    const avgMentions = Math.round(totalMentions / uniqueConcepts);

    return NextResponse.json({
      success: true,
      data: {
        topConcepts,
        allConcepts: TOP_CONCEPTS,
        categoryDistribution,
        statistics: {
          totalMentions,
          uniqueConcepts,
          avgMentions,
          totalCategories: Object.keys(categoryCounts).length,
          mostMentionedWord: topConcepts[0],
          mostMentionedCategory: categoryDistribution[0],
        },
      },
    });
  } catch (error) {
    console.error('Error fetching word analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch word analytics' },
      { status: 500 }
    );
  }
}
