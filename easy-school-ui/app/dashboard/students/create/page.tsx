"use client";
import React, { useEffect, useState } from "react";
import { CustomerField } from '@/app/lib/definitions';  // Ensure this path is correct
import CreateStudentForm from "../components/StudentsCreateForm";
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';


export default function Page() {
  
  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Alunos', href: '/dashboard/students' },
        {
          label: 'Criar Aluno',
          href: '/dashboard/students/create',
          active: true,
        },
      ]}
    />
    <CreateStudentForm />
  </main>
  );
}
