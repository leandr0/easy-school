// app/lib/withAuth.ts
import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth } from '@/app/lib/authz.server';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';

type Handler = (req: NextRequest, ctx: any) => Promise<Response>;

export function withAuth(handler: Handler, roles?: string[] | string): Handler {
  return async (req, ctx) => {
    try {
      await requireAuth(roles);
      return handler(req, ctx);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (e instanceof ForbiddenError) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
