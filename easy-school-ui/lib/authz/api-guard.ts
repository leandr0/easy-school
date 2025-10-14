// lib/authz/api-guard.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAbility } from './session';
import type { Permission } from './permissions';

type Handler = (req: NextRequest, ctx: any) => Promise<Response>;

type Mode = 'any' | 'all';

export function withAuthZ(required: Permission | Permission[], handler: Handler, options: { mode?: Mode } = {}): Handler {
  
  const needs = Array.isArray(required) ? required : [required];
  const mode: Mode = options.mode ?? 'all';

  return async (req, ctx) => {
    const ability = await getAbility(req);
    if (!ability) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const check = (p: Permission) => ability.can(p);
    const allowed = mode === 'all' ? needs.every(check) : needs.some(check);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return handler(req, ctx);
  };
}
