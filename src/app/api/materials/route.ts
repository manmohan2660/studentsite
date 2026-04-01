import { NextRequest, NextResponse } from 'next/server';
import { StudyMaterialService } from '@/services/StudyMaterialService';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const course = searchParams.get('course');
    const examType = searchParams.get('examType');

    const skip = (page - 1) * limit;

    // If search query, search materials
    if (search) {
      const materials = await StudyMaterialService.searchMaterials(search);
      return NextResponse.json(
        { success: true, data: materials },
        { status: 200 }
      );
    }

    // If filtering by subject
    if (subject) {
      const materials = await StudyMaterialService.getMaterialsBySubject(subject);
      return NextResponse.json(
        { success: true, data: materials },
        { status: 200 }
      );
    }

    // If filtering by course
    if (course) {
      const materials = await StudyMaterialService.getMaterialsByCategory(course);
      return NextResponse.json(
        { success: true, data: materials },
        { status: 200 }
      );
    }

    // If filtering by exam type
    if (examType) {
      const materials = await StudyMaterialService.getMaterialsByExam(examType);
      return NextResponse.json(
        { success: true, data: materials },
        { status: 200 }
      );
    }

    // Get all published materials with pagination
    const { materials, total } = await StudyMaterialService.getPublishedMaterials(
      limit,
      skip
    );

    return NextResponse.json(
      {
        success: true,
        data: materials,
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
    return NextResponse.json(
      { success: false, message: error.message },
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
        { success: false, message: 'Unauthorized - No token provided' },
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

    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.description || !body.description.trim()) {
      return NextResponse.json(
        { success: false, message: 'Description is required' },
        { status: 400 }
      );
    }

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    // Set author to the admin creating it
    body.author = authResult.user._id.toString();

    // Auto-publish materials created by admins
    if (!('published' in body)) {
      body.published = true;
    }

    const material = await StudyMaterialService.createMaterial(body);

    return NextResponse.json(
      { success: true, data: material, message: 'Material created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Material creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create material' },
      { status: 500 }
    );
  }
}
