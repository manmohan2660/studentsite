import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/db/connect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify and decode token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password').lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
