// app/dashboard/adm/user/components/MyUserView.tsx
import Link from 'next/link';
import { formatBRDate } from '@/app/lib/dates';
import { UserModel } from '@/app/lib/definitions/user_definitions';

type Props = { user: UserModel };

/**
 * Restricted, self-only view of the Usuários page for TEACHER/STUDENT.
 * Deliberately does not render Roles or the Ativo/Inativo toggle - those
 * stay admin-only (see UsersTable/UsersListMobile, used for the full list).
 */
export default function MyUserView({ user }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border p-5 space-y-4">
      <div>
        <div className="text-sm font-medium text-gray-500">Email</div>
        <div className="text-base text-gray-900">{user.username}</div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-500">Status</div>
        <span
          className={
            'inline-block text-xs px-2 py-0.5 rounded-full ' +
            (user.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700')
          }
        >
          {user.status ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-500">Criado em</div>
        <div className="text-base text-gray-900">{formatBRDate(user.created_at)}</div>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        <Link
          href="/dashboard/adm/user/me/edit"
          className="rounded-md bg-purple-600 text-white px-4 py-2 hover:bg-purple-700"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}
