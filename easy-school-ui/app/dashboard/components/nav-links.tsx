// app/dashboard/components/nav-links.tsx
'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { Clock10Icon } from 'lucide-react';
import type { NavLink, IconKey } from '@/lib/nav/menu';

const iconMap: Record<IconKey, React.ComponentType<any>> = {
  home: HomeIcon,
  courses: LanguageIcon,
  classes: ShoppingBagIcon,
  students: UserGroupIcon,
  teachers: AcademicCapIcon,
  clock: Clock10Icon,
  dollar: CurrencyDollarIcon,
  wrench: WrenchScrewdriverIcon,
  book: BookOpenIcon,
};

export default function NavLinks({ items }: { items: NavLink[] }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const toggleMenu = (name: string) => setOpenMenus((p) => ({ ...p, [name]: !p[name] }));

  return (
    <>
      {items.map((link) => {
        const LinkIcon = iconMap[link.icon]; // <-- lookup here
        const hasSub = !!link.subItems?.length;
        const isOpen = openMenus[link.name];

        return (
          <div key={link.name} className="w-full">
            <div className="flex items-center rounded-md bg-gray-50 text-purple-900 ">
              <a
                href={!hasSub ? link.href : '#'}
                onClick={
                  hasSub
                    ? (e) => {
                        e.preventDefault();
                        toggleMenu(link.name);
                      }
                    : undefined
                }
                className="flex h-[48px] grow items-center justify-center gap-2 p-3 
                           text-sm font-medium hover:bg-sky-200 hover:text-blue-600
                           md:flex-none md:justify-start md:p-2 md:px-3 cursor-pointer
                           font-bold w-full"
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
                {hasSub && (
                  <div className="hidden md:block ml-auto">
                    {isOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                  </div>
                )}
              </a>
            </div>

            {hasSub && isOpen && (
              <div className="mt-1 ml-4 md:ml-8 space-y-1">
                {link.subItems!.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    className="flex h-[40px] items-center gap-2 rounded-md bg-gray-50 p-2 text-sm font-normal hover:bg-sky-50 hover:text-blue-600 md:px-3 text-blue-400"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <p className="hidden md:block">{s.name}</p>
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
