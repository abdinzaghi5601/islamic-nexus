/**
 * Automated Ayah Theme Tagging Script
 *
 * This script automatically tags ayahs with themes based on:
 * 1. Keywords in English translations
 * 2. Keywords in tafsir text
 * 3. Predefined keyword mappings for each theme
 *
 * Usage:
 *   npm run auto-tag-ayahs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Keyword mappings for each theme (lowercase for case-insensitive matching)
const THEME_KEYWORDS: Record<string, string[]> = {
  // Faith & Belief
  'tawhid': ['allah', 'god', 'lord', 'one', 'alone', 'worship', 'deity', 'associate', 'partner'],
  'angels': ['angel', 'gabriel', 'jibril', 'michael', 'mikail'],
  'prophets': ['prophet', 'messenger', 'abraham', 'moses', 'jesus', 'muhammad', 'noah', 'adam'],
  'day-of-judgment': ['judgment', 'day', 'resurrection', 'hour', 'hereafter', 'account', 'reckoning'],
  'paradise': ['paradise', 'garden', 'heaven', 'jannah', 'reward', 'bliss'],
  'hell': ['hell', 'fire', 'punishment', 'torment', 'hellfire', 'jahannam'],

  // Worship & Rituals
  'salah': ['prayer', 'pray', 'salah', 'prostrate', 'bow', 'ruku'],
  'zakat': ['charity', 'zakat', 'alms', 'poor', 'needy', 'spend'],
  'fasting': ['fast', 'fasting', 'ramadan', 'sawm'],
  'hajj': ['pilgrimage', 'hajj', 'kaaba', 'mecca', 'sacred'],
  'dhikr': ['remember', 'remembrance', 'mention', 'glorify', 'praise'],
  'dua': ['call', 'invoke', 'supplication', 'ask', 'pray'],

  // Morals & Character
  'patience': ['patient', 'patience', 'persevere', 'endure', 'steadfast'],
  'gratitude': ['grateful', 'thank', 'gratitude', 'appreciate'],
  'honesty': ['truth', 'truthful', 'honest', 'trust', 'trustworthy'],
  'kindness': ['kind', 'mercy', 'compassion', 'gentle', 'merciful'],
  'humility': ['humble', 'humility', 'modest', 'arrogant', 'pride'],
  'forgiveness': ['forgive', 'pardon', 'mercy', 'forgiving'],
  'justice': ['just', 'justice', 'fair', 'equity', 'witness'],

  // Life Guidance
  'family-marriage': ['marriage', 'marry', 'spouse', 'wife', 'husband', 'family'],
  'parents-children': ['parent', 'mother', 'father', 'child', 'children', 'son', 'daughter'],
  'knowledge': ['knowledge', 'learn', 'teach', 'wise', 'wisdom', 'understand'],
  'work-business': ['work', 'business', 'trade', 'commerce', 'wealth', 'earn'],
  'wealth-poverty': ['wealth', 'poor', 'poverty', 'rich', 'provision', 'sustenance'],

  // Stories & History
  'prophet-muhammad': ['muhammad', 'prophet', 'messenger'],
  'prophet-ibrahim': ['abraham', 'ibrahim'],
  'prophet-musa': ['moses', 'musa'],
  'prophet-isa': ['jesus', 'isa', 'mary', 'maryam'],
  'previous-nations': ['nation', 'people', 'destroyed', 'ad', 'thamud'],

  // Creation & Nature
  'human-creation': ['create', 'created', 'creation', 'human', 'mankind'],
  'heavens-earth': ['heaven', 'earth', 'sky', 'star', 'sun', 'moon'],
  'natural-phenomena': ['rain', 'water', 'wind', 'mountain', 'sea', 'ocean'],

  // Trials & Challenges
  'illness-health': ['illness', 'sick', 'heal', 'disease', 'afflict'],
  'death-afterlife': ['death', 'die', 'dead', 'grave', 'afterlife'],
  'loss-grief': ['loss', 'grief', 'sorrow', 'calamity', 'distress'],
  'persecution': ['persecute', 'oppress', 'harm', 'enemy', 'fight'],

  // Quran & Revelation
  'quran-guidance': ['quran', 'book', 'revelation', 'guidance', 'guide'],
  'quran-miracles': ['sign', 'miracle', 'verse', 'clear'],
  'previous-scriptures': ['torah', 'gospel', 'scripture', 'book'],
};

async function autoTagAyahs() {
  console.log('🏷️  Starting Automated Ayah Theme Tagging...\n');

  try {
    // Step 1: Get all themes
    console.log('📋 Step 1: Loading themes...');
    const themes = await prisma.ayahTheme.findMany();
    const themeMap = new Map<string, number>();
    themes.forEach((t) => themeMap.set(t.slug, t.id));
    console.log(`   ✅ Loaded ${themes.length} themes\n`);

    // Step 2: Get all ayahs with translations and tafsirs
    console.log('📖 Step 2: Loading ayahs with translations and tafsirs...');
    const ayahs = await prisma.ayah.findMany({
      include: {
        translations: {
          include: { translator: true },
        },
        tafsirs: {
          include: { tafsirBook: true },
        },
        surah: true,
      },
      orderBy: { numberInQuran: 'asc' },
    });
    console.log(`   ✅ Loaded ${ayahs.length} ayahs\n`);

    // Step 3: Process ayahs in batches
    console.log('🔍 Step 3: Analyzing and tagging ayahs...\n');

    let taggedCount = 0;
    let batchCount = 0;
    const BATCH_SIZE = 100;

    for (let i = 0; i < ayahs.length; i += BATCH_SIZE) {
      const batch = ayahs.slice(i, i + BATCH_SIZE);
      batchCount++;

      console.log(`   📦 Processing batch ${batchCount} (${i + 1}-${i + batch.length})...`);

      for (const ayah of batch) {
        // Combine all text for keyword matching
        const translationTexts = ayah.translations.map((t) => t.text.toLowerCase()).join(' ');
        const tafsirTexts = ayah.tafsirs.map((t) => t.text.toLowerCase()).join(' ');
        const combinedText = `${translationTexts} ${tafsirTexts}`;

        // Match keywords to themes
        const matchedThemes = new Map<string, number>(); // slug -> relevance score

        for (const [themeSlug, keywords] of Object.entries(THEME_KEYWORDS)) {
          let relevance = 0;

          for (const keyword of keywords) {
            const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
            const matches = combinedText.match(regex);
            if (matches) {
              relevance += matches.length;
            }
          }

          if (relevance > 0) {
            matchedThemes.set(themeSlug, relevance);
          }
        }

        // Tag ayah with matched themes (top 3 most relevant)
        const sortedThemes = Array.from(matchedThemes.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3); // Top 3 themes

        for (const [themeSlug, relevance] of sortedThemes) {
          const themeId = themeMap.get(themeSlug);
          if (themeId) {
            try {
              await prisma.ayahThemeMapping.create({
                data: {
                  ayahId: ayah.id,
                  themeId: themeId,
                  relevance: Math.min(relevance, 10), // Cap at 10
                },
              });
              taggedCount++;
            } catch (error) {
              // Skip if already exists
            }
          }
        }
      }

      console.log(`      ✅ Batch ${batchCount} complete`);

      // Small delay to avoid overwhelming database
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Automated Tagging Complete!\n');
    console.log('Summary:');
    console.log(`- Ayahs processed: ${ayahs.length}`);
    console.log(`- Theme mappings created: ${taggedCount}`);
    console.log(`- Average tags per ayah: ${(taggedCount / ayahs.length).toFixed(2)}`);
    console.log('\n✅ Ayahs are now intelligently categorized by themes!');
    console.log('💡 View results: npm run db:studio -> ayah_theme_mappings');
  } catch (error) {
    console.error('❌ Error during tagging:', error);
    throw error;
  }
}

autoTagAyahs()
  .catch((e) => {
    console.error('❌ Tagging failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
