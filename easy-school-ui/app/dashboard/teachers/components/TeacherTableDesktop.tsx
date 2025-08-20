"use client"

import React from "react";
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { UpdateTeacher } from '../../components/ui_buttons';
import TeacherStatus from './TeacherStatus';

interface TeacherTableDesktopProps {
  teachers: TeacherModel[];
  isLoading: boolean;
  error: string | null;
}

export default function TeacherTableDesktop({ 
  teachers, 
  isLoading, 
  error 
}: TeacherTableDesktopProps) {

  if (isLoading) {
    return (
      <div className="rounded-lg bg-gray-50 p-2">
        <table className="min-w-full text-gray-900">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
              <th scope="col" className="px-3 py-5 font-medium">Status</th>
              <th scope="col" className="relative py-3 pl-6 pr-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="w-full border-b">
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                </td>
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex justify-end">
                    <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar professores: {error}</p>
        </div>
      </div>
    );
  }

  if (!teachers?.length) {
    return (
      <div className="rounded-lg bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-gray-500">Nenhum professor encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
      <table className="min-w-full text-gray-900">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              Nome
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              Status
            </th>
            <th scope="col" className="relative py-3 pl-6 pr-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {teachers.map((teacher) => (
            <tr
              key={teacher.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                  <p>{teacher.name}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                <TeacherStatus status={teacher.status ? "Ativo" : "Inativo"} />                    
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                  <UpdateTeacher id={teacher.id as string} disabled={false} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}