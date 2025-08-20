'use client';

import { generateYAxisSolicitacaoMonth } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { useState, useEffect } from 'react';
import { DashBoardGrowthModel } from '@/app/lib/definitions/dashboard_definition';
import { getGrowthData } from '@/app/services/dashboardService';

export default function SolicitacaoMonthChart() {
  const [solicitacaoMonth, setSolicitacaoMonth] = useState<DashBoardGrowthModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching growth data...');
        const data = await getGrowthData();
        console.log('Growth data received:', data);
        
        setSolicitacaoMonth(data || []);
      } catch (err) {
        console.error('Error fetching growth data:', err);

      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const chartHeight = 350;
  
  // Generate Y-axis labels only when we have data
  const { yAxisLabels, topLabel } = solicitacaoMonth.length > 0 
    ? generateYAxisSolicitacaoMonth(solicitacaoMonth) 
    : { yAxisLabels: [], topLabel: 0 };

  // Loading state
  if (loading) {
    return (
      <div className="w-full md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Hora/Aula
        </h2>
        
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="sm:grid-cols-7 mt-0 grid grid-cols-6 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
            {/* Y-axis skeleton */}
            <div
              className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
              style={{ height: `${chartHeight}px` }}
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>

            {/* Chart bars skeleton */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center w-[40px]">
                <div
                  className="w-full rounded-md bg-gray-200 animate-pulse"
                  style={{
                    height: `${Math.random() * chartHeight}px`,
                  }}
                />
                <div className="h-3 w-8 bg-gray-200 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex items-center pb-2 pt-6">
            <CalendarIcon className="h-5 w-5 text-gray-500 animate-pulse" />
            <h3 className="ml-2 text-sm text-gray-500">Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Hora/Aula
        </h2>
        
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error loading chart data</h3>
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
  if (!solicitacaoMonth || solicitacaoMonth.length === 0) {
    return (
      <div className="w-full md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Hora/Aula
        </h2>
        
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="rounded-md bg-white p-4">
            <p className="mt-4 text-gray-400">No data available.</p>
          </div>
          <div className="flex items-center pb-2 pt-6">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <h3 className="ml-2 text-sm text-gray-500">Últimos 6 meses</h3>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render the chart
  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Hora/Aula
      </h2>
      
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-7 mt-0 grid grid-cols-6 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {solicitacaoMonth.map((month) => (
           <div key={month.month} className="flex flex-col items-center w-[40px] ">
              <div
                className="w-full rounded-md bg-blue-300 "
                style={{
                  height: `${(chartHeight / topLabel) * month.total}px`,
                }}
              />
              <p className="-rotate-90 text-[11px] text-gray-400 sm:rotate-0 mt-2 ">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Últimos 6 meses</h3>
        </div>
      </div>
    </div>
  );
}