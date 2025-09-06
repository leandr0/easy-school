// app/dashboard/components/Cards.tsx
import { use } from 'react';
import type { DashBoardTotalCardsModel } from '@/app/lib/definitions/dashboard_definition';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import LanguageIcon from '@heroicons/react/24/outline'; // adjust if you have a custom LanguageIcon
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  teacher: AcademicCapIcon,
  student: UserGroupIcon,
  course_class: BookOpenIcon,
  language: (LanguageIcon as any) ?? AcademicCapIcon, // fallback if missing
};

export default function Cards({
  dataPromise,
}: {
  dataPromise: Promise<DashBoardTotalCardsModel>;
}) {
  const data = use(dataPromise); // ← suspends under <SafeSuspense/>

  return (
    <>
      <Card title="Professores"  value={data?.total_teacher ?? 0}      type="teacher" />
      <Card title="Cursos"       value={data?.total_course_class ?? 0} type="course_class" />
      <Card title="Idiomas"      value={data?.total_language ?? 0}     type="language" />
      <Card title="Alunos"       value={data?.total_student ?? 0}      type="student" />
    </>
  );
}

function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'language' | 'teacher' | 'course_class' | 'student';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
