import UsersViews from './components/UsersViews';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt, hasAnyRole } from '@/app/lib/authz';
import { callBff, getAllUsers } from '@/bff/services/security/user.server';
import { UserModel } from '@/app/lib/definitions/user_definitions';

export const metadata = { title: 'Users' };
// while developing, avoid any caching surprises
export const dynamic = 'force-dynamic';


export default async function Page() {

  const token = cookies().get('user')?.value ?? '';
  const user = token ? await verifyJwt(token).catch(() => null) : null;

  if (!user || !hasAnyRole(user, ['ADMIN'])) {
    redirect('/login'); // or '/login'
  }
  
  const users: UserModel[] = await getAllUsers();

  return (
    <main className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
     <UsersViews users={users} />
    </main>
  );
}