import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

type Params = {
  params: Promise<{
    ayahId: string;
  }>;
};

/**
 * GET /api/tajweed/ayah/[ayahId]
 * Fetch all tajweed applications for a specific ayah
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { ayahId: ayahIdParam } = await params;
    const ayahId = parseInt(ayahIdParam);

    if (isNaN(ayahId)) {
      return NextResponse.json(
        { error: 'Invalid ayah ID' },
        { status: 400 }
      );
    }

    const applications = await prisma.tajweedApplication.findMany({
      where: {
        ayahId,
      },
      include: {
        rule: true,
      },
      orderBy: {
        startPosition: 'asc',
      },
    });

    // Parse the examples JSON string in each rule
    const applicationsWithParsedRules = applications.map(app => ({
      ...app,
      rule: {
        ...app.rule,
        examples: JSON.parse(app.rule.examples),
      },
    }));

    return NextResponse.json(applicationsWithParsedRules);
  } catch (error) {
    console.error('Error fetching tajweed applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tajweed applications' },
      { status: 500 }
    );
  }
}
