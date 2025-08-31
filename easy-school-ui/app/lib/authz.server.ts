// app/lib/authz.server.ts (variant)
import 'server-only';
import { headers as nextHeaders, cookies as nextCookies } from 'next/headers';
import { verifyJwt, type AuthUser } from '@/app/lib/authz';
import { UnauthorizedError, ForbiddenError } from '@/app/lib/errors';

export async function requireAuth(requiredRoles?: string | string[]): Promise<AuthUser> {
  const cookieToken = nextCookies().get('user')?.value || '';
  const auth = nextHeaders().get('authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const token = cookieToken || bearer;
  if (!token) throw new UnauthorizedError();

  const user = await verifyJwt(token).catch(() => null);
  if (!user) throw new UnauthorizedError();

  if (requiredRoles) {
    const need = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const ok = (user.roles ?? []).some(r => need.includes(r));
    if (!ok) throw new ForbiddenError();
  }
  return user;
}

function getIncomingToken(): string {
  const cookieToken = nextCookies().get('user')?.value || '';
  const auth = nextHeaders().get('authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return cookieToken || bearer;
}

export async function bearerHeaders(requiredRoles?: string | string[]) {
  // authorizes, but ignore its return value
  await requireAuth(requiredRoles);
  const token = getIncomingToken();
  if (!token) throw new UnauthorizedError();
  return { Authorization: `Bearer ${token}` } as Record<string, string>;
}
