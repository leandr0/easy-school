// app/adm/user/edit/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { upstream } from '@/bff/http';
import { PATHS } from '@/bff/paths';
import { RoleSchema, type Role } from '@/bff/schemas';
import { z } from 'zod';
import EditUserForm from '../components/EditUserForm';

const JWT_SECRET = process.env.JWT_SECRET!;
const EDIT_COOKIE = 'edit_user';

export const metadata = { title: 'Editar usuário' };
export const dynamic = 'force-dynamic';

export default async function Page() {
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
  const [userRaw, rolesRaw] = await Promise.all([
    upstream<unknown>(`${PATHS.SECURITY.USERS}/${id}`, { method: 'GET' }),
    upstream<unknown>(PATHS.SECURITY.ROLES, { method: 'GET' }),
  ]);
  const roles: Role[] = z.array(RoleSchema).parse(rolesRaw);

  // try to infer current role id from common shapes
  const currentRoleId =
    String(
      (userRaw as any)?.role_id ??
      (userRaw as any)?.role?.id ??
      (userRaw as any)?.roles?.[0]?.id ??
      ''
    ) || '';

  const initial = {
    username: String((userRaw as any)?.username ?? ''),
    status:
      typeof (userRaw as any)?.status === 'boolean'
        ? (userRaw as any).status
        : String((userRaw as any)?.status ?? '').toLowerCase() !== 'false',
    roleId: currentRoleId,
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Editar usuário</h1>
      <EditUserForm roles={roles} initial={initial} />
    </main>
  );
}
