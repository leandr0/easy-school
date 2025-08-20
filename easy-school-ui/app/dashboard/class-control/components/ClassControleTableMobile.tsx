'use client';

import { format, addDays } from "date-fns";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { ClassControlModel } from "@/app/lib/definitions/class_control_definitions";
import { Switch } from "@/app/dashboard/components/switch";
import { useState } from "react";
import { Button, CancelButton } from "@/app/ui/button";

interface ClassControlTableMobileProps {
  classes: CourseClassCompleteModel[];
  selectedClassId: string;
  participantList: { id: string; name: string; role: "Teacher" | "Student" }[];
  currentWeekStart: Date;
  onClassChange: (value: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToggleAttendance: (participantId: string, date: string) => void;
  onSaveAttendance: () => void;
  onCancel: () => void;
  attendance: { [participantId: string]: { [date: string]: boolean } };
  classContent: string;
  setClassContent: (value: string) => void;
  replacement: boolean;
  setReplacement: (value: boolean) => void;
  disabledDates: Set<string>;
  loading: boolean;
  existingRecords: ClassControlModel[];
}

export default function ClassControlTableMobile(props: ClassControlTableMobileProps) {
  const {
    classes, selectedClassId, participantList, currentWeekStart,
    onClassChange, onPrevWeek, onNextWeek, onToggleAttendance, onSaveAttendance,
    attendance, classContent, setClassContent, replacement, setReplacement,
    disabledDates, loading, existingRecords, onCancel,
  } = props;

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [showParticipants, setShowParticipants] = useState(true);

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const selectedDate = weekDates[selectedDateIndex];
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const isDateDisabled = (dateStr: string) => disabledDates.has(dateStr);
  const getAttendanceCount = (dateStr: string) =>
    participantList.filter((p) => attendance[`${p.role}-${p.id}`]?.[dateStr]).length;
  const getDayName = (d: Date) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];

  return (
    <div className="box-border w-full max-w-[100vw] overflow-x-hidden bg-gray-50">
      {/* cap the inner content to the viewport too */}
      <div className="mx-auto w-full max-w-screen-sm">
        {/* reserve space for footer */}
        <main className="p-4 space-y-4 pb-[calc(env(safe-area-inset-bottom,0px)+80px)] max-w-full">
          {/* Class Selection */}
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Turma
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => { setSelectedDateIndex(0); onClassChange(e.target.value); }}
              disabled={loading}
              className="w-full max-w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="bg-white rounded-lg p-4 shadow-sm max-w-full">
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <span className="ml-2 text-gray-600">Carregando...</span>
              </div>
            </div>
          )}

          {!!selectedClassId && (
            <>
              {/* Week Navigation */}
              <div className="bg-white rounded-lg p-4 shadow-sm max-w-full">
                <div className="flex justify-between items-center mb-4 min-w-0">
                  <button
                    onClick={onPrevWeek}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                    Anterior
                  </button>

                  <div className="text-center min-w-0">
                    <div className="font-semibold text-gray-900">
                      {format(currentWeekStart, "MMM yyyy")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(currentWeekStart, "dd")} - {format(addDays(currentWeekStart, 6), "dd")}
                    </div>
                  </div>

                  <button
                    onClick={onNextWeek}
                    disabled={addDays(currentWeekStart, 7) > new Date() || loading}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                  </button>
                </div>

                {/* Date Tabs: viewport-safe scroller */}
                <div className="w-full overflow-x-auto pb-2">
                  <div className="w-max inline-flex gap-1">
                    {weekDates.map((date, index) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const disabled = isDateDisabled(dateStr);
                      const attendanceCount = getAttendanceCount(dateStr);

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDateIndex(index)}
                          className={[
                            "shrink-0 min-w-[68px] px-3 py-2 rounded-lg text-center",
                            selectedDateIndex === index
                              ? "bg-blue-600 text-white"
                              : disabled
                                ? "bg-gray-200 text-gray-500"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          ].join(" ")}
                        >
                          <div className="text-xs font-medium">{getDayName(date)}</div>
                          <div className="text-sm">{format(date, "dd")}</div>
                          {disabled && <div className="text-xs mt-1">🔒</div>}
                          {attendanceCount > 0 && !disabled && (
                            <div className="text-xs mt-1">{attendanceCount}👥</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Existing Records Info */}
              {existingRecords.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-full">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      Esta semana já possui {existingRecords.length} registro(s) salvos.
                      Dias marcados com 🔒 não podem ser editados.
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Date Info */}
              <div className="bg-white rounded-lg p-4 shadow-sm max-w-full">
                <div className="flex items-center justify-between mb-3 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {getDayName(selectedDate)}, {format(selectedDate, "dd/MM/yyyy")}
                  </h3>
                  {isDateDisabled(selectedDateStr) && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Já salvo
                    </span>
                  )}
                </div>

                {/* Toggle View */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowParticipants(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${showParticipants ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    Participantes
                  </button>
                  <button
                    onClick={() => setShowParticipants(false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${!showParticipants ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    Configurações
                  </button>
                </div>

                {showParticipants ? (
                  <div className="space-y-3">
                    {participantList.map((p) => {
                      const key = `${p.role}-${p.id}`;
                      const present = attendance[key]?.[selectedDateStr] || false;

                      return (
                        <div
                          key={key}
                          className={`flex items-center justify-between p-3 rounded-lg border ${present ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                            }`}
                        >
                          {/* min-w-0 allows truncation instead of overflow */}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{p.name}</div>
                            <div className={`text-sm ${p.role === "Teacher" ? "text-blue-600" : "text-gray-500"}`}>
                              {p.role === "Teacher" ? "Professor" : "Estudante"}
                            </div>
                          </div>

                          <button
                            onClick={() => onToggleAttendance(key, selectedDateStr)}
                            disabled={isDateDisabled(selectedDateStr)}
                            className={[
                              "w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0",
                              isDateDisabled(selectedDateStr)
                                ? "bg-gray-200 cursor-not-allowed"
                                : present
                                  ? "bg-green-500 hover:bg-green-600 active:scale-95"
                                  : "bg-gray-300 hover:bg-gray-400 active:scale-95",
                            ].join(" ")}
                          >
                            {/* use white icons so we don't rely on text color layers */}
                            {present ? (
                              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Switch
                      checked={replacement}
                      onChange={setReplacement}
                      label="Aula de reposição"
                      size="md"
                      color="green"
                      disabled={loading}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conteúdo da Aula
                      </label>
                      <textarea
                        value={classContent}
                        onChange={(e) => setClassContent(e.target.value)}
                        disabled={loading}
                        className="w-full max-w-full border border-gray-300 rounded-lg p-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="Descreva aqui o conteúdo ministrado nesta semana..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        <div className="mt-6 flex justify-end gap-4">

          <CancelButton
            type="button"
            onClick={onCancel}
          >
            Voltar
          </CancelButton>
          {Number(selectedClassId) > 0 && (
            <Button
              className="hover:bg-purple-500"
              type="submit"
              onClick={onSaveAttendance}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Salvar Presença"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
