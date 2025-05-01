"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateCourseClassForm from "@/app/ui/course_classes/course_classes_create-form";


export default function Page() {
  
  
  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Turmas', href: '/dashboard/courses-class' },
        {
          label: 'Criar Turma',
          href: '/dashboard/courses-class/create',
          active: true,
        },
      ]}
    />
    <CreateCourseClassForm />
  </main>
  );
}
