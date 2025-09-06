import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';

import React, { useEffect, useState } from "react";

import EditCourseClassForm from '../../components/CourseClassesEditForm';

import { getCourseClassById, updateCourseClass } from '@/bff/services/courseClass.server';
import { getAllWeekDays, getWeekDaysByCourseClass } from '@/bff/services/calendarWeekDay.server';
import { fetchAvailabilityTeacher } from '@/bff/services/calendarRangeHourDay.server';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const courseClass = await getCourseClassById(id);


  const [allWeekDays, selectedlWeekDays] = await Promise.all([
    getAllWeekDays(),
    getWeekDaysByCourseClass(courseClass.id!),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Turmas', href: '/dashboard/courses-class' },
          {
            label: 'Editar Turmas',
            href: `/dashboard/courses-class/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCourseClassForm courseClass={courseClass} onSave={updateCourseClass} allWeekDays={allWeekDays} selectedlWeekDays={selectedlWeekDays} searchTeacher={fetchAvailabilityTeacher} />
    </main>
  );
}