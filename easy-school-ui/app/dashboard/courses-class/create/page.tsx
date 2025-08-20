"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import CreateCourseClassForm from "../components/CourseClassesCreateForm";

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
