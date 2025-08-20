'use client';

import { format, addDays, addWeeks } from "date-fns";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { ClassControlModel } from "@/app/lib/definitions/class_control_definitions";
import { Switch } from "@/app/dashboard/components/switch";
import { Button, CancelButton } from "@/app/ui/button";

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
  onCancel: () => void;
  classContent: string;
  setClassContent: (value: string) => void;
  replacement: boolean;
  setReplacement: (value: boolean) => void;
  disabledDates: Set<string>;
  loading: boolean;
  existingRecords: ClassControlModel[];
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
  onCancel,
  attendance,
  classContent,
  setClassContent,
  replacement,
  setReplacement,
  disabledDates,
  loading,
  existingRecords,
}: ClassControlTableDesktopProps) {
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const isNextWeekDisabled = addWeeks(currentWeekStart, 1) > new Date();

  const isDateDisabled = (dateStr: string) => {
    return disabledDates.has(dateStr);
  };

  const getDateTooltip = (dateStr: string) => {
    if (isDateDisabled(dateStr)) {
      return "Esta data já possui registros salvos e não pode ser editada";
    }
    return "Clique para marcar/desmarcar presença";
  };

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
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onPrevWeek}
              className="text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
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
              disabled={isNextWeekDisabled || loading}
              className={`text-blue-600 flex items-center gap-1 hover:underline ${(isNextWeekDisabled || loading) ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Próxima semana
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 17l5-5-5-5v10z" />
              </svg>
            </button>
          </div>

          {/* Show info about existing records */}
          {existingRecords.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800">
                  Esta semana já possui {existingRecords.length} registro(s) de presença salvos.
                  Dias com registros não podem ser editados.
                </span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left min-w-[200px]">Nome</th>
                  <th className="border p-2 text-left min-w-[80px]">Role</th>
                  {weekDates.map((date, index) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const disabled = isDateDisabled(dateStr);
                    return (
                      <th
                        key={`${date.toISOString()}-${index}`}
                        className={`border p-2 min-w-[100px] ${disabled ? 'bg-gray-200' : ''}`}
                        title={disabled ? "Dia com registros existentes" : ""}
                      >
                        <div className="flex flex-col items-center">
                          <span>{format(date, "EEE dd/MM")}</span>
                          {disabled && (
                            <span className="text-xs text-gray-600 mt-1">
                              🔒 Salvo
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
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
                        const disabled = isDateDisabled(dateStr);

                        return (
                          <td
                            key={`${dateStr}-${index}`}
                            className={`border p-2 text-center ${disabled ? 'bg-gray-100' : ''}`}
                          >
                            <button
                              onClick={() => onToggleAttendance(participantKey, dateStr)}
                              title={getDateTooltip(dateStr)}
                              disabled={disabled}
                              className={`w-6 h-6 flex items-center justify-center mx-auto ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                }`}
                            >
                              {present ? (
                                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-white transition-all duration-300 ${disabled
                                    ? 'bg-green-400'
                                    : 'bg-green-500 transform hover:scale-110 animate-fadeIn'
                                  }`}>
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
                                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-gray-600 transition-all duration-300 ${disabled
                                    ? 'bg-red-300'
                                    : 'bg-gray-300 transform hover:scale-110 animate-fadeIn'
                                  }`}>
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
              disabled={loading}
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Conteúdo da Aula
            </label>
            <textarea
              value={classContent}
              onChange={(e) => setClassContent(e.target.value)}
              className="w-full border rounded-md p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Descreva aqui o conteúdo ministrado nesta semana..."
              disabled={loading}
            />
          </div>

          <div className="mt-6 flex justify-end gap-4">

            <CancelButton
              type="button"
              onClick={onCancel}
            >
              Voltar
            </CancelButton>
            <Button
              className='hover:bg-purple-500'
              type="submit"
              onClick={onSaveAttendance}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Salvar Presença"}
            </Button>
          </div>
    
        </>
      )}
    </div>
  );
}