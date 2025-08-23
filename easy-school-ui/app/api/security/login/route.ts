
'use server'

import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from 'auth';
import { setUserInCookieServer } from '@/app/lib/login';
import { login } from '@/app/services/security/loginService';
import { UserModel } from '@/app/lib/definitions/user_definitions';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email, password } = await req.json();

  // Authenticate the user
  const user: UserModel = await login(email, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Set the user in the session cookie and return the response
  return await setUserInCookieServer(user);
}