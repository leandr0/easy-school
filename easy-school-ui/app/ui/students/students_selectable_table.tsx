'use client';

import React, { forwardRef, useImperativeHandle } from "react";
import { StudentModel } from '@/app/lib/definitions/students_definitions';

export type SelectableStudentsTableRef = {
  // If you need any methods to be called from parent, define them here
  // For now, we don't need refreshStudents since data comes from parent
};

interface SelectableStudentsTableProps {
  students: StudentModel[];
  selectedStudentIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const SelectableStudentsTable = forwardRef<SelectableStudentsTableRef, SelectableStudentsTableProps>(
  ({ students, selectedStudentIds, onSelectionChange }, ref) => {

    useImperativeHandle(ref, () => ({
      // Add any methods here that parent might need to call
      // Currently empty since data loading is handled by parent
    }));

    const handleCheckboxChange = (studentId: string) => {
      const updatedSelected = selectedStudentIds.includes(studentId)
        ? selectedStudentIds.filter(id => id !== studentId)
        : [...selectedStudentIds, studentId];

      onSelectionChange(updatedSelected);
    };

    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="mt-2 flow-root">

              <div className="md:hidden">
                {students?.map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center p-4 mb-2 rounded-md border ${selectedStudentIds.includes(student.id ?? '')
                        ? 'bg-blue-100 border-blue-400'
                        : 'bg-white border-gray-200 hover:bg-gray-100'
                      } cursor-pointer transition`}
                  >
                    <input
                      type="checkbox"
                      value={student.id ?? ''}
                      checked={selectedStudentIds.includes(student.id ?? '')}
                      onChange={() => student.id && handleCheckboxChange(student.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{student.name}</span>
                      <span className="text-xs text-gray-600">{student.phone_number}</span>
                      <span className="text-xs text-gray-600">{student.email}</span>
                    </div>
                  </label>
                ))}
              </div>

              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                    <th className="px-3 py-5 font-medium">Telefone</th>
                    <th className="px-3 py-5 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {students?.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id ?? '');

                    return (
                      <tr
                        key={student.id}
                        className={`cursor-pointer border-b py-3 text-sm last-of-type:border-none
                          ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                          [&:first-child>td:first-child]:rounded-tl-lg
                          [&:first-child>td:last-child]:rounded-tr-lg
                          [&:last-child>td:first-child]:rounded-bl-lg
                          [&:last-child>td:last-child]:rounded-br-lg`}
                        onClick={() => student.id && handleCheckboxChange(student.id)}
                      >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <p>{student.name}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{student.phone_number}</td>
                        <td className="whitespace-nowrap px-3 py-3">{student.email}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    );
  });

SelectableStudentsTable.displayName = 'SelectableStudentsTable';

export default SelectableStudentsTable;