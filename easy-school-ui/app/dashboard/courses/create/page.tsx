"use client";
import React, { useEffect, useState } from "react";
import { CustomerField } from '@/app/lib/definitions';  // Ensure this path is correct
import CreateCourseForm from "@/app/ui/courses/courses_create-form";
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';


export default function Page() {
  
  const [customers, setCustomers] = useState<CustomerField[] | null>(null);
  const [isVertical, setIsVertical] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null); // Error can be a string
  
  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Cursos', href: '/dashboard/courses' },
        {
          label: 'Criar Curso',
          href: '/dashboard/courses/create',
          active: true,
        },
      ]}
    />
    <CreateCourseForm />
  </main>
  );
}
