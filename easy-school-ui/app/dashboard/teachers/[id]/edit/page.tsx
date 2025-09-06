import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import TeacherEditForm from '../../components/EditTeacherForm';
import { getTeacherById } from '@/bff/services/teacher.server';
import { getAllLanguages } from '@/bff/services/language.server';
import { fetchCalendarRangeHourDayByTeacher } from '@/bff/services/calendarRangeHourDay.server';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { HttpError } from '@/app/config/api';



export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  let teacher: TeacherModel = {};
  let calendars:any = [];
  let teacherFound = false;

  try {

    calendars = await fetchCalendarRangeHourDayByTeacher(id);

    if (calendars.length > 0 && calendars[0].teacher) {
      teacher = calendars[0].teacher;
      teacherFound = true;
    } 


  } catch (err: any) {
    if (!(err instanceof HttpError && err.status === 404)) {
      throw err;
    }
  }

  if(!teacherFound){
    teacher = await getTeacherById(id);
  }

  teacher.language_ids = teacher.languages?.map(lang => lang.id!.toString()) || [];

  const languages = await getAllLanguages();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Professores', href: '/dashboard/teachers' },
          {
            label: 'Editar Professor',
            href: `/dashboard/teachers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <TeacherEditForm teacher={teacher} languages={languages} calendars={calendars} />
    </main>
  );
}