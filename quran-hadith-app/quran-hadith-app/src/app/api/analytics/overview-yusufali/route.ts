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
 * Overview Analytics from Yusuf Ali Translation
 * GET /api/analytics/overview-yusufali
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

    // Surah names mapping (114 surahs)
    const surahNames: { [key: number]: { name: string; arabic: string; type: string } } = {
      1: { name: 'Al-Fatiha', arabic: 'الفاتحة', type: 'Meccan' },
      2: { name: 'Al-Baqarah', arabic: 'البقرة', type: 'Medinan' },
      3: { name: 'Ali Imran', arabic: 'آل عمران', type: 'Medinan' },
      4: { name: 'An-Nisa', arabic: 'النساء', type: 'Medinan' },
      5: { name: 'Al-Ma\'idah', arabic: 'المائدة', type: 'Medinan' },
      6: { name: 'Al-An\'am', arabic: 'الأنعام', type: 'Meccan' },
      7: { name: 'Al-A\'raf', arabic: 'الأعراف', type: 'Meccan' },
      103: { name: 'Al-Asr', arabic: 'العصر', type: 'Meccan' },
      108: { name: 'Al-Kawthar', arabic: 'الكوثر', type: 'Meccan' },
      112: { name: 'Al-Ikhlas', arabic: 'الإخلاص', type: 'Meccan' },
      // Add more as needed...
    };

    // Group by surah
    const surahData = new Map<number, CSVRow[]>();
    let totalWords = 0;

    for (const record of records) {
      const surahNum = parseInt(record.Surah);
      if (!surahData.has(surahNum)) {
        surahData.set(surahNum, []);
      }
      surahData.get(surahNum)!.push(record);

      // Count words
      totalWords += record.Text.split(/\s+/).length;
    }

    // Calculate totals
    const totals = {
      surahs: surahData.size,
      ayahs: records.length,
      totalWords: totalWords,
      uniqueWords: calculateUniqueWords(records)
    };

    // Calculate Meccan vs Medinan (using known data)
    const meccanSurahs = [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114];

    let meccanAyahs = 0;
    let medinanAyahs = 0;

    for (const [surahNum, ayahs] of surahData.entries()) {
      if (meccanSurahs.includes(surahNum)) {
        meccanAyahs += ayahs.length;
      } else {
        medinanAyahs += ayahs.length;
      }
    }

    const revelation = {
      meccan: {
        surahs: meccanSurahs.length,
        ayahs: meccanAyahs
      },
      medinan: {
        surahs: 114 - meccanSurahs.length,
        ayahs: medinanAyahs
      }
    };

    // Find longest and shortest surahs
    const surahLengths = Array.from(surahData.entries()).map(([num, ayahs]) => ({
      number: num,
      name: surahNames[num]?.name || `Surah ${num}`,
      arabic: surahNames[num]?.arabic || '',
      ayahs: ayahs.length
    }));

    surahLengths.sort((a, b) => b.ayahs - a.ayahs);
    const longestSurahs = surahLengths.slice(0, 5);

    surahLengths.sort((a, b) => a.ayahs - b.ayahs);
    const shortestSurahs = surahLengths.slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        totals,
        revelation,
        longestSurahs,
        shortestSurahs
      }
    });

  } catch (error) {
    console.error('Error analyzing overview:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze overview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateUniqueWords(records: CSVRow[]): number {
  const uniqueWords = new Set<string>();
  const stopWords = new Set(['the', 'and', 'of', 'to', 'in', 'a', 'is', 'that', 'for', 'it', 'with', 'be', 'are', 'on', 'as', 'from', 'by', 'at', 'or', 'an', 'will', 'not', 'who', 'but', 'have', 'they', 'this', 'shall', 'them', 'was', 'all', 'their', 'we', 'do', 'you', 'he', 'his', 'what', 'when', 'if', 'can', 'said', 'there', 'so', 'were', 'been']);

  for (const record of records) {
    const words = record.Text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    words.forEach(w => uniqueWords.add(w));
  }

  return uniqueWords.size;
}
