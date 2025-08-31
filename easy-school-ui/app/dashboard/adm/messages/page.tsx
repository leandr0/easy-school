import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import CreateMessageForm from "@/app/dashboard/adm/messages/components/message_create-form";


export default function Page({ params }: { params: { id: string } }) {
  
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
