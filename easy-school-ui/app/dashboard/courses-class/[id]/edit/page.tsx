import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import React, { useEffect, useState } from "react";
import EditCourseClassForm from '../../components/CourseClassesEditForm'; 


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;


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
      <EditCourseClassForm />
    </main>
  );
}