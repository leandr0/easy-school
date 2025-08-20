'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import DateInput from '@/app/dashboard/components/DateInput';
import { StudentModel } from '@/app/lib/definitions/students_definitions';

type Props = {
  formData: StudentModel;
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CreateStudentFormMobile({
  formData,
  message,
  onChange,
  onDueDateChange,
}: Props) {
  // Helper: ensure focused input scrolls above the sticky bar
  const scrollIntoViewCentered = (e: React.FocusEvent<HTMLElement>) => {
    // small defer helps after mobile keyboard opens
    setTimeout(() => {
      e.currentTarget.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 50);
  };

  return (
    <>
      {/* Add bottom padding so content never sits under the fixed footer.
         Height ~72px (h-11 + paddings). We also include safe-area for iOS. */}
      <div className="mt-4 pb-[calc(env(safe-area-inset-bottom,0px)+72px)]">
        <div className="rounded-lg bg-gray-50 px-3 py-4">
          <h2 className="text-base font-bold mb-4 text-gray-800">Informações do Aluno</h2>

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={formData?.name || ''}
                onChange={onChange}
                onFocus={scrollIntoViewCentered}
                className="block w-full rounded-md border border-gray-300 py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do aluno"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={onChange}
                onFocus={scrollIntoViewCentered}
                className="block w-full rounded-md border border-gray-300 py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={onChange}
                onFocus={scrollIntoViewCentered}
                className="block w-full rounded-md border border-gray-300 py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
            </div>

            {/* Vencimento */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Vencimento</label>
              <input
                type="number"
                name="due_date"
                id="due_date"
                min={5}
                max={20}
                step={5}
                value={formData?.due_date || ''}
                onChange={onDueDateChange}
                onFocus={scrollIntoViewCentered}
                className="block w-24 text-center rounded-md border border-gray-200 py-3 text-base outline-2"
              />
              <p className="text-xs text-gray-500 mt-1">Valores permitidos: 5, 10, 15 ou 20.</p>
            </div>

            {/* Início */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Início</label>
              <DateInput
                name="start_date"
                value={formData.start_date || ''}
                onChange={onChange}
                onFocus={scrollIntoViewCentered}
                className="block w-full text-center rounded-md border border-gray-300 py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {message && (
              <div className="text-sm">
                <p className={message.startsWith('✅') ? 'text-emerald-700' : 'text-red-600'}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed footer with safe-area padding */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 bg-white border-t border-gray-200 p-3 md:hidden"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        }}
      >
        <div className="flex gap-3">
          <Link
            href="/dashboard/students"
            className="flex-1 h-11 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-700 text-center inline-flex"
          >
            Cancelar
          </Link>
          <Button type="submit" className="flex-1 h-11 hover:bg-purple-500">
            Criar Aluno
          </Button>
        </div>
      </div>
    </>
  );
}
