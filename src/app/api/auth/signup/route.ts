import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/db/connect';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, adminSecret } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Determine role based on adminSecret
    let role = 'student';
    if (adminSecret === process.env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      onboardingCompleted: false,
    });

    await user.save();

    return NextResponse.json(
      {
        message: 'Account created successfully',
        userId: user._id,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
