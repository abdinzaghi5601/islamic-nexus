import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { withAdminAuth } from '@/middleware/admin-auth';

/**
 * DELETE /api/admin/delete-hadith-from-ayah
 * Deletes a hadith reference from a specific ayah
 * PROTECTED: Requires admin authentication
 */
export const DELETE = withAdminAuth(async (request: Request) => {
  try {
    const { hadithId, ayahId } = await request.json();

    if (!hadithId || !ayahId) {
      return NextResponse.json(
        { error: 'Missing hadithId or ayahId' },
        { status: 400 }
      );
    }

    // Delete the hadith-ayah reference
    await prisma.hadithAyahReference.deleteMany({
      where: {
        hadithId: parseInt(hadithId),
        ayahId: parseInt(ayahId),
      },
    });

    return NextResponse.json(
      { message: 'Hadith reference deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting hadith reference:', error);
    return NextResponse.json(
      { error: 'Failed to delete hadith reference' },
      { status: 500 }
    );
  }
});
