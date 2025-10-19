import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface CSVRow {
  Surah: string;
  Ayah: string;
  Text: string;
}

/**
 * Word Analysis from Yusuf Ali Translation
 * GET /api/analytics/words-yusufali
 */
export async function GET() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'en.yusufali.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as CSVRow[];

    // Define key Islamic concepts to track
    const conceptsConfig = [
      {
        word: 'Allah',
        wordArabic: 'الله',
        category: 'Divine Names',
        variations: ['allah', 'god']
      },
      {
        word: 'Lord',
        wordArabic: 'رب',
        category: 'Divine Attributes',
        variations: ['lord']
      },
      {
        word: 'Merciful',
        wordArabic: 'الرحيم',
        category: 'Divine Attributes',
        variations: ['merciful', 'mercy', 'compassion', 'compassionate']
      },
      {
        word: 'Believe',
        wordArabic: 'آمن',
        category: 'Faith',
        variations: ['believe', 'believers', 'belief', 'faith', 'faithful']
      },
      {
        word: 'Prayer',
        wordArabic: 'صلاة',
        category: 'Worship',
        variations: ['prayer', 'pray', 'worship', 'prostrate']
      },
      {
        word: 'Guidance',
        wordArabic: 'هدى',
        category: 'Divine Guidance',
        variations: ['guide', 'guidance', 'guided']
      },
      {
        word: 'Righteous',
        wordArabic: 'صالح',
        category: 'Virtues',
        variations: ['righteous', 'righteousness', 'good', 'virtue']
      },
      {
        word: 'Paradise',
        wordArabic: 'جنة',
        category: 'Hereafter',
        variations: ['paradise', 'garden', 'gardens', 'heaven']
      },
      {
        word: 'Hellfire',
        wordArabic: 'نار',
        category: 'Hereafter',
        variations: ['fire', 'hell', 'hellfire', 'blazing']
      },
      {
        word: 'Forgiveness',
        wordArabic: 'مغفرة',
        category: 'Divine Mercy',
        variations: ['forgive', 'forgiveness', 'pardon', 'forgiving']
      },
      {
        word: 'Patience',
        wordArabic: 'صبر',
        category: 'Virtues',
        variations: ['patient', 'patience', 'persever', 'steadfast']
      },
      {
        word: 'Grateful',
        wordArabic: 'شكر',
        category: 'Virtues',
        variations: ['grateful', 'gratitude', 'thank', 'thanks']
      },
      {
        word: 'Knowledge',
        wordArabic: 'علم',
        category: 'Wisdom',
        variations: ['knowledge', 'know', 'wisdom', 'wise', 'learn']
      },
      {
        word: 'Messenger',
        wordArabic: 'رسول',
        category: 'Prophethood',
        variations: ['messenger', 'messengers', 'apostle', 'prophet']
      },
      {
        word: 'Revelation',
        wordArabic: 'وحي',
        category: 'Divine Message',
        variations: ['revelation', 'revealed', 'reveal', 'book', 'scripture']
      },
      {
        word: 'Judgment',
        wordArabic: 'حساب',
        category: 'Day of Judgment',
        variations: ['judgment', 'judge', 'account', 'reckoning']
      },
      {
        word: 'Charity',
        wordArabic: 'صدقة',
        category: 'Social Justice',
        variations: ['charity', 'alms', 'spend', 'give']
      },
      {
        word: 'Truth',
        wordArabic: 'حق',
        category: 'Virtue',
        variations: ['truth', 'true', 'truthful']
      },
      {
        word: 'Repentance',
        wordArabic: 'توبة',
        category: 'Forgiveness',
        variations: ['repent', 'repentance', 'turn']
      },
      {
        word: 'Signs',
        wordArabic: 'آيات',
        category: 'Creation',
        variations: ['sign', 'signs', 'miracle', 'miracles']
      }
    ];

    // Analyze concepts
    const topConcepts = conceptsConfig.map(concept => {
      let count = 0;

      for (const record of records) {
        const textLower = record.Text.toLowerCase();
        concept.variations.forEach(variation => {
          const regex = new RegExp(`\\b${variation}\\b`, 'gi');
          const matches = textLower.match(regex);
          if (matches) count += matches.length;
        });
      }

      return {
        word: concept.word,
        wordArabic: concept.wordArabic,
        category: concept.category,
        count
      };
    });

    // Sort by count
    topConcepts.sort((a, b) => b.count - a.count);

    // Calculate category distribution
    const categoryMap = new Map<string, { totalMentions: number; uniqueWords: number }>();

    topConcepts.forEach(concept => {
      if (!categoryMap.has(concept.category)) {
        categoryMap.set(concept.category, { totalMentions: 0, uniqueWords: 0 });
      }
      const cat = categoryMap.get(concept.category)!;
      cat.totalMentions += concept.count;
      cat.uniqueWords += 1;
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data
    })).sort((a, b) => b.totalMentions - a.totalMentions);

    // Calculate statistics
    const totalMentions = topConcepts.reduce((sum, c) => sum + c.count, 0);
    const mostMentioned = topConcepts[0];

    const statistics = {
      totalMentions,
      uniqueConcepts: topConcepts.filter(c => c.count > 0).length,
      mostMentionedWord: {
        word: mostMentioned.word,
        wordArabic: mostMentioned.wordArabic,
        count: mostMentioned.count
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        topConcepts: topConcepts.filter(c => c.count > 0),
        categoryDistribution,
        statistics
      }
    });

  } catch (error) {
    console.error('Error analyzing words:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze words',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
