import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPgVector() {
  try {
    console.log('🔍 Checking PostgreSQL extensions...\n');

    // Check available extensions
    const availableExtensions: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM pg_available_extensions
      WHERE name LIKE '%vector%' OR name LIKE '%embedding%'
      ORDER BY name;
    `);

    console.log('📦 Available vector/embedding extensions:');
    if (availableExtensions.length > 0) {
      availableExtensions.forEach(ext => {
        console.log(`  - ${ext.name} (${ext.default_version}): ${ext.comment}`);
      });
    } else {
      console.log('  ❌ No vector extensions found');
    }

    console.log('\n🔌 Currently installed extensions:');
    const installedExtensions: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM pg_extension ORDER BY extname;
    `);

    installedExtensions.forEach(ext => {
      console.log(`  ✅ ${ext.extname}`);
    });

    // Try to create pgvector extension
    console.log('\n🚀 Attempting to enable pgvector extension...');
    try {
      await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('✅ pgvector extension enabled successfully!');

      // Test vector functionality
      await prisma.$executeRawUnsafe('SELECT vector_dims(\'[1,2,3]\'::vector);');
      console.log('✅ pgvector is working correctly!');
    } catch (err: any) {
      console.log('❌ Failed to enable pgvector:', err.message);
      console.log('\n📋 Solutions:');
      console.log('1. Contact Railway support to enable pgvector extension');
      console.log('2. Or use Railway CLI: railway run psql -c "CREATE EXTENSION vector;"');
      console.log('3. Or switch to a PostgreSQL provider that supports pgvector (Supabase, Neon, etc.)');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPgVector();
