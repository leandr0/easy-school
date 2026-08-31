import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import CreateMessageForm from "@/app/dashboard/adm/messages/components/message_create-form";
import { authorizePage } from '@/lib/authz/page-guard';


export default async function Page({ params }: { params: { id: string } }) {

  // TEACHER/STUDENT now reach /dashboard/adm via the users.self permission,
  // but Mensagens stays admin-only.
  await authorizePage('admin.all');

  const id = params.id;

  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Mensagens', href: '/dashboard/adm/messages' },
        {
          label: 'Criar Mensagens',
          href: `/dashboard/adm/messages`,
          active: true,
        },
      ]}
    />
    <CreateMessageForm/>
  </main>
  );
}
