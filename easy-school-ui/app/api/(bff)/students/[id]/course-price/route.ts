'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { URLPathParam } from '@/app/lib/url_path_param';

const clientApi = externalApiClient.resource('/students');

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    
    const pathParams = new URLPathParam();
    pathParams.append(id);
    pathParams.append('course-price');

    await requireAuth('ADMIN');
    
    const data = await clientApi.get<StudentModel>( pathParams.toString() , {headers: await bearerHeaders() , cache: 'no-store' });

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