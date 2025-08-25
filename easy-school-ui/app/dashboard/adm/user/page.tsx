// app/adm/user/page.tsx
import { upstream } from '@/bff/http';
import { z } from 'zod';
import { UserSchema, type User } from '@/bff/schemas';
import UsersTable from './components/UsersTable';
import Link from 'next/link';
import { PATHS } from '@/bff/paths';
import UsersListMobile from './components/UsersListMobile';
import UsersViews from './components/UsersViews';

export const metadata = { title: 'Users' };
// while developing, avoid any caching surprises
export const dynamic = 'force-dynamic';

export default async function Page() {
  // If your backend supports paging, you can pass query params here (e.g., ?page=0&size=50)
  const raw = await upstream<unknown>(PATHS.SECURITY.USERS, { method: 'GET' , cache: 'no-store'});
  const users: User[] = z.array(UserSchema).parse(raw);

  return (
    <main className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
      <UsersViews users={users} />
    </main>
  );
}