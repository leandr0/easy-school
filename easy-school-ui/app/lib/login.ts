'use server'
import { serialize } from 'cookie'
import { generateJwtToken} from '@/app/lib/session'
import { NextResponse } from 'next/server';
import { UserModel } from './definitions/user_definitions'


export async function setUserInCookie(user: UserModel): Promise<NextResponse> {
  if (!user) {
    throw new Error('User is undefined');
  }

  // Create JWT token
  const token = generateJwtToken(user);

  // Create a new NextResponse
  const response = NextResponse.json({ message: 'User authenticated' });

  // Set the cookie directly in the response
  response.cookies.set({
    name: 'user', // Cookie name
    value: token, // JWT token as the value
    //httpOnly: true, // Inaccessible from JavaScript
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 60 * 60 * 24 * 7, // 1 week expiration
    sameSite: 'strict', // Protect against CSRF attacks
    path: '/', // Cookie available throughout the site
  });

  return response;
}

export async function setUserInCookieServer(user: UserModel): Promise<NextResponse> {
  const token = generateJwtToken(user);

  const response = NextResponse.json({ message: 'Login successful' });
  
  // Serialize the cookie
  const cookie = serialize('user', token, {
    httpOnly: true,
    //secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'strict',
    path: '/',
  });

  // Set the 'Set-Cookie' header in the response
  response.headers.set('Set-Cookie', cookie);
  
  return response;
}
