"use client";
import React, { useEffect, useState } from "react";
import { CustomerField } from '@/app/lib/definitions';  // Ensure this path is correct
import CreateStudentForm from "@/app/ui/students/students_create-form";
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateTeacherForm from "@/app/ui/teachers/teacher_create-form";


export default function Page() {
  
  const [customers, setCustomers] = useState<CustomerField[] | null>(null);
  const [isVertical, setIsVertical] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null); // Error can be a string
  
  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Professores', href: '/dashboard/teachers' },
        {
          label: 'Criar Professor',
          href: '/dashboard/teachers/create',
          active: true,
        },
      ]}
    />
    <CreateTeacherForm/>
  </main>
  );
}
