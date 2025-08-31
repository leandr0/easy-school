'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import { addDays, format, startOfWeek, addWeeks, subWeeks, endOfWeek } from "date-fns";

import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { ClassControlModel } from "@/app/lib/definitions/class_control_definitions";

import ClassControlTableDesktop from "./ClassControlTableDesktop";
import ClassControlTableMobile from "./ClassControleTableMobile";


import { getAllCourseClassAvailable } from "@/bff/services/courseClass.server";
import { getStudentsInCourseClass } from "@/bff/services/student.server";
import { storeFrequencyClass, filteringDataRange } from "@/bff/services/classControl.server";


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

export default function ClassControlTable() {
  const [courseClassList, setCourseClassList] = useState<CourseClassCompleteModel[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [participantList, setParticipantList] = useState<Participant[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [classContent, setClassContent] = useState<string>("");
  const [replacement, setReplacement] = useState<boolean>(false);
  const [disabledDates, setDisabledDates] = useState<Set<string>>(new Set());
  const [existingRecords, setExistingRecords] = useState<ClassControlModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Function to load existing attendance records for the current week
  const loadExistingRecords = async (classId: string, weekStart: Date) => {
    if (!classId || classId === "") return;

    setLoading(true);
    try {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const startDate = format(weekStart, "yyyy-MM-dd");
      const endDate = format(weekEnd, "yyyy-MM-dd");

      console.log(`🔍 Loading existing records for class ${classId} from ${startDate} to ${endDate}`);

      const records = await filteringDataRange(startDate, endDate, Number(classId));
      setExistingRecords(records);

      // Create set of disabled dates
      const disabledDatesSet = new Set<string>();
      records.forEach(record => {
        if (record.day && record.month && record.year) {
          // Reconstruct the date from day, month, year
          const recordDate = new Date(record.year, record.month - 1, record.day);
          const dateStr = format(recordDate, "yyyy-MM-dd");
          disabledDatesSet.add(dateStr);
        }
      });

      setDisabledDates(disabledDatesSet);
      console.log(`📅 Found ${records.length} existing records, disabled dates:`, Array.from(disabledDatesSet));

      // Pre-populate attendance data from existing records
      populateAttendanceFromRecords(records);

    } catch (error) {
      console.error("Error loading existing records:", error);
      setExistingRecords([]);
      setDisabledDates(new Set());
    } finally {
      setLoading(false);
    }
  };

  // Function to populate attendance data from existing records
  const populateAttendanceFromRecords = (records: ClassControlModel[]) => {
    const newAttendance: AttendanceRecord = {};

    records.forEach(record => {
      if (record.day && record.month && record.year) {
        const recordDate = new Date(record.year, record.month - 1, record.day);
        const dateStr = format(recordDate, "yyyy-MM-dd");

        // Mark teacher attendance
        if (record.teacher_id) {
          const teacherKey = `Teacher-${record.teacher_id}`;
          if (!newAttendance[teacherKey]) {
            newAttendance[teacherKey] = {};
          }
          newAttendance[teacherKey][dateStr] = true;
        }

        // Mark student attendance
        if (record.students && record.students.length > 0) {
          record.students.forEach(studentId => {
            const studentKey = `Student-${studentId}`;
            if (!newAttendance[studentKey]) {
              newAttendance[studentKey] = {};
            }
            newAttendance[studentKey][dateStr] = true;
          });
        }
      }
    });

    setAttendance(newAttendance);
  };

  const handleCourseClassChange = async (classId: string) => {
    if (!classId || classId === "") {
      setParticipantList([]);
      setSelectedClassId("");
      setAttendance({});
      setClassContent("");
      setDisabledDates(new Set());
      setExistingRecords([]);
      return;
    }

    setParticipantList([]); // Clear previous data
    setSelectedClassId(classId);
    setAttendance({});
    setClassContent("");
    setReplacement(false);

    // Reset to current week when changing class
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeekStart(currentWeek);

    const selectedClass = courseClassList.find((c) => String(c.id) === classId);
    if (!selectedClass) {
      console.warn("Turma não encontrada:", classId);
      return;
    }

    const students = await getStudentsInCourseClass(classId);
    const participants: Participant[] = [];

    if (selectedClass.teacher && selectedClass.teacher.id && selectedClass.teacher.name) {
      participants.push({
        id: selectedClass.teacher.id,
        name: selectedClass.teacher.name,
        role: "Teacher",
        phone_number: selectedClass.teacher.phone_number,
        email: selectedClass.teacher.email,
      });
    }

    students.forEach((s) => {
      if (s.id && s.name) {
        participants.push({
          id: s.id,
          name: s.name,
          role: "Student",
          phone_number: s.phone_number,
          email: s.email,
        });
      }
    });

    console.log("Participantes atualizados:", participants);
    setParticipantList(participants);

    // Load existing records for the current week (now reset to current date)
    await loadExistingRecords(classId, currentWeek);
  };

  const handlePrevWeek = async () => {
    const newWeekStart = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeekStart);

    // Load existing records for the new week
    if (selectedClassId) {
      await loadExistingRecords(selectedClassId, newWeekStart);
    }
  };

  const handleNextWeek = async () => {
    const newWeekStart = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeekStart);

    // Load existing records for the new week
    if (selectedClassId) {
      await loadExistingRecords(selectedClassId, newWeekStart);
    }
  };

  const toggleAttendance = (participantId: string, date: string) => {
    // Don't allow toggling if the date is disabled (already has stored data)
    if (disabledDates.has(date)) {
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [date]: !prev[participantId]?.[date],
      },
    }));
  };

 const onCancel = async () => {
      setClassContent("");
      setReplacement(false);
      router.push('/dashboard');
 }

  const saveAttendance = async () => {
    const selectedClass = courseClassList.find(c => String(c.id) === selectedClassId);
    if (!selectedClass || !selectedClass.teacher?.id) {
      alert("No class or teacher selected.");
      return;
    }

    const records: any[] = [];
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

    console.log(`📅 Processing ${weekDates.length} days:`);

    for (const date of weekDates) {
      const dateStr = format(date, "yyyy-MM-dd");

      // Skip dates that are disabled (already have stored data)
      if (disabledDates.has(dateStr)) {
        console.log(`⏭️ Skipping ${dateStr} - already has stored data`);
        continue;
      }

      const studentsPresent = participantList
        .filter((p) => p.role === "Student" && attendance[`Student-${p.id}`]?.[dateStr])
        .map((p) => Number(p.id));

      const teacherKey = `Teacher-${selectedClass.teacher.id}`;
      const isTeacherPresent = attendance[teacherKey]?.[dateStr];

      // Create record if ANY attendance is marked (student OR teacher)
      if (studentsPresent.length > 0 || isTeacherPresent) {
        records.push({
          id: null, // For new records, set to null
          date: dateStr, // Send as formatted string
          course_class_id: Number(selectedClass.id),
          teacher_id: isTeacherPresent ? Number(selectedClass.teacher.id) : null,
          students: studentsPresent,
          content: classContent,
          replacement: replacement,
        });
      }
    }

    if (records.length === 0) {
      console.warn("⚠️ No new attendance records to save.");
      alert("Nenhuma presença nova foi marcada para salvar.");
      return;
    }

    console.log(`✅ Preparing to save ${records.length} new attendance record(s):`);
    records.forEach((rec, index) => {
      console.log(`📝 Record ${index + 1}:`, {
        id: rec.id,
        date: rec.date,
        course_class_id: rec.course_class_id,
        teacher_id: rec.teacher_id,
        students: rec.students,
        content: rec.content,
        replacement: rec.replacement,
      });
    });

    try {
      await storeFrequencyClass(records);

      // Reset class content after successful save
      setClassContent("");
      setReplacement(false);

      // Reload existing records to update disabled dates
      await loadExistingRecords(selectedClassId, currentWeekStart);
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Erro ao salvar presença. Tente novamente.");
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="hidden md:block">
            <ClassControlTableDesktop
              classes={courseClassList}
              selectedClassId={selectedClassId}
              participantList={participantList}
              currentWeekStart={currentWeekStart}
              onClassChange={handleCourseClassChange}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToggleAttendance={toggleAttendance}
              onSaveAttendance={saveAttendance}
              attendance={attendance}
              classContent={classContent}
              setClassContent={setClassContent}
              replacement={replacement}
              setReplacement={setReplacement}
              disabledDates={disabledDates}
              loading={loading}
              existingRecords={existingRecords}
              onCancel={onCancel}
            />
          </div>
          <div className="md:hidden">
            <ClassControlTableMobile
              classes={courseClassList}
              selectedClassId={selectedClassId}
              participantList={participantList}
              currentWeekStart={currentWeekStart}
              onClassChange={handleCourseClassChange}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToggleAttendance={toggleAttendance}
              onSaveAttendance={saveAttendance}
              attendance={attendance}
              classContent={classContent}
              setClassContent={setClassContent}
              replacement={replacement}
              setReplacement={setReplacement}
              disabledDates={disabledDates}
              loading={loading}
              existingRecords={existingRecords}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}