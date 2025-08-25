import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { Clock10Icon } from 'lucide-react';
import { useState } from 'react';

// Type definitions
interface SubItem {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  subItems?: SubItem[];
}

// Updated links structure with sub-menus
const links: NavLink[] = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
  {
    name: 'Cursos',
    href: '/dashboard/courses',
    icon: BookOpenIcon,
    subItems: [
      { name: 'Todos os Cursos', href: '/dashboard/courses' },
      { name: 'Criar Curso', href: '/dashboard/courses/create' }
    ]
  },
  {
    name: 'Turmas',
    href: '/dashboard/courses-class',
    icon: ShoppingBagIcon,
    subItems: [
      { name: 'Todas as Turmas', href: '/dashboard/courses-class' },
      { name: 'Criar Turma', href: '/dashboard/courses-class/create' }
    ]
  },
  {
    name: 'Alunos',
    href: '/dashboard/students',
    icon: UserGroupIcon,
    subItems: [
      { name: 'Todos os Alunos', href: '/dashboard/students' },
      { name: 'Cadastrar Aluno', href: '/dashboard/students/create' }
    ]
  },
  {
    name: 'Professores',
    href: '/dashboard/teachers',
    icon: AcademicCapIcon,
    subItems: [
      { name: 'Todos os Professores', href: '/dashboard/teachers' },
      { name: 'Cadastrar Professor', href: '/dashboard/teachers/create' }
    ]
  },
  {
    name: 'Controle de Aulas',
    href: '/dashboard/class-control',
    icon: Clock10Icon,
    subItems: [
      { name: 'Lista de Aulas', href: '/dashboard/class-control' },
      { name: 'Frequência', href: '/dashboard/class-control/attendance' }
    ]
  },
  {
    name: 'Financeiro',
    href: '/dashboard/financial',
    icon: CurrencyDollarIcon,
    subItems: [
      { name: 'Dashboard', href: '/dashboard/financial' }
    ]
  },
  {
    name: 'Configurações',
    href: '/dashboard/adm',
    icon: WrenchScrewdriverIcon,
    subItems: [
      { name: 'Mensagens', href: '/dashboard/adm/messages' },
      { name: 'Usuários', href: '/dashboard/adm/user' }
    ]
  }
];

export default function NavLinks() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (linkName: string): void => {
    setOpenMenus(prev => ({
      ...prev,
      [linkName]: !prev[linkName]
    }));
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const hasSubItems = link.subItems && link.subItems.length > 0;
        const isOpen = openMenus[link.name];

        return (
          <div key={link.name} className="w-full">
            {/* Main Link */}
            <div className="flex items-center rounded-md bg-gray-50 text-purple-900 ">
              <a
                href={!hasSubItems ? link.href : '#'}
                onClick={hasSubItems ? (e) => {
                  e.preventDefault();
                  toggleMenu(link.name);
                } : undefined}
                className="flex h-[48px] grow items-center justify-center gap-2  p-3 
                text-sm font-medium hover:bg-sky-200 hover:text-blue-600
                md:flex-none md:justify-start md:p-2 md:px-3 cursor-pointer
                font-bold w-full"
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
                {hasSubItems && (
                  <div className="hidden md:block ml-auto">
                    {isOpen ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </div>
                )}
              </a>
            </div>

            {/* Sub-menu */}
            {hasSubItems && isOpen && link.subItems && (
              <div className="mt-1 ml-4 md:ml-8 space-y-1">
                {link.subItems.map((subItem) => (
                  <a
                    key={subItem.name}
                    href={subItem.href}
                    className="flex h-[40px] items-center gap-2 rounded-md bg-gray-50  p-2 text-sm font-normal hover:bg-sky-50 hover:text-blue-600 md:px-3
                    text-blue-400"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="hidden md:block">{subItem.name}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}