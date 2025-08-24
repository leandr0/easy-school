import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { UserField } from '@/app/lib/definitions';

import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'zcffHBNq4d2zxvOTiJ2r/PzSq45CGEnzapG12Qdc0lk='; // Store this securely

const protectedRoutes = ['/profile'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;

  // Read the cookie from the request (Edge-compatible)
  const token = req.cookies.get('user')?.value;

  console.log(`Temos token ${token}`);

  //if (pathname === '/login') return NextResponse.next();
  // If there is no token, redirect to /login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // (Optional) verify JWT using jose (Edge-compatible)
  try {
    //const secret = new TextEncoder().encode(JWT_SECRET);
    //await jose.jwtVerify(token, secret); // throws if invalid/expired
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    // negative lookahead: exclude login, api, _next, static files and favicon
    '/((?!login|api|_next|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|map)).*)',
  ],
};