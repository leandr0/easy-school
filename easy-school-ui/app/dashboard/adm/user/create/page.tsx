// app/dashboard/adm/user/create/page.tsx
import { upstream } from 'bff/http'; 
import { RoleSchema } from 'bff/schemas'; 
import { z } from 'zod';
import CreateUserForm from '../components/CreateUserForm';

export const metadata = { title: 'Create User' };

export default async function Page() {
  const data = await upstream<any>('/security/roles', { method: 'GET' });
  const roles = z.array(RoleSchema).parse(data);

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create User</h1>
      <CreateUserForm roles={roles} />
    </main>
  );
}
        