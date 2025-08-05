'use client';

import { useEffect, useState } from "react";
import { CourseClassCompleteModel } from "@/app/lib/definitions/course_class_definitions";
import { getAllCourseClassAvailable } from "@/app/services/courseClassService";
import { getStudentsInCourseClass } from "@/app/services/studentService";
import { storeFrequencyClass } from "@/app/services/classControlService";
import { addDays, format, startOfWeek, addWeeks, subWeeks } from "date-fns";
import ClassControlTableDesktop from "./ClassControlTableDesktop";
import { ClassControlModel } from "@/app/lib/definitions/class_control_definitions";

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

  const handleCourseClassChange = async (classId: string) => {
    if (!classId || classId === "") return;

    setParticipantList([]); // Clear previous data
    setSelectedClassId(classId);
    setAttendance({});
    setClassContent("");

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
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const toggleAttendance = (participantId: string, date: string) => {
    setAttendance((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [date]: !prev[participantId]?.[date],
      },
    }));
  };

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
      const dayName = format(date, "EEEE");

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
          course_class_id: Number(selectedClass.id), // Keep the original field name
          teacher_id: isTeacherPresent ? Number(selectedClass.teacher.id) : null,
          students: studentsPresent,
          content: classContent,
          replacement: replacement,
        });
      }
    }

    if (records.length === 0) {
      console.warn("⚠️ No attendance records to save.");
      alert("Nenhuma presença foi marcada para salvar.");
      return;
    }

    console.log(`✅ Preparing to save ${records.length} attendance record(s):`);
    records.forEach((rec, index) => {
      console.log(`📝 Record ${index + 1}:`, {
        id: rec.id,
        date: rec.date,
        course_class_id: rec.course_class_id, // Now properly included
        teacher_id: rec.teacher_id,
        students: rec.students,
        content: rec.content,
        replacement: rec.replacement,
      });
    });

    try {
      await storeFrequencyClass(records);
      alert("Presença salva com sucesso!");
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

  return (
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
    />
  );
}
