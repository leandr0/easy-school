'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { getURLQueryParam, parseURLQueryArrayParam } from '@/app/lib/helpers/api.helper';

const clientApi = externalApiClient.resource('/calendar/range-hour-days/teacher/available');

export async function GET(req: NextRequest) {
  try {

    await requireAuth(['ADMIN', "TEACHER"]);


    const calendar_week_day_ids = parseURLQueryArrayParam(req.url, "calendar_week_day_ids");
    const language_id = getURLQueryParam(req.url, "language_id");
    const start_hour = getURLQueryParam(req.url, "start_hour");
    const start_minute = getURLQueryParam(req.url, "start_minute");
    const end_hour = getURLQueryParam(req.url, "end_hour");
    const end_minute = getURLQueryParam(req.url, "end_minute");

    const queryParams = new URLSearchParams();
    queryParams.set("calendar_week_day_ids", calendar_week_day_ids.join(','));
    queryParams.append("language_id", language_id!);
    queryParams.append("start_hour", start_hour!);
    queryParams.append("start_minute", start_minute!);
    queryParams.append("end_hour", end_hour!);
    queryParams.append("end_minute", end_minute!);

    const data = await clientApi.get(`?${queryParams.toString()}`, { headers: await bearerHeaders() });

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