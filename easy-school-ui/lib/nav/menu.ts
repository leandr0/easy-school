// lib/nav/menu.ts
import type { Permission } from '@/lib/authz/permissions';

export type IconKey =
  | 'home'
  | 'courses'
  | 'classes'
  | 'students'
  | 'teachers'
  | 'clock'
  | 'dollar'
  | 'wrench'
  | 'book';

export interface SubItem {
  name: string;
  href: string;
  required?: Permission | Permission[];
}

export interface NavLink {
  name: string;
  href: string;
  icon: IconKey; // <-- string key, not a component
  required?: Permission | Permission[];
  subItems?: SubItem[];
}

// ---- Menu model (add/remove items as you like) ----
export const links: NavLink[] = [
  { name: 'Home', href: '/dashboard', icon: 'home', required: 'dashboard.view' },
  {
    name: 'Cursos',
    href: '/dashboard/courses',
    icon: 'courses',
    required: 'courses.read',
    subItems: [
      { name: 'Todos os Cursos', href: '/dashboard/courses', required: 'courses.read' },
      { name: 'Criar Curso', href: '/dashboard/courses/create', required: 'courses.write' },
    ],
  },
  {
    name: 'Livros',
    href: '/dashboard/books',
    icon: 'book',
    required: 'admin.all',
    subItems: [
      { name: 'Todos os Livros', href: '/dashboard/books', required: 'admin.all' },
      { name: 'Criar Livro', href: '/dashboard/books/create', required: 'admin.all' },
    ],
  },
  {
    name: 'Turmas',
    href: '/dashboard/courses-class',
    icon: 'classes',
    required: 'classes.read',
    subItems: [
      { name: 'Todas as Turmas', href: '/dashboard/courses-class', required: 'classes.read' },
      { name: 'Criar Turma', href: '/dashboard/courses-class/create', required: 'classes.write' },
    ],
  },
  {
    name: 'Alunos',
    href: '/dashboard/students',
    icon: 'students',
    required: 'students.read',
    subItems: [
      { name: 'Todos os Alunos', href: '/dashboard/students', required: 'students.read' },
      /*{ name: 'Cadastrar Aluno', href: '/dashboard/students/create', required: 'students.write' },*/
    ],
  },
  {
    name: 'Professores',
    href: '/dashboard/teachers',
    icon: 'teachers',
    required: 'teachers.read',
    subItems: [
      { name: 'Todos os Professores', href: '/dashboard/teachers', required: 'teachers.read' },
      /*{ name: 'Cadastrar Professor', href: '/dashboard/teachers/create', required: 'teachers.write' },*/
    ],
  },
  {
    name: 'Controle de Aulas',
    href: '/dashboard/class-control',
    icon: 'clock',
    required: 'class_controls.read',
    subItems: [
      { name: 'Lista de Aulas', href: '/dashboard/class-control', required: ['class_controls.read' ,'class_controls.write']},
      { name: 'Frequência', href: '/dashboard/class-control/attendance', required: ['class_controls.read' ]},
       { name: 'Relatório', href: '/dashboard/class-control/report', required: ['class_controls.read' ]},
    ],
  },
  {
    name: 'Financeiro',
    href: '/dashboard/financial',
    icon: 'dollar',
    required: 'financial.read',
    subItems: [
      { name: 'Dashboard', href: '/dashboard/financial', required: 'financial.read' },
      { name: 'Contratos', href: '/dashboard/financial/contracts', required: 'financial.read' },
    ],
  },
  {
    name: 'Configurações',
    href: '/dashboard/adm',
    icon: 'wrench',
    required: 'users.self',
    subItems: [
      { name: 'Mensagens', href: '/dashboard/adm/messages', required: 'admin.all' },
      { name: 'Usuários', href: '/dashboard/adm/user', required: 'users.self' },
    ],
  },
];

// ---- Helpers ----
function hasAll(userPerms: Permission[], required?: Permission | Permission[]) {
  if (!required) return true;
  const need = Array.isArray(required) ? required : [required];
  const userSet = new Set(userPerms);
  // admin shortcut
  if (userSet.has('admin.all' as Permission)) return true;
  return need.every((p) => userSet.has(p));
}

/** Filter parent and subitems by user permissions */
export function filterNav(all: NavLink[], userPerms: Permission[]): NavLink[] {
  return all
    .filter((link) => hasAll(userPerms, link.required))
    .map((link) => {
      const sub = link.subItems?.filter((s) => hasAll(userPerms, s.required)) ?? [];
      return { ...link, subItems: sub };
    })
    // Optional: hide parents that would become empty after filtering sub-items
    .filter((link) => (link.subItems && link.subItems.length > 0) || !link.subItems);
}
