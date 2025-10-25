import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Security Monitoring System for Islamic Website
 * Tracks and alerts on suspicious activities
 */

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  timestamp: Date;
  ip: string;
  userAgent: string;
  path: string;
  userId?: string;
  details: any;
  resolved: boolean;
}

export enum SecurityEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  
  // Content modification events
  CONTENT_VIEW = 'CONTENT_VIEW',
  CONTENT_MODIFY = 'CONTENT_MODIFY',
  CONTENT_DELETE = 'CONTENT_DELETE',
  CONTENT_CREATE = 'CONTENT_CREATE',
  
  // Security violations
  SUSPICIOUS_REQUEST = 'SUSPICIOUS_REQUEST',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  BLOCKED_IP_ACCESS = 'BLOCKED_IP_ACCESS',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',
  
  // Admin events
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  ADMIN_ACTION = 'ADMIN_ACTION',
  ROLE_CHANGE = 'ROLE_CHANGE',
  
  // System events
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  API_ERROR = 'API_ERROR',
}

export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Security Event Logger
 */
export class SecurityEventLogger {
  private static events: SecurityEvent[] = [];
  private static readonly MAX_EVENTS = 10000; // Keep last 10k events in memory
  
  /**
   * Log a security event
   */
  static async logEvent(
    type: SecurityEventType,
    severity: SecuritySeverity,
    request: NextRequest,
    details: any = {},
    userId?: string
  ): Promise<void> {
    const event: SecurityEvent = {
      id: this.generateEventId(),
      type,
      severity,
      timestamp: new Date(),
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'Unknown',
      path: request.nextUrl.pathname,
      userId,
      details,
      resolved: false,
    };
    
    // Add to in-memory store
    this.events.unshift(event);
    
    // Keep only the latest events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }
    
    // Log to console
    console.log(`[SECURITY_EVENT] ${severity} - ${type}`, {
      id: event.id,
      ip: event.ip,
      path: event.path,
      userId: event.userId,
      details,
    });
    
    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      await this.sendToExternalLogger(event);
    }
    
    // Check for security alerts
    await this.checkSecurityAlerts(event);
  }
  
  /**
   * Get recent security events
   */
  static getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(0, limit);
  }
  
  /**
   * Get events by type
   */
  static getEventsByType(type: SecurityEventType, limit: number = 100): SecurityEvent[] {
    return this.events
      .filter(event => event.type === type)
      .slice(0, limit);
  }
  
  /**
   * Get events by severity
   */
  static getEventsBySeverity(severity: SecuritySeverity, limit: number = 100): SecurityEvent[] {
    return this.events
      .filter(event => event.severity === severity)
      .slice(0, limit);
  }
  
  /**
   * Get events by IP
   */
  static getEventsByIP(ip: string, limit: number = 100): SecurityEvent[] {
    return this.events
      .filter(event => event.ip === ip)
      .slice(0, limit);
  }
  
  /**
   * Mark event as resolved
   */
  static markEventResolved(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      return true;
    }
    return false;
  }
  
  /**
   * Generate unique event ID
   */
  private static generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get client IP address
   */
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (cfConnectingIP) return cfConnectingIP;
    if (realIP) return realIP;
    if (forwarded) return forwarded.split(',')[0].trim();
    
    return request.ip || '127.0.0.1';
  }
  
  /**
   * Send event to external logging service
   */
  private static async sendToExternalLogger(event: SecurityEvent): Promise<void> {
    try {
      // Example: Send to external logging service
      // await fetch('https://your-logging-service.com/api/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
    } catch (error) {
      console.error('Error sending event to external logger:', error);
    }
  }
  
  /**
   * Check for security alerts
   */
  private static async checkSecurityAlerts(event: SecurityEvent): Promise<void> {
    // Check for multiple failed login attempts
    if (event.type === SecurityEventType.LOGIN_FAILURE) {
      const recentFailures = this.events
        .filter(e => 
          e.type === SecurityEventType.LOGIN_FAILURE && 
          e.ip === event.ip && 
          e.timestamp > new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        );
      
      if (recentFailures.length >= 5) {
        await this.triggerAlert('MULTIPLE_LOGIN_FAILURES', {
          ip: event.ip,
          failureCount: recentFailures.length,
          timeWindow: '15 minutes',
        });
      }
    }
    
    // Check for suspicious request patterns
    if (event.type === SecurityEventType.SUSPICIOUS_REQUEST) {
      const recentSuspicious = this.events
        .filter(e => 
          e.type === SecurityEventType.SUSPICIOUS_REQUEST && 
          e.ip === event.ip && 
          e.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
        );
      
      if (recentSuspicious.length >= 10) {
        await this.triggerAlert('SUSPICIOUS_ACTIVITY', {
          ip: event.ip,
          suspiciousCount: recentSuspicious.length,
          timeWindow: '1 hour',
        });
      }
    }
    
    // Check for rate limit violations
    if (event.type === SecurityEventType.RATE_LIMIT_EXCEEDED) {
      const recentRateLimits = this.events
        .filter(e => 
          e.type === SecurityEventType.RATE_LIMIT_EXCEEDED && 
          e.ip === event.ip && 
          e.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
        );
      
      if (recentRateLimits.length >= 3) {
        await this.triggerAlert('PERSISTENT_RATE_LIMIT_VIOLATIONS', {
          ip: event.ip,
          violationCount: recentRateLimits.length,
          timeWindow: '1 hour',
        });
      }
    }
  }
  
  /**
   * Trigger security alert
   */
  private static async triggerAlert(alertType: string, details: any): Promise<void> {
    console.log(`[SECURITY_ALERT] ${alertType}`, details);
    
    // In production, you might want to:
    // - Send email notification
    // - Send SMS alert
    // - Create incident ticket
    // - Block IP automatically
    
    if (process.env.NODE_ENV === 'production') {
      // Example: Send alert to external service
      // await fetch('https://your-alert-service.com/api/alerts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ alertType, details, timestamp: new Date() }),
      // });
    }
  }
}

/**
 * Security Analytics
 */
export class SecurityAnalytics {
  /**
   * Get security statistics
   */
  static getSecurityStats(timeWindow: number = 24 * 60 * 60 * 1000): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topIPs: Array<{ ip: string; count: number }>;
    topPaths: Array<{ path: string; count: number }>;
  } {
    const cutoffTime = new Date(Date.now() - timeWindow);
    const recentEvents = SecurityEventLogger.getRecentEvents(10000)
      .filter(event => event.timestamp > cutoffTime);
    
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};
    const pathCounts: Record<string, number> = {};
    
    recentEvents.forEach(event => {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      
      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      // Count by IP
      ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
      
      // Count by path
      pathCounts[event.path] = (pathCounts[event.path] || 0) + 1;
    });
    
    return {
      totalEvents: recentEvents.length,
      eventsByType,
      eventsBySeverity,
      topIPs: Object.entries(ipCounts)
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topPaths: Object.entries(pathCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    };
  }
  
  /**
   * Get threat level for an IP
   */
  static getThreatLevel(ip: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const events = SecurityEventLogger.getEventsByIP(ip, 1000);
    const recentEvents = events.filter(e => 
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    const criticalEvents = recentEvents.filter(e => e.severity === SecuritySeverity.CRITICAL).length;
    const highEvents = recentEvents.filter(e => e.severity === SecuritySeverity.HIGH).length;
    const mediumEvents = recentEvents.filter(e => e.severity === SecuritySeverity.MEDIUM).length;
    
    if (criticalEvents >= 3 || highEvents >= 10) return 'CRITICAL';
    if (criticalEvents >= 1 || highEvents >= 5 || mediumEvents >= 20) return 'HIGH';
    if (highEvents >= 1 || mediumEvents >= 10) return 'MEDIUM';
    return 'LOW';
  }
}

/**
 * Helper functions for common security logging
 */
export const SecurityLogger = {
  /**
   * Log authentication events
   */
  async logAuthEvent(
    type: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT',
    request: NextRequest,
    userId?: string,
    details?: any
  ) {
    const severity = type === 'LOGIN_FAILURE' ? SecuritySeverity.MEDIUM : SecuritySeverity.LOW;
    await SecurityEventLogger.logEvent(
      type as SecurityEventType,
      severity,
      request,
      details,
      userId
    );
  },
  
  /**
   * Log content access
   */
  async logContentAccess(
    contentType: string,
    contentId: number,
    request: NextRequest,
    userId?: string
  ) {
    await SecurityEventLogger.logEvent(
      SecurityEventType.CONTENT_VIEW,
      SecuritySeverity.LOW,
      request,
      { contentType, contentId },
      userId
    );
  },
  
  /**
   * Log content modification
   */
  async logContentModification(
    contentType: string,
    contentId: number,
    operation: string,
    request: NextRequest,
    userId?: string
  ) {
    await SecurityEventLogger.logEvent(
      SecurityEventType.CONTENT_MODIFY,
      SecuritySeverity.MEDIUM,
      request,
      { contentType, contentId, operation },
      userId
    );
  },
  
  /**
   * Log security violation
   */
  async logSecurityViolation(
    violationType: SecurityEventType,
    request: NextRequest,
    details?: any
  ) {
    await SecurityEventLogger.logEvent(
      violationType,
      SecuritySeverity.HIGH,
      request,
      details
    );
  },
  
  /**
   * Log admin actions
   */
  async logAdminAction(
    action: string,
    request: NextRequest,
    userId: string,
    details?: any
  ) {
    await SecurityEventLogger.logEvent(
      SecurityEventType.ADMIN_ACTION,
      SecuritySeverity.MEDIUM,
      request,
      { action, ...details },
      userId
    );
  },
};
