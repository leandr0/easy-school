'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { StudentCoursePriceModel, CoursePriceModel } from '@/app/lib/definitions/students_definitions';
import StudentEditDesktopForm from './StudentEditDesktopForm';
import StudentEditMobileForm from './StudentEditMobileForm';
import { EditCourseModalDesktop } from './EditCourseModalDesktop';
import { EditCourseModalMobile } from './EditCourseModalMobile';
import { ConfirmUpdateModalDesktop } from './ConfirmUpdateModalDesktop';
import { ConfirmUpdateModalMobile } from './ConfirmUpdateModalMobile';
import { findByIdCoursePrice, updateStudentAndCoursePrice } from "@/bff/services/student.server";

export default function StudentEditForm({ student_id }: { student_id: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState<StudentCoursePriceModel>({
    name: "",
    email: "",
    phone_number: "",
    due_date: "",
    start_date: "",
    status: true,
    courses: [],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CoursePriceModel | null>(null);
  const [newCoursePriceInput, setNewCoursePriceInput] = useState<string>("");
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const student = await findByIdCoursePrice(student_id);
        setFormData(student);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchStudentData();
  }, [student_id]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        courses: formData.courses?.map(course => ({
          ...course,
          course_price: parseFloat(String(course.course_price))
        }))
      };

      await updateStudentAndCoursePrice(dataToSend);
      setMessage("✅ Student updated successfully!");
      router.push("/dashboard/students");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ Unknown error occurred.");
      }
    }
  };

  const handleEditCourseClick = (course: CoursePriceModel) => {
    setCourseToEdit(course);
    const priceValue = typeof course.course_price === 'string'
      ? parseFloat(course.course_price) || 0
      : course.course_price || 0;
    setNewCoursePriceInput(priceValue.toString());
    setShowEditCourseModal(true);
  };

  const handleSaveNewCoursePrice = () => {
    setShowEditCourseModal(false);
    setShowConfirmUpdateModal(true);
  };

  const handleConfirmUpdate = () => {
    if (courseToEdit && newCoursePriceInput !== null) {
      setFormData(prevFormData => {
        const updatedCourses = prevFormData.courses?.map(course => {
          if (course.name === courseToEdit.name) {
            return { ...course, course_price: parseFloat(newCoursePriceInput) };
          }
          return course;
        });
        return { ...prevFormData, courses: updatedCourses };
      });
    }
    setShowConfirmUpdateModal(false);
    setCourseToEdit(null);
    setNewCoursePriceInput("");
  };

  const handleCancelEdit = () => {
    setShowEditCourseModal(false);
    setCourseToEdit(null);
    setNewCoursePriceInput("");
  };

  const handleCancelConfirm = () => {
    setShowConfirmUpdateModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <StudentEditDesktopForm
          formData={formData}
          message={message}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onEditCourse={handleEditCourseClick}
          onSwitchStatus={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
        />
      </div>
      <div className="block md:hidden px-4 space-y-6">
        <StudentEditMobileForm
          formData={formData}
          message={message}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onEditCourse={handleEditCourseClick}
          onSwitchStatus={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
        />
      </div>

      {showEditCourseModal && courseToEdit && (
        <>
          <EditCourseModalDesktop
            course={courseToEdit}
            inputValue={newCoursePriceInput}
            onChange={setNewCoursePriceInput}
            onCancel={handleCancelEdit}
            onSave={handleSaveNewCoursePrice}
          />
          <EditCourseModalMobile
            course={courseToEdit}
            inputValue={newCoursePriceInput}
            onChange={setNewCoursePriceInput}
            onCancel={handleCancelEdit}
            onSave={handleSaveNewCoursePrice}
          />
        </>
      )}

      {showConfirmUpdateModal && (
        <>
          <ConfirmUpdateModalDesktop
            newPrice={newCoursePriceInput}
            onCancel={handleCancelConfirm}
            onConfirm={handleConfirmUpdate}
          />
          <ConfirmUpdateModalMobile
            newPrice={newCoursePriceInput}
            onCancel={handleCancelConfirm}
            onConfirm={handleConfirmUpdate}
          />
        </>
      )}
    </div>
  );
}
