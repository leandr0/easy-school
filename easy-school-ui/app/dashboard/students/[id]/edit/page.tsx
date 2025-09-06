import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import StudentEditForm from '../../components/StudentEditForm';
import React, { useEffect, useState } from "react";
import { findByIdCoursePrice } from '@/bff/services/student.server';



export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const student = await findByIdCoursePrice(id);

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
      <StudentEditForm student={student}/>
    </main>
  );
}