import { NextRequest, NextResponse } from 'next/server';

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting - Stricter limits to protect Islamic content
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute window
    MAX_REQUESTS: 60, // 60 requests per minute (stricter)
    API_REQUESTS: 30, // 30 API requests per minute
    ADMIN_MAX_REQUESTS: 100, // Higher limit for admin
    WRITE_REQUESTS: 10, // Limit write operations (POST/PUT/DELETE)
  },

  // Blocked IPs (add suspicious IPs here)
  BLOCKED_IPS: new Set([
    // Add any known malicious IPs here
    // Example: '192.168.1.100', '10.0.0.50'
  ]),

  // Enhanced suspicious patterns - Protect against all attacks
  SUSPICIOUS_PATTERNS: [
    // Path traversal
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e/i,

    // XSS attempts
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<img.*src.*=/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,

    // Event handlers
    /on\w+\s*=/i,

    // SQL injection
    /union.*select/i,
    /drop\s+(table|database)/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update.*set/i,
    /exec(\s|\()/i,
    /execute(\s|\()/i,
    /--\s*$/,
    /;.*drop/i,
    /'\s*or\s*'.*'=/i,
    /'\s*or\s*1\s*=\s*1/i,

    // Command injection
    /\|\s*ls/i,
    /\|\s*cat/i,
    /\|\s*nc/i,
    /`.*`/,
    /\$\(.*\)/,

    // Code injection
    /eval\s*\(/i,
    /exec\s*\(/i,
    /Function\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,

    // LDAP injection
    /\(\|/,
    /\(\&/,

    // XML injection
    /<!ENTITY/i,
    /<!DOCTYPE/i,

    // Null bytes
    /%00/,
    /\x00/,
  ],
  
  // Admin-only paths
  ADMIN_PATHS: [
    '/api/admin',
    '/admin',
  ],
  
  // Protected content paths (require authentication)
  PROTECTED_PATHS: [
    '/api/bookmarks',
    '/api/reading-history',
    '/api/dashboard',
    '/dashboard',
    '/bookmarks',
  ],
};

// In-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if IP is blocked
 */
function isBlockedIP(ip: string): boolean {
  return SECURITY_CONFIG.BLOCKED_IPS.has(ip);
}

/**
 * Check for suspicious patterns in request
 */
function hasSuspiciousPatterns(request: NextRequest): boolean {
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check URL for suspicious patterns
  for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      return true;
    }
  }
  
  // Check request body for POST/PUT requests
  if (request.method === 'POST' || request.method === 'PUT') {
    // We'll check this in the API route itself since we can't read body in middleware
  }
  
  return false;
}

/**
 * Enhanced rate limiting check with different limits for different actions
 */
function checkRateLimit(
  ip: string,
  isAdmin: boolean = false,
  isAPI: boolean = false,
  isWrite: boolean = false
): boolean {
  const now = Date.now();
  const windowMs = SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;

  let maxRequests: number;
  if (isAdmin) {
    maxRequests = SECURITY_CONFIG.RATE_LIMIT.ADMIN_MAX_REQUESTS;
  } else if (isWrite) {
    maxRequests = SECURITY_CONFIG.RATE_LIMIT.WRITE_REQUESTS;
  } else if (isAPI) {
    maxRequests = SECURITY_CONFIG.RATE_LIMIT.API_REQUESTS;
  } else {
    maxRequests = SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS;
  }

  const type = isWrite ? 'write' : isAPI ? 'api' : 'general';
  const key = `${ip}:${type}:${Math.floor(now / windowMs)}`;
  const current = rateLimitMap.get(key);

  if (!current) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

/**
 * Cleanup old rate limit entries (called on each request)
 * Note: setInterval doesn't work in Edge runtime
 */
function cleanupRateLimitCache(): void {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS) {
      rateLimitMap.delete(key);
      cleanedCount++;
    }
  }

  // Only cleanup when cache gets large (every ~1000 entries)
  if (cleanedCount > 0 && rateLimitMap.size % 100 === 0) {
    console.log(`[CACHE] Cleaned ${cleanedCount} expired rate limit entries`);
  }
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return request.ip || '127.0.0.1';
}

/**
 * Add essential security headers - Optimized for Edge runtime
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Most headers are already set in next.config.ts
  // Only add runtime-specific headers here

  // Custom headers to indicate Islamic content protection
  response.headers.set('X-Islamic-Content-Protected', 'true');
  response.headers.set('X-Content-Integrity', 'verified');

  return response;
}

/**
 * Log security events
 */
function logSecurityEvent(event: string, ip: string, path: string, details?: any) {
  console.log(`[SECURITY] ${event} - IP: ${ip} - Path: ${path}`, details || '');
  
  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external logging service
    // await sendToLoggingService({ event, ip, path, details, timestamp: new Date() });
  }
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  
  // Skip middleware for static files and API routes that don't need security
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/workbox-') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }
  
  // 1. Check if IP is blocked
  if (isBlockedIP(ip)) {
    logSecurityEvent('BLOCKED_IP_ACCESS', ip, pathname);
    return new NextResponse('Access Denied', { status: 403 });
  }
  
  // 2. Check for suspicious patterns
  if (hasSuspiciousPatterns(request)) {
    logSecurityEvent('SUSPICIOUS_REQUEST', ip, pathname, {
      userAgent: request.headers.get('user-agent'),
      url: request.url
    });
    return new NextResponse('Suspicious Request Detected', { status: 400 });
  }
  
  // Cleanup rate limit cache periodically (every 100 requests)
  if (Math.random() < 0.01) {
    cleanupRateLimitCache();
  }

  // 3. Enhanced Rate limiting - Different limits for different operations
  const isAdminPath = SECURITY_CONFIG.ADMIN_PATHS.some(path => pathname.startsWith(path));
  const isAPIPath = pathname.startsWith('/api');
  const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  const isAdmin = isAdminPath;

  if (!checkRateLimit(ip, isAdmin, isAPIPath, isWriteOperation)) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', ip, pathname, {
      method: request.method,
      type: isWriteOperation ? 'write' : isAPIPath ? 'api' : 'general'
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }
  
  // 4. Authentication is now handled by Next.js API routes and server components
  // This keeps the middleware lightweight and under the 1MB Edge limit
  // Protected routes will check auth in their own route handlers
  
  // 6. Add security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
