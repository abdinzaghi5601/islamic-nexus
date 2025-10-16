import { searchAyahsSemantic } from '../src/lib/utils/semantic-search';

async function demoSemanticSearch() {
  console.log('\n🎯 SEMANTIC SEARCH DEMO\n');
  console.log('════════════════════════════════════════════════════════\n');

  const queries = [
    'God is one and unique',
    'gratitude and thankfulness',
    'creation of the heavens and earth',
    'mercy and compassion',
    'guidance for believers',
  ];

  for (const query of queries) {
    console.log(`\n📝 Query: "${query}"`);
    console.log('─'.repeat(60));

    try {
      const results = await searchAyahsSemantic(query, {
        language: 'english',
        similarityThreshold: 0.5, // Lower threshold for demo
        maxResults: 3,
      });

      if (results.length === 0) {
        console.log('❌ No results found (try generating more embeddings)');
      } else {
        console.log(`✅ Found ${results.length} results:\n`);
        results.forEach((r, i) => {
          console.log(`${i + 1}. ${r.content.reference} (${(r.similarity * 100).toFixed(1)}% similar)`);
          const text = r.content.textEnglish.length > 120
            ? r.content.textEnglish.substring(0, 120) + '...'
            : r.content.textEnglish;
          console.log(`   "${text}"`);
          console.log();
        });
      }
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}\n`);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log('\n✨ Demo complete!');
  console.log('\n💡 Note: With only 253 ayahs, results are limited.');
  console.log('   Generate all 6,236 ayahs for complete coverage:');
  console.log('   npm run generate:embeddings:ayahs\n');
}

demoSemanticSearch();
