import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCleanedAyahText, removeBismillah, containsBismillah } from '@/lib/utils/bismillah';

export async function GET() {
  try {
    // Test with Surah 2, Ayah 1
    const ayahData = await prisma.ayah.findFirst({
      where: {
        surahId: 2,
        ayahNumber: 1,
      },
      include: {
        surah: true,
      },
    });

    if (!ayahData) {
      return NextResponse.json({ error: 'Ayah not found' }, { status: 404 });
    }

    const originalText = ayahData.textArabic;
    const cleanedText = getCleanedAyahText(originalText, 2, 1);
    const hasBismillah = containsBismillah(originalText);
    const manualRemoval = removeBismillah(originalText);

    return NextResponse.json({
      surah: 2,
      ayah: 1,
      originalText,
      originalLength: originalText.length,
      cleanedText,
      cleanedLength: cleanedText.length,
      hasBismillah,
      manualRemoval,
      manualRemovalLength: manualRemoval.length,
      charactersRemoved: originalText.length - cleanedText.length,
      testPassed: cleanedText !== originalText && !containsBismillah(cleanedText),
      expectedStart: 'الٓمٓ',
      actualStart: cleanedText.substring(0, 10),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to test',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
