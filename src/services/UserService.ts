import User, { IUser } from '@/models/User';
import dbConnect from '@/lib/db/connect';

export class UserService {
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      await dbConnect();
      const user = new User(userData);
      return await user.save();
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      await dbConnect();
      return await User.findOne({ email: email.toLowerCase() }).lean();
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  static async getUserById(id: string): Promise<IUser | null> {
    try {
      await dbConnect();
      return await User.findById(id).lean();
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  static async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      await dbConnect();
      const user = await User.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();
      return user;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  static async completeOnboarding(id: string, onboardingData: any): Promise<IUser | null> {
    try {
      await dbConnect();
      const user = await User.findByIdAndUpdate(
        id,
        {
          ...onboardingData,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).lean();
      return user;
    } catch (error: any) {
      throw new Error(`Failed to complete onboarding: ${error.message}`);
    }
  }

  static async getUsersByType(userType: string): Promise<IUser[]> {
    try {
      await dbConnect();
      return await User.find({ userType }).lean();
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  static async getAllStudents(): Promise<IUser[]> {
    try {
      await dbConnect();
      return await User.find({ role: 'student' }).select('-password').lean();
    } catch (error: any) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await dbConnect();
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  static async getUserStats(): Promise<any> {
    try {
      await dbConnect();
      const totalUsers = await User.countDocuments({ role: 'student' });
      const collegeStudents = await User.countDocuments({ userType: 'college' });
      const examAspirants = await User.countDocuments({ userType: 'govt-exam' });
      const skillLearners = await User.countDocuments({ userType: 'skill-learner' });
      const adminUsers = await User.countDocuments({ role: 'admin' });

      return {
        totalUsers,
        collegeStudents,
        examAspirants,
        skillLearners,
        adminUsers,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch user stats: ${error.message}`);
    }
  }
}
