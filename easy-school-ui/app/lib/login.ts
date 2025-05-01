'use server'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { encrypt ,generateJwtToken} from '@/app/lib/session'
import { loginUser } from 'auth'
import { cookies } from 'next/headers';
import { UserField } from '@/app/lib/definitions';
import { fetchCustomers } from '@/app/lib/data';  
import { CustomerField } from '@/app/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';


export async function setUserInCookie(user: UserField): Promise<NextResponse> {
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

export async function setUserInCookieServer(user: UserField): Promise<NextResponse> {
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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
  
    // Log the email and password for debugging purposes
    //console.log(req.body.email);
    //console.log(req.body.password);
  
    // Attempt to log in the user
    const user: UserField | undefined = await loginUser(email, password);
  
    // Handle the case where login fails (i.e., user is undefined)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // If login is successful, set the user in the cookie
    await setUserInCookieServer(user);
  
    // Return a success response to the client
    return res.status(200).json({ message: 'Successfully set cookie!' });
  }