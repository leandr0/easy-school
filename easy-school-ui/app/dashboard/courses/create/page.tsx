import CreateCourseForm from "@/app/dashboard/courses/components/CreateCourseForm";
import Breadcrumbs from '@/app/dashboard/components/breadcrumbs';
import { getAllLanguages } from '@/bff/services/language.server';
import { createCourse } from "@/bff/services/course.server";

export default async function Page() {

  const languages = await getAllLanguages();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cursos', href: '/dashboard/courses' },
          {
            label: 'Criar Curso',
            href: '/dashboard/courses/create',
            active: true,
          },
        ]}
      />
      <CreateCourseForm languages={languages} onSave={createCourse} />
    </main>
  );
}
