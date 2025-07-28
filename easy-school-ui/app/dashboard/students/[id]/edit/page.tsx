import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import StudentEditForm from '@/app/ui/students/StudentEditForm';
import React, { useEffect, useState } from "react";



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
      <StudentEditForm student_id={id}/>
    </main>
  );
}