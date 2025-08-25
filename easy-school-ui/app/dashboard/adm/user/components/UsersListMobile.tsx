// app/adm/user/components/UsersListMobile.tsx
'use client';

import { useMemo, useState } from 'react';
import type { User } from '@/bff/schemas';
import { UpdateBase } from '@/app/dashboard/components/ui_buttons';
import EditUserAction from './EditUserAction';


type Props = {
  users: User[];
  formatDate: (ts?: string | null) => string;
};

export default function UsersListMobile({ users, formatDate }: Props) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query ? users.filter((u) => u.username.toLowerCase().includes(query)) : users;
  }, [q, users]);

  return (
    <div className="bg-white rounded-lg shadow border ">
      <div className="p-3 border-b">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por email…"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">Nenhum usuário.</div>
      ) : (
        <ul className="divide-y">
          {filtered.map((u) => (
            <li key={u.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{u.username}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    Criado em: <span className="font-medium text-gray-700">{formatDate(u.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={
                      'text-xs px-2 py-0.5 rounded-full ' +
                      (u.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700')
                    }
                  >
                    {u.status ? 'Ativo' : 'Inativo'}
                  </span>
                  <EditUserAction id={u.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
