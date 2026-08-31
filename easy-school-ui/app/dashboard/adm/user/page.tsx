import UsersViews from './components/UsersViews';
import MyUserView from './components/MyUserView';

import { redirect } from 'next/navigation';
import { getAbility } from '@/lib/authz/session';
import { getAllUsers, getMyUser } from '@/bff/services/security/user.server';
import { UserModel } from '@/app/lib/definitions/user_definitions';

export const metadata = { title: 'Users' };
// while developing, avoid any caching surprises
export const dynamic = 'force-dynamic';


export default async function Page() {

  const ability = await getAbility();

  if (!ability || !ability.can('users.self')) {
    redirect('/login');
  }

  // Full admin experience: unchanged - every user, with roles and the
  // activate/deactivate control.
  if (ability.can('admin.all')) {
    const users: UserModel[] = await getAllUsers();

    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
        <UsersViews users={users} />
      </main>
    );
  }

  // TEACHER / STUDENT: only their own record, no roles, no status control.
  const me: UserModel = await getMyUser();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Meu Usuário</h1>
      <MyUserView user={me} />
    </main>
  );
}
