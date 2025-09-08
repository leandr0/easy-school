export type Permission =
  | 'dashboard.view'
  | 'students.read' | 'students.write'
  | 'courses.read'  | 'courses.write'
  | 'revenues.read' | 'revenues.write'
  | 'admin.all';

export type Role = 'ADMIN' | 'MANAGER' | 'TEACHER' | 'ASSISTANT' | 'STUDENT';

export const RolePermissions: Record<Role, Permission[]> = {
  ADMIN: ['admin.all'],
  MANAGER: ['dashboard.view','students.read','students.write','courses.read','courses.write','revenues.read','revenues.write'],
  TEACHER: ['dashboard.view','students.read','courses.read'],
  ASSISTANT: ['dashboard.view','students.read','courses.read','revenues.read'],
  STUDENT: ['dashboard.view'],
};
