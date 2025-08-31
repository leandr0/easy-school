'use server'
import { NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders } from '@/app/lib/authz.server';

const clientApi = externalApiClient.resource('/languages');

export async function GET() {
  try {

    const data = await clientApi.get('/total-students', { headers: await bearerHeaders() });

    return NextResponse.json(data);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
