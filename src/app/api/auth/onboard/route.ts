import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/db/connect';
import { UserService } from '@/services/UserService';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, userType, course, branch, examTarget, learningGoal } = body;

    // Validation
    if (!userId || !userType) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      userType,
      onboardingCompleted: true,
    };

    // Add role-specific data
    if (userType === 'college') {
      if (!course || !branch) {
        return NextResponse.json(
          { message: 'Course and branch are required for college students' },
          { status: 400 }
        );
      }
      updateData.course = course;
      updateData.branch = branch;
    } else if (userType === 'govt-exam') {
      if (!examTarget) {
        return NextResponse.json(
          { message: 'Target exam is required' },
          { status: 400 }
        );
      }
      updateData.examTarget = examTarget;
    } else if (userType === 'skill-learner') {
      if (!learningGoal) {
        return NextResponse.json(
          { message: 'Learning goal is required' },
          { status: 400 }
        );
      }
      updateData.learningGoal = learningGoal;
    }

    // Update user with onboarding data
    const updatedUser = await UserService.completeOnboarding(userId, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Onboarding completed successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          userType: updatedUser.userType,
          onboardingCompleted: updatedUser.onboardingCompleted,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { message: error.message || 'Onboarding failed' },
      { status: 500 }
    );
  }
}
