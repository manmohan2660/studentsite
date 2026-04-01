import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/auth';
import { AnalyticsService } from '@/services/AnalyticsService';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const summary = await AnalyticsService.getAnalyticsSummary();

    return NextResponse.json(
      { success: true, data: summary },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
