/**
 * Seed Script for Tajweed Rules
 *
 * This script populates the tajweed_rules table with all standard Tajweed rules
 * from the rules configuration file.
 *
 * Usage: npx tsx scripts/seed-tajweed-rules.ts
 */

import { PrismaClient } from '@prisma/client';
import { TAJWEED_RULES } from '../src/lib/tajweed/rules';

const prisma = new PrismaClient();

async function seedTajweedRules() {
  console.log('🌱 Starting Tajweed rules seeding...\n');

  try {
    // Delete existing rules (optional - uncomment if you want to reset)
    // await prisma.tajweedRule.deleteMany({});
    // console.log('✓ Cleared existing Tajweed rules\n');

    let successCount = 0;
    let errorCount = 0;

    for (const rule of TAJWEED_RULES) {
      try {
        // Check if rule already exists
        const existing = await prisma.tajweedRule.findUnique({
          where: { ruleId: rule.id },
        });

        if (existing) {
          console.log(`⏭  Skipping existing rule: ${rule.name} (${rule.nameArabic})`);
          continue;
        }

        // Create new rule
        await prisma.tajweedRule.create({
          data: {
            ruleId: rule.id,
            name: rule.name,
            nameArabic: rule.nameArabic,
            category: rule.category,
            color: rule.color,
            textColor: rule.textColor,
            description: rule.description,
            examples: JSON.stringify(rule.examples), // Convert array to JSON string
            audioExample: rule.audioExample,
          },
        });

        console.log(`✓ Created: ${rule.name} (${rule.nameArabic})`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create: ${rule.name}`, error);
        errorCount++;
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ Seeding complete!`);
    console.log(`   Successfully created: ${successCount} rules`);
    console.log(`   Skipped/Errors: ${errorCount}`);
    console.log(`   Total rules in config: ${TAJWEED_RULES.length}`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedTajweedRules()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
