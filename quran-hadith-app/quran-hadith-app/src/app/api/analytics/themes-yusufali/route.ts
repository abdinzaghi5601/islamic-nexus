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
 * Themes Analytics from Yusuf Ali Translation
 * GET /api/analytics/themes-yusufali
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

    // Define major themes with keywords
    const themesConfig = [
      {
        id: 1,
        name: 'Belief and Faith',
        nameArabic: 'الإيمان',
        description: 'Faith in Allah, belief in the unseen, and trust in divine guidance',
        keywords: ['believe', 'faith', 'faithful', 'believers', 'trust', 'conviction'],
        subThemes: ['Monotheism', 'Trust in Allah', 'Unseen', 'Day of Judgment']
      },
      {
        id: 2,
        name: 'Prayer and Worship',
        nameArabic: 'العبادة والصلاة',
        description: 'Acts of worship, prayer, prostration, and devotion to Allah',
        keywords: ['prayer', 'pray', 'worship', 'bow', 'prostrate', 'devotion', 'adoration'],
        subThemes: ['Salah', 'Prostration', 'Remembrance', 'Devotion']
      },
      {
        id: 3,
        name: 'Charity and Social Justice',
        nameArabic: 'الصدقة والعدل',
        description: 'Giving to the poor, social responsibility, and economic justice',
        keywords: ['charity', 'alms', 'spend', 'give', 'poor', 'needy', 'orphan', 'justice'],
        subThemes: ['Zakat', 'Helping Poor', 'Orphans', 'Fair Dealings']
      },
      {
        id: 4,
        name: 'Guidance and Wisdom',
        nameArabic: 'الهداية والحكمة',
        description: 'Divine guidance, the straight path, and wisdom from Allah',
        keywords: ['guide', 'guidance', 'path', 'way', 'straight', 'wisdom', 'knowledge'],
        subThemes: ['Straight Path', 'Quran as Guide', 'Divine Wisdom', 'Knowledge']
      },
      {
        id: 5,
        name: 'Paradise and Reward',
        nameArabic: 'الجنة والأجر',
        description: 'Eternal gardens, heavenly rewards for the righteous',
        keywords: ['garden', 'paradise', 'heaven', 'reward', 'bliss', 'rivers', 'eternal'],
        subThemes: ['Gardens of Eden', 'Eternal Life', 'Rivers', 'Companions']
      },
      {
        id: 6,
        name: 'Hellfire and Punishment',
        nameArabic: 'النار والعقاب',
        description: 'Consequences for disbelief and rejection of truth',
        keywords: ['fire', 'hell', 'punishment', 'penalty', 'torment', 'wrath', 'blazing'],
        subThemes: ['Eternal Fire', 'Divine Justice', 'Warning', 'Accountability']
      },
      {
        id: 7,
        name: 'Mercy and Forgiveness',
        nameArabic: 'الرحمة والمغفرة',
        description: "Allah's infinite mercy and forgiveness for those who repent",
        keywords: ['mercy', 'merciful', 'forgive', 'forgiveness', 'compassion', 'repent', 'pardon'],
        subThemes: ['Divine Mercy', 'Repentance', 'Compassion', 'Pardon']
      },
      {
        id: 8,
        name: 'Prophets and Messengers',
        nameArabic: 'الأنبياء والرسل',
        description: 'Stories of prophets sent to guide humanity',
        keywords: ['prophet', 'messenger', 'moses', 'abraham', 'jesus', 'noah', 'apostle'],
        subThemes: ['Biblical Prophets', 'Previous Nations', 'Prophetic Stories', 'Divine Message']
      },
      {
        id: 9,
        name: 'Day of Judgment',
        nameArabic: 'يوم القيامة',
        description: 'The final day, resurrection, and divine judgment',
        keywords: ['judgment', 'resurrection', 'account', 'hereafter', 'last day', 'reckoning'],
        subThemes: ['Resurrection', 'Final Judgment', 'Scales', 'Accountability']
      },
      {
        id: 10,
        name: 'Creation and Signs',
        nameArabic: 'الخلق والآيات',
        description: "Signs of Allah's creation in the universe",
        keywords: ['creation', 'created', 'heavens', 'earth', 'signs', 'universe', 'nature'],
        subThemes: ['Natural Signs', 'Heavens and Earth', 'Miracles', 'Reflection']
      },
      {
        id: 11,
        name: 'Patience and Perseverance',
        nameArabic: 'الصبر والمثابرة',
        description: 'Endurance, patience in adversity, and steadfastness',
        keywords: ['patient', 'patience', 'persever', 'steadfast', 'endure', 'forbear'],
        subThemes: ['Trials', 'Steadfastness', 'Endurance', 'Testing']
      },
      {
        id: 12,
        name: 'Gratitude and Praise',
        nameArabic: 'الشكر والحمد',
        description: 'Thankfulness to Allah and praising His attributes',
        keywords: ['grateful', 'gratitude', 'thank', 'praise', 'glorify', 'exalt'],
        subThemes: ['Thankfulness', 'Praise', 'Glorification', 'Remembrance']
      },
      {
        id: 13,
        name: 'Family and Relationships',
        nameArabic: 'الأسرة والعلاقات',
        description: 'Rights and duties in family and social relationships',
        keywords: ['parents', 'mother', 'father', 'children', 'family', 'relatives', 'kindred'],
        subThemes: ['Parental Rights', 'Children', 'Marriage', 'Family Ties']
      },
      {
        id: 14,
        name: 'Truth and Falsehood',
        nameArabic: 'الحق والباطل',
        description: 'Distinguishing truth from falsehood',
        keywords: ['truth', 'true', 'false', 'falsehood', 'lie', 'honest', 'deceit'],
        subThemes: ['Truthfulness', 'Honesty', 'Deception', 'Clarity']
      },
      {
        id: 15,
        name: 'Struggle and Jihad',
        nameArabic: 'الجهاد',
        description: 'Spiritual and physical struggle in the path of Allah',
        keywords: ['strive', 'fight', 'struggle', 'cause', 'defend', 'battle'],
        subThemes: ['Defense', 'Spiritual Struggle', 'Sacrifice', 'Perseverance']
      }
    ];

    // Analyze themes
    const themes = themesConfig.map(theme => {
      let ayahCount = 0;
      const ayahRefs: Array<{ surah: number; ayah: number }> = [];

      for (const record of records) {
        const textLower = record.Text.toLowerCase();
        const found = theme.keywords.some(keyword => textLower.includes(keyword));

        if (found) {
          ayahCount++;
          ayahRefs.push({
            surah: parseInt(record.Surah),
            ayah: parseInt(record.Ayah)
          });
        }
      }

      return {
        id: theme.id,
        name: theme.name,
        nameArabic: theme.nameArabic,
        description: theme.description,
        ayahCount,
        subThemeCount: theme.subThemes.length,
        subThemes: theme.subThemes.map(st => ({ name: st, ayahCount: 0 })),
        sampleAyahs: ayahRefs.slice(0, 5)
      };
    });

    // Sort by ayah count
    themes.sort((a, b) => b.ayahCount - a.ayahCount);

    // Calculate statistics
    const statistics = {
      totalMainThemes: themes.length,
      totalSubThemes: themes.reduce((sum, t) => sum + t.subThemeCount, 0),
      totalAyahsTagged: themes.reduce((sum, t) => sum + t.ayahCount, 0),
      avgAyahsPerTheme: Math.round(themes.reduce((sum, t) => sum + t.ayahCount, 0) / themes.length)
    };

    return NextResponse.json({
      success: true,
      data: {
        themes,
        statistics,
        topThemes: themes.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Error analyzing themes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze themes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
