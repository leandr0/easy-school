'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';

const clientApi = externalApiClient.resource('/course-class-students');

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    await requireAuth('ADMIN');

    const data = clientApi.post<void>('/student-list',json, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

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