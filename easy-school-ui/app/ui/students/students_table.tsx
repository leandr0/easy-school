"use client"

import { UpdateBase } from '../buttons/ui_buttons';
import StudentStatus from './students_status';
import { formatDateToLocal } from '@/app/lib/utils';
import React, { useEffect, useState } from "react";

import { getAllStudents } from '@/app/services/studentService';
import { StudentModel } from '@/app/lib/definitions/students_definitions';

export default function StudentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const [students, setStudents] = useState<StudentModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {students?.map((student) => (
              <div key={student.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="max-w-[70%]">
                    <div className="mb-2">
                      <p className="font-medium truncate">{student.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">Vencimento: <span className="font-bold">{student.due_date}</span></p>
                  </div>
                  <StudentStatus status={student.status ? "Ativo" : "Inativo"} />  
                </div>

                <div className="flex flex-col w-full justify-between pt-4">
                  <div className="space-y-2 w-full">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm font-medium">Tel:</span>
                        <p className="text-sm">{student.phone_number}</p>
                      </div>
                      <div className="flex justify-end">
                        <UpdateBase id={student.id as string} link='/dashboard/students/${id}/edit' disabled={false} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm font-medium">Email:</span>
                      <p className="text-sm break-words">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm font-medium">Inscrição:</span>
                      <p className="text-sm">{student.start_date ? formatDateToLocal(student.start_date) : 'Não disponível'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop View */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="grid grid-cols-13 text-left text-sm font-normal rounded-lg bg-gray-50 text-center">
              <div className="px-4 py-3 font-medium sm:pl-6 border-b col-span-3">
                Nome
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-2">
                Telefone
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-3">
                Email
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1">
                Status
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1 text-center">
                Vencimento
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-2">
                Inscrição
              </div>
              <div className="px-3 py-3 font-medium border-b col-span-1">
                <span className="sr-only">Edit</span>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="bg-white">
              {students?.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-13 w-full border-b text-sm last-of-type:border-none">

                  <div className="py-3 pl-6 pr-3 col-span-3">
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm">{student.name}</p>
                    </div>
                  </div>
                  
                  <div className="px-3 py-3 col-span-2">
                    <p className="truncate text-xs md:text-sm">{student.phone_number}</p>
                  </div>
                  
                  <div className="px-3 py-3 col-span-3">
                    <p className="truncate text-xs md:text-sm">{student.email}</p>
                  </div>
                  <div className="px-3 py-3 col-span-1">
                    <StudentStatus status={student.status ? "Ativo" : "Inativo" } />                    
                  </div>
                  <div className="text-center py-3 col-span-1 text-center ml-[23px]">
                    <p className="text-xs md:text-sm">{student.due_date}</p>
                  </div>
                  <div className="px-3 py-3 col-span-2 text-center">
                    <p className="truncate text-xs md:text-sm">{student.start_date ? formatDateToLocal(student.start_date) : 'Não disponível'}</p>
                  </div>
                  <div className="py-3 pr-3 col-span-1 flex justify-center">
                    <div className="flex justify-center">
                      <UpdateBase id={student.id as string} link='/dashboard/students/${id}/edit' disabled={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}