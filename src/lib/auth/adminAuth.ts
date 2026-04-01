import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import User from "@/models/User";
import dbConnect from "@/lib/db/connect";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

/**
 * ✅ Verify Admin Token - Works with Bearer tokens
 * Used in API routes to verify admin authorization
 * Supports both Admin model and User model with role='admin'
 */
export async function verifyAdminToken(token: string) {
  try {
    await dbConnect();

    if (!token) {
      return {
        valid: false,
        message: "No token provided",
      };
    }

    // Verify JWT
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Try Admin model first
    let admin = await Admin.findById(decoded.id);

    // If not found in Admin, try User model with admin role
    if (!admin) {
      const user = await User.findById(decoded.id);
      if (user && user.role === 'admin') {
        admin = user as any;
      }
    }

    if (!admin) {
      return {
        valid: false,
        message: "Admin not found",
      };
    }

    const isActive = admin.isActive !== false; // isActive should default to true
    if (!isActive) {
      return {
        valid: false,
        message: "Admin account is inactive",
      };
    }

    return {
      valid: true,
      user: admin,
    };
  } catch (error: any) {
    console.error("Admin token verification error:", error);
    return {
      valid: false,
      message: "Invalid or expired token",
    };
  }
}

/**
 * ✅ Require Admin Helper for Next.js Route Handlers
 * Works with cookie-based JWT auth
 * Supports both Admin model and User model with role='admin'
 */
export async function requireAdmin(request: Request) {
  try {
    await dbConnect();

    // Get token from Authorization header first, then from cookies
    let token = null;
    const authHeader = request.headers.get("authorization");
    
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Try to get from auth-token cookie
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/auth-token=([^;]+)/);
        token = match?.[1];
      }
    }

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized - No token",
      };
    }

    // Verify JWT
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Try Admin model first
    let admin = await Admin.findById(decoded.id);

    // If not found in Admin, try User model with admin role
    if (!admin) {
      const user = await User.findById(decoded.id);
      if (user && user.role === 'admin') {
        admin = user as any;
      }
    }

    if (!admin) {
      return {
        success: false,
        status: 403,
        message: "Admin not found",
      };
    }

    const isActive = admin.isActive !== false;
    if (!isActive) {
      return {
        success: false,
        status: 403,
        message: "Admin account is inactive",
      };
    }

    return {
      success: true,
      user: admin,
    };
  } catch (error: any) {
    console.error("Admin auth error:", error);
    return {
      success: false,
      status: 401,
      message: "Invalid or expired token",
    };
  }
}