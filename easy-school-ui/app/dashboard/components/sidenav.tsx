// app/dashboard/components/SideNav.tsx
import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';
import NavLinks from '@/app/dashboard/components/nav-links';
import NavLinksMobile from '@/app/dashboard/components/NavLinksMobile';
import SignOutButton from '@/app/dashboard/components/SignOutButton';

import { getAbility } from '@/lib/authz/session';
import { links as ALL_LINKS, filterNav } from '@/lib/nav/menu';

export default async function SideNav() {
  const ability = await getAbility();
  const userPerms = ability?.list ?? [];
  const items = filterNav(ALL_LINKS, userPerms);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Header / Logo */}
      <Link className="mb-2 flex h-16 items-end justify-start rounded-md bg-purple-400 p-4 md:h-40" href="/dashboard">
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      {/* Mobile 
      <div className="md:hidden w-full">
        <NavLinksMobile items={items} />
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
      */}

      {/* Desktop */}
      <div className="hidden md:flex md:grow md:flex-col md:space-y-2">
        <NavLinks items={items} />
        <div className="h-auto grow rounded-md bg-gray-50" />
        
        <SignOutButton full />
        {/*
        <p>{ability?.username}</p>
        <p>{JSON.stringify(ability?.list)}</p>
        <p>{ability?.roles}</p>
        */}
      </div>
    </div>
  );
}
