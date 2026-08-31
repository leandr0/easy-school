import { redirect } from 'next/navigation';
import { getAbility } from '@/lib/authz/session';
import { getMyUser } from '@/bff/services/security/user.server';
import EditMyUserForm from '../../components/EditMyUserForm';

export const metadata = { title: 'Editar minha conta' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const ability = await getAbility();

  if (!ability || !ability.can('users.self')) {
    redirect('/login');
  }

  const me = await getMyUser();

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Editar minha conta</h1>
      <EditMyUserForm initial={{ username: me.username }} />
    </main>
  );
}
