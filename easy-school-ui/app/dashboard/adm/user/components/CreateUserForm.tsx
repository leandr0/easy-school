// app/dashboard/adm/user/create/CreateUserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUserAction } from '@/app/actions/users';
import { RoleModel } from '@/app/lib/definitions/role_definitions';
import RolesMultiSelect from './RolesSelect';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full rounded-md bg-purple-600 text-white py-2 disabled:opacity-60"
    >
      {pending ? 'Creating…' : 'Create User'}
    </button>
  );
}

const initialState = null as any;

export default function CreateUserForm({ roles }: { roles: RoleModel[] }) {
  const [state, action] = useFormState(createUserAction, initialState);

  // Build conflicts BY ID, from your known codes:
  const codeToId = new Map<string, string>();

  roles.forEach((r) => {
    const code = String(r?.code ?? '').trim().toUpperCase();
    if (code) codeToId.set(code, String(r.id));
  });

  // in CreateUserForm.tsx, before rendering RolesMultiSelect
  const mapBy = (val: unknown) => String(val ?? '').trim().toUpperCase();

  const codeOrNameToId = new Map<string, string>();
  roles.forEach((r) => {
    const byCode = mapBy(r?.code);
    const byName = mapBy(r?.role);
    const id = String(r.id);
    if (byCode) codeOrNameToId.set(byCode, id);
    if (byName) codeOrNameToId.set(byName, id);
  });

  const ADMIN = codeOrNameToId.get('ADMIN');
  const STUDENT = codeOrNameToId.get('STUDENT');
  const TEACHER = codeOrNameToId.get('TEACHER');

  const conflictsById: Record<string, string[]> = {};
  const addConflict = (a?: string, b?: string) => {
    if (!a || !b) return;
    conflictsById[a] = [...(conflictsById[a] ?? []), b];
  };

  // Teacher ↔ Student
  addConflict(TEACHER, STUDENT);
  addConflict(STUDENT, TEACHER);

  // Student ↔ Admin
  addConflict(STUDENT, ADMIN);
  addConflict(ADMIN, STUDENT);


  return (
    <form action={action} className="bg-white rounded-lg p-4 shadow">
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        name="username"
        type="email"
        inputMode="email"
        autoComplete="email"
        className="mt-1 w-full rounded-md border px-3 py-2"
        placeholder="name@example.com"
        required
      />
      {state?.errors?.username && (
        <p className="mt-1 text-sm text-red-600">{state.errors.username[0]}</p>
      )}

      <label className="block text-sm font-medium text-gray-700 mt-4">Password</label>
      <input
        name="password"
        type="password"
        autoComplete="new-password"
        className="mt-1 w-full rounded-md border px-3 py-2"
        placeholder="••••••••"
        required
        minLength={6}
      />
      {state?.errors?.password && (
        <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
      )}

      <RolesMultiSelect
        roles={roles}
        name="roleIds"
        required
        error={state?.errors?.roleIds?.[0] ?? null}
        conflictsById={conflictsById}
        placeholder="Select roles…"
        label="Roles"
      />

      {state?.serverError && (
        <p className="mt-3 text-sm text-red-600">{state.serverError}</p>
      )}

      <SubmitButton />
    </form>
  );
}
