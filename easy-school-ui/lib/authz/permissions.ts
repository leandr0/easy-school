export type Permission =
  | 'dashboard.view'
  | 'students.read' | 'students.write'
  | 'courses.read'  | 'courses.write'
  | 'revenues.read' | 'revenues.write'
  | 'classes.read'  | 'classes.write'
  | 'teachers.read' | 'teachers.write'
  | 'class_controls.read' | 'class_controls.write'
  | 'financial.read'
  | 'admin.all';
  
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export const RolePermissions: Record<Role, Permission[]> = {
  ADMIN: ['admin.all'],
  TEACHER: ['dashboard.view','students.read','courses.read','class_controls.read' ,'class_controls.write','teachers.read'],
  STUDENT: ['dashboard.view' , 'class_controls.read'],
};
