'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { CourseClassModel } from '@/app/lib/definitions/course_class_definitions';
import { URLPathParam } from '@/app/lib/url_path_param';
import { getURLQueryParam } from '@/app/lib/helpers/api.helper';

const clientApi = externalApiClient.resource('/class-control');

export async function GET(req: NextRequest, { params }: { params: { courseClassId: string } }) {
  try {

    const { courseClassId } = params;
  
    const start_day = getURLQueryParam(req.url,"start_day");
    const start_month = getURLQueryParam(req.url,"start_month");
    const start_year = getURLQueryParam(req.url,"start_year");
    const end_day = getURLQueryParam(req.url,"end_day");
    const end_month = getURLQueryParam(req.url,"end_month");
    const end_year = getURLQueryParam(req.url,"end_year");


    const queryParams = new URLSearchParams();
    queryParams.append("start_day", start_day!);
    queryParams.append("start_month", start_month!);
    queryParams.append("start_year", start_year!);
    queryParams.append("end_day", end_day!);
    queryParams.append("end_month", end_month!);
    queryParams.append("end_year", end_year!);


    await requireAuth('ADMIN');

    const pathParams = new URLPathParam();
    pathParams.append('control');
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