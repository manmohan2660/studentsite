import { NextRequest, NextResponse } from 'next/server';
import { RoadmapService } from '@/services/RoadmapService';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const roadmap = await RoadmapService.getRoadmapBySlug(slug);

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: roadmap },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check admin authorization from header or cookie
    let token = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authResult = await verifyAdminToken(token);
    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const roadmap = await RoadmapService.updateRoadmap(slug, body);

    return NextResponse.json(
      { success: true, data: roadmap },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check admin authorization from header or cookie
    let token = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authResult = await verifyAdminToken(token);
    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Admin access required' },
        { status: 403 }
      );
    }

    await RoadmapService.deleteRoadmap(slug);

    return NextResponse.json(
      { success: true, message: 'Roadmap deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
