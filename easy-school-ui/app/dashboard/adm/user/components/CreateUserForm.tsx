// app/dashboard/adm/user/components/CreateUserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUserAction } from '@/app/actions/users';
import { RoleModel } from '@/app/lib/definitions/role_definitions';
import RolesMultiSelect from './RolesSelect';
import PhoneNumberField, { onlyDigits } from '@/app/dashboard/components/PhoneNumberField';
import BRLCurrency from '@/app/dashboard/components/currency';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const formRef = useRef<HTMLFormElement>(null);

  // Helpers p/ mapear por CODE/NAME
  const mapBy = (val: unknown) => String(val ?? '').trim().toUpperCase();

  const codeOrNameToId = useMemo(() => {
    const m = new Map<string, string>();
    roles.forEach((r) => {
      const byCode = mapBy(r?.code);
      const byName = mapBy(r?.role);
      const id = String(r.id);
      if (byCode) m.set(byCode, id);
      if (byName) m.set(byName, id);
    });
    return m;
  }, [roles]);

  const ADMIN = codeOrNameToId.get('ADMIN');
  const STUDENT = codeOrNameToId.get('STUDENT');
  const TEACHER = codeOrNameToId.get('TEACHER');

  // Conflitos
  const conflictsById: Record<string, string[]> = useMemo(() => {
    const c: Record<string, string[]> = {};
    const add = (a?: string, b?: string) => {
      if (!a || !b) return;
      c[a] = [...(c[a] ?? []), b];
    };
    // Teacher ↔ Student
    add(TEACHER, STUDENT);
    add(STUDENT, TEACHER);
    // Student ↔ Admin
    add(STUDENT, ADMIN);
    add(ADMIN, STUDENT);
    return c;
  }, [ADMIN, STUDENT, TEACHER]);

  // Estado do telefone (controlado)
  const [phone, setPhone] = useState<string>('');

  // Roles selecionadas — RolesMultiSelect não expõe onChange/value (é não controlado),
  // então sincronizamos lendo o FormData sempre que algo mudar dentro do <form>.
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const syncSelectedRoles = () => {
    // RolesMultiSelect re-renders its hidden inputs asynchronously after the
    // change event (it toggles its own internal state), so defer the read
    // until after that DOM update has been committed.
    setTimeout(() => {
      if (!formRef.current) return;
      const fd = new FormData(formRef.current);
      setSelectedRoleIds(fd.getAll('roleIds').map(String));
    }, 0);
  };

  const hasRole = (id?: string | null) => !!id && selectedRoleIds.includes(id);
  const isTeacher = hasRole(TEACHER);
  const isStudent = hasRole(STUDENT);

  // Compensation (R$) e Due Date
  const [compensation, setCompensation] = useState<string>('');
  const [dueDate, setDueDate] = useState<number | ''>('');

  const onCompensationChange = (val: string) => setCompensation(val);
  const onDueDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const n = e.target.value === '' ? '' : Number(e.target.value);
    setDueDate(n);
  };

  // Sempre que alternar roles, zera o campo que não deve ir
  useEffect(() => {
    if (isTeacher) setDueDate('');
    if (isStudent) setCompensation('');
  }, [isTeacher, isStudent]);

  return (
    <form
      ref={formRef}
      action={action}
      onChange={syncSelectedRoles}
      className="bg-white rounded-lg p-4 shadow"
    >
      <label className="block text-sm font-medium text-gray-700 mt-1">Nome</label>
      <input
        name="name"
        type="text"
        autoComplete="name"
        className="mt-1 w-full rounded-md border px-3 py-2"
        placeholder="Nome completo"
        required
        minLength={10}
      />
      {state?.errors?.name && (
        <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
      )}

      {/* Telefone */}
      <div className="mt-4">
        <PhoneNumberField
          label="Telefone"
          value={phone}
          onChange={(formatted) => setPhone(formatted)}
          required
        />
        {/* Enviar só dígitos para o backend */}
        <input type="hidden" name="phone_number" value={onlyDigits(phone)} />
        {state?.errors?.phone_number && (
          <p className="mt-1 text-sm text-red-600">{state.errors.phone_number[0]}</p>
        )}
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">Email (username)</label>
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

      {/* Se TEACHER: mostra compensation e oculta due_date */}
      {isTeacher ? (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compensação (R$)
          </label>
          <BRLCurrency
            asInput
            name="compensation"
            readonly={false}
            value={compensation}
            onChange={onCompensationChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
          />
          {/* Garante que due_date não seja enviado */}
          <input type="hidden" name="due_date" value="" />
          {state?.errors?.compensation && (
            <p className="mt-1 text-sm text-red-600">{state.errors.compensation[0]}</p>
          )}
        </div>
      ) : (
        // Quando não é teacher, garante que compensation vá vazio
        <input type="hidden" name="compensation" value="" />
      )}

      {/* Se STUDENT: mostra due_date e oculta compensation */}
      {isStudent ? (
        <div className="mt-4 flex items-center">
          <label htmlFor="due_date" className="w-24 text-sm text-right mr-3">
            Vencimento:
          </label>
          <input
            type="number"
            name="due_date"
            id="due_date"
            min={5}
            max={20}
            step={5}
            value={dueDate}
            onChange={onDueDateChange}
            className="text-center block w-20 rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
          />
          {/* Garante que compensation não seja enviado */}
          <input type="hidden" name="compensation" value="" />
          {state?.errors?.due_date && (
            <p className="ml-3 text-sm text-red-600">{state.errors.due_date[0]}</p>
          )}
        </div>
      ) : (
        // Quando não é student, garante que due_date vá vazio
        <input type="hidden" name="due_date" value="" />
      )}

      <SubmitButton />
    </form>
  );
}
