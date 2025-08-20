"use client";
import React, { useEffect, useState } from "react";
import { CustomerField } from '@/app/lib/definitions';  // Ensure this path is correct
import CreateStudentForm from "../components/students_create-form";
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';


export default function Page() {
  
  const [customers, setCustomers] = useState<CustomerField[] | null>(null);
  const [isVertical, setIsVertical] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null); // Error can be a string
  
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
