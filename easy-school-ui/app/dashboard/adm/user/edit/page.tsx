import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { RoleSchema, type Role } from '@/bff/schemas';
import { z } from 'zod';
import EditUserForm from '../components/EditUserForm';
import { findUser } from '@/bff/services/security/user.server';
import { fetchRoles } from '@/bff/services/security/role.server';
import { authorizePage } from '@/lib/authz/page-guard';

const JWT_SECRET = process.env.JWT_SECRET!;
const EDIT_COOKIE = 'edit_user';

export const metadata = { title: 'Editar usuário' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  // This is the admin edit-any-user flow (id-based). TEACHER/STUDENT use
  // /dashboard/adm/user/me/edit instead, which only ever touches their own
  // account.
  await authorizePage('admin.all');

  const token = cookies().get(EDIT_COOKIE)?.value;

  if (!token) redirect('/dashboard/adm/user?updated=1');

  let id: string;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; purpose: string };
    if (payload.purpose !== 'edit') throw new Error('bad purpose');
    id = payload.id;
  } catch {
    redirect('/adm/user?err=badtoken');
  }

  // load user + roles
  const [userRaw, rolesRaw] = await Promise.all([findUser(id), fetchRoles()]);
  const roles: Role[] = z.array(RoleSchema).parse(rolesRaw);

  // infer current role ids from common shapes -> always string[]
  const roleIds: string[] = (() => {
    const r1 = (userRaw as any)?.role_id;
    const r2 = (userRaw as any)?.role?.id;
    const rArr = (userRaw as any)?.roles;
    if (Array.isArray(rArr) && rArr.length) return rArr.map((r: any) => String(r?.id ?? '')).filter(Boolean);
    if (r1 != null) return [String(r1)];
    if (r2 != null) return [String(r2)];
    return [];
  })();

  const initial = {
    username: String((userRaw as any)?.username ?? ''),
    status:
      typeof (userRaw as any)?.status === 'boolean'
        ? (userRaw as any).status
        : String((userRaw as any)?.status ?? '').toLowerCase() !== 'false',
    roleIds,
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Editar usuário</h1>
      <EditUserForm roles={roles} initial={initial} />
    </main>
  );
}
