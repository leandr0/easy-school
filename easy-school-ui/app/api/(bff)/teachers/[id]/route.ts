'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { externalApiClient } from '@/app/config/clientAPI';

const clientApi = externalApiClient.resource('/teachers');

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    
    await requireAuth('ADMIN');
    
    const data = await clientApi.get<TeacherModel>(id, {headers: await bearerHeaders() , cache: 'no-store' });

    return NextResponse.json(data);
  } catch (e: any) {
    console.log(`Get Teacher By Id ERROR ${e}`);
    
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (e instanceof HttpError && e.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
