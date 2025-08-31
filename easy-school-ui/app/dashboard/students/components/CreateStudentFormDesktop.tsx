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

export default function CreateStudentFormDesktop({
  formData,
  message,
  onChange,
  onDueDateChange,
}: Props) {
  return (
    <>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-4 md:pt-0">
            <h2 className="text-base font-bold text-left mb-4 p-3 text-gray-800">
              Informações do Aluno
            </h2>

            <div className="space-y-4">
              {/* Nome */}
              <div className="flex items-center">
                <label className="w-24 text-sm text-right mr-3">Nome:</label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ''}
                  onChange={onChange}
                  className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Telefone + Email */}
              <div className="flex items-center">
                <label className="w-24 text-sm text-right mr-3">Telefone:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={onChange}
                  className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                />

                <label className="w-24 text-sm text-right mr-3">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={onChange}
                  className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Vencimento + Início */}
              <div className="flex items-center">
                <label className="w-24 text-sm text-right mr-3">Vencimento:</label>
                <input
                  type="number"
                  name="due_date"
                  id="due_date"
                  
                  min={5}
                  max={20}
                  step={5}
                  value={formData?.due_date || ''}
                  onChange={onDueDateChange}
                  className="text-center block w-20 rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                />

                <label className="w-24 text-sm text-right mr-3 ml-16">Início:</label>
                <DateInput
                  name="start_date"
                  value={formData.start_date || ''}
                  onChange={onChange}
                  className="text-center rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {message && (
                <div className="text-sm mt-2">
                  <p className={message.startsWith('✅') ? 'text-emerald-700' : 'text-red-600'}>
                    {message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/students"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button className="hover:bg-purple-500" type="submit">
          Criar Aluno
        </Button>
      </div>
    </>
  );
}
