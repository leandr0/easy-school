'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useTransition } from 'react';

import { SelectableStudentsTableRef } from '../../students/components/StudentsSelectableTable';

import { CourseClassAddStudentsForm } from '@/app/lib/definitions/course_class_definitions';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { CreateCourseClassStudentModel } from '@/app/lib/definitions/course_class_students_definitions';

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

type Props = {
  courseClass: CourseClassAddStudentsForm,
  students: StudentModel[],
  availableStudents: StudentModel[],
  fetchStudents(course_class_id: any): Promise<StudentModel[]>,
  fetchAvailableStudents(course_class_id: any): Promise<StudentModel[]>,
  onDelete(student_id: any, course_class_id: any): Promise<void> ,
  onUpdate(model: CreateCourseClassStudentModel): Promise<void>,
};


export default function AddStudentsCourseClassForm({ courseClass, students, availableStudents, fetchStudents, fetchAvailableStudents,onDelete,onUpdate }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<CourseClassAddStudentsForm>(courseClass);
  const [studentsList, setStudentsList] = useState<StudentModel[]>(students);
  const [availableList, setAvailableList] = useState<StudentModel[]>(availableStudents);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectableRef = useRef<SelectableStudentsTableRef>(null);

  useEffect(() => {
    startTransition(refreshAllData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseClass?.id]);

  const refreshAllData = async () => {
    setError(null);
    try {
      const [freshStudents, freshAvailable] = await Promise.all([
        fetchStudents(courseClass.id),
        fetchAvailableStudents(courseClass.id),
      ]);
      setStudentsList(freshStudents);
      setAvailableList(freshAvailable);
      setSelectedStudentIds([]);
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh lists');
    }
  };

  useEffect(() => {
    setFormData(courseClass);
    setStudentsList(students);
    setAvailableList(availableStudents);

  }, [courseClass, students, availableStudents]);

  const onRemoveStudent = async (studentId: string) => {
    setError(null);
    const removed = studentsList.find((s) => String(s.id) === String(studentId));
    if (!removed) return;

    // optimistic UI
    setStudentsList((prev) => prev.filter((s) => String(s.id) !== String(studentId)));
    setAvailableList((prev) => [removed, ...prev]);

    try {
      await onDelete(studentId, courseClass.id);
      setMessage('✅ Student removed successfully!');
    } catch (err: any) {
      // rollback
      setStudentsList((prev) => [removed, ...prev]);
      setAvailableList((prev) => prev.filter((s) => String(s.id) !== String(studentId)));
      setError(err?.message || 'Failed to remove student');
    }finally{
      await refreshAllData();
    }
  };

  const onAddSelected = async () => {
    if (selectedStudentIds.length === 0) return;

    // optimistic move
    const selected = availableList.filter((s) => selectedStudentIds.includes(String(s.id ?? '')));
    setAvailableList((prev) => prev.filter((s) => !selectedStudentIds.includes(String(s.id ?? ''))));
    setStudentsList((prev) => [...prev, ...selected]);
    setSelectedStudentIds([]);

    try {
      const payload: CreateCourseClassStudentModel = {
        course_class_id: courseClass.id,
        student_ids: selectedStudentIds,
      };
      await onUpdate(payload);
      setMessage('✅ Students added successfully!');
    } catch (err: any) {
      setMessage(err?.message ? `❌ ${err.message}` : '❌ Unknown error.');

    }finally{
      await refreshAllData();
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
        <AddStudentsDesktop formData={formData} students={studentsList} availableStudents={availableList} selectedStudentIds={selectedStudentIds} 
        setSelectedStudentIds={setSelectedStudentIds} onRemoveStudent={onRemoveStudent} onAddSelected={onAddSelected} onBack={onBack}
        message={message} error={error} selectableRef={selectableRef} />
        
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <AddStudentsMobile formData={formData} students={studentsList} availableStudents={availableList} selectedStudentIds={selectedStudentIds} 
        setSelectedStudentIds={setSelectedStudentIds} onRemoveStudent={onRemoveStudent} onAddSelected={onAddSelected} onBack={onBack}
        message={message} error={error} selectableRef={selectableRef} />
      </div>
    </form>
  );
}
