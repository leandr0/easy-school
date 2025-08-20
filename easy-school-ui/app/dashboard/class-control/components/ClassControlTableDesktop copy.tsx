'use client';

import { format, addDays, addWeeks } from "date-fns";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { Switch } from "@/app/dashboard/components/switch";

interface ClassControlTableDesktopProps {
  classes: CourseClassCompleteModel[];
  selectedClassId: string;
  participantList: {
    id: string;
    name: string;
    role: "Teacher" | "Student";
  }[];
  currentWeekStart: Date;
  onClassChange: (value: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToggleAttendance: (participantId: string, date: string) => void;
  onSaveAttendance: () => void;
  attendance: {
    [participantId: string]: {
      [date: string]: boolean;
    };
  };
  classContent: string;
  setClassContent: (value: string) => void;
  replacement: boolean;
  setReplacement: (value: boolean) => void;
}

export default function ClassControlTableDesktop({
  classes,
  selectedClassId,
  participantList,
  currentWeekStart,
  onClassChange,
  onPrevWeek,
  onNextWeek,
  onToggleAttendance,
  onSaveAttendance,
  attendance,
  classContent,
  setClassContent,
  replacement,
  setReplacement,
}: ClassControlTableDesktopProps) {
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const isNextWeekDisabled = addWeeks(currentWeekStart, 1) > new Date();


  return (
    <div className="space-y-6">
      <select
        value={selectedClassId}
        onChange={(e) => onClassChange(e.target.value)}
        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {selectedClassId && (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onPrevWeek}
              className="text-blue-600 flex items-center gap-1 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              Semana anterior
            </button>

            <h2 className="font-bold text-lg">
              Semana de {format(currentWeekStart, "dd/MM/yyyy")}
            </h2>

            <button
              onClick={onNextWeek}
              disabled={isNextWeekDisabled}
              className={`text-blue-600 flex items-center gap-1 hover:underline ${
                isNextWeekDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Próxima semana
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 17l5-5-5-5v10z" />
              </svg>
            </button>
          </div>

          {/* Debug info - remove this once fixed */}
          <div className="text-sm text-gray-600 mb-2">
            Debug: Displaying {weekDates.length} days
          </div>

          <div className="overflow-x-auto"> {/* Changed from overflow-auto to overflow-x-auto */}
            <table className="w-full border text-sm"> {/* Removed table-fixed and min-w-full */}
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left min-w-[200px]">Nome</th> {/* Added min-width */}
                  <th className="border p-2 text-left min-w-[80px]">Role</th> {/* Added min-width */}
                  {weekDates.map((date, index) => (
                    <th key={`${date.toISOString()}-${index}`} className="border p-2 min-w-[100px]"> {/* Added index to key and min-width */}
                      {format(date, "EEE dd/MM")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participantList.map((p) => {
                  const participantKey = `${p.role}-${p.id}`;
                  return (
                    <tr key={participantKey} className="border-t">
                      <td className="border p-2 text-left">{p.name}</td>
                      <td className="border p-2 text-left">{p.role}</td>
                      {weekDates.map((date, index) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const present = attendance[participantKey]?.[dateStr] || false;
                        return (
                          <td key={`${dateStr}-${index}`} className="border p-2 text-center"> {/* Added index to key */}
                            <button
                              onClick={() => onToggleAttendance(participantKey, dateStr)}
                              title={present ? "Presente" : "Ausente"}
                              className="w-6 h-6 flex items-center justify-center mx-auto"
                            >
                              {present ? (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white transition-all duration-300 transform hover:scale-110 animate-fadeIn">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 transition-all duration-300 transform hover:scale-110 animate-fadeIn">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Switch
              checked={replacement}
              onChange={setReplacement}
              label="Aula de reposição"
              size="md"
              color="green"
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Conteúdo da Aula
            </label>
            <textarea
              value={classContent}
              onChange={(e) => setClassContent(e.target.value)}
              className="w-full border rounded-md p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva aqui o conteúdo ministrado nesta semana..."
            />
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={onSaveAttendance}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar Presença
            </button>
          </div>
        </>
      )}
    </div>
  );
}