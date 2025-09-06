'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { URLPathParam } from '@/app/lib/url_path_param';

const clientApi = externalApiClient.resource('/revenue/messages');

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
  try {

    const { studentId } = params;
    
    await requireAuth('ADMIN');
    

    const pathParams = new URLPathParam();
    pathParams.append('payment-message');
    pathParams.append('student');
    pathParams.append(studentId);
    pathParams.append('link');

    const data = await clientApi.get(pathParams.toString(), { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });

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
