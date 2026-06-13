import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fdf9b36c-0076-4c5a-a951-ba9d50613c16';

export interface JWTPayload {
  id: number;
  member_id: string;
  name: string;
  mobile: string;
  district: string;
  taluk: string;
  village: string;
}

export function hashPin(pin: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pin, salt);
}

export function comparePin(pin: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(pin, hash);
  } catch (error) {
    return false;
  }
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

const OTP_SECRET = process.env.OTP_SECRET || JWT_SECRET;

type OtpTokenPayload = {
  mobile: string;
  otp: string;
};

export function signOtpToken(mobile: string, otp: string): string {
  return jwt.sign({ mobile, otp }, OTP_SECRET, { expiresIn: '5m' });
}

export function verifyOtpToken(token: string): OtpTokenPayload | null {
  try {
    return jwt.verify(token, OTP_SECRET) as OtpTokenPayload;
  } catch (error) {
    return null;
  }
}

// Helpers for Server Side Cookie Management
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(payload: JWTPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Delete immediately
    path: '/',
  });
}
