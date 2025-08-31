'use server'
import { serialize } from 'cookie'
import { NextResponse } from 'next/server';
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

export async function setUserInCookieServer(user: UserModel): Promise<NextResponse> {

  
  console.log(`setUserInCookieServer >  user ${JSON.stringify(user)}`);


  
  const token = await generateJwtToken(user);

  console.log(`Generated token ${token}`);

  const response = NextResponse.json({ message: 'Login successful' });
  
 response.cookies.set({
    name: 'user',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
