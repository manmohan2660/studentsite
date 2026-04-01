import dbConnect from '@/lib/db/connect';
import Admin from '@/models/Admin';
import { IAdmin } from '@/models/Admin';

export class AdminService {
  // Register admin user
  static async registerAdmin(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'editor' = 'editor'
  ): Promise<IAdmin> {
    await dbConnect();

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const admin = await Admin.create({ email, password, name, role });
    return admin;
  }

  // Find admin by email
  static async findAdminByEmail(email: string): Promise<IAdmin | null> {
    await dbConnect();
    const admin = await Admin.findOne({ email }).select('+password');
    return admin;
  }

  // Find admin by ID
  static async findAdminById(id: string): Promise<IAdmin | null> {
    await dbConnect();
    const admin = await Admin.findById(id);
    return admin;
  }

  // Update admin
  static async updateAdmin(
    id: string,
    data: Partial<IAdmin>
  ): Promise<IAdmin | null> {
    await dbConnect();
    const admin = await Admin.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return admin;
  }

  // Get all admins
  static async getAllAdmins(): Promise<IAdmin[]> {
    await dbConnect();
    const admins = await Admin.find();
    return admins;
  }
}
