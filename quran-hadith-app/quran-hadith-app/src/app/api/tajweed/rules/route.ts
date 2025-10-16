import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/tajweed/rules
 * Fetch all Tajweed rules
 */
export async function GET() {
  try {
    const rules = await prisma.tajweedRule.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    // Prisma automatically parses Json fields, no need to JSON.parse
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error fetching tajweed rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tajweed rules' },
      { status: 500 }
    );
  }
}
