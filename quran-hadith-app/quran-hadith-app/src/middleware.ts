import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // 100 requests per window
    ADMIN_MAX_REQUESTS: 1000, // Higher limit for admin
  },
  
  // Blocked IPs (add suspicious IPs here)
  BLOCKED_IPS: new Set([
    // Add any known malicious IPs here
  ]),
  
  // Suspicious patterns to block
  SUSPICIOUS_PATTERNS: [
    /\.\./, // Path traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /drop\s+table/i, // SQL injection
    /delete\s+from/i, // SQL injection
    /insert\s+into/i, // SQL injection
    /update\s+set/i, // SQL injection
    /exec\s*\(/i, // Command injection
    /eval\s*\(/i, // Code injection
    /javascript:/i, // JavaScript injection
    /vbscript:/i, // VBScript injection
    /onload=/i, // Event handler injection
    /onerror=/i, // Event handler injection
    /onclick=/i, // Event handler injection
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
 * Rate limiting check
 */
function checkRateLimit(ip: string, isAdmin: boolean = false): boolean {
  const now = Date.now();
  const windowMs = SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;
  const maxRequests = isAdmin 
    ? SECURITY_CONFIG.RATE_LIMIT.ADMIN_MAX_REQUESTS 
    : SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS;
  
  const key = `${ip}:${Math.floor(now / windowMs)}`;
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
 * Add security headers
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
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
  
  // 3. Rate limiting
  const isAdminPath = SECURITY_CONFIG.ADMIN_PATHS.some(path => pathname.startsWith(path));
  const isAdmin = isAdminPath; // For now, assume admin paths are for admins
  
  if (!checkRateLimit(ip, isAdmin)) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', ip, pathname);
    return new NextResponse('Too Many Requests', { status: 429 });
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
