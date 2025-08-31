import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import CreateTeacherForm from "@/app/dashboard/teachers/components/TeacherCreateForm";


export default function Page() {
    
  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Professores', href: '/dashboard/teachers' },
        {
          label: 'Criar Professor',
          href: '/dashboard/teachers/create',
          active: true,
        },
      ]}
    />
    <CreateTeacherForm/>
  </main>
  );
}
