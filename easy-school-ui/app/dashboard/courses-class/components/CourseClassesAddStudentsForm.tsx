'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

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
  onRemoveStudent: (studentId: string) => void;
  onAddSelected: () => void;
  onBack: () => void;
  message: string;
  error: string | null;
  selectableRef: React.RefObject<SelectableStudentsTableRef>;
  // Number of add/remove requests still in flight in the background. The
  // lists themselves are updated optimistically and don't wait on this — it
  // only drives a small, non-blocking "syncing..." indicator, since the API
  // here can be slow and we don't want the UI to freeze up for it.
  pendingSaves: number;
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
  const [pendingSaves, setPendingSaves] = useState(0);

  const selectableRef = useRef<SelectableStudentsTableRef>(null);

  // NOTE: there used to be a "silent" background refresh here on mount
  // (Promise.all([fetchStudents, fetchAvailableStudents])) meant to keep the
  // lists fresh. It's gone now — the API is slow enough that it could still
  // be in flight when the user adds/removes a student, and when it finally
  // resolved it would overwrite the just-applied optimistic update with the
  // stale pre-mutation snapshot it had fetched earlier. That race was the
  // actual cause of "the list doesn't update" across every version of this
  // page. The `students`/`availableStudents` props are already fresh (the
  // server component fetched them right before rendering this page), so
  // there's nothing this needs to re-fetch on mount — the effect below just
  // seeds local state from those props, and after that, optimistic updates
  // are the single source of truth until the next full page load.
  useEffect(() => {
    setFormData(courseClass);
    setStudentsList(students);
    setAvailableList(availableStudents);
  }, [courseClass, students, availableStudents]);

  // ---- Remove: update the UI immediately, let the API call finish in the
  // background. On failure we roll back just this one change.
  const onRemoveStudent = (studentId: string) => {
    setError(null);
    const removed = studentsList.find((s) => String(s.id) === String(studentId));
    if (!removed) return;

    setStudentsList((prev) => prev.filter((s) => String(s.id) !== String(studentId)));
    setAvailableList((prev) => [removed, ...prev]);

    setPendingSaves((n) => n + 1);
    onDelete(studentId, courseClass.id)
      .then(() => {
        setMessage('✅ Student removed successfully!');
      })
      .catch((err: any) => {
        // rollback
        setStudentsList((prev) => [removed, ...prev]);
        setAvailableList((prev) => prev.filter((s) => String(s.id) !== String(studentId)));
        setError(err?.message || 'Failed to remove student');
      })
      .finally(() => setPendingSaves((n) => Math.max(0, n - 1)));
  };

  // ---- Add: same idea — move the selected students over right away instead
  // of waiting on the (slow) API response, then reconcile in the background.
  const onAddSelected = () => {
    if (selectedStudentIds.length === 0) return;
    setError(null);

    // `selectedStudentIds` (and therefore `idsToAdd`) can hold the student's
    // raw numeric id — checkbox selection passes `student.id` straight
    // through without stringifying it, even though this is typed as
    // string[]. Comparing that directly against `String(s.id)` below with
    // `.includes()` is a strict-equality check, so `[327].includes("327")`
    // is false: a plain number never matches its own string form. That
    // silently produced zero matches on every add, so the optimistic update
    // moved nothing even though the request to the API (which just forwards
    // the ids as-is) succeeded — the actual root cause of "nothing happens".
    // Normalizing both sides to strings here fixes the comparison; the
    // original (possibly-numeric) ids still go out in the payload unchanged.
    const idsToAdd = selectedStudentIds;
    const idsToAddStr = idsToAdd.map(String);
    const selected = availableList.filter((s) => idsToAddStr.includes(String(s.id ?? '')));

    setAvailableList((prev) => prev.filter((s) => !idsToAddStr.includes(String(s.id ?? ''))));
    setStudentsList((prev) => [...prev, ...selected]);
    setSelectedStudentIds([]);

    const payload: CreateCourseClassStudentModel = {
      course_class_id: courseClass.id,
      student_ids: idsToAdd,
    };

    setPendingSaves((n) => n + 1);
    onUpdate(payload)
      .then(() => {
        setMessage('✅ Students added successfully!');
      })
      .catch((err: any) => {
        // rollback this batch
        setAvailableList((prev) => [...selected, ...prev]);
        setStudentsList((prev) => prev.filter((s) => !idsToAddStr.includes(String(s.id ?? ''))));
        setMessage(err?.message ? `❌ ${err.message}` : '❌ Unknown error.');
      })
      .finally(() => setPendingSaves((n) => Math.max(0, n - 1)));
  };
  const onBack = () => router.push('/dashboard/courses-class');

  const commonProps: AddStudentsCommonProps = {
    formData,
    students: studentsList,
    availableStudents: availableList,
    selectedStudentIds,
    setSelectedStudentIds,
    onRemoveStudent,
    onAddSelected,
    onBack,
    message,
    error,
    selectableRef,
    pendingSaves,
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
