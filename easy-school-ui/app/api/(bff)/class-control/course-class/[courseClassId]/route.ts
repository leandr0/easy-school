'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { CourseClassModel } from '@/app/lib/definitions/course_class_definitions';
import { URLPathParam } from '@/app/lib/url_path_param';

const clientApi = externalApiClient.resource('/class-control');

export async function GET(req: NextRequest, { params }: { params: { courseClassId: string } }) {
  try {

    const { courseClassId } = params;

    await requireAuth('ADMIN');


    const reqQueryParams = new URL(req.url).searchParams;


    const start_data = reqQueryParams.get("start_date");
    const end_data = reqQueryParams.get("end_date");
  
    const queryParams = new URLSearchParams();
    queryParams.append("start_date", start_data!);
    queryParams.append("end_date", end_data!);

    const pathParams = new URLPathParam();
    pathParams.append('course-class');
    pathParams.append(courseClassId);

    const data = await clientApi.get<CourseClassModel>(`${pathParams.toString()}?${queryParams.toString()}`, { headers: await bearerHeaders(), cache: 'no-store' });

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
