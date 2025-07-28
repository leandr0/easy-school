'use client';

import { BookOpenIcon } from '@heroicons/react/24/outline';
import { CourseClassModel } from '@/app/lib/definitions/course_class_definitions';

interface CourseClassSelectorProps {
  classes: CourseClassModel[];
  selectedClassId: string;
  onClassChange: (value: string) => void;
}

export default function CourseClassSelector({ 
  classes, 
  selectedClassId, 
  onClassChange 
}: CourseClassSelectorProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onClassChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <select
          id="course_id"
          name="course_id"
          value={selectedClassId}
          onChange={handleChange}
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby="course-error"
        >
          {classes.map((klass) => (
            <option key={klass.id} value={klass.id}>
              {klass.name}
            </option>
          ))}
        </select>
        <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}