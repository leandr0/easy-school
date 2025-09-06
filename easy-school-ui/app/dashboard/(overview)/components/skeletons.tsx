// app/dashboard/components/skeletons.tsx
import { lusitana } from '@/app/ui/fonts';
import { CalendarIcon } from '@heroicons/react/24/outline';

export function CardsSkeleton() {
  return (
    <>
      {[0,1,2,3].map((i) => (
        <div key={i} className="rounded-xl bg-gray-100 p-2 shadow-sm animate-pulse">
          <div className="flex p-4">
            <div className="h-5 w-5 rounded-md bg-gray-200" />
            <div className="ml-2 h-6 w-16 rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
            <div className="h-7 w-20 rounded-md bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  );
}

export function GrowthSkeleton() {
  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Hora/Aula
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-7 mt-0 grid grid-cols-6 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex" style={{ height: 350 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center w-[40px]">
              <div className="w-full rounded-md bg-gray-200 animate-pulse" style={{ height: `${50 + i*20}px` }} />
              <div className="h-3 w-8 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500 animate-pulse" />
          <h3 className="ml-2 text-sm text-gray-500">Loading…</h3>
        </div>
      </div>
    </div>
  );
}

export function LanguagesSkeleton() {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Alunos por idioma
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-row items-center justify-between py-4 border-t">
              <div className="flex items-center">
                <div className="mr-4 h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    </div>
  );
}
