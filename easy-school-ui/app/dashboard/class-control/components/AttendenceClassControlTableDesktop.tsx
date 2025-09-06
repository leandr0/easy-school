'use client';

import { ClassControlResponseModel } from "@/app/lib/definitions/class_control_definitions";
import { Switch } from "@/app/dashboard/components/switch";
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Users, BookOpen, User } from "lucide-react";
import { CourseClassStudentModel } from "@/app/lib/definitions/course_class_students_definitions";
import AttendenceDateRangeFilter from "./AttendenceDateRangeFilter";
import { StudentModel } from "@/app/lib/definitions/students_definitions";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { CancelButton } from "@/app/ui/button";
import { Pagination } from "../../components/Pagination";

export type DateRange = { startDate: string; endDate: string };

interface AttendenceClassControlTableDesktopProps {
  dateRange: DateRange;
  classes: CourseClassCompleteModel[];
  onClassChange: (value: string) => void;
  onChange: (next: DateRange) => void;
  onCancel: () => void;
  onApply: () => Promise<void> | void;
  selectedClassId: string;
  loading: boolean;
  existingRecords: ClassControlResponseModel[];
  expandedRows: { [id: string]: StudentModel[] };
  loadingRow: string | null;
  onToggleRow: (studentId: string, classControlId: string) => Promise<void>;
}

export default function AttendenceClassControlTableDesktop({
  dateRange,
  classes,
  onClassChange,
  onChange,
  onCancel,
  onApply,
  selectedClassId,
  loading,
  existingRecords,
  expandedRows,
  loadingRow,
  onToggleRow
}: AttendenceClassControlTableDesktopProps) {



  // 🔢 pagination state
  const [page, setPage] = useState<number>(1);        // 1-based
  const [pageSize, setPageSize] = useState<number>(5);

  // clamp current page if revenues length changes
  const totalCount = existingRecords?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // slice current page
  const currentItems = useMemo(() => {
    if (!existingRecords?.length) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return existingRecords.slice(start, end);
  }, [existingRecords, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Turma
        </label>
        <div className="relative">
          <select
            id="class-select"
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:bg-gray-50 disabled:text-gray-500"
            disabled={loading}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8 bg-white rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Carregando registros existentes...</span>
        </div>
      )}

      {/* Main Content */}
      {selectedClassId && (
        <>
          {/* Date Range Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <AttendenceDateRangeFilter
              value={dateRange}
              onChange={onChange}
              onApply={onApply}
              precision="day"
              startLabel="Data de início"
              endLabel="Data de fim"
              buttonText="Aplicar filtro"
              busyText="Aplicando..."
              busy={loading}
              errorMessage="A data final deve ser posterior à data inicial."
            />
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
                <div className="col-span-1 flex items-center justify-center">
                  <span className="sr-only">Expandir</span>
                </div>
                <div className="col-span-5 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                  Turma
                </div>
                <div className="col-span-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  Data
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  Reposição
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {currentItems && currentItems.length > 0 ? (
                currentItems.map((classControl) => {
                  const isExpanded = !!expandedRows[classControl.class_control?.id!];
                  const classControlId = String(classControl.class_control?.id!);

                  return (
                    <div key={classControlId}>
                      {/* Main Row */}
                      <div
                        className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        onClick={() => onToggleRow(classControlId, classControlId)}
                      >
                        {/* Expand/Collapse Button */}
                        <div className="col-span-1 flex items-center justify-center">
                          {loadingRow === classControlId ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                          ) : isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        {/* Class Name */}
                        <div className="col-span-5 flex items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {classControl.class_control?.course_class?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {classControl.students?.length || 0} aluno(s) presente(s)
                            </p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="col-span-3 flex items-center">
                          <p className="text-sm text-gray-900">
                            {`${classControl.class_control?.day?.toString().padStart(2, '0')}/${classControl.class_control?.month?.toString().padStart(2, '0')
                              }/${classControl.class_control?.year}`}
                          </p>
                        </div>

                        {/* Replacement Toggle */}
                        <div className="col-span-3 flex items-center justify-center">
                          <Switch
                            checked={classControl.class_control?.replacement!}
                            onChange={() => { }}
                          />
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          <div className="px-6 py-6 space-y-6">

                            {/* Teacher Information */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center mb-3">
                                <User className="w-5 h-5 text-gray-500 mr-2" />
                                <h4 className="font-semibold text-gray-800">Professor</h4>
                              </div>
                              <div className="pl-7">
                                {classControl.teacher?.name ? (
                                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div>
                                      <p className="font-medium text-gray-900">{classControl.teacher.name}</p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Presente
                                    </span>
                                  </div>
                                ) : (
                                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Ausente
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Students Information */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center mb-3">
                                <Users className="w-5 h-5 text-gray-500 mr-2" />
                                <h4 className="font-semibold text-gray-800">
                                  Alunos Presentes ({classControl.students?.length || 0})
                                </h4>
                              </div>
                              <div className="pl-7">
                                {classControl.students && classControl.students.length > 0 ? (
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {classControl.students.map((student, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-gray-900 truncate">{student.name}</p>
                                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                                            {student.email && (
                                              <span className="bg-gray-100 px-2 py-1 rounded">
                                                {student.email}
                                              </span>
                                            )}
                                            {student.phone_number && (
                                              <span className="bg-gray-100 px-2 py-1 rounded">
                                                {student.phone_number}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-3">
                                          Presente
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                    <p className="text-gray-500">Nenhum aluno presente</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Class Content */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center mb-3">
                                <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
                                <h4 className="font-semibold text-gray-800">Conteúdo da Aula</h4>
                              </div>
                              <div className="pl-7">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                    {classControl.class_control?.content ||
                                      <span className="text-gray-400 italic">Nenhum conteúdo registrado</span>
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhum registro encontrado</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Selecione uma turma e período para visualizar os registros de controle de classe.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <Pagination
              totalCount={totalCount}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
              pageSizeOptions={[5, 10, 15, 20]}
              // Optional: localized labels
              labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'página', page: 'Página', goTo: 'Ir para' }}
            />
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end gap-4">

        <CancelButton
          type="button"
          onClick={onCancel}>
          Voltar
        </CancelButton>
      </div>
    </div>
  );
}