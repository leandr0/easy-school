'use client';

import { ClassControlResponseModel } from "@/app/lib/definitions/class_control_definitions";
import { Switch } from "@/app/dashboard/components/switch";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { CourseClassStudentModel } from "@/app/lib/definitions/course_class_students_definitions";
import AttendenceDateRangeFilter from "./AttendenceDateRangeFilter";
import { StudentModel } from "@/app/lib/definitions/students_definitions";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";

export type DateRange = { startDate: string; endDate: string };

interface AttendenceClassControlTableDesktopProps {
  dateRange: DateRange;
  classes: CourseClassCompleteModel[];
  onClassChange: (value: string) => void;
  onChange: (next: DateRange) => void;
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
  onApply,
  selectedClassId,
  loading,
  existingRecords,
  expandedRows,
  loadingRow,
  onToggleRow
}: AttendenceClassControlTableDesktopProps) {

  

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="relative">
          <select
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            className="peer block cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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


      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando registros existentes...</span>
        </div>
      )}

      {selectedClassId && (
        <>
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

          <div className="overflow-x-auto ">
            {/* Header row */}
            <div className="grid grid-cols-4 text-left text-sm font-normal bg-gray-50 text-center rounded-lg">
              <div className="py-3 pl-[90px] font-medium sm:pl-6 border-b col-span-2">Turma</div>
              <div className="py-3 pl-[40px]font-medium border-b col-span-1">Data</div>
              <div className="px-3 py-3 font-medium border-b col-span-1">Reposição</div>
            </div>

            <div className="bg-white">
              {existingRecords?.map((classControl) => {
                const isExpanded = !!expandedRows[classControl.class_control?.id!];
                console.log(classControl);
                return (
                  <div key={classControl.class_control?.id}>
                    <div
                      className={`grid grid-cols-13 border-b text-sm last-of-type:border-none transition hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
                    >
                      <div className="py-3 px-2 col-span-2"></div>
                      <div
                        className="py-3 px-3 col-span-1 flex justify-start items-center cursor-pointer"
                        onClick={() => onToggleRow(String(classControl.class_control?.id!), String(classControl.class_control?.id!))}
                      >
                        {loadingRow === String(classControl.class_control?.id) ? (
                          <span className="animate-pulse">⏳</span>
                        ) : isExpanded ? (
                          <ChevronUp size={16} className="text-blue-600" />
                        ) : (
                          <ChevronDown size={16} className="text-blue-600" />
                        )}
                      </div>
                      <div className="py-3 col-span-5 flex text-center items-left text-left gap-2">
                        <p className="truncate text-sm">{classControl.class_control?.course_class?.name}</p>
                      </div>
                      <div className="pr-3 col-span-3 flex items-center gap-2">
                        <p className="truncate text-sm">{classControl.class_control?.day + "/" + classControl.class_control?.month + "/" + classControl.class_control?.year}</p>
                      </div>
                      <div className="px-5 py-3 col-span-2 pl-[10px] text-center">
                        <p className="md:text-sm text-center">
                          <Switch checked={classControl.class_control?.replacement!} onChange={() => { }} />
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="col-span-7 text-sm px-6 py-4 border-b bg-gray-50">
                        <div className="space-y-4">
                          {/* Teacher Information */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Professor:</h4>
                            <div className="pl-4 text-gray-700">
                              {classControl.teacher?.name ?
                                <div >
                                  <div >
                                    <p>{classControl.teacher?.name}</p>
                                  </div>
                                  <div >
                                    <span className="text-green-600 font-medium">Presente</span>
                                  </div>
                                </div>
                                :
                                <span className="text-red-500 font-medium">Ausente</span>
                              }


                            </div>
                          </div>

                          {/* Students Information */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Alunos Presentes ({classControl.students?.length || 0}):
                            </h4>
                            <div className="pl-4">
                              {classControl.students && classControl.students.length > 0 ? (
                                <div className="grid gap-2">
                                  {classControl.students.map((student, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div>
                                        <p className="font-medium text-gray-800">{student.name}</p>
                                        <div className="text-sm text-gray-600">
                                          {student.email && <span>Email: {student.email}</span>}
                                          {student.phone_number && (
                                            <span className="ml-4">Tel: {student.phone_number}</span>
                                          )}
                                        </div>
                                      </div>
                                      <span className="text-green-600 font-medium">Presente</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500">Nenhum aluno presente</p>
                              )}
                            </div>
                          </div>

                          {/* Class Content */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Conteúdo da Aula:</h4>
                            <div className="pl-4 bg-white p-3 rounded border">
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {classControl.class_control?.content || 'Nenhum conteúdo registrado'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}