import { getCourseClassById } from '@/app/lib/actions/course_class_actions';
import { CourseClassModel } from '@/app/lib/definitions/course_class_definitions';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import React, { useEffect, useState } from "react";
import EditCourseClassForm from '@/app/ui/course_classes/course_classes_edit_form';
import EditStudentForm from '@/app/ui/students/students_edit_form';


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Alunos', href: '/dashboard/students' },
          {
            label: 'Editar Aluno',
            href: `/dashboard/students/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditStudentForm student_id={id}/>
    </main>
  );
}