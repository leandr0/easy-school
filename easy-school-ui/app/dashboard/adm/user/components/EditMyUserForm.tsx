// app/dashboard/adm/user/components/EditMyUserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { updateMyUserAction } from '@/app/actions/users';

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

export default function EditMyUserForm({
  initial,
}: {
  initial: { username: string };
}) {
  const [state, action] = useFormState(updateMyUserAction, null);

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
            autoComplete="new-password"
          />
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Server error */}
        {state?.serverError && (
          <p className="text-sm text-red-600">{state.serverError}</p>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Link href="/dashboard/adm/user" className="rounded-md border px-4 py-2">
            Voltar
          </Link>
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
}
