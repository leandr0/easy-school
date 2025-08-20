'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import DeleteStudantFromCourseClassList from '@/app/dashboard/components/ui_buttons';
import SelectableStudentsTable , { SelectableStudentsTableRef }from '../../students/components/students_selectable_table';

import { CourseClassAddStudentsForm } from '@/app/lib/definitions/course_class_definitions';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { CreateCourseClassStudentModel } from '@/app/lib/definitions/course_class_students_definitions';

import { getCourseClassById } from '@/app/services/courseClassService';
import { getStudentsInCourseClass, getStudentsNotInCourseClass } from '@/app/services/studentService';
import { createCourseClassStudent, deleteByStudentAndCourseClass } from '@/app/services/courseClassStudentService';

import AddStudentsDesktop from './AddStudentsDesktop';
import AddStudentsMobile from './AddStudentsMobile';

export type AddStudentsCommonProps = {
  formData: CourseClassAddStudentsForm;
  students: StudentModel[];
  availableStudents: StudentModel[];
  selectedStudentIds: string[];
  setSelectedStudentIds: (ids: string[]) => void;
  onRemoveStudent: (studentId: string) => Promise<void>;
  onAddSelected: () => Promise<void>;
  onBack: () => void;
  message: string;
  error: string | null;
  selectableRef: React.RefObject<SelectableStudentsTableRef>;
};

export default function AddStudentsCourseClassForm({ course_class_id }: { course_class_id: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState<CourseClassAddStudentsForm>({ id: course_class_id });
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [availableStudents, setAvailableStudents] = useState<StudentModel[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectableRef = useRef<SelectableStudentsTableRef>(null);

  const loadCourseClassData = async () => {
    try {
      const courseClass = await getCourseClassById(course_class_id);
      setFormData(prev => ({
        ...prev,
        teacher: courseClass.teacher,
        course: courseClass.course,
        name: courseClass.name,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar turma');
    }
  };

  const loadStudentsInClass = async () => {
    try {
      const list = await getStudentsInCourseClass(course_class_id);
      setStudents(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos da turma');
    }
  };

  const loadAvailableStudents = async () => {
    try {
      const list = await getStudentsNotInCourseClass(course_class_id);
      setAvailableStudents(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos disponíveis');
    }
  };

  const refreshAllData = async () => {
    await Promise.all([loadStudentsInClass(), loadAvailableStudents()]);
    setSelectedStudentIds([]);
  };

  useEffect(() => {
    loadCourseClassData();
    refreshAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course_class_id]);

  const onRemoveStudent = async (studentId: string) => {
    setError(null);
    const removed = students.find(s => String(s.id) === String(studentId));
    if (!removed) return;

    // optimistic UI
    setStudents(prev => prev.filter(s => String(s.id) !== String(studentId)));
    setAvailableStudents(prev => [removed, ...prev]);

    try {
      await deleteByStudentAndCourseClass(studentId, course_class_id);
      setMessage('✅ Student removed successfully!');
    } catch (err: any) {
      // rollback
      setStudents(prev => [removed, ...prev]);
      setAvailableStudents(prev => prev.filter(s => String(s.id) !== String(studentId)));
      setError(err?.message || 'Failed to remove student');
    }
  };

  const onAddSelected = async () => {
    if (selectedStudentIds.length === 0) return;

    try {
      const payload: CreateCourseClassStudentModel = {
        course_class_id,
        student_ids: selectedStudentIds,
      };

      // optimistic: move selected to current list
      const selected = availableStudents.filter(s => selectedStudentIds.includes(s.id ?? ''));
      setAvailableStudents(prev => prev.filter(s => !selectedStudentIds.includes(s.id ?? '')));
      setStudents(prev => [...prev, ...selected]);
      setSelectedStudentIds([]);

      await createCourseClassStudent(payload);
      setMessage('✅ Students added successfully!');
    } catch (err) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : '❌ Unknown error.');
      await refreshAllData(); // ensure truth
    }
  };

  const onBack = () => router.push('/dashboard/courses-class');

  const commonProps: AddStudentsCommonProps = {
    formData,
    students,
    availableStudents,
    selectedStudentIds,
    setSelectedStudentIds,
    onRemoveStudent,
    onAddSelected,
    onBack,
    message,
    error,
    selectableRef,
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Desktop */}
      <div className="hidden md:block">
        <AddStudentsDesktop {...commonProps} />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <AddStudentsMobile {...commonProps} />
      </div>
    </form>
  );
}
