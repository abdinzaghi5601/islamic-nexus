import { NextRequest } from 'next/server';
import { z } from 'zod';

/**
 * Security validation utilities for the Islamic website
 * Protects against XSS, SQL injection, and other attacks
 */

// Common validation schemas
export const ValidationSchemas = {
  // User input validation
  email: z.string().email().max(255).trim(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).trim(),
  
  // Islamic content validation
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1).max(286),
  hadithId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  
  // Search validation
  searchQuery: z.string().min(1).max(500).trim(),
  
  // Pagination validation
  page: z.number().int().min(1).max(1000).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  
  // Admin content validation
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(10000).trim(),
  description: z.string().max(1000).trim().optional(),
};

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHTML(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;');
}

/**
 * Sanitize text content (removes potentially dangerous characters)
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/iframe/gi, '') // Remove iframe tags
    .replace(/object/gi, '') // Remove object tags
    .replace(/embed/gi, '') // Remove embed tags
    .replace(/link/gi, '') // Remove link tags
    .replace(/meta/gi, '') // Remove meta tags
    .replace(/style/gi, '') // Remove style tags
    .replace(/form/gi, '') // Remove form tags
    .replace(/input/gi, '') // Remove input tags
    .replace(/button/gi, '') // Remove button tags
    .replace(/select/gi, '') // Remove select tags
    .replace(/textarea/gi, '') // Remove textarea tags
    .replace(/[^\w\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, ''); // Keep only alphanumeric, spaces, and Arabic characters
}

/**
 * Validate and sanitize search query
 */
export function validateSearchQuery(query: string): string {
  if (!query) return '';
  
  // Remove SQL injection patterns
  const sanitized = query
    .replace(/['"]/g, '') // Remove quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL comment start
    .replace(/\*\//g, '') // Remove SQL comment end
    .replace(/union/gi, '') // Remove UNION
    .replace(/select/gi, '') // Remove SELECT
    .replace(/insert/gi, '') // Remove INSERT
    .replace(/update/gi, '') // Remove UPDATE
    .replace(/delete/gi, '') // Remove DELETE
    .replace(/drop/gi, '') // Remove DROP
    .replace(/create/gi, '') // Remove CREATE
    .replace(/alter/gi, '') // Remove ALTER
    .replace(/exec/gi, '') // Remove EXEC
    .replace(/execute/gi, '') // Remove EXECUTE
    .trim();
  
  return sanitized;
}

/**
 * Validate Islamic content (Quran, Hadith, etc.)
 */
export function validateIslamicContent(content: string): string {
  if (!content) return '';
  
  // Remove potentially dangerous content while preserving Islamic text
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object[^>]*>.*?<\/object>/gi, '') // Remove object tags
    .replace(/<embed[^>]*>/gi, '') // Remove embed tags
    .replace(/<link[^>]*>/gi, '') // Remove link tags
    .replace(/<meta[^>]*>/gi, '') // Remove meta tags
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remove style tags
    .replace(/<form[^>]*>.*?<\/form>/gi, '') // Remove form tags
    .replace(/<input[^>]*>/gi, '') // Remove input tags
    .replace(/<button[^>]*>.*?<\/button>/gi, '') // Remove button tags
    .replace(/<select[^>]*>.*?<\/select>/gi, '') // Remove select tags
    .replace(/<textarea[^>]*>.*?<\/textarea>/gi, '') // Remove textarea tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate request body for API routes
 */
export function validateRequestBody<T>(request: NextRequest, schema: z.ZodSchema<T>): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      resolve(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reject(new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`));
      } else {
        reject(new Error('Invalid request body'));
      }
    }
  });
}

/**
 * Validate query parameters
 */
export function validateQueryParams<T>(request: NextRequest, schema: z.ZodSchema<T>): T {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Query validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Invalid query parameters');
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size too large. Maximum 10MB allowed.' };
  }
  
  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/json',
    'text/csv'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed.' };
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // Script tags
    /javascript:/i, // JavaScript protocol
    /vbscript:/i, // VBScript protocol
    /on\w+=/i, // Event handlers
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return { valid: false, error: 'Suspicious file name detected.' };
    }
  }
  
  return { valid: true };
}

/**
 * Validate URL parameters
 */
export function validateURLParams<T>(params: Record<string, string | string[]>, schema: z.ZodSchema<T>): T {
  try {
    // Convert string arrays to single strings (take first value)
    const normalizedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value
      ])
    );
    
    return schema.parse(normalizedParams);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`URL parameter validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Invalid URL parameters');
  }
}

/**
 * Security headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Log security events
 */
export function logSecurityEvent(
  event: string,
  details: {
    ip?: string;
    userAgent?: string;
    path?: string;
    userId?: string;
    error?: string;
    data?: any;
  }
) {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY] ${timestamp} - ${event}`, details);
  
  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external logging service
    // await sendToLoggingService({ event, timestamp, ...details });
  }
}
