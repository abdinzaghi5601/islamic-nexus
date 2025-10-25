import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

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
 * Cleanup old rate limit entries (run periodically)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

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
 * Add comprehensive security headers - Maximum protection for Islamic content
 */
function addSecurityHeaders(response: NextResponse, request: NextRequest): NextResponse {
  // Content Security Policy - Strict policy to prevent any tampering
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://fonts.googleapis.com https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://*.vercel.app https://cdn.jsdelivr.net https://*.quran.com",
    "media-src 'self' data: blob:",
    "connect-src 'self' https://vercel.live https://cdn.jsdelivr.net https://*.quran.com https://*.sunnah.com https://*.aladhan.com",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Prevent clickjacking - NO ONE can frame this Islamic content
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Strict referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy - Disable all unnecessary features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), ' +
    'magnetometer=(), gyroscope=(), accelerometer=(), ' +
    'autoplay=(), encrypted-media=(), picture-in-picture=()'
  );

  // HSTS - Force HTTPS (in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // Custom headers to indicate Islamic content protection
  response.headers.set('X-Islamic-Content-Protected', 'true');
  response.headers.set('X-Content-Integrity', 'verified');
  response.headers.set('X-Modification-Protection', 'active');

  // CORS - Only allow same origin
  response.headers.set('Access-Control-Allow-Origin', request.nextUrl.origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Cache control for sensitive content
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

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
  
  // 4. Check authentication for protected paths
  const isProtectedPath = SECURITY_CONFIG.PROTECTED_PATHS.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    try {
      const session = await auth();
      if (!session || !session.user) {
        logSecurityEvent('UNAUTHENTICATED_ACCESS', ip, pathname);
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    } catch (error) {
      logSecurityEvent('AUTH_ERROR', ip, pathname, { error: error.message });
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }
  
  // 5. Admin path protection
  if (isAdminPath) {
    try {
      const session = await auth();
      if (!session || !session.user) {
        logSecurityEvent('UNAUTHENTICATED_ADMIN_ACCESS', ip, pathname);
        return new NextResponse('Unauthorized', { status: 401 });
      }
      
      // @ts-ignore - role exists in our extended session
      if (session.user.role !== 'admin') {
        logSecurityEvent('NON_ADMIN_ADMIN_ACCESS', ip, pathname, {
          userEmail: session.user.email,
          userRole: session.user.role
        });
        return new NextResponse('Forbidden', { status: 403 });
      }
    } catch (error) {
      logSecurityEvent('ADMIN_AUTH_ERROR', ip, pathname, { error: error.message });
      return new NextResponse('Authentication Error', { status: 500 });
    }
  }
  
  // 6. Add security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response, request);
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
