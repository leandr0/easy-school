'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from './definitions/user_definitions'
import { generateJwtToken } from '@/sign';


export async function setUserInCookie(user: UserModel): Promise<NextResponse> {
  if (!user) {
    throw new Error('User is undefined');
  }

  // Create JWT token
  const token = JSON.stringify(generateJwtToken(user));

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

export async function setUserInCookieServer(req: NextRequest, user: UserModel): Promise<NextResponse> {

  const secure = req.nextUrl.protocol === 'https:'; // detects real scheme

  const token = await generateJwtToken(user);



  const response = NextResponse.json(user);

  response.cookies.set({
    name: 'user',
    value: token,
    httpOnly: true,
    secure,
    //secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });



  return response;
}
