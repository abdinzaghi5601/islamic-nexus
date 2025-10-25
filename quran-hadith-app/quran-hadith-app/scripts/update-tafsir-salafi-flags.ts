/**
 * Update Tafsir Books with Salafi Verification Flags
 *
 * This script updates the database to mark which tafsir books are verified by Salafi scholars
 * and removes Sufi tafsirs from the database.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Salafi-verified tafsir authors (based on scholarly consensus)
const SALAFI_VERIFIED_AUTHORS = [
  'Ismail ibn Kathir',
  'Hafiz Ibn Kathir',
  'Al-Tabari',
  'Al-Baghawi',
  'Al-Qurtubi',
  'عبد الرحمن بن ناصر السعدي', // Al-Sa'di
  'Abdullah Ibn Abbas',
  'Al-Wahidi',
  'Tanweer', // Tanwir al-Miqbas (Ibn Abbas attribution)
  'المیسر', // Al-Muyassar (King Fahd Complex)
  'Waseet', // Al-Wasit (generally acceptable)
  'AbdulRahman Bin Hasan Al-Alshaikh',
  'Tawheed Publication', // Bengali Ibn Kathir
  'Bayaan Foundation', // Ahsanul Bayaan
  'King Fahd Quran Printing Complex',
  'Абдур-Рахман ибн Насир ас-Саади', // Russian Al-Sa'di
  'Rebar', // Kurdish tafsir
];

// Sufi/Mystical tafsir authors/names to REMOVE
const SUFI_NAMES_TO_REMOVE = [
  'Tafsir al-Tustari',
  'Kashani Tafsir',
  'Al-Qushairi Tafsir',
  'Kashf Al-Asrar Tafsir',
];

const SUFI_AUTHORS_TO_REMOVE = [
  'Sahl ibn Abdullah al-Tustari',
  'Al-Qushairi',
  'Abd al-Razzaq Kashani',
  'Rashid al-Din Maybudi',
];

async function main() {
  console.log('🔄 Starting Tafsir Salafi Verification Update...\n');

  // Step 1: Remove Sufi tafsirs (by name or author)
  console.log('📋 Step 1: Removing Sufi tafsirs from database...');

  // First, find the Sufi tafsir book IDs
  const sufiBooks = await prisma.tafsirBook.findMany({
    where: {
      OR: [
        {
          authorName: {
            in: SUFI_AUTHORS_TO_REMOVE,
          },
        },
        {
          name: {
            in: SUFI_NAMES_TO_REMOVE,
          },
        },
      ],
    },
    select: { id: true, name: true },
  });

  console.log(`Found ${sufiBooks.length} Sufi tafsir books to remove:`);
  sufiBooks.forEach(book => console.log(`  - ${book.name}`));

  // Delete associated verses first (to avoid foreign key constraint)
  if (sufiBooks.length > 0) {
    const sufiBookIds = sufiBooks.map(b => b.id);
    const deletedVerses = await prisma.tafsirVerse.deleteMany({
      where: {
        tafsirBookId: {
          in: sufiBookIds,
        },
      },
    });
    console.log(`✅ Deleted ${deletedVerses.count} associated verses`);

    // Now delete the books
    const deletedCount = await prisma.tafsirBook.deleteMany({
      where: {
        id: {
          in: sufiBookIds,
        },
      },
    });
    console.log(`✅ Removed ${deletedCount.count} Sufi tafsir books\n`);
  } else {
    console.log('✅ No Sufi tafsir books found in database\n');
  }

  // Step 2: Mark Salafi-verified tafsirs as true
  console.log('📋 Step 2: Marking Salafi-verified tafsirs...');
  const verifiedUpdate = await prisma.tafsirBook.updateMany({
    where: {
      authorName: {
        in: SALAFI_VERIFIED_AUTHORS,
      },
    },
    data: {
      salafiVerified: true,
    },
  });
  console.log(`✅ Marked ${verifiedUpdate.count} tafsirs as Salafi-verified\n`);

  // Step 3: Mark non-Salafi tafsirs as false
  console.log('📋 Step 3: Marking non-Salafi tafsirs...');
  const nonVerifiedUpdate = await prisma.tafsirBook.updateMany({
    where: {
      authorName: {
        notIn: SALAFI_VERIFIED_AUTHORS,
      },
    },
    data: {
      salafiVerified: false,
    },
  });
  console.log(`✅ Marked ${nonVerifiedUpdate.count} tafsirs as non-Salafi\n`);

  // Step 4: Display summary
  console.log('📊 Summary of Tafsir Books:\n');

  const salafiCount = await prisma.tafsirBook.count({
    where: { salafiVerified: true },
  });

  const nonSalafiCount = await prisma.tafsirBook.count({
    where: { salafiVerified: false },
  });

  const totalCount = await prisma.tafsirBook.count();

  console.log(`Total Tafsir Books: ${totalCount}`);
  console.log(`✅ Salafi-Verified: ${salafiCount}`);
  console.log(`⚠️  Non-Salafi: ${nonSalafiCount}\n`);

  // Step 5: List all tafsirs by verification status
  console.log('📚 Salafi-Verified Tafsirs:');
  const salafiTafsirs = await prisma.tafsirBook.findMany({
    where: { salafiVerified: true },
    select: { name: true, authorName: true, language: true },
  });
  salafiTafsirs.forEach(t => {
    console.log(`  ✅ ${t.name} - ${t.authorName} (${t.language})`);
  });

  console.log('\n⚠️  Non-Salafi Tafsirs:');
  const nonSalafiTafsirs = await prisma.tafsirBook.findMany({
    where: { salafiVerified: false },
    select: { name: true, authorName: true, language: true },
  });
  nonSalafiTafsirs.forEach(t => {
    console.log(`  ⚠️  ${t.name} - ${t.authorName} (${t.language})`);
  });

  console.log('\n✅ Update completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
