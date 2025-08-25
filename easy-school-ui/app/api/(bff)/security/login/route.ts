
'use server'

import { NextRequest, NextResponse } from 'next/server';
import { setUserInCookieServer } from '@/app/lib/login';
import { externalApiClient } from '@/app/config/clientAPI';
import { UserModel } from '@/app/lib/definitions/user_definitions';
import { PATHS } from '@/bff/paths';

export async function POST(req: NextRequest) {

  const { username, password } = await req.json();

  const authApi = externalApiClient.resource(PATHS.SECURITY.LOGIN);

  let user: UserModel;
  try {

    user = await authApi.post<UserModel>({ username, password });

  } catch (e) {

    const status = (e as any)?.status ?? 500;
    const msg = (e as Error)?.message ?? 'Login failed';

    if (status === 404 || status === 400) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ error: msg }, { status });
  }

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return setUserInCookieServer(user);
}