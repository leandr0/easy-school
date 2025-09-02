'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { HttpError } from '@/app/config/api';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';
import { getURLQueryParam } from '@/app/lib/helpers/api.helper';
import { RevenueModel } from '@/app/lib/definitions/revenue_definitions';

const clientApi = externalApiClient.resource('/revenues');

export async function GET(req: NextRequest) {
  try {

    await requireAuth('ADMIN');

    const url = req.url;

    const queryParams = new URLSearchParams();
    
    queryParams.append('start_month' , getURLQueryParam(url,'start_month')!);
    queryParams.append('start_year' , getURLQueryParam(url,'start_year')!);
    queryParams.append('end_month' , getURLQueryParam(url,'end_month')!);
    queryParams.append('end_year' , getURLQueryParam(url,'end_year')!);

    const data = await clientApi.get<RevenueModel[]>('/date-range?'+queryParams.toString(), { headers: await bearerHeaders(), cache: 'no-store' });

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