import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import React, { useEffect, useState } from "react";
import AddStudentsCourseClassForm from '../../components/CourseClassesAddStudentsForm';

import { getCourseClassById } from '@/bff/services/courseClass.server';
import { getStudentsInCourseClass, getStudentsNotInCourseClass } from '@/bff/services/student.server';
import { createCourseClassStudent, deleteByStudentAndCourseClass } from '@/bff/services/courseClassStudent.server';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const courseClass = await getCourseClassById(id);

  const [students, availableStudents] = await Promise.all([
          getStudentsInCourseClass(courseClass.id),
          getStudentsNotInCourseClass(courseClass.id!),
        ]);


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Turmas', href: '/dashboard/courses-class' },
          {
            label: 'Adicionar Alunos ',
            href: `/dashboard/courses-class/${id}/students`,
            active: true,
          },
        ]}
      />
      <AddStudentsCourseClassForm courseClass={courseClass} students={students} availableStudents={availableStudents}
      fetchStudents={getStudentsInCourseClass} fetchAvailableStudents={getStudentsNotInCourseClass}
      onDelete={deleteByStudentAndCourseClass} onUpdate={createCourseClassStudent}/>
    </main>
  );
}