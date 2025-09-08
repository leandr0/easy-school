// lib/authz/session.ts
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Role, RolePermissions, Permission } from './permissions';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type SessionUser = { id: string; email: string; role: Role; name?: string };

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: String(payload.sub),
      email: String(payload.email),
      role: (payload.role as Role) ?? 'STUDENT',
      name: payload.name as string | undefined,
    };
  } catch { return null; }
}

export type Ability = { can: (p: Permission) => boolean; list: Permission[] };

export async function getAbility(): Promise<Ability | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const perms = new Set<Permission>(RolePermissions[user.role] ?? []);
  return {
    can: (p) => perms.has('admin.all') || perms.has(p),
    list: [...perms],
  };
}
