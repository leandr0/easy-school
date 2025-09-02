// app/dashboard/adm/user/create/page.tsx
import CreateUserForm from '../components/CreateUserForm';
import { fetchRoles } from '@/bff/services/security/role.server';

export const metadata = { title: 'Create User' };

export default async function Page() {
  
  const roles = await fetchRoles();

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create User</h1>
      <CreateUserForm roles={roles} />
    </main>
  );
}
        