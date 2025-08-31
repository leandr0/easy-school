'use server'
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';
import { externalApiClient } from '@/app/config/clientAPI';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';

const clientApi = externalApiClient.resource('/class-control');


export async function POST(req: NextRequest) {
    try {
        const json = await req.json();

        await requireAuth(['ADMIN','TEACHER']);


        const data = clientApi.post<void>(json, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

        return NextResponse.json(data);

    } catch (e: any) {
        if (e instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (e instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
    }
}
