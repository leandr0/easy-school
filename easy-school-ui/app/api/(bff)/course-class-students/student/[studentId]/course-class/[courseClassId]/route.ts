'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { externalApiClient } from '@/app/config/clientAPI';
import { URLPathParam } from '@/app/lib/url_path_param';

const clientApi = externalApiClient.resource('/course-class-students');

interface Params {
  studentId: string;
  courseClassId: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {

  try {
    const { studentId, courseClassId } = params;

    await requireAuth('ADMIN');

    const pathParams = new URLPathParam();
    pathParams.append('student');
    pathParams.append(studentId);
    pathParams.append('course-class');
    pathParams.append(courseClassId);

    const data = await clientApi.delete<TeacherModel>(pathParams.toString(), { headers: await bearerHeaders(), cache: 'no-store' });

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