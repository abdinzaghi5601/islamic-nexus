import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface CSVRow {
  Surah: string;
  Ayah: string;
  Text: string;
}

interface ProphetData {
  key: string;
  name: string;
  nameArabic: string;
  mentions: number;
  surahsAppearing: number;
  ayahReferences: Array<{ surah: number; ayah: number }>;
  relatedTopics: string[];
}

/**
 * Prophets Analytics from Yusuf Ali Translation
 * GET /api/analytics/prophets-yusufali
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

    // Define prophets with their variations and Arabic names
    const prophetsConfig = [
      {
        key: 'muhammad',
        name: 'Muhammad',
        nameArabic: 'محمد',
        variations: ['muhammad', 'ahmad'],
        topics: ['Final Prophet', 'Seal of Prophets', 'Al-Amin']
      },
      {
        key: 'moses',
        name: 'Moses (Musa)',
        nameArabic: 'موسى',
        variations: ['moses', 'musa'],
        topics: ['Bani Israel', 'Pharaoh', 'Torah', 'Mount Sinai']
      },
      {
        key: 'abraham',
        name: 'Abraham (Ibrahim)',
        nameArabic: 'إبراهيم',
        variations: ['abraham', 'ibrahim'],
        topics: ['Kaaba', 'Monotheism', 'Father of Prophets', 'Sacrifice']
      },
      {
        key: 'jesus',
        name: 'Jesus (Isa)',
        nameArabic: 'عيسى',
        variations: ['jesus', 'isa', 'christ', 'messiah'],
        topics: ['Miracles', 'Gospel', 'Virgin Birth', 'Ascension']
      },
      {
        key: 'noah',
        name: 'Noah (Nuh)',
        nameArabic: 'نوح',
        variations: ['noah', 'nuh'],
        topics: ['The Flood', 'Ark', 'Patience', 'Warning']
      },
      {
        key: 'joseph',
        name: 'Joseph (Yusuf)',
        nameArabic: 'يوسف',
        variations: ['joseph', 'yusuf', 'yousuf'],
        topics: ['Dreams', 'Egypt', 'Forgiveness', 'Patience']
      },
      {
        key: 'adam',
        name: 'Adam',
        nameArabic: 'آدم',
        variations: ['adam'],
        topics: ['First Human', 'Paradise', 'Khilafah', 'Knowledge']
      },
      {
        key: 'david',
        name: 'David (Dawud)',
        nameArabic: 'داود',
        variations: ['david', 'dawud', 'dawood'],
        topics: ['Psalms', 'Justice', 'Kingdom', 'Goliath']
      },
      {
        key: 'solomon',
        name: 'Solomon (Sulaiman)',
        nameArabic: 'سليمان',
        variations: ['solomon', 'sulaiman', 'sulayman'],
        topics: ['Wisdom', 'Kingdom', 'Jinn', 'Queen of Sheba']
      },
      {
        key: 'jacob',
        name: 'Jacob (Yaqub)',
        nameArabic: 'يعقوب',
        variations: ['jacob', 'yakub', 'yaqub', 'israel'],
        topics: ['Patience', 'Family', 'Bani Israel']
      },
      {
        key: 'ishmael',
        name: 'Ishmael (Ismail)',
        nameArabic: 'إسماعيل',
        variations: ['ishmael', 'ismail'],
        topics: ['Sacrifice', 'Kaaba', 'Patience']
      },
      {
        key: 'isaac',
        name: 'Isaac (Ishaq)',
        nameArabic: 'إسحاق',
        variations: ['isaac', 'ishaq'],
        topics: ['Promise', 'Lineage', 'Blessing']
      },
      {
        key: 'lot',
        name: 'Lot (Lut)',
        nameArabic: 'لوط',
        variations: ['lot', 'lut'],
        topics: ['Sodom', 'Warning', 'Righteousness']
      },
      {
        key: 'jonah',
        name: 'Jonah (Yunus)',
        nameArabic: 'يونس',
        variations: ['jonah', 'yunus'],
        topics: ['Whale', 'Repentance', 'Patience', 'Nineveh']
      },
      {
        key: 'job',
        name: 'Job (Ayub)',
        nameArabic: 'أيوب',
        variations: ['job', 'ayub', 'ayyub'],
        topics: ['Patience', 'Suffering', 'Faith', 'Healing']
      },
      {
        key: 'aaron',
        name: 'Aaron (Harun)',
        nameArabic: 'هارون',
        variations: ['aaron', 'harun'],
        topics: ['Moses', 'Helper', 'Golden Calf']
      },
      {
        key: 'zachariah',
        name: 'Zachariah (Zakariya)',
        nameArabic: 'زكريا',
        variations: ['zachariah', 'zakariya', 'zacharias'],
        topics: ['Prayer', 'Old Age', 'John', 'Temple']
      },
      {
        key: 'john',
        name: 'John (Yahya)',
        nameArabic: 'يحيى',
        variations: ['john', 'yahya', 'baptist'],
        topics: ['Righteousness', 'Wisdom', 'Youth']
      },
      {
        key: 'elijah',
        name: 'Elijah (Ilyas)',
        nameArabic: 'إلياس',
        variations: ['elijah', 'elias', 'ilyas'],
        topics: ['Prophethood', 'Warning']
      },
      {
        key: 'elisha',
        name: 'Elisha (Alyasa)',
        nameArabic: 'اليسع',
        variations: ['elisha', 'alyasa'],
        topics: ['Prophethood', 'Miracles']
      },
      {
        key: 'hud',
        name: 'Hud',
        nameArabic: 'هود',
        variations: ['hud'],
        topics: ['Ad People', 'Warning', 'Destruction']
      },
      {
        key: 'salih',
        name: 'Salih',
        nameArabic: 'صالح',
        variations: ['salih', 'saleh'],
        topics: ['Thamud', 'She-Camel', 'Warning']
      },
      {
        key: 'shuayb',
        name: "Shu'ayb",
        nameArabic: 'شعيب',
        variations: ['shuayb', 'jethro'],
        topics: ['Midian', 'Justice', 'Trade']
      },
      {
        key: 'idris',
        name: 'Idris (Enoch)',
        nameArabic: 'إدريس',
        variations: ['idris', 'enoch'],
        topics: ['Righteousness', 'Elevated']
      },
      {
        key: 'dhulkifl',
        name: 'Dhul-Kifl',
        nameArabic: 'ذو الكفل',
        variations: ['dhulkifl', 'ezekiel'],
        topics: ['Patience', 'Righteousness']
      }
    ];

    // Analyze each prophet
    const prophets: ProphetData[] = [];

    for (const config of prophetsConfig) {
      let mentions = 0;
      const surahsSet = new Set<number>();
      const ayahRefs: Array<{ surah: number; ayah: number }> = [];

      for (const record of records) {
        const textLower = record.Text.toLowerCase();
        const found = config.variations.some(v => textLower.includes(v));

        if (found) {
          // Count occurrences of all variations
          config.variations.forEach(variation => {
            const regex = new RegExp(`\\b${variation}\\b`, 'gi');
            const matches = textLower.match(regex);
            if (matches) mentions += matches.length;
          });

          const surah = parseInt(record.Surah);
          const ayah = parseInt(record.Ayah);
          surahsSet.add(surah);
          ayahRefs.push({ surah, ayah });
        }
      }

      if (mentions > 0) {
        prophets.push({
          key: config.key,
          name: config.name,
          nameArabic: config.nameArabic,
          mentions,
          surahsAppearing: surahsSet.size,
          ayahReferences: ayahRefs.slice(0, 10), // Top 10 references
          relatedTopics: config.topics
        });
      }
    }

    // Sort by mentions (descending)
    prophets.sort((a, b) => b.mentions - a.mentions);

    // Calculate summary
    const summary = {
      totalProphets: prophets.length,
      totalMentions: prophets.reduce((sum, p) => sum + p.mentions, 0),
      avgMentions: Math.round(prophets.reduce((sum, p) => sum + p.mentions, 0) / prophets.length),
      mostMentioned: prophets[0] ? {
        name: prophets[0].name,
        nameArabic: prophets[0].nameArabic,
        mentions: prophets[0].mentions
      } : null,
      leastMentioned: prophets[prophets.length - 1] ? {
        name: prophets[prophets.length - 1].name,
        nameArabic: prophets[prophets.length - 1].nameArabic,
        mentions: prophets[prophets.length - 1].mentions
      } : null
    };

    return NextResponse.json({
      success: true,
      data: {
        prophets,
        summary,
        topProphets: prophets.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Error analyzing prophets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze prophets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
