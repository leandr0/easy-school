'use client';

import React, { useEffect, useState, useCallback } from "react";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";

import { addDays, format, startOfWeek, endOfWeek } from "date-fns";
import { ClassControlResponseModel } from "@/app/lib/definitions/class_control_definitions";
import AttendenceClassControlTableDesktop from "./AttendenceClassControlTableDesktop";

import { StudentModel } from "@/app/lib/definitions/students_definitions";
import { useRouter } from 'next/navigation';
import AttendenceClassControlTableMobile from "./AttendenceClassControlTableMobile";

import { getAllCourseClassAvailable } from "@/bff/services/courseClass.server";
import { controlFilteringDataRange } from "@/bff/services/classControl.server";


type Participant = {
    id: string;
    name: string;
    role: "Teacher" | "Student";
    phone_number?: string;
    email?: string;
};

type AttendanceRecord = {
    [participantId: string]: {
        [date: string]: boolean;
    };
};

export type DateRange = { startDate: string; endDate: string };

export default function AttendenceClassControlTable() {
    const [courseClassList, setCourseClassList] = useState<CourseClassCompleteModel[]>([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [existingRecords, setExistingRecords] = useState<ClassControlResponseModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const [expandedRows, setExpandedRows] = useState<{ [id: string]: StudentModel[] }>({});
    const [loadingRow, setLoadingRow] = useState<string | null>(null);
    const router = useRouter();

    // Date range filter state
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: format(addDays(new Date(), -15), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const getInitialDateRange = (): DateRange => ({
        startDate: format(addDays(new Date(), -15), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });


    const resetExpandedRows = useCallback(() => {
        setExpandedRows({});
        setLoadingRow(null); // Also reset any loading state
    }, []);

    const toggleRow = async (studentId: string, classControlId: string) => {
        if (expandedRows[classControlId]) {
            setExpandedRows(prev => {
                const copy = { ...prev };
                delete copy[classControlId];
                return copy;
            });
        } else {
            try {
                setLoadingRow(classControlId);
                // Find the record to get the student data
                const record = existingRecords.find(r => String(r.class_control?.id) === classControlId);
                if (record?.students) {
                    // Ensure students is not undefined before setting state
                    setExpandedRows(prev => ({
                        ...prev,
                        [classControlId]: record.students || [] // Fallback to empty array if undefined
                    }));
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setLoadingRow(null);
            }
        }
    };

    useEffect(() => {
        getAllCourseClassAvailable()
            .then((classes) => {
                const placeholder: CourseClassCompleteModel = {
                    id: "",
                    name: "Selecione uma turma ... ",
                    status: true,
                    course: { id: "", name: "" },
                    teacher: { id: "", name: "", language_ids: [], calendar_range_hour_days: [] },
                    language: { id: "", name: "" },
                };
                setCourseClassList([placeholder, ...classes]);
            })
            .catch((err) => console.error(err));
    }, []);


    const handleCourseClassChange = async (classId: string) => {
        if (!classId || classId === "") {
            setSelectedClassId("");
            setExistingRecords([]);
            setDateRange(getInitialDateRange());
            return;
        }

        resetExpandedRows();
        setExistingRecords([]);
        setDateRange(getInitialDateRange());
        setSelectedClassId(classId);
        // Reset to current week when changing class
        const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        setCurrentWeekStart(currentWeek);

        const selectedClass = courseClassList.find((c) => String(c.id) === classId);
        if (!selectedClass) {
            console.warn("Turma não encontrada:", classId);
            return;
        }


        // Load existing records for the current week
        await loadExistingRecords(classId, currentWeek);
    };

    const onCancel = async () => {
        router.push('/dashboard');
    }

    // Handle date range filter
    const handleDateRangeApply = useCallback(async () => {
        if (!selectedClassId || selectedClassId === "") {
            alert("Selecione uma turma primeiro.");
            return;
        }

        try {
            setLoading(true);


            const records = await controlFilteringDataRange(dateRange.startDate, dateRange.endDate, Number(selectedClassId));
            setExistingRecords(records);



        } catch (error) {
            console.error("Error filtering by date range:", error);
            alert("Erro ao filtrar por período. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [dateRange, selectedClassId]);

    // Function to load existing attendance records for the current week
    const loadExistingRecords = async (classId: string, weekStart: Date) => {
        if (!classId || classId === "") return;

        setLoading(true);
        try {
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
            const startDate = format(weekStart, "yyyy-MM-dd");
            const endDate = format(weekEnd, "yyyy-MM-dd");



            const records = await controlFilteringDataRange(startDate, endDate, Number(classId));
            setExistingRecords(records);


        } catch (error) {
            console.error("Error loading existing records:", error);
            setExistingRecords([]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="mt-6 flow-root w-full">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0">
                    <div className="hidden md:block">


                        <AttendenceClassControlTableDesktop
                            classes={courseClassList}
                            onClassChange={handleCourseClassChange}
                            selectedClassId={selectedClassId}
                            dateRange={dateRange}
                            onApply={handleDateRangeApply}
                            onChange={setDateRange}
                            loading={loading}
                            existingRecords={existingRecords}
                            expandedRows={expandedRows}
                            loadingRow={loadingRow}
                            onToggleRow={toggleRow}
                            onCancel={onCancel}
                        />
                    </div>
                    <div className="md:hidden">
                        <AttendenceClassControlTableMobile
                            classes={courseClassList}
                            onClassChange={handleCourseClassChange}
                            selectedClassId={selectedClassId}
                            dateRange={dateRange}
                            onApply={handleDateRangeApply}
                            onChange={setDateRange}
                            loading={loading}
                            existingRecords={existingRecords}
                            expandedRows={expandedRows}
                            loadingRow={loadingRow}
                            onToggleRow={toggleRow}
                            onCancel={onCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}