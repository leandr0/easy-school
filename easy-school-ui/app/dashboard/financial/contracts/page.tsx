import { Metadata } from 'next';
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import { authorizePage } from '@/lib/authz/page-guard';
import { getAllStudents } from '@/bff/services/student.server';
import ContractsPageClient from './components/ContractsPageClient';

export const metadata: Metadata = {
  title: 'Contratos',
};

export default async function Page() {
  await authorizePage('financial.read');

  const students = await getAllStudents();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Financeiro', href: '/dashboard/financial' },
          { label: 'Contratos', href: '/dashboard/financial/contracts', active: true },
        ]}
      />
      <ContractsPageClient students={students} />
    </main>
  );
}
