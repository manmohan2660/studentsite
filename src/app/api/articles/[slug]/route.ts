import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/services/ArticleService';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await ArticleService.getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article }, { status: 200 });
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
    // Check admin authorization
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

    const { slug } = await params;
    const body = await request.json();
    const article = await ArticleService.updateArticle(slug, body);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check admin authorization
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

    const { slug } = await params;
    const success = await ArticleService.deleteArticle(slug);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Article deleted' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
