import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/admin-auth';
import { SecurityAnalytics } from '@/lib/security/monitoring';

/**
 * GET /api/security/analytics
 * Get security analytics (admin only)
 */
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const timeWindow = parseInt(searchParams.get('timeWindow') || '86400000'); // 24 hours in ms
    const ip = searchParams.get('ip');
    
    let stats;
    
    if (ip) {
      // Get threat level for specific IP
      const threatLevel = SecurityAnalytics.getThreatLevel(ip);
      stats = {
        ip,
        threatLevel,
        timeWindow,
      };
    } else {
      // Get general security statistics
      stats = SecurityAnalytics.getSecurityStats(timeWindow);
    }
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching security analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch security analytics' },
      { status: 500 }
    );
  }
});
