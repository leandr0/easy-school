'use client';

import { format, addDays } from "date-fns";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { ClassControlModel } from "@/app/lib/definitions/class_control_definitions";
import { Switch } from "@/app/ui/components/switch";
import { useState } from "react";

interface ClassControlTableMobileProps {
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
    disabledDates: Set<string>;
    loading: boolean;
    existingRecords: ClassControlModel[];
}

export default function ClassControlTableMobile({
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
    disabledDates,
    loading,
    existingRecords,
}: ClassControlTableMobileProps) {
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [showParticipants, setShowParticipants] = useState(true);

    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    const selectedDate = weekDates[selectedDateIndex];
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

    const isDateDisabled = (dateStr: string) => {
        return disabledDates.has(dateStr);
    };

    const getAttendanceCount = (dateStr: string) => {
        return participantList.filter(p => {
            const participantKey = `${p.role}-${p.id}`;
            return attendance[participantKey]?.[dateStr];
        }).length;
    };

    const getDayName = (date: Date) => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days[date.getDay()];
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Class Selection */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Turma
                </label>
                <select
                    value={selectedClassId}
                    onChange={(e) => onClassChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Carregando...</span>
                    </div>
                </div>
            )}

            {selectedClassId && (
                <>
                    {/* Week Navigation */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={onPrevWeek}
                                className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                                Anterior
                            </button>

                            <div className="text-center">
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
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M10 17l5-5-5-5v10z" />
                                </svg>
                            </button>
                        </div>

                        {/* Date Selection Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-2">
                            {weekDates.map((date, index) => {
                                const dateStr = format(date, "yyyy-MM-dd");
                                const disabled = isDateDisabled(dateStr);
                                const attendanceCount = getAttendanceCount(dateStr);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDateIndex(index)}
                                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[70px] ${selectedDateIndex === index
                                                ? 'bg-blue-600 text-white'
                                                : disabled
                                                    ? 'bg-gray-200 text-gray-500'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-xs font-medium">
                                            {getDayName(date)}
                                        </div>
                                        <div className="text-sm">
                                            {format(date, "dd")}
                                        </div>
                                        {disabled && (
                                            <div className="text-xs mt-1">🔒</div>
                                        )}
                                        {attendanceCount > 0 && !disabled && (
                                            <div className="text-xs mt-1">
                                                {attendanceCount}👥
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Existing Records Info */}
                    {existingRecords.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    Esta semana já possui {existingRecords.length} registro(s) salvos.
                                    Dias marcados com 🔒 não podem ser editados.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Selected Date Info */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900">
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
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${showParticipants
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                Participantes
                            </button>
                            <button
                                onClick={() => setShowParticipants(false)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${!showParticipants
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                Configurações
                            </button>
                        </div>

                        {showParticipants ? (
                            /* Participants List */
                            <div className="space-y-3">
                                {participantList.map((participant) => {
                                    const participantKey = `${participant.role}-${participant.id}`;
                                    const present = attendance[participantKey]?.[selectedDateStr] || false;

                                    return (
                                        <div
                                            key={participantKey}
                                            className={`flex items-center justify-between p-3 rounded-lg border ${present ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {participant.name}
                                                </div>
                                                <div className={`text-sm ${participant.role === 'Teacher' ? 'text-blue-600' : 'text-gray-500'
                                                    }`}>
                                                    {participant.role === 'Teacher' ? 'Professor' : 'Estudante'}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => onToggleAttendance(participantKey, selectedDateStr)}
                                                disabled={isDateDisabled(selectedDateStr)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDateDisabled(selectedDateStr)
                                                        ? 'bg-gray-200 cursor-not-allowed'
                                                        : present
                                                            ? 'bg-green-500 hover:bg-green-600 active:scale-95'
                                                            : 'bg-gray-300 hover:bg-gray-400 active:scale-95'
                                                    }`}
                                            >
                                                {present ? (
                                                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                    </svg>
                                                ) : (
                                                    isDateDisabled(selectedDateStr) ?
                                                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                        </svg>
                                                        :
                                                        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                        </svg>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Settings */
                            <div className="space-y-4">
                                <div>
                                    <Switch
                                        checked={replacement}
                                        onChange={setReplacement}
                                        label="Aula de reposição"
                                        size="md"
                                        color="green"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Conteúdo da Aula
                                    </label>
                                    <textarea
                                        value={classContent}
                                        onChange={(e) => setClassContent(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="Descreva aqui o conteúdo ministrado nesta semana..."
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button - Fixed at bottom */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 safe-area-inset-bottom">
                        <button
                            onClick={onSaveAttendance}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                        >
                            {loading ? "Salvando..." : "Salvar Presença"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}