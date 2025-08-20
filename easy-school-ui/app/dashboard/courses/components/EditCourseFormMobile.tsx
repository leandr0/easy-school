'use client';

import React from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import type { CourseModel } from '@/app/lib/definitions/courses_definitions';
import type { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import BRLCurrency from '../../components/currency';
import { Switch } from '../../components/switch';

type Props = {
  formData: CourseModel;
  languages: LanguageModel[];
  selectedLanguageId: string | number;
  message: string;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPriceChange: (value: number | string) => void;
  onStatusChange: (checked: boolean) => void;

};

export default function EditCourseFormMobile({
  formData,
  languages,
  selectedLanguageId,
  message,
  error,
  onSubmit,
  onChange,
  onPriceChange,
  onStatusChange,

}: Props) {


  return (
    <form onSubmit={onSubmit} className="pb-24"> {/* space for sticky bar */}
      <div className="mt-4">
        <div className="rounded-lg bg-gray-50 px-3 py-4">
          {/* Mobile: single column, larger touch targets */}
          <div className="space-y-4">
            {/* Language */}
            <div>
              <label htmlFor="language_id" className="block text-sm font-medium text-gray-700 mb-1">
                Idioma
              </label>
              <div className="relative">
                <select
                  id="language_id"
                  name="language_id"
                  value={selectedLanguageId}
                  onChange={onChange}
                  className="block w-full rounded-md border border-gray-200 py-3 pl-10 pr-3 text-base"
                >
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                id="name"
                name="name"
                value={formData?.name || ''}
                onChange={onChange}
                inputMode="text"
                className="block w-full rounded-md border border-gray-200 py-3 px-3 text-base"
                placeholder="Nome do curso"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <BRLCurrency
                value={formData.price}
                asInput
                onChange={onPriceChange}
                className="block w-full rounded-md border border-gray-200 py-3 px-3 text-base"
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <Switch
                checked={Boolean(formData.status)}
                onChange={onStatusChange}
                label={formData.status ? 'Ativo' : 'Inativo'}
                color="green"
              />
            </div>

            {(message || error) && (
              <div className="text-sm">
                {message && <p className="text-emerald-700">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar for mobile */}
      <div className="fixed inset-x-0 bottom-0 z-10 bg-white border-t border-gray-200 p-3">
        <div className="flex gap-3">
          <Link
            href="/dashboard/courses"
            className="flex-1 h-11 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-700 text-center inline-flex"
          >
            Cancelar
          </Link>
          <Button type="submit" className="flex-1 h-11">
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
