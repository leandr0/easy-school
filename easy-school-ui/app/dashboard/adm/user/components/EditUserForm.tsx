// app/adm/user/edit/EditUserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateUserAction, endEditUser } from '@/app/actions/users';
import type { Role } from '@/bff/schemas';
import { Switch } from '@/app/dashboard/components/switch';
import { useMemo, useState } from 'react';
import RolesSelect from '@/app/dashboard/adm/user/components/RolesSelect';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-purple-600 text-white px-4 py-2 disabled:opacity-60"
    >
      {pending ? 'Salvando…' : 'Salvar alterações'}
    </button>
  );
}

function CancelBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border px-4 py-2"
      form="cancel-edit-form"
    >
      Voltar
    </button>
  );
}

export default function EditUserForm({
  roles,
  initial,
}: {
  roles: Role[];
  initial: { username: string; status: boolean; roleIds: string[] };
}) {
  const [state, action] = useFormState(updateUserAction, null);
  const [active, setActive] = useState<boolean>(initial.status);

  // Build ID-based conflicts (ADMIN ↔ STUDENT, TEACHER ↔ STUDENT)
  const conflictsById = useMemo(() => {
    const up = (v: unknown) => String(v ?? '').trim().toUpperCase();
    const map = new Map<string, string>();
    roles.forEach((r) => {
      const id = String(r.id);
      const code = up((r as any)?.code);
      const name = up((r as any)?.role);
      if (code) map.set(code, id);
      if (name) map.set(name, id);
    });

    const ADMIN   = map.get('ADMIN');
    const STUDENT = map.get('STUDENT');
    const TEACHER = map.get('TEACHER');

    const out: Record<string, string[]> = {};
    const add = (a?: string, b?: string) => {
      if (!a || !b) return;
      out[a] = [...(out[a] ?? []), b];
    };

    // Teacher ↔ Student
    add(TEACHER, STUDENT);
    add(STUDENT, TEACHER);
    // Student ↔ Admin
    add(STUDENT, ADMIN);
    add(ADMIN, STUDENT);

    return out;
  }, [roles]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <form action={action} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            name="username"
            type="email"
            defaultValue={initial.username}
            required
            autoComplete="email"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
          {state?.errors?.username && (
            <p className="mt-1 text-sm text-red-600">{state.errors.username[0]}</p>
          )}
        </div>

        {/* Optional new password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nova senha (opcional)</label>
          <input
            name="password"
            type="password"
            placeholder="Deixe em branco para manter a atual"
            className="mt-1 w-full rounded-md border px-3 py-2"
            minLength={6}
          />
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Roles (multi-select with chips) */}
        <RolesSelect
          roles={roles as any}
          name="roleIds"
          required
          defaultSelectedIds={initial.roleIds}
          error={state?.errors?.roleIds?.[0] ?? null}
          conflictsById={conflictsById}
        />

        {/* Status toggle (with hidden input for form value) */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Ativo</span>
          <input type="hidden" name="status" value={active ? 'on' : 'off'} />
          <Switch checked={active} onChange={setActive} />
        </div>

        {/* Server error */}
        {state?.serverError && (
          <p className="text-sm text-red-600">{state.serverError}</p>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <CancelBtn />
          <SubmitBtn />
        </div>
      </form>

      {/* separate form to end edit and go back (clears cookie) */}
      <form id="cancel-edit-form" action={endEditUser} />
    </div>
  );
}
