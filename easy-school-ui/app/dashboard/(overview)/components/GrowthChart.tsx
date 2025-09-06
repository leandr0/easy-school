// app/dashboard/components/GrowthChart.tsx
import { use } from 'react';
import type { DashBoardGrowthModel } from '@/app/lib/definitions/dashboard_definition';
import { lusitana } from '@/app/ui/fonts';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { generateYAxisSolicitacaoMonth } from '@/app/lib/utils';

export default function GrowthChart({
  dataPromise,
}: {
  dataPromise: Promise<DashBoardGrowthModel[]>;
}) {
  const solicitacaoMonth = use(dataPromise) ?? [];

  const chartHeight = 350;
  const { yAxisLabels, topLabel } =
    solicitacaoMonth.length > 0
      ? generateYAxisSolicitacaoMonth(solicitacaoMonth)
      : { yAxisLabels: [], topLabel: 1 };

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Hora/Aula
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-7 mt-0 grid grid-cols-6 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          {/* Y-axis */}
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {/* Bars */}
          {solicitacaoMonth.map((month) => (
            <div key={month.month} className="flex flex-col items-center w-[40px] ">
              <div
                className="w-full rounded-md bg-purple-400"
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
