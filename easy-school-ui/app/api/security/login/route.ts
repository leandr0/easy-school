
'use server'

import { NextRequest, NextResponse } from 'next/server';
import { setUserInCookieServer } from '@/app/lib/login';
import { externalApiClient } from '@/app/config/clientAPI';
import { UserModel } from '@/app/lib/definitions/user_definitions';

export async function POST(req: NextRequest) {

  console.log('API Login receiving request ');
  const { username, password } = await req.json();

  console.log('API Login setting path externa API ');
  const authApi = externalApiClient.resource('/security/login');

  console.log('API Login setting UserModel ');
  let user: UserModel;
  try {
    console.log('API Login calling external API ');
    user = await authApi.post<UserModel>({ username, password });
    console.log('API Login external API returns');
  } catch (e) {
    console.log('API Login external API got error');
    // Map backend errors
    const status = (e as any)?.status ?? 500;
    const msg = (e as Error)?.message ?? 'Login failed';
    return NextResponse.json({ error: msg }, { status });
  }

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  console.log('calling setUserInCookieServer');
  // Set cookie and return
  return setUserInCookieServer(user);
}