import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import { bffApiClient } from '@/app/config/clientAPI';
import { TeacherSchema } from '@/bff/schemas';
import { UserModel } from '@/app/lib/definitions/user_definitions';


const clientApi = bffApiClient.resource('/teachers');

/**
}

export async function getAllTeachersAvailable(): Promise<TeacherModel[]> {
  await requireAuth('ADMIN');
  return clientApi.get<TeacherModel[]>("/available", {headers: await bearerHeaders() , cache: 'no-store' });
}

export async function getAllTeachersAvailableByLanguage(language_id: any): Promise<TeacherModel[]> {
  await requireAuth('ADMIN');

  const params = new URLSearchParams();
  params.append("language", language_id.toString());

  return clientApi.get<TeacherModel[]>('/available?' + params.toString(), {headers: await bearerHeaders() , cache: 'no-store' });
}

export async function getAllTeachersAvailableByLanguageFromCourseClass(course_class_id: any): Promise<TeacherModel[]> {
  await requireAuth('ADMIN');

  const params = new URLSearchParams();
  params.append("course_class", course_class_id.toString());

  return clientApi.get<TeacherModel[]>('/available?' + params.toString(), {headers: await bearerHeaders() , cache: 'no-store' });
}
**/
// Migrated
export async function createTeacher(teacher: TeacherModel): Promise<void> {

  return await clientApi.post<void>(teacher);
}
//Migrated
export async function updateTeacher(teacher: TeacherModel): Promise<TeacherModel> {
  return await clientApi.put(teacher);
}

//Migrate
export async function getAllTeachers(): Promise<TeacherModel[]> {
  return await clientApi.get<TeacherModel[]>();
}


export async function getTeacherById(teacher_id: any): Promise<TeacherModel> {
  return clientApi.get<TeacherModel>(teacher_id);
}
