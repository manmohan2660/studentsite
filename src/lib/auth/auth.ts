import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-key';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

export class AuthService {
  // Generate JWT token
  static generateToken(
    payload: TokenPayload,
    expiresIn: string | number = '7d'
  ): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
  }

  // Verify JWT token
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Set auth cookie
  static async setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
  }

  // Get auth token from cookies
  static async getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('auth-token')?.value;
  }

  // Clear auth cookie
  static async clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
  }

  // Get current user from request
  static async getCurrentUser(): Promise<TokenPayload | null> {
    const token = await this.getAuthToken();
    if (!token) {
      return null;
    }

    return this.verifyToken(token);
  }
}
