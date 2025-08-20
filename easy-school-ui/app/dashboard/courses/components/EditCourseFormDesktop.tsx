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

export default function EditCourseFormDesktop({
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
    <form onSubmit={onSubmit}>
      <div className="mt-6 flow-root">
        <div className="rounded-lg bg-gray-50 p-4 md:pt-5">
          {/* Desktop: two-column grid */}
          <div className="mb-4 grid grid-cols-2 gap-6">
            {/* Language */}
            <div className="relative grid grid-cols-4 items-center">
              <label htmlFor="language_id" className="text-base mt-[2px] ml-[45px]">
                Idioma:
              </label>
              <div className="relative col-span-3">
                <select
                  id="language_id"
                  name="language_id"
                  value={selectedLanguageId}
                  onChange={onChange}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
                  aria-describedby="operadora-error"
                >
                  {languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.name}
                    </option>
                  ))}
                </select>
                <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Name */}
            <div className="relative grid grid-cols-4 items-center">
              <label htmlFor="name" className="text-base mt-[2px] ml-[45px]">
                Nome:
              </label>
              <div className="col-span-3">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData?.name || ''}
                  onChange={onChange}
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
            {/* Price */}
            <div className="relative grid grid-cols-4 items-center">
              <label className="text-base mt-[2px] ml-[45px]">Valor:</label>
              <div className="col-span-3">
                <BRLCurrency
                  value={formData.price}
                  asInput
                  onChange={onPriceChange}
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center pl-[71px] mt-1">
              <Switch
                checked={Boolean(formData.status)}
                onChange={onStatusChange}
                label={formData.status ? 'Ativo' : 'Inativo'}
                color="green"
              />
            </div>
          </div>

          {(message || error) && (
            <div className="mt-2 text-sm">
              {message && <p className="text-emerald-700">{message}</p>}
              {error && <p className="text-red-600">{error}</p>}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/courses"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </Link>
          <Button type="submit">Salvar Curso</Button>
        </div>
      </div>
    </form>
  );
}
