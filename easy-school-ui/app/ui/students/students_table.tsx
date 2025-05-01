"use client"

import { AddPropriedade, DeleteSolicitacao, UpdateSolicitacao } from '../buttons/ui_buttons';
import StudentStatus from './students_status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import React, { useEffect, useState } from "react";

import { getAllStudents } from '@/app/lib/actions/students_actions';
import { StudentModel } from '@/app/lib/definitions/students_definitions';

export default async function StudentsTable({
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
          <div className="md:hidden">
            {students?.map((student) => (

              <div key={student.id} className="mb-2 w-full rounded-md bg-white p-4">

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{student.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{student.due_date}</p>
                  </div>
                  <StudentStatus status={student.status ? "Ativo" : "Inativo"} />  
                </div>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {student.phone_number}
                    </p>

                    <p>{student.email}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <p>{student.start_date ? formatDateToLocal(student.start_date) : 'No Date Provided'}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nome
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Telefone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Dia de vencimento
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Data de inscrição
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {students?.map((student) => (
                <tr
                  key={student.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{student.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.phone_number}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                      {student.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  <StudentStatus status={student.status ? "Ativo" : "Inativo" } />                    
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                      {student.due_date }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.start_date ? formatDateToLocal(student.start_date) : 'No Date Provided'}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <AddPropriedade idSolicitacao={student.id as string} disabled={false} />
                      <UpdateSolicitacao id={student.id as string} disabled={false} />
                      <DeleteSolicitacao id={student.id as string} disabled={false} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
