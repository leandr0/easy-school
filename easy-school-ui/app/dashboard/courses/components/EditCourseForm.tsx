'use client';

import { useRouter } from 'next/navigation';

import React, { useEffect, useMemo, useState } from 'react';

import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';

import { getAllLanguages } from '@/bff/services/language.server';
import { createCourse, findCourse } from '@/bff/services/course.server';

import EditCourseFormDesktop from './EditCourseFormDesktop';
import EditCourseFormMobile from './EditCourseFormMobile';

// Simple media query hook (no extra deps)
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

type Props = { course_id: string };

export default function EditCourseForm({ course_id }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)'); // md breakpoint
  const router = useRouter();

  const [languages, setLanguages] = useState<LanguageModel[]>([]);
  const [formData, setFormData] = useState<CourseModel>({ name: '', status: true });
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load languages once
  useEffect(() => {
    getAllLanguages()
      .then((langs) => {
        const withPlaceholder: LanguageModel[] = [
          { id: '', name: 'Selecione um idioma ... ', status: true },
          ...langs,
        ];
        setLanguages(withPlaceholder);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Load course by id
  useEffect(() => {
    findCourse(course_id)
      .then((course) => setFormData((prev) => ({ ...prev, ...course })))
      .catch((err) => setError(err.message));
  }, [course_id]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      setMessage('✅ Course created successfully!');
      setFormData({ name: '', status: true });
      router.push('/dashboard/courses');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : '❌ Unknown error occurred.');
    }
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
