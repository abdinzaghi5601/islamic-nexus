import { semanticSearchAll } from '../src/lib/utils/semantic-search';

async function testSemanticSearchAPI() {
  console.log('🔍 Testing Semantic Search API\n');

  const testQueries = [
    { query: 'patience in difficult times', language: 'english' as const },
    { query: 'being grateful to God', language: 'english' as const },
    { query: 'الصبر', language: 'arabic' as const },
  ];

  for (const { query, language } of testQueries) {
    console.log(`\n📝 Query: "${query}" (${language})`);
    console.log('─'.repeat(60));

    try {
      const startTime = Date.now();
      const results = await semanticSearchAll(query, {
        language,
        similarityThreshold: 0.6,
        maxResults: 3,
        types: ['ayah'],
      });
      const searchTime = Date.now() - startTime;

      if (results.length === 0) {
        console.log('❌ No results found');
        console.log('   (This is expected if only 3 ayahs have embeddings)');
      } else {
        console.log(`✅ Found ${results.length} results in ${searchTime}ms\n`);
        results.forEach((result, i) => {
          console.log(`   ${i + 1}. ${result.content.reference} (similarity: ${(result.similarity * 100).toFixed(1)}%)`);
          console.log(`      ${result.content.textEnglish.substring(0, 100)}...`);
          if (language === 'arabic') {
            console.log(`      ${result.content.textArabic.substring(0, 80)}...`);
          }
          console.log();
        });
      }
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n✨ Semantic search test completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Generate more embeddings for better results');
  console.log('   2. Run: npm run generate:embeddings:ayahs');
  console.log('   3. Test with the dev server running');
}

testSemanticSearchAPI();
