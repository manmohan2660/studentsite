import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/AdminService';
import { AuthService } from '@/lib/auth/auth';
import User from '@/models/User';
import dbConnect from '@/lib/db/connect';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // First, try to find in Admin collection
    let admin = await AdminService.findAdminByEmail(email);

    // If not found in Admin, check User model with admin role
    if (!admin) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (user && user.role === 'admin') {
        // Treat user as admin for authentication
        admin = user as any;
      } else if (user && user.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'You do not have admin access' },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = AuthService.generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role || 'admin',
    });

    // Set cookie
    const response = NextResponse.json(
      {
        success: true,
        data: {
          token,
          admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
