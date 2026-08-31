// app/dashboard/adm/user/create/page.tsx
import CreateUserForm from '../components/CreateUserForm';
import { fetchRoles } from '@/bff/services/security/role.server';
import { authorizePage } from '@/lib/authz/page-guard';

export const metadata = { title: 'Create User' };

export default async function Page() {

  // TEACHER/STUDENT now reach /dashboard/adm via the users.self permission,
  // but creating users stays admin-only.
  await authorizePage('admin.all');

  const roles = await fetchRoles();

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create User</h1>
      <CreateUserForm roles={roles} />
    </main>
  );
}
        