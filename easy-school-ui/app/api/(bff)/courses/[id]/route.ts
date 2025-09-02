'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';

const clientApi = externalApiClient.resource('/courses');

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    
    await requireAuth('ADMIN');
    
    const data = await clientApi.get<CourseModel>(id, {headers: await bearerHeaders() , cache: 'no-store' });

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
