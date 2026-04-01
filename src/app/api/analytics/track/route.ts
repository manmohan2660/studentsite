import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/AnalyticsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get user IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const usage = await AnalyticsService.trackToolUsage({
      ...body,
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, data: usage },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolName = searchParams.get('toolName');

    const stats = await AnalyticsService.getToolStats(toolName || undefined);

    return NextResponse.json(
      { success: true, data: stats },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
