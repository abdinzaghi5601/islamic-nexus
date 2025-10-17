// app/api/analytics/prophets/route.ts
import { NextResponse } from 'next/server';
import { PROPHETS } from '@/lib/utils/search-utils';

export const dynamic = 'force-dynamic';

// Prophet mention data from Quranic corpus analysis
const PROPHET_MENTIONS = {
  moses: { count: 136, surahs: 33 },
  abraham: { count: 69, surahs: 25 },
  noah: { count: 43, surahs: 28 },
  jesus: { count: 25, surahs: 15 },
  joseph: { count: 27, surahs: 4 },
  adam: { count: 25, surahs: 7 },
  david: { count: 16, surahs: 5 },
  solomon: { count: 17, surahs: 6 },
  lot: { count: 27, surahs: 15 },
  jonah: { count: 4, surahs: 4 },
  aaron: { count: 20, surahs: 13 },
  ishmael: { count: 12, surahs: 9 },
  isaac: { count: 17, surahs: 12 },
  jacob: { count: 16, surahs: 13 },
  job: { count: 4, surahs: 2 },
  zachariah: { count: 7, surahs: 4 },
  john: { count: 5, surahs: 4 },
  elijah: { count: 3, surahs: 2 },
  elisha: { count: 2, surahs: 1 },
  muhammad: { count: 4, surahs: 4 }, // Direct mentions by name
};

export async function GET() {
  try {
    // Build prophet analytics from static data
    const prophetAnalytics = Object.entries(PROPHETS).map(([key, info]) => {
      const mentions = PROPHET_MENTIONS[key as keyof typeof PROPHET_MENTIONS] || { count: 0, surahs: 0 };

      return {
        key,
        name: info.english[0],
        nameArabic: info.arabic[0],
        mentions: mentions.count,
        surahsAppearing: mentions.surahs,
        taggedAyahs: 0, // Theme model doesn't exist yet
        relatedTopics: info.relatedTopics,
      };
    });

    // Sort by mention count
    prophetAnalytics.sort((a, b) => b.mentions - a.mentions);

    // Calculate summary statistics
    const totalMentions = prophetAnalytics.reduce((sum, p) => sum + p.mentions, 0);
    const avgMentions = Math.round(totalMentions / prophetAnalytics.length);
    const mostMentioned = prophetAnalytics[0];
    const leastMentioned = prophetAnalytics[prophetAnalytics.length - 1];

    return NextResponse.json({
      success: true,
      data: {
        prophets: prophetAnalytics,
        summary: {
          totalProphets: prophetAnalytics.length,
          totalMentions,
          avgMentions,
          mostMentioned: {
            name: mostMentioned.name,
            nameArabic: mostMentioned.nameArabic,
            mentions: mostMentioned.mentions,
          },
          leastMentioned: {
            name: leastMentioned.name,
            nameArabic: leastMentioned.nameArabic,
            mentions: leastMentioned.mentions,
          },
        },
        topProphets: prophetAnalytics.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Error fetching prophet analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prophet analytics' },
      { status: 500 }
    );
  }
}
