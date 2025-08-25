'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Clock10Icon } from 'lucide-react';

interface SubItem {
  name: string;
  href: string;
}
interface NavLink {
  name: string;
  mobileLabel?: string;
  href: string;
  icon: React.ComponentType<any>;
  subItems?: SubItem[];
}

const links: NavLink[] = [
  { name: 'Home', mobileLabel: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Cursos',
    mobileLabel: 'Cursos',
    href: '/dashboard/courses',
    icon: BookOpenIcon,
    subItems: [
      { name: 'Todos os Cursos', href: '/dashboard/courses' },
      { name: 'Criar Curso', href: '/dashboard/courses/create' },
    ],
  },
  {
    name: 'Turmas',
    mobileLabel: 'Turmas',
    href: '/dashboard/courses-class',
    icon: ShoppingBagIcon,
    subItems: [
      { name: 'Todas as Turmas', href: '/dashboard/courses-class' },
      { name: 'Criar Turma', href: '/dashboard/courses-class/create' },
    ],
  },
  {
    name: 'Alunos',
    mobileLabel: 'Alunos',
    href: '/dashboard/students',
    icon: UserGroupIcon,
    subItems: [
      { name: 'Todos os Alunos', href: '/dashboard/students' },
      { name: 'Cadastrar Aluno', href: '/dashboard/students/create' },
    ],
  },
  {
    name: 'Professores',
    mobileLabel: 'Profs',
    href: '/dashboard/teachers',
    icon: AcademicCapIcon,
    subItems: [
      { name: 'Todos os Professores', href: '/dashboard/teachers' },
      { name: 'Cadastrar Professor', href: '/dashboard/teachers/create' },
    ],
  },
  {
    name: 'Controle de Aulas',
    mobileLabel: 'Controle',
    href: '/dashboard/class-control',
    icon: Clock10Icon,
    subItems: [
      { name: 'Lista de Aulas', href: '/dashboard/class-control' },
      { name: 'Frequência', href: '/dashboard/class-control/attendance' },
    ],
  },
  {
    name: 'Financeiro',
    mobileLabel: 'Financeiro',
    href: '/dashboard/financial',
    icon: CurrencyDollarIcon,
    subItems: [{ name: 'Dashboard', href: '/dashboard/financial' }],
  },
  {
    name: 'Configurações',
    mobileLabel: 'Config.',
    href: '/dashboard/adm',
    icon: WrenchScrewdriverIcon,
    subItems: [{ name: 'Mensagens', href: '/dashboard/adm/messages' },
      { name: 'Usuários', href: '/dashboard/adm/user' }
    ],
  },
];

export default function NavLinksMobile() {
  const pathname = usePathname();
  const [sheetFor, setSheetFor] = useState<NavLink | null>(null);

  // prevent background scroll when sheet is open
  useEffect(() => {
    if (sheetFor) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [sheetFor]);

  const handleTopLevelClick = (link: NavLink, e: React.MouseEvent) => {
    if (link.subItems && link.subItems.length > 0) {
      e.preventDefault();
      setSheetFor(link);
    }
    // else allow normal navigation
  };

  return (
    <>
      {/* Two-row grid (mobile only) */}
      <nav className="md:hidden w-full bg-white" aria-label="Mobile quick nav">
        <ul className="grid grid-cols-4 gap-2 px-2 py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname?.startsWith(link.href);
            const label = link.mobileLabel ?? link.name;

            const hasSub = !!(link.subItems && link.subItems.length > 0);

            return (
              <li key={link.name} className="flex">
                <Link
                  href={link.href}
                  onClick={(e) => handleTopLevelClick(link, e)}
                  className={`
                    relative
                    flex flex-col items-center justify-center
                    w-full rounded-lg h-16
                    ${isActive ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-600'}
                    hover:bg-sky-50 hover:text-blue-700
                  `}
                >
                  <Icon className="w-5 h-5 mb-1 shrink-0" />
                  <span className="text-[11px] leading-tight font-medium truncate max-w-[72px]">
                    {label}
                  </span>

                  {hasSub && (
                    <span
                      className="
                        absolute top-1 right-1
                        inline-flex items-center justify-center
                        w-4 h-4 rounded-full
                        text-[10px] font-semibold
                        bg-purple-200 text-purple-800
                      "
                      title="Tem subitens"
                    >
                      +
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Sheet for subitems */}
      {sheetFor && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`Submenu de ${sheetFor.name}`}
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetFor(null)}
            aria-label="Fechar submenu"
          />

          {/* Sheet */}
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-white rounded-t-2xl shadow-2xl
              p-3
              max-h-[60vh] overflow-y-auto
            "
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900">
                {sheetFor.name}
              </h2>
              <button
                onClick={() => setSheetFor(null)}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Fechar
              </button>
            </div>

            {/* Go to parent page */}
            <Link
              href={sheetFor.href}
              className="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100"
              onClick={() => setSheetFor(null)}
            >
              <span className="text-sm font-medium">Ir para {sheetFor.name}</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>

            {/* Subitems list */}
            <ul className="space-y-1">
              {sheetFor.subItems?.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-gray-50 text-gray-800 hover:bg-sky-50"
                    onClick={() => setSheetFor(null)}
                  >
                    <span className="text-sm">{s.name}</span>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
