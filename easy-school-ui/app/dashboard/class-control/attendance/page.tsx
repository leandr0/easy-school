import ClassControlTable from '../components/ClassControlTable';
import { lusitana } from '@/app/ui/fonts';

import { Metadata } from 'next';
import AttendenceClassControlTable from '../components/AttendenceClassControlTable';
 
export const metadata: Metadata = {
  title: 'Presença das Aulas',
};

export default async function Page() {
  
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Controle de Aulas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <AttendenceClassControlTable/>
      </div>
    </div>
  );
}