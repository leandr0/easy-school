'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useEffect, useState } from "react";
import { CourseClassCreateForm } from '@/app/lib/definitions/course_class_definitions';
import { createCourseClass } from '@/app/lib/actions/course_class_actions';
import { BookOpenIcon } from '@heroicons/react/24/outline';

import { findCourse, getAllCoursesAvailable } from '@/app/lib/actions/course_actions';
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';

import { fetchAvailabilityTeacher } from '@/app/lib/actions/calendar_range_hour_day_actions';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';
import { MessageModel } from '@/app/lib/definitions/messages_definitions';

// Import the new components


export default function CreateMessageForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<MessageModel>();
  
  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  
  return (
    <form >
     
    <div className="mt-6 flow-root">

        <div className="rounded-lg bg-gray-50 p-4 md:pt-5">

          <div className="mb-4 grid grid-cols-2 gap-4 " >

            <div className="relative grid grid-cols-4">

              <div className="relative text-base mt-[10px] ml-[45px] ">reminder_message:</div>
              <div className="relative col-span-3">

                <input
                  type="text"
                  name="reminder_message"
                  id="reminder_message"
                  value={formData?.reminder_message}
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>

            </div>

          </div>

        </div>  


      <div >
        <Button
          type="submit"
          name="action"
          onClick={() => setActionType('fetch_teacher_availability')}
          value="fetch_teacher_availability"
          className='w-full hover:bg-purple-500'>
          Buscar professor
        </Button>
      </div>
      
      </div>   
  
    </form>
  );
}