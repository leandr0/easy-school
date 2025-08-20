import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import StudentEditForm from '@/app/ui/students/StudentEditForm';
import React, { useEffect, useState } from "react";
import TeacherEditForm from '../../components/EditTeacherForm';



export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Professores', href: '/dashboard/teachers' },
          {
            label: 'Editar Professor',
            href: `/dashboard/teachers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <TeacherEditForm teacher_id={id}/>
    </main>
  );
}