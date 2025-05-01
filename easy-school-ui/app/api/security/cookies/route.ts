'use server'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'zcffHBNq4d2zxvOTiJ2r/PzSq45CGEnzapG12Qdc0lk='; // Store this securely
// This function will handle the server-side logic for creating a "solicitacao"

import { cookies } from 'next/headers'; // Next.js 13 App Router

// Your handler function (for GET, POST, etc.)
export async function GET(req: Request): Promise<NextResponse> {
  // Retrieve cookies from the request
  const cookieStore = cookies(); // App Router API to get cookies

  const allCookies = await cookieStore.getAll(); // Returns an array of { name, value } objects

  // Log each cookie key-value pair
  console.log('All Cookies:');
  allCookies.forEach(({ name, value }) => {
    console.log(`${name}: ${value}`);
  });


  const token = await cookieStore.get('user')?.value;// || null; // Get the 'user' cookie
  

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized, no token' }, { status: 407 });
  }
  console.log('Token : ',token);
  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Access user data from the token

    let res = NextResponse.json({ message: decoded}, { status: 200 });

    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');


    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req: Request) : Promise<NextResponse> {
  
  const { cookieName } = await req.json();
  let res = NextResponse.json({ message:  'Cookie deleted'}, { status: 200 });
  
  res.headers.set('Set-Cookie', serialize(cookieName, '', {
    maxAge: -1,  // Immediately expires the cookie
    path: '/',   // Ensure it's applied site-wide
  }));

 return res;

}

