import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { ayahId: string } }
) {
  try {
    const ayahId = parseInt(params.ayahId);

    if (isNaN(ayahId)) {
      return NextResponse.json(
        { error: 'Invalid ayah ID' },
        { status: 400 }
      );
    }

    // Fetch all words for this ayah with their translations and grammar
    const words = await prisma.ayahWord.findMany({
      where: { ayahId },
      include: {
        translations: true,
        grammar: true,
        root: true,
      },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error('Error fetching ayah words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ayah words' },
      { status: 500 }
    );
  }
}
