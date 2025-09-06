'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import CreateStudentFormDesktop from './CreateStudentFormDesktop';
import CreateStudentFormMobile from './CreateStudentFormMobile';
import { createStudent } from '@/bff/services/student.server';

export default function CreateStudentForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<StudentModel>({
    name: '',
    email: '',
    phone_number: '',
    due_date: '',
    start_date: '',
    status: true,
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDueDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const allowed = [5, 10, 20];
    const val = Number(e.target.value);
    if (allowed.includes(val) || e.target.value === '') {
      handleChange(e);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      setMessage('✅ Student created successfully!');
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        due_date: '',
        start_date: '',
        status: true,
      });
      router.push('/dashboard/students');
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : '❌ Unknown error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Desktop */}
      <div className="hidden md:block">
        <CreateStudentFormDesktop
          formData={formData}
          message={message}
          onChange={handleChange}
          onDueDateChange={handleDueDateChange}
        />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <CreateStudentFormMobile
          formData={formData}
          message={message}
          onChange={handleChange}
          onDueDateChange={handleDueDateChange}
        />
      </div>
    </form>
  );
}
