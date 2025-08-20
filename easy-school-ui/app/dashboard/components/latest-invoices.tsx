'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { useState, useEffect } from 'react';

import { getLanguageTotalStudents } from '@/app/services/languageService';
import { DashBoardTotalCardsLanguageModel } from '@/app/lib/definitions/dashboard_definition';

export default function ReportOperadora() {
  const [reportOperadora, setReportOperadora] = useState<DashBoardTotalCardsLanguageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching language data...');
        const data = await getLanguageTotalStudents();
        console.log('Language data received:', data);
        
        setReportOperadora(data);
      } catch (err) {
        console.error('Error fetching language data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load language data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Alunos por idioma
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
          <div className="bg-white px-6">
            {/* Loading skeletons */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-row items-center justify-between py-4 border-t">
                <div className="flex items-center">
                  <div className="mr-4 h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="min-w-0">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex items-center pb-2 pt-6">
            <ArrowPathIcon className="h-5 w-5 text-gray-500 animate-spin" />
            <h3 className="ml-2 text-sm text-gray-500">Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Alunos por idioma
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error loading language data</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!reportOperadora || reportOperadora.length === 0) {
    return (
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Alunos por idioma
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">No language data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render the data
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Alunos por idioma
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {reportOperadora.map((language, i) => {
            return (
              <div
                key={language.name}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={language.image_url}
                    alt={`${language.name}'s profile picture`}
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
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {language.total_students}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}