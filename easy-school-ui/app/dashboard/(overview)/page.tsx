// app/dashboard/page.tsx

import {
  getTeacherCourseClassLanguageStudent,
  getGrowthData
} from '@/bff/services/dashboard.server';
import Cards from './components/Cards';
import GrowthChart from './components/GrowthChart';
import LanguagesStat from './components/LanguagesStat';
import {
  CardsSkeleton,
  GrowthSkeleton,
  LanguagesSkeleton,
} from './components/skeletons';
import { getLanguageTotalStudents } from '@/bff/services/language.server';
import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';

// If you want to always SSR and avoid caching surprises:
export const dynamic = 'force-dynamic';

export default function Page() {
  // kick off all fetches in parallel (DON’T await)
  const cardsPromise = getTeacherCourseClassLanguageStudent();
  const growthPromise = getGrowthData();
  const langsPromise = getLanguageTotalStudents();

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

  return (
    <main >
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Relatórios
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SafeSuspense fallback={<CardsSkeleton />}>
          <Cards dataPromise={cardsPromise} />
        </SafeSuspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <SafeSuspense fallback={<GrowthSkeleton />}>
          <GrowthChart dataPromise={growthPromise} />
        </SafeSuspense>

        <SafeSuspense fallback={<LanguagesSkeleton />}>
          <LanguagesStat dataPromise={langsPromise} />
        </SafeSuspense>
      </div>
    </main>
  );
}
