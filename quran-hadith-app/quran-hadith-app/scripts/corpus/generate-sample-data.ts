// scripts/corpus/generate-sample-data.ts
// Generate sample corpus data for testing and demonstration
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate sample corpus data for the first surah (Al-Fatiha)
 * This allows you to test the Corpus Analytics feature immediately
 */
async function generateSampleData() {
  console.log('🎨 Generating Sample Corpus Data\n');
  console.log('📖 Will create sample data for Surah Al-Fatiha (7 ayahs)\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing corpus data...');
    await prisma.$transaction([
      prisma.wordMorphology.deleteMany(),
      prisma.wordGrammar.deleteMany(),
      prisma.ayahWord.deleteMany(),
      prisma.wordRoot.deleteMany(),
    ]);
    console.log('✅ Cleared\n');

    // Create common roots
    console.log('🌱 Creating root words...');
    const roots = await Promise.all([
      prisma.wordRoot.create({
        data: { root: 'ح م د', rootSimple: 'حمد', meaning: 'praise, thanks', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ر ح م', rootSimple: 'رحم', meaning: 'mercy, compassion', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'م ل ك', rootSimple: 'ملك', meaning: 'king, dominion', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ع ب د', rootSimple: 'عبد', meaning: 'worship, serve', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ع و ن', rootSimple: 'عون', meaning: 'help, assistance', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ه د ي', rootSimple: 'هدي', meaning: 'guide, guidance', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ص ر ط', rootSimple: 'صرط', meaning: 'path, way', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ق و م', rootSimple: 'قوم', meaning: 'straight, upright', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ن ع م', rootSimple: 'نعم', meaning: 'blessing, favor', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'غ ض ب', rootSimple: 'غضب', meaning: 'anger, wrath', occurrences: 0 },
      }),
      prisma.wordRoot.create({
        data: { root: 'ض ل ل', rootSimple: 'ضلل', meaning: 'astray, lost', occurrences: 0 },
      }),
    ]);
    console.log(`✅ Created ${roots.length} roots\n`);

    // Get first surah
    const surah = await prisma.surah.findFirst({
      where: { number: 1 },
      include: { ayahs: { orderBy: { ayahNumber: 'asc' } } },
    });

    if (!surah) {
      throw new Error('Surah Al-Fatiha not found in database. Run npm run import:quran first.');
    }

    console.log(`📝 Found Surah ${surah.nameEnglish} with ${surah.ayahs.length} ayahs\n`);

    // Sample words for each ayah with linguistic data
    const sampleWords = [
      // Ayah 1: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
      [
        { text: 'بِسْمِ', root: null, pos: 'Particle', gender: 'Masculine', number: 'Singular' },
        { text: 'اللَّهِ', root: null, pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'الرَّحْمَٰنِ', root: 'ر ح م', pos: 'Adjective', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'الرَّحِيمِ', root: 'ر ح م', pos: 'Adjective', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
      ],
      // Ayah 2: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
      [
        { text: 'الْحَمْدُ', root: 'ح م د', pos: 'Noun', case: 'Nominative', gender: 'Masculine', number: 'Singular' },
        { text: 'لِلَّهِ', root: null, pos: 'Particle', gender: 'Masculine', number: 'Singular' },
        { text: 'رَبِّ', root: 'ر ب ب', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'الْعَالَمِينَ', root: 'ع ل م', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Plural' },
      ],
      // Ayah 3: "الرَّحْمَٰنِ الرَّحِيمِ"
      [
        { text: 'الرَّحْمَٰنِ', root: 'ر ح م', pos: 'Adjective', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'الرَّحِيمِ', root: 'ر ح م', pos: 'Adjective', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
      ],
      // Ayah 4: "مَالِكِ يَوْمِ الدِّينِ"
      [
        { text: 'مَالِكِ', root: 'م ل ك', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'يَوْمِ', root: 'ي و م', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'الدِّينِ', root: 'د ي ن', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
      ],
      // Ayah 5: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
      [
        { text: 'إِيَّاكَ', root: null, pos: 'Pronoun', person: 'Second', gender: 'Masculine', number: 'Singular' },
        { text: 'نَعْبُدُ', root: 'ع ب د', pos: 'Verb', tense: 'Present', person: 'First', number: 'Plural', form: 'I' },
        { text: 'وَإِيَّاكَ', root: null, pos: 'Pronoun', person: 'Second', gender: 'Masculine', number: 'Singular' },
        { text: 'نَسْتَعِينُ', root: 'ع و ن', pos: 'Verb', tense: 'Present', person: 'First', number: 'Plural', form: 'X' },
      ],
      // Ayah 6: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
      [
        { text: 'اهْدِنَا', root: 'ه د ي', pos: 'Verb', tense: 'Imperative', person: 'Second', number: 'Singular', form: 'I' },
        { text: 'الصِّرَاطَ', root: 'ص ر ط', pos: 'Noun', case: 'Accusative', gender: 'Masculine', number: 'Singular' },
        { text: 'الْمُسْتَقِيمَ', root: 'ق و م', pos: 'Adjective', case: 'Accusative', gender: 'Masculine', number: 'Singular' },
      ],
      // Ayah 7: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ..."
      [
        { text: 'صِرَاطَ', root: 'ص ر ط', pos: 'Noun', case: 'Accusative', gender: 'Masculine', number: 'Singular' },
        { text: 'الَّذِينَ', root: null, pos: 'Pronoun', gender: 'Masculine', number: 'Plural' },
        { text: 'أَنْعَمْتَ', root: 'ن ع م', pos: 'Verb', tense: 'Past', person: 'Second', number: 'Singular', form: 'IV' },
        { text: 'عَلَيْهِمْ', root: null, pos: 'Particle', number: 'Plural' },
        { text: 'غَيْرِ', root: 'غ ي ر', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Singular' },
        { text: 'الْمَغْضُوبِ', root: 'غ ض ب', pos: 'Verb', tense: 'Past', gender: 'Masculine', number: 'Singular' },
        { text: 'عَلَيْهِمْ', root: null, pos: 'Particle', number: 'Plural' },
        { text: 'وَلَا', root: null, pos: 'Particle' },
        { text: 'الضَّالِّينَ', root: 'ض ل ل', pos: 'Noun', case: 'Genitive', gender: 'Masculine', number: 'Plural' },
      ],
    ];

    let totalWords = 0;
    let totalGrammar = 0;
    let totalMorphology = 0;

    // Import words for each ayah
    for (let i = 0; i < Math.min(surah.ayahs.length, sampleWords.length); i++) {
      const ayah = surah.ayahs[i];
      const words = sampleWords[i];

      console.log(`   Ayah ${ayah.ayahNumber}: ${words.length} words`);

      for (let j = 0; j < words.length; j++) {
        const wordData = words[j];

        // Get or create root
        const root = wordData.root
          ? await prisma.wordRoot.findFirst({ where: { root: wordData.root } })
          : null;

        if (root) {
          await prisma.wordRoot.update({
            where: { id: root.id },
            data: { occurrences: { increment: 1 } },
          });
        }

        // Create word
        const word = await prisma.ayahWord.create({
          data: {
            ayahId: ayah.id,
            position: j + 1,
            textArabic: wordData.text,
            textSimplified: wordData.text.normalize('NFD').replace(/[\u064B-\u065F]/g, ''),
            rootId: root?.id,
          },
        });
        totalWords++;

        // Create grammar
        if (wordData.pos) {
          await prisma.wordGrammar.create({
            data: {
              wordId: word.id,
              partOfSpeech: wordData.pos,
              root: wordData.root || null,
              case_: wordData.case || null,
              gender: wordData.gender || null,
              number: wordData.number || null,
              person: wordData.person || null,
              tense: wordData.tense || null,
              form: wordData.form || null,
            },
          });
          totalGrammar++;
        }

        // Create morphology
        await prisma.wordMorphology.create({
          data: {
            wordId: word.id,
            stem: wordData.text,
            lemma: wordData.text,
          },
        });
        totalMorphology++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ SAMPLE DATA GENERATED!\n');
    console.log('📊 Statistics:');
    console.log(`   Words:       ${totalWords}`);
    console.log(`   Roots:       ${roots.length}`);
    console.log(`   Grammar:     ${totalGrammar}`);
    console.log(`   Morphology:  ${totalMorphology}`);
    console.log('='.repeat(50) + '\n');

    console.log('✨ Next steps:');
    console.log('   1. Go to http://localhost:3000/analytics');
    console.log('   2. Click "Corpus Analysis 🌱" tab');
    console.log('   3. See the visualizations!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  generateSampleData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { generateSampleData };
