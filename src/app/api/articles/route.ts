import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/services/ArticleService';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // If search query, search articles
    if (search) {
      const articles = await ArticleService.searchArticles(search);
      return NextResponse.json(
        {
          success: true,
          data: articles,
        },
        { status: 200 }
      );
    }

    const { articles, total } = await ArticleService.getPublishedArticles(
      limit,
      skip
    );

    return NextResponse.json(
      {
        success: true,
        data: articles,
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
    
    // Set author to the admin creating it
    body.author = authResult.user._id.toString();
    
    // Auto-publish articles when created by admins
    if (!('published' in body)) {
      body.published = true;
    }
    if (!('publishedAt' in body) && body.published) {
      body.publishedAt = new Date();
    }

    const article = await ArticleService.createArticle(body);

    return NextResponse.json(
      { success: true, data: article },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
