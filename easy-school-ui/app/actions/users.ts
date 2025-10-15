// app/actions/users.ts
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createUser, updateUser } from '@/bff/services/security/user.server';
import { UserModel } from "@/app/lib/definitions/user_definitions";
import { fetchRoles } from '@/bff/services/security/role.server';

const EDIT_COOKIE = 'edit_user';
const JWT_SECRET = process.env.JWT_SECRET!;

const CreateUserSchema = z.object({
  username: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  roleIds: z
    .array(z.union([z.string(), z.number()]))
    .nonempty('Select at least one role')
    .transform(arr => arr.map(v => Number(v)))
    .refine(arr => arr.every(n => Number.isFinite(n) && n > 0), { message: 'Invalid role id(s)' }),
});

type ActionState =
  | { ok?: boolean; errors?: Record<string, string[]>; serverError?: string }
  | null;


const U = (v: unknown) => String(v ?? '').trim().toUpperCase();

/** Build conflicts by ID using role code OR role name (case-insensitive). */
function buildConflictsById(allRoles: any[]) {
  const byKey = new Map<string, string>(); // "ADMIN"|"STUDENT"|"TEACHER" -> id
  for (const r of allRoles) {
    const id = String(r?.id ?? '');
    if (!id) continue;
    const byCode = U(r?.code);
    const byName = U(r?.role);
    if (byCode) byKey.set(byCode, id);
    if (byName) byKey.set(byName, id);
  }

  const ADMIN   = byKey.get('ADMIN');
  const STUDENT = byKey.get('STUDENT');
  const TEACHER = byKey.get('TEACHER');

  const conflictsById: Record<string, Set<string>> = {};
  const add = (a?: string, b?: string) => {
    if (!a || !b) return;
    if (!conflictsById[a]) conflictsById[a] = new Set<string>();
    conflictsById[a]!.add(b);
  };

  // Your business rules:
  // Teacher ↔ Student
  add(TEACHER, STUDENT);
  add(STUDENT, TEACHER);
  // Student ↔ Admin
  add(STUDENT, ADMIN);
  add(ADMIN, STUDENT);

  return conflictsById;
}

/** Return an error message if any conflicting pair is chosen; otherwise null. */
function validateConflictsById(selectedIds: string[], conflictsById: Record<string, Set<string>>) {
  const chosen = new Set(selectedIds.map(String));
  for (const id of chosen) {
    const conflicts = conflictsById[id];
    if (!conflicts) continue;
    for (const cid of conflicts) {
      if (chosen.has(cid)) return 'Invalid combination of roles.'; // keep generic
    }
  }
  return null;
}


export async function createUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // 1) Gather + basic validation
  const raw = {
    username: String(formData.get('username') ?? ''),
    password: String(formData.get('password') ?? ''),
    roleIds: (formData.getAll('roleIds') as (string | number)[]) ?? [],
  };

  const parsed = CreateUserSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { ok: false, errors: fieldErrors };
  }

  const email = parsed.data.username.toLowerCase();
  const roleIdsNum = Array.from(new Set(parsed.data.roleIds)); // number[]
  const roleIdsStr = roleIdsNum.map(String);                   // string ids for maps

  // 2) Load roles from server and verify existence
  const allRoles = await fetchRoles(); // must return { id, role, code? }[]
  const allIds = new Set(allRoles.map(r => String(r?.id ?? '')));
  const missing = roleIdsStr.filter(id => !allIds.has(id));
  if (missing.length) {
    return { ok: false, errors: { roleIds: ['One or more selected roles no longer exist.'] } };
  }

  // 3) Build ID-based conflicts and validate
  const conflictsById = buildConflictsById(allRoles);
  const msg = validateConflictsById(roleIdsStr, conflictsById);
  if (msg) {
    return { ok: false, errors: { roleIds: [msg] } };
  }

  // 4) Persist
  const password_hash = await bcrypt.hash(parsed.data.password, 12);
  try {
    const user: UserModel = {
      username: email,
      password_hash,
      roles: roleIdsStr.map(id => ({ id })), // keep ids as strings
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
// keep your existing imports, helpers (U, buildConflictsById, validateConflictsById), EDIT_COOKIE, etc.

// Replace your UpdateUserSchema with this:
const UpdateUserSchema = z.object({
  username: z.string().trim().email('Informe um e-mail válido'),
  password: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length === 0 || s.length >= 6, {
      message: 'Senha deve ter pelo menos 6 caracteres',
    }),
  roleIds: z
    .array(z.union([z.string(), z.number()]))
    .nonempty('Selecione pelo menos um perfil')
    .transform((arr) => arr.map((v) => Number(v)))
    .refine((arr) => arr.every((n) => Number.isFinite(n) && n > 0), {
      message: 'ID(s) de perfil inválido(s)',
    }),
  status: z
    .union([z.string(), z.boolean(), z.number()])
    .transform((v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v !== 0;
      const s = String(v).toLowerCase();
      return s === 'on' || s === 'true' || s === '1';
    }),
});

// Update your updateUserAction to this:
export async function updateUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = getEditUserIdOrRedirect();

  // Collect raw values (note roleIds via getAll)
  const raw = {
    username: String(formData.get('username') ?? ''),
    password: String(formData.get('password') ?? ''),
    roleIds: (formData.getAll('roleIds') as (string | number)[]) ?? [],
    status: (formData.get('status') ?? 'off') as any,
  };

  const parsed = UpdateUserSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { ok: false, errors: fieldErrors };
  }

  const email = parsed.data.username.toLowerCase();
  const status = parsed.data.status;
  const roleIdsNum = Array.from(new Set(parsed.data.roleIds)); // number[]
  const roleIdsStr = roleIdsNum.map(String);                   // string ids

  // Load all roles for existence + conflicts
  const allRoles = await fetchRoles();
  const allIds = new Set(allRoles.map((r: any) => String(r?.id ?? '')));
  const missing = roleIdsStr.filter((rid) => !allIds.has(rid));
  if (missing.length) {
    return { ok: false, errors: { roleIds: ['Um ou mais perfis não existem mais.'] } };
  }

  // Build conflicts (by ID) and validate
  const conflictsById = buildConflictsById(allRoles);
  const msg = validateConflictsById(roleIdsStr, conflictsById);
  if (msg) {
    return { ok: false, errors: { roleIds: [msg] } };
  }

  // Build user payload
  const user: UserModel = {
    id,
    username: email,
    status,
    roles: roleIdsStr.map((rid) => ({ id: rid })),
  };

  if (parsed.data.password) {
    // hash only if present
    user.password_hash = await bcrypt.hash(parsed.data.password, 12);
  }

  try {
    await updateUser(user);
    cookies().delete(EDIT_COOKIE);
    revalidatePath('/dashboard/adm/user');
    redirect('/dashboard/adm/user?updated=1');
  } catch (e: any) {
    return { ok: false, serverError: e?.message ?? 'Falha ao atualizar usuário' };
  }
}
