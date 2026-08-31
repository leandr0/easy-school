import { lusitana } from '@/app/ui/fonts';

import { Metadata } from 'next';
import ClassControlReport from '../components/ClassControlReport';

export const metadata: Metadata = {
  title: 'Relatório de Frequência',
};

export default async function Page() {

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Controle de Aulas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <ClassControlReport />
      </div>
    </div>
  );
}
