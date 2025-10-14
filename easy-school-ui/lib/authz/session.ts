// lib/authz/session.ts
import { cookies as globalCookies, headers as globalHeaders } from 'next/headers';
import type { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';
import { Role, RolePermissions, Permission } from './permissions';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const CANDIDATE_COOKIE_NAMES = ['user', 'auth_token', 'token']; // support multiple

type JwtClaims = JWTPayload & {
  username?: string;
  roles?: string[];
  name?: string;
};

export type SessionUser = {
  id: string;
  email: string;
  roles: Role[];
  name?: string;
};

function readTokenFrom(req?: NextRequest): string | null {
  // 1) Try request cookies first (most reliable in route handlers)
  if (req) {
    for (const n of CANDIDATE_COOKIE_NAMES) {
      const v = req.cookies.get(n)?.value;
      if (v) return v;
    }
    const ah = req.headers.get('authorization') || req.headers.get('Authorization');
    if (ah?.startsWith('Bearer ')) return ah.slice(7);
  }

  // 2) Fallback to global stores (works in server components/edge)
  const store = globalCookies();
  for (const n of CANDIDATE_COOKIE_NAMES) {
    const v = store.get(n)?.value;
    if (v) return v;
  }
  const h = globalHeaders().get('authorization');
  if (h?.startsWith('Bearer ')) return h.slice(7);

  return null;
}

export async function getSessionUser(req?: NextRequest): Promise<SessionUser | null> {
  const token = readTokenFrom(req);
  // avoid logging the token; just indicate presence
  
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: 'easy-school',
      audience: 'web',
    });

    const p = payload as JwtClaims;
    const rawRoles = (p.roles ?? []).map((r) => r?.toUpperCase?.()) as string[];
    const roles: Role[] = rawRoles.filter((r): r is Role =>
      ['ADMIN', 'MANAGER', 'TEACHER', 'ASSISTANT', 'STUDENT'].includes(r)
    );
    const effective = roles.length ? roles : (['STUDENT'] as Role[]);

    return {
      id: String(p.sub ?? ''),
      email: String(p.username ?? ''), // your token uses "username"
      roles: effective,
      name: p.name,
    };
  } catch (e) {
    console.warn('jwtVerify failed', e);
    return null;
  }
}

export type Ability = { can: (p: Permission) => boolean; list: Permission[],username: string,roles: string[] };

export async function getAbility(req?: NextRequest): Promise<Ability | null> {
  const user = await getSessionUser(req);

  if (!user) return null;

  const perms = new Set<Permission>();
  user.roles.forEach((r) => (RolePermissions[r] ?? []).forEach((p) => perms.add(p)));

  return {
    can: (p) => perms.has('admin.all') || perms.has(p),
    list: Array.from(perms),
    username: user.email!,
    roles: user.roles,
  };
}
