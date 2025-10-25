import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/admin-auth';
import { SecurityEventLogger, SecurityAnalytics } from '@/lib/security/monitoring';

/**
 * GET /api/security/events
 * Get security events (admin only)
 */
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const ip = searchParams.get('ip');
    const timeWindow = parseInt(searchParams.get('timeWindow') || '86400000'); // 24 hours in ms
    
    let events;
    
    if (type) {
      events = SecurityEventLogger.getEventsByType(type as any, limit);
    } else if (severity) {
      events = SecurityEventLogger.getEventsBySeverity(severity as any, limit);
    } else if (ip) {
      events = SecurityEventLogger.getEventsByIP(ip, limit);
    } else {
      events = SecurityEventLogger.getRecentEvents(limit);
    }
    
    // Filter by time window
    const cutoffTime = new Date(Date.now() - timeWindow);
    events = events.filter(event => event.timestamp > cutoffTime);
    
    return NextResponse.json({
      success: true,
      data: {
        events,
        total: events.length,
        filters: { type, severity, ip, timeWindow },
      },
    });
  } catch (error) {
    console.error('Error fetching security events:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch security events' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/security/events/:id/resolve
 * Mark security event as resolved (admin only)
 */
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { eventId } = body;
    
    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    const resolved = SecurityEventLogger.markEventResolved(eventId);
    
    if (!resolved) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Event marked as resolved',
    });
  } catch (error) {
    console.error('Error resolving security event:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resolve security event' },
      { status: 500 }
    );
  }
});
