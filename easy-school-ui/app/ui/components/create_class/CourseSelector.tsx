'use client';

import { BookOpenIcon } from '@heroicons/react/24/outline';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';

interface CourseSelectorProps {
  courses: CourseModel[];
  selectedCourseId: string;
  onCourseChange: (value: string) => void;
}

export default function CourseSelector({ 
  courses, 
  selectedCourseId, 
  onCourseChange 
}: CourseSelectorProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCourseChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <select
          id="course_id"
          name="course_id"
          value={selectedCourseId}
          onChange={handleChange}
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby="course-error"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}