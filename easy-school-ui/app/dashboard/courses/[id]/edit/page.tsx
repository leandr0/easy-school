import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import EditCourseForm from "@/app/dashboard/courses/components/EditCourseForm";
import { getAllLanguages } from '@/bff/services/language.server';
import { createCourse, findCourse } from '@/bff/services/course.server';


export default async function Page({ params }: { params: { id: string } }) {


  const id = params.id;
  const [languages, course] = await Promise.all([
    getAllLanguages(),
    findCourse(id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cursos', href: '/dashboard/courses' },
          {
            label: 'Editar Curso',
            href: `/dashboard/courses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCourseForm languages={languages} course={course}  onSave={createCourse}/>
    </main>
  );
}
