//'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { StudentModel } from '@/app/lib/definitions/students_definitions';


import { withAuthZ } from '@/lib/authz/api-guard';
import { getAbility, getSessionUser } from '@/lib/authz/session';

export const dynamic = 'force-dynamic';

const clientApi = externalApiClient.resource('/students');

export async function GET(req: NextRequest) {
  try {

    const handler = withAuthZ(['students.read', 'admin.all'], async () => {
      const data = await clientApi.get<StudentModel[]>('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
      return NextResponse.json(data);
    }, { mode: 'any' });

    return handler(req, {} as any);

  } catch (e: any) {

    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    await requireAuth('ADMIN');

    const data = clientApi.post<void>(json, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

    return NextResponse.json(data);

  } catch (e: any) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (e instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const json = await req.json();

    await requireAuth('ADMIN');

    const data = await clientApi.put(json, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } })
    return NextResponse.json(data);

  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}