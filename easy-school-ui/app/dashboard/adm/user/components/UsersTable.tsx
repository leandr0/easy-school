// app/adm/user/components/UsersTable.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { User } from '@/bff/schemas';
import { Switch } from '@/app/dashboard/components/switch';
import { UpdateBase } from '@/app/dashboard/components/ui_buttons';
import EditUserAction from './EditUserAction';
import { UserModel } from '@/app/lib/definitions/user_definitions';
import { Pagination } from '@/app/dashboard/components/Pagination';


type Props = {
  users: UserModel[];
  formatDate: (ts?: string | null) => string;
};


export default function UsersTable({ users, formatDate }: Props) {

  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query ? users.filter(u => u.username.toLowerCase().includes(query)) : users;
  }, [q, users]);

  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(5);

  // clamp current page if revenues length changes
  const totalCount = filtered?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!filtered?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, page, pageSize]);


  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-3 border-b">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by email…"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 font-medium text-gray-700">Created</th>
              <th className="px-4 py-2 font-medium text-gray-700 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr><td className="px-4 py-6 text-gray-500" colSpan={3}>No users found.</td></tr>
            ) : currentItems.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">
                  <Switch checked={u.status!} onChange={() => { }} />
                </td>
                <td className="px-4 py-2">{formatDate(u.created_at)}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end">
                    <EditUserAction id={u.id!} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[5, 10,15]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}
