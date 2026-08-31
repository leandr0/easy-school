'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { UserModel } from '@/app/lib/definitions/user_definitions';

// Self-service: no role restriction here (any authenticated user - ADMIN,
// TEACHER or STUDENT), because the Spring endpoint resolves "who am I" from
// the JWT itself, never from a client-supplied id. There is no way to read
// or write someone else's account through this route.
const clientApi = externalApiClient.resource('/security/users');

export async function GET() {
  try {

    await requireAuth();

    const data = await clientApi.get<UserModel>('/me', { headers: await bearerHeaders(), cache: 'no-store' });

    return NextResponse.json(data);
  } catch (e: any) {

    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {

    const json = await req.json();

    await requireAuth();

    const data = await clientApi.put<UserModel>('/me', json, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json' } });

    return NextResponse.json(data);
  } catch (e: any) {

    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
