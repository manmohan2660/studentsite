import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import dbConnect from '@/lib/db/connect';
import { RoadmapService } from '@/services/RoadmapService';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // If search query, search roadmaps
    if (search) {
      const roadmaps = await RoadmapService.searchRoadmaps(search);
      return NextResponse.json(roadmaps, { status: 200 });
    }

    // Build filter
    const query: any = { published: true };
    if (category) {
      query.category = category;
    }

    const roadmaps = await Roadmap.find(query)
      .populate('createdBy', 'name email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Roadmap.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: roadmaps,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching roadmaps:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching roadmaps' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Set creator to the admin
    body.createdBy = authResult.user._id.toString();

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') as string;
    }

    const roadmap = await RoadmapService.createRoadmap(body);

    return NextResponse.json(
      { success: true, data: roadmap },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating roadmap:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
