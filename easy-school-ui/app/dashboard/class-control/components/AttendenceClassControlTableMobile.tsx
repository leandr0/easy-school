'use client';

import { ClassControlResponseModel } from "@/app/lib/definitions/class_control_definitions";
import { Switch } from "@/app/dashboard/components/switch";
import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  BookOpen,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { CourseClassStudentModel } from "@/app/lib/definitions/course_class_students_definitions";
import AttendenceDateRangeFilter from "./AttendenceDateRangeFilter";
import { StudentModel } from "@/app/lib/definitions/students_definitions";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { CancelButton } from "@/app/ui/button";
import { Pagination } from "../../components/Pagination";

export type DateRange = { startDate: string; endDate: string };

interface AttendenceClassControlTableMobileProps {
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

export default function AttendenceClassControlTableMobile({
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
}: AttendenceClassControlTableMobileProps) {


    // 🔢 pagination state
    const [page, setPage] = useState<number>(1);        // 1-based
    const [pageSize, setPageSize] = useState<number>(3);
  
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
    <div className="space-y-4 p-4">
      {/* Class Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <label htmlFor="class-select-mobile" className="block text-sm font-medium text-gray-700 mb-2">
          <BookOpen className="w-4 h-4 inline mr-2" />
          Selecionar Turma
        </label>
        <select
          id="class-select-mobile"
          value={selectedClassId}
          onChange={(e) => onClassChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:bg-gray-50 disabled:text-gray-500"
          disabled={loading}
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-3"></div>
          <span className="text-gray-600 text-sm text-center">Carregando registros existentes...</span>
        </div>
      )}

      {/* Main Content */}
      {selectedClassId && (
        <>
          {/* Date Range Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="mb-3">
              <Calendar className="w-4 h-4 inline mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar por Período</span>
            </div>
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

          {/* Records Cards */}
          <div className="space-y-3">
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((classControl) => {
                const isExpanded = !!expandedRows[classControl.class_control?.id!];
                const classControlId = String(classControl.class_control?.id!);

                return (
                  <div
                    key={classControlId}
                    className={`bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200 ${isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200'
                      }`}
                  >
                    {/* Card Header */}
                    <div
                      className={`p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      onClick={() => onToggleRow(classControlId, classControlId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold text-gray-900 truncate pr-2">
                              {classControl.class_control?.course_class?.name}
                            </h3>
                            <div
                              className="flex items-center space-x-2 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Switch
                                checked={classControl.class_control?.replacement!}
                                onChange={(checked) => {
                                  // Handle replacement toggle

                                }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>
                              {`${classControl.class_control?.day?.toString().padStart(2, '0')}/${classControl.class_control?.month?.toString().padStart(2, '0')
                                }/${classControl.class_control?.year}`}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{classControl.students?.length || 0} aluno(s) presente(s)</span>
                          </div>
                        </div>

                        <div className="ml-3 flex-shrink-0">
                          {loadingRow === classControlId ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                          ) : isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Quick Status Indicators */}
                      <div className="flex items-center space-x-2 mt-3">
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${classControl.teacher?.name
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {classControl.teacher?.name ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Professor presente
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Professor ausente
                            </>
                          )}
                        </div>

                        {classControl.class_control?.replacement && (
                          <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Reposição
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200">
                        <div className="p-4 space-y-4">

                          {/* Teacher Section */}
                          <div>
                            <div className="flex items-center mb-2">
                              <User className="w-4 h-4 text-gray-500 mr-2" />
                              <h4 className="font-medium text-gray-800">Professor</h4>
                            </div>
                            {classControl.teacher?.name ? (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">{classControl.teacher.name}</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Presente
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Ausente
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Students Section */}
                          <div>
                            <div className="flex items-center mb-2">
                              <Users className="w-4 h-4 text-gray-500 mr-2" />
                              <h4 className="font-medium text-gray-800">
                                Alunos ({classControl.students?.length || 0})
                              </h4>
                            </div>

                            {classControl.students && classControl.students.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {classControl.students.map((student, index) => (
                                  <div
                                    key={index}
                                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <span className="font-medium text-gray-900 text-sm">{student.name}</span>
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2 flex-shrink-0">
                                        Presente
                                      </span>
                                    </div>

                                    {(student.email || student.phone_number) && (
                                      <div className="space-y-1">
                                        {student.email && (
                                          <div className="flex items-center text-xs text-gray-600">
                                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">{student.email}</span>
                                          </div>
                                        )}
                                        {student.phone_number && (
                                          <div className="flex items-center text-xs text-gray-600">
                                            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span>{student.phone_number}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-gray-500 text-sm">Nenhum aluno presente</p>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div>
                            <div className="flex items-center mb-2">
                              <BookOpen className="w-4 h-4 text-gray-500 mr-2" />
                              <h4 className="font-medium text-gray-800">Conteúdo da Aula</h4>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {classControl.class_control?.content ||
                                  <span className="text-gray-400 italic">Nenhum conteúdo registrado</span>
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Nenhum registro encontrado</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Selecione uma turma e período para visualizar os registros de controle de classe.
                </p>
              </div>
            )}
          </div>

          <div className="mt-3">
            <Pagination
              totalCount={totalCount}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
              pageSizeOptions={[3,6]}
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