// scripts/corpus/parse-morphology.ts
// Parse Quranic Arabic Corpus XML to extract morphological data
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { DATA_DIR } from './download-corpus-data';

interface WordSegment {
  form: string;
  tag: string;
  features?: string;
}

interface ParsedWord {
  surahNumber: number;
  ayahNumber: number;
  position: number;
  textArabic: string;
  segments: WordSegment[];
  root?: string;
  lemma?: string;
  partOfSpeech?: string;
  features?: {
    form?: string;
    mood?: string;
    case?: string;
    number?: string;
    gender?: string;
    person?: string;
    tense?: string;
  };
}

interface ParsedAyah {
  surahNumber: number;
  ayahNumber: number;
  words: ParsedWord[];
}

/**
 * Parse Quranic Morphology XML file
 */
async function parseMorphologyXML(xmlPath?: string): Promise<ParsedAyah[]> {
  const filePath = xmlPath || path.join(DATA_DIR, 'quran-morphology.xml');

  console.log(`📖 Parsing XML file: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}. Run download script first.`);
  }

  const xmlContent = fs.readFileSync(filePath, 'utf-8');
  const parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true,
  });

  const result = await parser.parseStringPromise(xmlContent);
  const ayahs: ParsedAyah[] = [];

  // The XML structure is: <quran><sura><aya><word><segment>
  const suras = Array.isArray(result.quran.sura)
    ? result.quran.sura
    : [result.quran.sura];

  for (const sura of suras) {
    const surahNumber = parseInt(sura.index);
    const ayas = Array.isArray(sura.aya) ? sura.aya : [sura.aya];

    for (const aya of ayas) {
      const ayahNumber = parseInt(aya.index);
      const words: ParsedWord[] = [];

      const ayaWords = Array.isArray(aya.word) ? aya.word : [aya.word];

      for (let i = 0; i < ayaWords.length; i++) {
        const word = ayaWords[i];
        const segments: WordSegment[] = [];

        // Parse segments (morphemes)
        const wordSegments = Array.isArray(word.segment)
          ? word.segment
          : word.segment ? [word.segment] : [];

        for (const segment of wordSegments) {
          segments.push({
            form: segment.form || '',
            tag: segment.tag || '',
            features: segment.features || '',
          });
        }

        // Extract root and lemma from first segment (usually the stem)
        const stemSegment = segments.find(s => s.tag?.includes('STEM'));

        words.push({
          surahNumber,
          ayahNumber,
          position: i + 1,
          textArabic: word.text || '',
          segments,
          root: stemSegment?.features?.match(/ROOT:(\S+)/)?.[1],
          lemma: stemSegment?.features?.match(/LEM:(\S+)/)?.[1],
          partOfSpeech: extractPartOfSpeech(segments),
          features: extractGrammarFeatures(segments),
        });
      }

      ayahs.push({
        surahNumber,
        ayahNumber,
        words,
      });
    }
  }

  console.log(`✅ Parsed ${ayahs.length} ayahs from ${suras.length} surahs\n`);
  return ayahs;
}

/**
 * Extract part of speech from word segments
 */
function extractPartOfSpeech(segments: WordSegment[]): string | undefined {
  for (const segment of segments) {
    if (segment.tag?.includes('V')) return 'Verb';
    if (segment.tag?.includes('N')) return 'Noun';
    if (segment.tag?.includes('ADJ')) return 'Adjective';
    if (segment.tag?.includes('PRON')) return 'Pronoun';
    if (segment.tag?.includes('P')) return 'Particle';
    if (segment.tag?.includes('DET')) return 'Determiner';
  }
  return undefined;
}

/**
 * Extract grammatical features from segments
 */
function extractGrammarFeatures(segments: WordSegment[]): ParsedWord['features'] {
  const features: ParsedWord['features'] = {};

  for (const segment of segments) {
    const tag = segment.tag || '';
    const featureStr = segment.features || '';

    // Extract features from tag
    if (tag.includes('PERF')) features.tense = 'Past';
    if (tag.includes('IMPF')) features.tense = 'Present';
    if (tag.includes('IMPV')) features.tense = 'Imperative';

    if (tag.includes('1P')) features.person = 'First';
    if (tag.includes('2P')) features.person = 'Second';
    if (tag.includes('3P')) features.person = 'Third';

    if (tag.includes('MS')) { features.gender = 'Masculine'; features.number = 'Singular'; }
    if (tag.includes('FS')) { features.gender = 'Feminine'; features.number = 'Singular'; }
    if (tag.includes('MD')) { features.gender = 'Masculine'; features.number = 'Dual'; }
    if (tag.includes('FD')) { features.gender = 'Feminine'; features.number = 'Dual'; }
    if (tag.includes('MP')) { features.gender = 'Masculine'; features.number = 'Plural'; }
    if (tag.includes('FP')) { features.gender = 'Feminine'; features.number = 'Plural'; }

    // Extract form from features
    const formMatch = featureStr.match(/FORM:(\w+)/);
    if (formMatch) features.form = formMatch[1];

    // Extract case
    if (featureStr.includes('NOM')) features.case = 'Nominative';
    if (featureStr.includes('ACC')) features.case = 'Accusative';
    if (featureStr.includes('GEN')) features.case = 'Genitive';

    // Extract mood
    if (featureStr.includes('SUBJ')) features.mood = 'Subjunctive';
    if (featureStr.includes('JUSS')) features.mood = 'Jussive';
  }

  return features;
}

export { parseMorphologyXML, ParsedAyah, ParsedWord };

// Run if executed directly
if (require.main === module) {
  parseMorphologyXML()
    .then((ayahs) => {
      console.log(`\n📊 Summary:`);
      console.log(`   Total Ayahs: ${ayahs.length}`);
      console.log(`   Total Words: ${ayahs.reduce((sum, a) => sum + a.words.length, 0)}`);

      // Sample output
      console.log(`\n📝 Sample (Surah 1, Ayah 1):`);
      const firstAyah = ayahs.find(a => a.surahNumber === 1 && a.ayahNumber === 1);
      if (firstAyah) {
        firstAyah.words.forEach((w, i) => {
          console.log(`   ${i + 1}. ${w.textArabic} - ${w.partOfSpeech} (Root: ${w.root || 'N/A'})`);
        });
      }

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}
