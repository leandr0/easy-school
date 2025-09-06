'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { UserModel } from '@/app/lib/definitions/user_definitions';
import { withAuth } from '@/app/lib/withAuth';
import { corsHeaders } from '@/app/lib/cors';
import { assertCsrf } from '@/app/lib/csrf';

const clientApi = externalApiClient.resource('/security/users');

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get('origin')) });
}

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const data = await clientApi.get<UserModel[]>('', {
      headers: await bearerHeaders(), // forward JWT to external API
      cache: 'no-store',
    });

    return new NextResponse(JSON.stringify(data), {
      headers: {
        ...corsHeaders(req.headers.get('origin')),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError)    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError)         return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}, ['ADMIN']);

export async function POST(req: NextRequest) {
  try {

    await requireAuth('ADMIN');

    const payload = await req.json();



    const data = await clientApi.post<UserModel[]>(payload,{ headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

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

    await requireAuth('ADMIN');

    const payload = await req.json();



    const data = await clientApi.put<UserModel[]>(payload,{ headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

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

