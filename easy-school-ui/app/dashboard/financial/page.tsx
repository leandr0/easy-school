import { lusitana } from '@/app/ui/fonts';

import { Metadata } from 'next';
import RevenuesTable from './components/RevenueTable';
import Link from 'next/link';
 
export const metadata: Metadata = {
  title: 'Financial',
};

export default async function Page() {
  
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Financial</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <RevenuesTable/>
      </div>
           <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Voltar
                </Link>
            </div>
    </div>
  );
}