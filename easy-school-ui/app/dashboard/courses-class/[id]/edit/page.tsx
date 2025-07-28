import { getCourseClassById } from '@/app/services/courseClassService';
import { CourseClassModel } from '@/app/lib/definitions/course_class_definitions';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import React, { useEffect, useState } from "react";
import EditCourseClassForm from '@/app/ui/course_classes/course_classes_edit_form';


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
      <EditCourseClassForm course_class_id={id}/>
    </main>
  );
}