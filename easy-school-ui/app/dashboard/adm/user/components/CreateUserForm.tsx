// app/dashboard/adm/user/create/CreateUserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUserAction } from '@/app/actions/users';
import { RoleModel } from '@/app/lib/definitions/role_definitions';

type Role = { id: string; role: string; code: string };

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

      <label className="block text-sm font-medium text-gray-700 mt-4">Role</label>
      <select
        name="roleId"
        required
        defaultValue=""
        className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
      >
        <option value="" disabled>
          Select a role…
        </option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.role}
          </option>
        ))}
      </select>
      {state?.errors?.roleId && (
        <p className="mt-1 text-sm text-red-600">{state.errors.roleId[0]}</p>
      )}

      {state?.serverError && (
        <p className="mt-3 text-sm text-red-600">{state.serverError}</p>
      )}

      <SubmitButton />
    </form>
  );
}
