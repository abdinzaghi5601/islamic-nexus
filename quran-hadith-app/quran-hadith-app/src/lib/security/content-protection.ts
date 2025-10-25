import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

/**
 * Content Protection System for Islamic Website
 * Prevents unauthorized modifications to Quran, Hadith, and other Islamic content
 */

// Content types that require special protection
export const PROTECTED_CONTENT_TYPES = {
  QURAN: 'quran',
  HADITH: 'hadith',
  TAFSIR: 'tafsir',
  DUAS: 'duas',
  BOOKS: 'books',
} as const;

// Operations that require admin access
export const ADMIN_OPERATIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  IMPORT: 'import',
  EXPORT: 'export',
} as const;

/**
 * Content integrity checker
 */
export class ContentIntegrityChecker {
  /**
   * Verify Quran content integrity
   */
  static async verifyQuranContent(surahNumber: number, ayahNumber: number): Promise<boolean> {
    try {
      const ayah = await prisma.ayah.findFirst({
        where: {
          surahNumber,
          ayahNumber,
        },
      });
      
      return !!ayah;
    } catch (error) {
      console.error('Error verifying Quran content:', error);
      return false;
    }
  }
  
  /**
   * Verify Hadith content integrity
   */
  static async verifyHadithContent(hadithId: number): Promise<boolean> {
    try {
      const hadith = await prisma.hadith.findUnique({
        where: { id: hadithId },
      });
      
      return !!hadith;
    } catch (error) {
      console.error('Error verifying Hadith content:', error);
      return false;
    }
  }
  
  /**
   * Check if content has been modified recently
   */
  static async checkRecentModifications(contentType: string, contentId: number): Promise<boolean> {
    try {
      // This would check a modification log table
      // For now, we'll return false (no recent modifications)
      return false;
    } catch (error) {
      console.error('Error checking recent modifications:', error);
      return false;
    }
  }
}

/**
 * Content modification logger
 */
export class ContentModificationLogger {
  /**
   * Log content modification
   */
  static async logModification(
    contentType: string,
    contentId: number,
    operation: string,
    userId: string,
    details?: any
  ) {
    try {
      // In a real implementation, you would log to a modifications table
      console.log(`[CONTENT_MODIFICATION] ${contentType}:${contentId} - ${operation} by user:${userId}`, details);
      
      // Example: Log to database
      // await prisma.contentModification.create({
      //   data: {
      //     contentType,
      //     contentId,
      //     operation,
      //     userId,
      //     details: JSON.stringify(details),
      //     timestamp: new Date(),
      //   },
      // });
    } catch (error) {
      console.error('Error logging content modification:', error);
    }
  }
  
  /**
   * Get modification history
   */
  static async getModificationHistory(contentType: string, contentId: number) {
    try {
      // This would query the modifications table
      return [];
    } catch (error) {
      console.error('Error getting modification history:', error);
      return [];
    }
  }
}

/**
 * Content access controller
 */
export class ContentAccessController {
  /**
   * Check if user can modify content
   */
  static async canModifyContent(
    contentType: string,
    contentId: number,
    userId: string
  ): Promise<boolean> {
    try {
      // Get user role
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      
      if (!user) return false;
      
      // Only admins can modify protected content
      if (user.role !== 'admin') return false;
      
      // Check if content exists and is not locked
      const isLocked = await this.isContentLocked(contentType, contentId);
      if (isLocked) return false;
      
      return true;
    } catch (error) {
      console.error('Error checking content modification permissions:', error);
      return false;
    }
  }
  
  /**
   * Check if content is locked (being edited by another admin)
   */
  static async isContentLocked(contentType: string, contentId: number): Promise<boolean> {
    try {
      // This would check a content locks table
      // For now, we'll return false (no locks)
      return false;
    } catch (error) {
      console.error('Error checking content lock:', error);
      return false;
    }
  }
  
  /**
   * Lock content for editing
   */
  static async lockContent(
    contentType: string,
    contentId: number,
    userId: string
  ): Promise<boolean> {
    try {
      // This would create a lock in the database
      console.log(`[CONTENT_LOCK] ${contentType}:${contentId} locked by user:${userId}`);
      return true;
    } catch (error) {
      console.error('Error locking content:', error);
      return false;
    }
  }
  
  /**
   * Unlock content
   */
  static async unlockContent(
    contentType: string,
    contentId: number,
    userId: string
  ): Promise<boolean> {
    try {
      // This would remove the lock from the database
      console.log(`[CONTENT_UNLOCK] ${contentType}:${contentId} unlocked by user:${userId}`);
      return true;
    } catch (error) {
      console.error('Error unlocking content:', error);
      return false;
    }
  }
}

/**
 * Content validation for Islamic texts
 */
export class IslamicContentValidator {
  /**
   * Validate Quran text (Arabic)
   */
  static validateQuranText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Quran text cannot be empty' };
    }
    
    // Check for Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    if (!arabicRegex.test(text)) {
      return { valid: false, error: 'Quran text must contain Arabic characters' };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+=/i,
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { valid: false, error: 'Suspicious content detected in Quran text' };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * Validate Hadith text
   */
  static validateHadithText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Hadith text cannot be empty' };
    }
    
    // Check for minimum length
    if (text.trim().length < 10) {
      return { valid: false, error: 'Hadith text too short' };
    }
    
    // Check for maximum length
    if (text.length > 10000) {
      return { valid: false, error: 'Hadith text too long' };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+=/i,
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { valid: false, error: 'Suspicious content detected in Hadith text' };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * Validate translation text
   */
  static validateTranslationText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Translation text cannot be empty' };
    }
    
    // Check for minimum length
    if (text.trim().length < 5) {
      return { valid: false, error: 'Translation text too short' };
    }
    
    // Check for maximum length
    if (text.length > 5000) {
      return { valid: false, error: 'Translation text too long' };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+=/i,
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { valid: false, error: 'Suspicious content detected in translation text' };
      }
    }
    
    return { valid: true };
  }
}

/**
 * Middleware for protecting content modification routes
 */
export async function protectContentModification(
  request: NextRequest,
  contentType: string,
  contentId: number
): Promise<NextResponse | null> {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user can modify content
    const canModify = await ContentAccessController.canModifyContent(
      contentType,
      contentId,
      session.user.id
    );
    
    if (!canModify) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to modify this content' },
        { status: 403 }
      );
    }
    
    // Check content integrity
    let isIntegrityValid = false;
    if (contentType === PROTECTED_CONTENT_TYPES.QURAN) {
      isIntegrityValid = await ContentIntegrityChecker.verifyQuranContent(
        contentId,
        parseInt(request.nextUrl.searchParams.get('ayah') || '0')
      );
    } else if (contentType === PROTECTED_CONTENT_TYPES.HADITH) {
      isIntegrityValid = await ContentIntegrityChecker.verifyHadithContent(contentId);
    }
    
    if (!isIntegrityValid) {
      return NextResponse.json(
        { success: false, message: 'Content integrity check failed' },
        { status: 400 }
      );
    }
    
    // Log the modification attempt
    await ContentModificationLogger.logModification(
      contentType,
      contentId,
      request.method,
      session.user.id,
      {
        ip: request.ip,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date(),
      }
    );
    
    return null; // Continue with the request
  } catch (error) {
    console.error('Error in content protection middleware:', error);
    return NextResponse.json(
      { success: false, message: 'Content protection error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to wrap API routes with content protection
 */
export function withContentProtection(
  contentType: string,
  handler: (request: NextRequest, contentId: number) => Promise<NextResponse>
) {
  return async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const contentId = parseInt(id);
    
    if (isNaN(contentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid content ID' },
        { status: 400 }
      );
    }
    
    // Check content protection
    const protectionError = await protectContentModification(request, contentType, contentId);
    if (protectionError) {
      return protectionError;
    }
    
    // If protection passes, proceed with the handler
    return handler(request, contentId);
  };
}
