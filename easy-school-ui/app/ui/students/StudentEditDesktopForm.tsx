'use client';

import React from 'react';
import { Button } from '@/app/ui/button';
import { StudentCoursePriceModel, CoursePriceModel } from '@/app/lib/definitions/students_definitions';
import DateInput from '../components/DateInput';
import { Switch } from '../components/switch';
import BRLCurrency from '../components/currency';
import { PencilIcon } from 'lucide-react';

interface Props {
  formData: StudentCoursePriceModel;
  message: string;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEditCourse: (course: CoursePriceModel) => void;
  onSwitchStatus: (checked: boolean) => void;
}

export default function StudentEditDesktopForm({
  formData,
  message,
  error,
  onChange,
  onSubmit,
  onEditCourse,
  onSwitchStatus,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="p-4">
      {message && (
        <div className={`mb-4 p-3 rounded-md text-center ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-center">
          Error: {error}
        </div>
      )}

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <h2 className="text-base font-bold text-left mb-4 p-3 text-gray-800">Informações do Aluno</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-full flex items-center">
                  <label htmlFor="name" className="w-24 text-sm text-right mr-3">Nome:</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={onChange}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full flex items-center">
                  <label htmlFor="phone_number" className="w-24 text-sm text-right mr-3">Telefone:</label>
                  <input
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={onChange}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                  />
                  <label htmlFor="email" className="w-24 text-sm text-right mr-3">Email:</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={onChange}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="w-full md:w-1/2 flex items-center mb-4 md:mb-0">
                  <label htmlFor="due_date" className="w-24 text-sm text-right mr-3 ml-[13px]">Vencimento:</label>
                  <input
                    id="due_date"
                    type="number"
                    name="due_date"
                    min={5}
                    max={20}
                    step={5}
                    value={formData.due_date || ""}
                    onChange={onChange}
                    className="text-center peer block w-15 rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>
                <div className="w-full md:w-1/2 flex items-center">
                  <label htmlFor="start_date" className="w-34 text-sm text-right pl-[65px]">Início:</label>
                  <DateInput
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={onChange}
                    className="text-center ml-[11px] rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="md:block mb-1 mt-4 pl-[71px]">
                    <Switch
                      checked={Boolean(formData.status)}
                      onChange={onSwitchStatus}
                      label={formData.status ? 'Ativo' : 'Inativo'}
                      color="green"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block mb-1 mt-4">
        <label className="block text-sm font-medium">
          <strong>Cursos:</strong>
        </label>
      </div>

      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mt-2 flow-root">
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                  <th scope="col" className="px-3 py-5 font-medium">Valor</th>
                  <th scope="col" className="px-4 py-5 font-medium"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {formData.courses?.map((course) => (
                  <tr key={course.name} className="border-b text-sm">
                    <td className="px-4 py-3">{course.name}</td>
                    <td className="px-4 py-3"><BRLCurrency value={course.course_price ?? 0} /></td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onEditCourse(course)}
                         className={" rounded-md border p-2 hover:bg-gray-100"}
                        title="Edit course price"
                      >
                          <PencilIcon className="w-5" color={'blue'} />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <a
          href="/dashboard/students"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </a>
        <Button className='hover:bg-purple-500' type="submit">Salvar Aluno</Button>
      </div>
    </form>
  );
}
