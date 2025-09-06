// app/dashboard/components/LanguagesStat.tsx
import { use } from 'react';
import Image from 'next/image';
import type { DashBoardTotalCardsLanguageModel } from '@/app/lib/definitions/dashboard_definition';
import { lusitana } from '@/app/ui/fonts';
import clsx from 'clsx';

export default function LanguagesStat({
  dataPromise,
}: {
  dataPromise: Promise<DashBoardTotalCardsLanguageModel[]>;
}) {
  const reportOperadora = use(dataPromise) ?? [];

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Alunos por idioma
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {reportOperadora.map((language, i) => (
            <div
              key={language.name}
              className={clsx('flex flex-row items-center justify-between py-4', {
                'border-t': i !== 0,
              })}
            >
              <div className="flex items-center">
                <Image
                  src={language.image_url}
                  alt={`${language.name} flag`}
                  className="mr-4 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {language.name}
                  </p>
                </div>
              </div>
              <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
                {language.total_students}
              </p>
            </div>
          ))}
          {reportOperadora.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">No language data available</p>
            </div>
          )}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <p className="text-sm text-gray-500">Updated just now</p>
        </div>
      </div>
    </div>
  );
}
