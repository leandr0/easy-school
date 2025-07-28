'use client';

import { CourseClassModel } from "@/app/lib/definitions/course_class_definitions";
import { useEffect, useState } from "react";
import ClassControlTableDesktop from "./ClassControlTableDesktop";
import { getAllCourseClass, getAllCourseClassAvailable } from "@/app/services/courseClassService";



export default function ClassControlTable() {

    const [error, setError] = useState<string | null>(null);
    const [courseClassList, setcourseClassList] = useState<CourseClassModel[]>([]);

    const [selectedCourseClassId, setSelectedCourseClassId] = useState("");

    const handleCourseClassChange = async (value: string) => {
        setSelectedCourseClassId(value);
    };


    useEffect(() => {
        getAllCourseClassAvailable()
          .then((classes) => {
            const updatedCourses = [
              {
                id: "",
                name: "Selecione uma turma ... ",
                status: true,
              },
              ...classes,
            ];
    
            setcourseClassList(updatedCourses);
          })
          .catch((err) => setError(err.message));
      }, []);



    return (

        <form>


            <ClassControlTableDesktop
                classes={courseClassList}
                onClassChange={handleCourseClassChange}
                selectedClassId={selectedCourseClassId}
            />

        </form>

    );
}