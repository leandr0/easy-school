"use client";
import React, { useEffect, useState } from "react";
import { CustomerField } from '@/app/lib/definitions';  // Ensure this path is correct
import CreateCourseForm from "@/app/dashboard/courses/components/CreateCourseForm";
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import EditCourseForm from "@/app/dashboard/courses/components/EditCourseForm";


export default function Page({ params }: { params: { id: string } }) {
  
  const id = params.id;

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
          label: 'Editar Curso',
          href: `/dashboard/courses/${id}/edit`,
          active: true,
        },
      ]}
    />
    <EditCourseForm course_id={id}/>
  </main>
  );
}
