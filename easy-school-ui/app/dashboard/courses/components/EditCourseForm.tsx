'use client';

import { useRouter } from 'next/navigation';

import React, { useEffect, useMemo, useState, TransitionStartFunction, useTransition } from 'react';

import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';


import EditCourseFormDesktop from './EditCourseFormDesktop';
import EditCourseFormMobile from './EditCourseFormMobile';

type Props = { languages: LanguageModel[], course: CourseModel, onSave: (c: CourseModel) => Promise<CourseModel>; };

export default function EditCourseForm({ languages, course, onSave }: Props) {

  const router = useRouter();

  const [formData, setFormData] = useState<CourseModel>({ name: '', status: true });
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFormData(course);
  }, [course]);


  const handleTextOrSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Special handling to keep language object consistent
    if (name === 'language_id') {
      const lang = languages.find((l) => String(l.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        language: lang ? { ...lang } : undefined,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked }));
  };

  const handlePriceChange = (value: number | string) => {
    let numericValue: number | undefined;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
      numericValue = isNaN(parsed) ? undefined : parsed;
    } else {
      numericValue = value;
    }
    setFormData((prev) => ({ ...prev, price: numericValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await onSave(formData); // <-- calls the server action
        setMessage('✅ Course saved successfully!');
        router.push('/dashboard/courses');
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error.');
      }
    });
  };

  const selectedLanguageId = useMemo(() => formData.language?.id ?? '', [formData.language]);

  // Shared props passed to both UIs
  const sharedProps = {
    formData,
    languages,
    selectedLanguageId,
    message,
    error,
    onSubmit: handleSubmit,
    onChange: handleTextOrSelectChange,
    onPriceChange: handlePriceChange,
    onStatusChange: handleStatusChange,
  };

  return (
    <div className="mt-6 flow-root w-full">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="hidden md:block">

            <EditCourseFormDesktop
              formData={formData}
              languages={languages}
              selectedLanguageId={selectedLanguageId}
              message={message}
              error={error}
              onSubmit={handleSubmit}
              onChange={handleTextOrSelectChange}
              onPriceChange={handlePriceChange}
              onStatusChange={handleStatusChange}
            />
          </div>

          <div className="md:hidden">
            <EditCourseFormMobile
              formData={formData}
              languages={languages}
              selectedLanguageId={selectedLanguageId}
              message={message}
              error={error}
              onSubmit={handleSubmit}
              onChange={handleTextOrSelectChange}
              onPriceChange={handlePriceChange}
              onStatusChange={handleStatusChange}
            /> 
          </div>
        </div>
      </div>
    </div>
  )
}
