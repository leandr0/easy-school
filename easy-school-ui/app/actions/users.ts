// app/actions/users.ts
'use server';

import { number, z } from 'zod';
import bcrypt from 'bcryptjs';
import { upstream } from 'bff/http';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PATHS } from '@/bff/paths';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createUser, updateUser } from '@/bff/services/security/user.server';
import { UserModel } from "@/app/lib/definitions/user_definitions";

const EDIT_COOKIE = 'edit_user';
const JWT_SECRET = process.env.JWT_SECRET!;

const CreateUserSchema = z.object({
  username: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  roleId: z.string().min(1, 'Role is required').transform((s) => Number(s)),
});

type ActionState =
  | { ok?: boolean; errors?: Record<string, string[]>; serverError?: string }
  | null;

export async function createUserAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    username: String(formData.get('username') ?? ''),
    password: String(formData.get('password') ?? ''),
    roleId: String(formData.get('roleId') ?? ''),
  };

  const parsed = CreateUserSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { ok: false, errors: fieldErrors };
  }

  const email = parsed.data.username.toLowerCase();
  const password_hash = await bcrypt.hash(parsed.data.password, 12);
  const role_id = parsed.data.roleId;

  try {

    const user: UserModel = {
      username: email,
      roles: [{ id: Number(role_id).toString() }],
      password_hash: password_hash,
    };



    await createUser(user);

  } catch (e: any) {
    return { ok: false, serverError: e?.message ?? 'Failed to create user' };
  }

  revalidatePath('/dashboard/adm/user');
  redirect('/dashboard/adm/user?created=1');
}

export async function beginEditUser(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) redirect('user?err=noid');

  // short-lived signed token; purpose=edit helps scope usage
  const token = jwt.sign({ id, purpose: 'edit' }, JWT_SECRET, { expiresIn: '10m' });

  cookies().set({
    name: EDIT_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: 'adm/user/edit',
    maxAge: 10 * 60, // 10 min
  });

  redirect('user/edit');
}

export async function endEditUser() {
  cookies().delete(EDIT_COOKIE);
  redirect('../user');
}

function getEditUserIdOrRedirect() {
  const token = cookies().get(EDIT_COOKIE)?.value;
  if (!token) redirect('/dashboard/adm/user?err=expired');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; purpose: string };
    if (payload.purpose !== 'edit') throw new Error('bad purpose');
    return payload.id;
  } catch {
    redirect('/dashboard/adm/user?err=badtoken');
  }
}

const UpdateUserSchema = z.object({
  username: z.string().trim().email('Informe um e-mail válido'),
  // password is optional; if provided, enforce min length
  password: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length === 0 || s.length >= 6, {
      message: 'Senha deve ter pelo menos 6 caracteres',
    }),
  roleId: z.string().min(1, 'Selecione um perfil'),
  status: z
    .union([z.string(), z.boolean(), z.number()])
    .transform((v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v !== 0;
      const s = String(v).toLowerCase();
      // checkbox sends "on" when checked, empty when not present
      return s === 'on' || s === 'true' || s === '1';
    }),
});



export async function updateUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = getEditUserIdOrRedirect();

  const raw = {
    username: String(formData.get('username') ?? ''),
    password: String(formData.get('password') ?? ''),
    roleId: String(formData.get('roleId') ?? ''),
    status: (formData.get('status') ?? 'off') as any,
  };

  const parsed = UpdateUserSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { ok: false, errors: fieldErrors };
  }

  const email = parsed.data.username.toLowerCase();
  const status = parsed.data.status;
  const role_id = Number(parsed.data.roleId);

  // build payload; include password_hash only if a new password was entered
  const body: Record<string, unknown> = { id, username: email, status, role_id };
  if (parsed.data.password) {
    body.password_hash = await bcrypt.hash(parsed.data.password, 12);
  }

  try {

    // Update basic fields
    await upstream(`${PATHS.SECURITY.USERS}`, {
      method: 'PUT', // adjust to PATCH if your API expects it
      body: JSON.stringify(body),
    });

    const user: UserModel = {
      id: id,
      username: email,
      roles: [{ id: Number(role_id).toString() }],
      status: status,
    };

    if (parsed.data.password) {
      user.password_hash = parsed.data.password;
    }

    await updateUser(user);
    /* Update role (if your API needs a separate call)
    await upstream(`${PATHS.SECURITY.USERS}/${id}/roles`, {
      method: 'PUT', // or POST depending on your backend
      body: JSON.stringify({ role_id }),
    });*/

    // clear edit cookie and go back to list
    cookies().delete(EDIT_COOKIE);
    revalidatePath('/dashboard/adm/user');
    redirect('/dashboard/adm/user?updated=1');
  } catch (e: any) {
    return { ok: false, serverError: e?.message ?? 'Falha ao atualizar usuário' };
  }
}