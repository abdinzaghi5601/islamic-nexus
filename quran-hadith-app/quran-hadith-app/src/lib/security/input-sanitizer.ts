/**
 * Input Sanitization and Validation Library
 *
 * CRITICAL: This protects the Islamic content from any malicious modifications
 * All user inputs MUST pass through these sanitizers before being used
 */

// Dangerous patterns to completely block
const DANGEROUS_PATTERNS = [
  // SQL Injection
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
  /('|(--|;|\/\*|\*\/|xp_|sp_))/g,
  /(OR|AND)\s+\d+\s*=\s*\d+/gi,

  // XSS
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,

  // Command Injection
  /(\||&|;|\$\(|\`)/g,

  // Path Traversal
  /\.\.[\/\\]/g,
  /%2e%2e/gi,

  // Null Bytes
  /%00|\\0/g,
];

/**
 * Sanitize string input - Remove all dangerous patterns
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';

  let sanitized = String(input).trim();

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // HTML entity encoding for extra safety
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.substring(0, 10000); // Max length limit
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(
  input: string | number | null | undefined,
  options: { min?: number; max?: number } = {}
): number {
  const num = Number(input);

  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }

  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = options;

  return Math.max(min, Math.min(max, Math.floor(num)));
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email) return '';

  const sanitized = String(email).trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }

  return sanitized.substring(0, 320); // RFC 5321 max length
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string | null | undefined): string {
  if (!url) return '';

  const sanitized = String(url).trim();

  // Only allow HTTP(S) protocols
  try {
    const parsed = new URL(sanitized);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    return parsed.toString().substring(0, 2048);
  } catch {
    throw new Error('Invalid URL format');
  }
}

/**
 * Sanitize boolean
 */
export function sanitizeBoolean(input: any): boolean {
  if (typeof input === 'boolean') return input;
  if (input === 'true' || input === '1' || input === 1) return true;
  return false;
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(input: any): string[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((item) => typeof item === 'string' || typeof item === 'number')
    .map((item) => sanitizeString(String(item)))
    .filter((item) => item.length > 0)
    .slice(0, 1000); // Max array length
}

/**
 * Sanitize JSON object - Deep sanitization
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return {} as T;

  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key).substring(0, 100);

    if (!sanitizedKey) continue;

    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === 'number') {
      sanitized[sanitizedKey] = sanitizeNumber(value);
    } else if (typeof value === 'boolean') {
      sanitized[sanitizedKey] = sanitizeBoolean(value);
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = sanitizeStringArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
  }

  return sanitized as T;
}

/**
 * Validate surah number (1-114)
 */
export function validateSurahNumber(num: number): number {
  const sanitized = sanitizeNumber(num, { min: 1, max: 114 });

  if (sanitized < 1 || sanitized > 114) {
    throw new Error('Invalid surah number. Must be between 1-114');
  }

  return sanitized;
}

/**
 * Validate ayah number (depends on surah)
 */
export function validateAyahNumber(surah: number, ayah: number): number {
  // Max ayahs per surah (approximate - you should import actual data)
  const maxAyahs: Record<number, number> = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, // ... etc
    // For now, use a safe max
  };

  const max = maxAyahs[surah] || 300;
  const sanitized = sanitizeNumber(ayah, { min: 1, max });

  if (sanitized < 1) {
    throw new Error('Invalid ayah number');
  }

  return sanitized;
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): string {
  const sanitized = sanitizeString(query);

  if (sanitized.length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }

  if (sanitized.length > 500) {
    throw new Error('Search query too long');
  }

  return sanitized;
}

/**
 * Detect if string contains Islamic content that should never be modified
 * Returns true if content appears to be Quranic Arabic or Hadith
 */
export function isProtectedIslamicContent(text: string): boolean {
  // Detect Arabic text (basic check for Arabic Unicode range)
  const arabicRegex = /[\u0600-\u06FF]/;

  // Detect common Quranic phrases
  const quranicPhrases = [
    'بسم الله',
    'الرحمن الرحيم',
    'الحمد لله',
    'قل',
    'يا أيها',
  ];

  // Detect common Hadith phrases
  const hadithPhrases = [
    'قال رسول الله',
    'صلى الله عليه وسلم',
    'رضي الله عنه',
    'عن أبي',
  ];

  const hasArabic = arabicRegex.test(text);
  const hasQuranicPhrase = quranicPhrases.some((phrase) => text.includes(phrase));
  const hasHadithPhrase = hadithPhrases.some((phrase) => text.includes(phrase));

  return hasArabic || hasQuranicPhrase || hasHadithPhrase;
}

/**
 * Log security violation
 */
export function logSecurityViolation(
  type: string,
  input: string,
  ip?: string
): void {
  console.error('[SECURITY VIOLATION]', {
    type,
    input: input.substring(0, 100),
    ip,
    timestamp: new Date().toISOString(),
  });

  // In production, send to external logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToSecurityLog({ type, input, ip, timestamp })
  }
}

/**
 * Master sanitization function - Use this for all API inputs
 */
export function sanitizeAPIInput<T extends Record<string, any>>(
  input: T,
  ip?: string
): T {
  try {
    // Deep sanitization
    const sanitized = sanitizeObject(input);

    // Check for violations in original input
    const inputString = JSON.stringify(input);
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(inputString)) {
        logSecurityViolation('DANGEROUS_PATTERN_DETECTED', inputString, ip);
        throw new Error('Invalid input detected');
      }
    }

    return sanitized;
  } catch (error) {
    logSecurityViolation('SANITIZATION_FAILED', JSON.stringify(input), ip);
    throw error;
  }
}
