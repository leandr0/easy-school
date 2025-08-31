'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { MessageModel } from '@/app/lib/definitions/messages_definitions';

const clientApi = externalApiClient.resource('/revenue/messages');

export async function GET(req: NextRequest) {
  try {

    await requireAuth('ADMIN');

    const data = await clientApi.get<MessageModel>('', { headers: await bearerHeaders(), cache: 'no-store' });

    return NextResponse.json(data);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      console.log(`Cause : ${e.cause}, Message : ${e.message}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {

    await requireAuth('ADMIN');

    const json = await req.json();

    const data = await clientApi.post(json, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } })

    return NextResponse.json(data);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      console.log(`Cause : ${e.cause}, Message : ${e.message}`)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}