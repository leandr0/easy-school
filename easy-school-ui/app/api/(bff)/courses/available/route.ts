'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { CourseClassModel } from '@/app/lib/definitions/course_class_definitions';

const clientApi = externalApiClient.resource('/courses');

export async function GET() {
  try {

    await requireAuth('ADMIN');

    const data = await clientApi.get<CourseClassModel[]>('/available', { headers: await bearerHeaders(), cache: 'no-store' });

    return NextResponse.json(data);

  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
