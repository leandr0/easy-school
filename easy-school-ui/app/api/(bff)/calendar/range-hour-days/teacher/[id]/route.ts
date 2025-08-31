'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { URLPathParam } from '@/app/lib/url_path_param';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';

const clientApi = externalApiClient.resource('/calendar/range-hour-days');

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    await requireAuth(['ADMIN', "TEACHER"]);

    const pathParams = new URLPathParam();
    pathParams.append("teacher");
    pathParams.append(id);
  
    const data = await clientApi.get(pathParams.toString(), { headers: await bearerHeaders() });

    return NextResponse.json(data);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    const json = await req.json();

    await requireAuth(['ADMIN', "TEACHER"]);

    const pathParams = new URLPathParam();
    pathParams.append("teacher");
    pathParams.append(id);
  
    const data = await clientApi.post(pathParams.toString(),json,  { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

    return NextResponse.json(data);
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}