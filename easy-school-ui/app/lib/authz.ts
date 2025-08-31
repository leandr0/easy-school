// app/lib/authz.ts
import { jwtVerify } from 'jose';
import { JwtClaims } from '@/sign';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type AuthUser = {
  id: string;
  username: string;
  roles: string[];
};

export async function verifyJwt(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secret, {
    issuer: 'easy-school',
    audience: 'web',
  });
  return {
    id: String(payload.sub),
    username: String(payload.username ?? ''),
    roles: Array.isArray(payload.roles) ? payload.roles.map(String) : [],
  };
}

export function hasAnyRole(user: AuthUser | null, required: string[]) {
  const roles = user?.roles ?? [];
  return required.some(r => roles.includes(r));
}
