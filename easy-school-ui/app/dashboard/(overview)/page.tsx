"use client";
import RevenueChart from '@/app/dashboard/components/revenue-chart';
import LatestInvoices from '@/app/dashboard/components/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/dashboard/components/cards';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';

// Simple Error Display Component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-red-800 font-semibold">Something went wrong</h3>
      <p className="text-red-600 mt-2">{error}</p>
      <button 
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  );
}

// Safe Suspense Wrapper
function SafeSuspense({ 
  children, 
  fallback, 
  errorMessage = "Failed to load component" 
}: { 
  children: React.ReactNode; 
  fallback: React.ReactNode; 
  errorMessage?: string;
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

export default function Page() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Relatórios
      </h1>
      
      {/* Cards Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        <SafeSuspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </SafeSuspense>
      </div>
      
      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">

        <SafeSuspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </SafeSuspense>
        
        <SafeSuspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </SafeSuspense>
      </div>
    </main>
  );
}