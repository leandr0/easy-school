'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useMemo, useState } from 'react';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';

import { BookOpenIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';

import BRLCurrency from '../../components/currency';

import { createCourse } from '@/bff/services/course.server';
import { getAllLanguages } from '@/bff/services/language.server';

export default function CreateCourseForm() {
  const router = useRouter();

  const [languages, setLanguages] = useState<LanguageModel[]>([]);
  const [formData, setFormData] = useState<CourseModel>({
    name: '',
    status: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllLanguages()
      .then((langs) => {
        const updated = [
          { id: '', name: 'Selecione um idioma ... ', status: true },
          ...langs,
        ];
        setLanguages(updated);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, language: { id: value } }));
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
    if (submitting) return;
    try {
      setSubmitting(true);
      setToast(null);
      await createCourse(formData);
      setToast('✅ Curso criado com sucesso!');
      router.push('/dashboard/courses');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred.';
      setToast(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const disableSubmit = submitting || loading || !formData.name || !formData.language?.id;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Header */}
      <div className="px-4 pt-2 md:px-0 md:pt-4">
        <h1 className="text-base md:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          Criar Curso
        </h1>
        <p className="text-xs md:text-sm text-gray-500">
          Defina idioma, nome e valor do curso.
        </p>
      </div>

      {/* Toast / Error */}
      <div className="px-4 md:px-0">
        {toast && (
          <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
            {toast}
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 md:mt-6 px-4 md:px-0 pb-24 md:pb-0">
        <div className="rounded-lg bg-white md:bg-gray-50 border border-gray-200 md:border-0 p-3 md:p-5">
          <div className="space-y-5">
            {/* Idioma */}
            <div>
              <label htmlFor="language_id" className="block text-sm font-medium text-gray-900">
                Idioma
              </label>
              <div className="relative mt-1">
                <select
                  id="language_id"
                  name="language_id"
                  value={formData.language?.id ?? ''}
                  onChange={handleLanguageChange}
                  className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  disabled={loading}
                >
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-500" />
              </div>
            </div>

            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Nome do Curso
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex.: Inglês Básico"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Valor */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-900">
                Valor (mensalidade)
              </label>
              <div className="mt-1">
                <BRLCurrency
                  value={formData.price}
                  asInput={true}
                  onChange={handlePriceChange}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
                <p className="mt-1 text-[11px] text-gray-500">Informe o valor em BRL.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex justify-end gap-3 mt-4">
          <Link
            href="/dashboard/courses"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={disableSubmit}>
            {submitting ? 'Criando...' : 'Criar Curso'}
          </Button>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-2">
        <Link
          href="/dashboard/courses"
          className="w-1/2 h-11 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 active:bg-gray-100 flex items-center justify-center"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={disableSubmit}
          className={`w-1/2 h-11 rounded-md text-sm font-semibold ${
            disableSubmit ? 'bg-purple-300 text-white' : 'bg-purple-600 text-white active:bg-purple-700'
          }`}
        >
          {submitting ? 'Criando...' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
