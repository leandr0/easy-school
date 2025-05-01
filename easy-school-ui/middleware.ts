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

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const sessionCookie = cookies().get('user')?.value;

  let session: UserField | undefined;

  console.log('middleware');
  if (sessionCookie) {
    console.log('Temos Cookie');
    try {
      //const decryptedSession = await decrypt(sessionCookie);
      //const decryptedSession = jwt.verify(sessionCookie, JWT_SECRET);
      //session = decryptedSession as UserField;
      //console.log('session : '+ session);
    } catch (error) {
      console.error('Error decrypting session:', error);
    }
  }
/** 
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session?.id && !req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }
**/
  return NextResponse.next();
}
