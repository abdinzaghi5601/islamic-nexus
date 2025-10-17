#!/bin/bash

# Automated Embedding Generation Loop Script
# Generates embeddings in batches until complete

cd "$(dirname "$0")/.."

echo "╔════════════════════════════════════════════════════════╗"
echo "║   AUTOMATED EMBEDDING GENERATION - CONTINUOUS MODE     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

BATCH_SIZE=2000
BATCH_COUNT=0
TOTAL_PROCESSED=0

while true; do
  BATCH_COUNT=$((BATCH_COUNT + 1))

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  BATCH #$BATCH_COUNT - Processing $BATCH_SIZE hadiths"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Run embedding generation
  npx tsx scripts/generate-embeddings.ts hadiths $BATCH_SIZE

  EXIT_CODE=$?

  if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ Error occurred in batch #$BATCH_COUNT"
    echo "   Exit code: $EXIT_CODE"
    echo ""
    echo "🔄 Waiting 10 seconds before retrying..."
    sleep 10
    continue
  fi

  TOTAL_PROCESSED=$((TOTAL_PROCESSED + BATCH_SIZE))

  # Check if there are more hadiths to process
  echo ""
  echo "📊 Checking remaining hadiths..."

  # Use node to check progress
  REMAINING=$(node check-progress.js 2>/dev/null | grep "English Embeddings:" | awk '{print $3}' | tr -d ',' || echo "0")

  if [ -z "$REMAINING" ] || [ "$REMAINING" = "0" ]; then
    echo "⚠️  Could not determine remaining count, checking with a test run..."
    # Try a small test batch to see if any remain
    npx tsx scripts/generate-embeddings.ts hadiths 1 2>&1 | grep -q "All Hadiths already have embeddings"
    if [ $? -eq 0 ]; then
      echo ""
      echo "╔════════════════════════════════════════════════════════╗"
      echo "║              ✅ ALL EMBEDDINGS COMPLETE!              ║"
      echo "╚════════════════════════════════════════════════════════╝"
      echo ""
      echo "📊 Total batches processed: $BATCH_COUNT"
      echo "📊 Total hadiths processed: ~$TOTAL_PROCESSED"
      echo ""
      exit 0
    fi
  fi

  echo "✅ Batch #$BATCH_COUNT complete!"
  echo "💾 Total processed so far: ~$TOTAL_PROCESSED hadiths"
  echo ""
  echo "⏸️  Waiting 5 seconds before next batch..."
  sleep 5
done
