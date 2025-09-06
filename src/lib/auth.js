import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// Hash password
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Set auth cookie
export async function setAuthCookie(userId) {
  const cookieStore = await cookies();
  cookieStore.set('auth-user', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

// Get user ID from cookie
export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth-user');
  return authCookie?.value || null;
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-user');
}
