"use client"

import React, { useEffect, useMemo, useState } from "react";
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { UpdateTeacher } from '../../components/ui_buttons';
import TeacherStatus from './TeacherStatus';
import { Pagination } from "../../components/Pagination";

interface TeacherTableMobileProps {
  teachers: TeacherModel[];
}

export default function TeacherTableMobile({
  teachers
}: TeacherTableMobileProps) {

  if (!teachers?.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Nenhum professor encontrado</p>
      </div>
    );
  }



  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(3);

  // clamp current page if revenues length changes
  const totalCount = teachers?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!teachers?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return teachers.slice(start, end);
  }, [teachers, page, pageSize]);

  return (
    <div className="space-y-3">
      {currentItems.map((teacher) => (
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
      <div className="mt-3">
        <Pagination
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          pageSizeOptions={[3, 5]}
          // Optional: localized labels
          labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
        />
      </div>
    </div>
  );
}
