"use client"

import React from "react";
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { UpdateTeacher } from '../../../ui/buttons/ui_buttons';
import TeacherStatus from './TeacherStatus';

interface TeacherTableMobileProps {
  teachers: TeacherModel[];
  isLoading: boolean;
  error: string | null;
}

export default function TeacherTableMobile({ 
  teachers, 
  isLoading, 
  error 
}: TeacherTableMobileProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">Erro ao carregar professores: {error}</p>
      </div>
    );
  }

  if (!teachers?.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Nenhum professor encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teachers.map((teacher) => (
        <div 
          key={teacher.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-100"
        >
          {/* Content with name, status and actions */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {teacher.name}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <TeacherStatus status={teacher.status ? "Ativo" : "Inativo"} />
                <UpdateTeacher 
                  id={teacher.id as string} 
                  disabled={false} 
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="pt-2 text-center text-sm text-gray-500">
        {teachers.length} professor{teachers.length !== 1 ? 'es' : ''}
      </div>
    </div>
  );
}
