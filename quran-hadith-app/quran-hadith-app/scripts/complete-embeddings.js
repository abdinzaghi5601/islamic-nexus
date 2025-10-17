/**
 * Automated Embedding Generation Loop Script
 * Generates embeddings in batches until complete
 */

const { spawn } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BATCH_SIZE = 2000;
let batchCount = 0;
let totalProcessed = 0;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logHeader(title) {
  console.log('\n' + '═'.repeat(70));
  console.log(`  ${title}`);
  console.log('═'.repeat(70) + '\n');
}

async function checkRemainingHadiths() {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as remaining
      FROM hadiths
      WHERE embedding_arabic_jsonb IS NULL
    `;
    return Number(result[0]?.remaining || 0);
  } catch (error) {
    console.error('Error checking remaining hadiths:', error.message);
    return -1;
  }
}

async function runBatch() {
  return new Promise((resolve, reject) => {
    log(`\n🔄 Starting batch #${batchCount + 1}...`, 'cyan');
    log(`   Processing ${BATCH_SIZE} hadiths\n`, 'bright');

    const process = spawn('npx', ['tsx', 'scripts/generate-embeddings.ts', 'hadiths', BATCH_SIZE.toString()], {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code === 0) {
        batchCount++;
        totalProcessed += BATCH_SIZE;
        log(`✅ Batch #${batchCount} complete!`, 'green');
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  logHeader('AUTOMATED EMBEDDING GENERATION - CONTINUOUS MODE');

  log('📊 Checking initial status...', 'cyan');
  let remaining = await checkRemainingHadiths();

  if (remaining === 0) {
    log('\n✅ All hadiths already have embeddings!', 'green');
    await prisma.$disconnect();
    return;
  }

  if (remaining < 0) {
    log('\n❌ Could not connect to database. Please check your DATABASE_URL.', 'red');
    await prisma.$disconnect();
    return;
  }

  log(`   ${remaining.toLocaleString()} hadiths remaining\n`, 'bright');

  const estimatedBatches = Math.ceil(remaining / BATCH_SIZE);
  const estimatedCost = (remaining * 2 * 50 * 0.75 / 1_000_000) * 0.02;
  const estimatedTime = Math.ceil(estimatedBatches * 3); // ~3 minutes per batch

  log('📈 Estimates:', 'yellow');
  log(`   Batches needed: ~${estimatedBatches}`, 'bright');
  log(`   Total cost: ~$${estimatedCost.toFixed(4)}`, 'bright');
  log(`   Estimated time: ~${estimatedTime} minutes`, 'bright');
  log('');

  // Main loop
  while (true) {
    try {
      log('━'.repeat(70), 'blue');
      log(`  BATCH #${batchCount + 1}`, 'blue');
      log('━'.repeat(70), 'blue');

      // Run batch
      await runBatch();

      // Check remaining
      remaining = await checkRemainingHadiths();

      if (remaining === 0) {
        logHeader('✅ ALL EMBEDDINGS COMPLETE!');
        log(`📊 Total batches processed: ${batchCount}`, 'green');
        log(`📊 Total hadiths processed: ~${totalProcessed.toLocaleString()}`, 'green');
        log(`💰 Approximate cost: ~$${((totalProcessed * 2 * 50 * 0.75 / 1_000_000) * 0.02).toFixed(4)}`, 'green');
        log('');
        break;
      }

      log(`\n💾 Progress: ${totalProcessed.toLocaleString()} processed, ${remaining.toLocaleString()} remaining`, 'cyan');
      log('⏸️  Waiting 5 seconds before next batch...', 'yellow');
      await sleep(5000);

    } catch (error) {
      log(`\n❌ Error in batch #${batchCount + 1}: ${error.message}`, 'red');
      log('🔄 Waiting 10 seconds before retrying...', 'yellow');
      await sleep(10000);
    }
  }

  await prisma.$disconnect();
  log('👋 Goodbye!\n', 'cyan');
}

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  log('\n\n⚠️  Interrupted by user', 'yellow');
  log(`📊 Completed ${batchCount} batches (~${totalProcessed.toLocaleString()} hadiths)`, 'cyan');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch(async (error) => {
  console.error('\n❌ Fatal error:', error);
  await prisma.$disconnect();
  process.exit(1);
});
