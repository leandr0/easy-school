// bff/auth.ts
import 'server-only';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { ENV } from './env';

const secret = new TextEncoder().encode(ENV.JWT_SECRET);

export async function signUserJwt(payload: Record<string, unknown>, exp: string = '1d') {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('easy-school')
    .setAudience('easy-school-users')
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJwt(token: string) {
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

export function setAuthCookie(token: string) {
  const c = cookies();
  c.set({
    name: 'user',
    value: token,
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1d
  });
}

export function clearAuthCookie() {
  const c = cookies();
  c.set({
    name: 'user',
    value: '',
    path: '/',
    maxAge: 0,
  });
}
