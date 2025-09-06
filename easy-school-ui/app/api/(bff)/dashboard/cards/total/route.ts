'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { withAuth } from '@/app/lib/withAuth';
import { corsHeaders } from '@/app/lib/cors';

const clientApi = externalApiClient.resource('/dashboard');


export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get('origin')) });
}

export const GET = withAuth(async (req: NextRequest) => {
  try {

    const data = await clientApi.get('/cards/total', { headers: await bearerHeaders(), cache: 'no-store', });

    return new NextResponse(JSON.stringify(data), {
      headers: {
        ...corsHeaders(req.headers.get('origin')),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}, ['ADMIN', 'TEACHER', 'STUDENT']);
