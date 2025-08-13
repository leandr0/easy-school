import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import React, { useEffect, useState } from "react";
import AddStudentsCourseClassForm from '../../components/CourseClassesAddStudentsForm';


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Turmas', href: '/dashboard/courses-class' },
          {
            label: 'Adicionar Alunos ',
            href: `/dashboard/courses-class/${id}/students`,
            active: true,
          },
        ]}
      />
      <AddStudentsCourseClassForm course_class_id={id}/>
    </main>
  );
}