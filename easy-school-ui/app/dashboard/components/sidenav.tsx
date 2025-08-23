'use client';
import Link from 'next/link';
import NavLinks from '@/app/dashboard/components/nav-links';
import NavLinksMobile from './NavLinksMobile';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SideNav() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { cookieName: 'user' };

    const response = await fetch('/api/security/cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: you generally don't need to set Cookie header manually in the browser;
        // 'credentials: include' will send cookies automatically if same-site is configured.
        // 'Cookie': `user=${document.cookie}`,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Header / Logo */}
      <Link
        className="mb-2 flex h-16 items-end justify-start rounded-md bg-purple-400 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      {/* Mobile layout */}
      <div className="md:hidden w-full">
        {/* Mobile accordion nav */}
        <NavLinksMobile />

        {/* Sign out button (mobile) */}
        <form onSubmit={handleSubmit} className="mt-3">
          <button
            className="w-full flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3
                       text-sm font-medium hover:bg-sky-100 hover:text-red-400"
          >
            <PowerIcon className="w-6" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex md:grow md:flex-col md:space-y-2">
        <NavLinks />
        <div className="h-auto grow rounded-md bg-gray-50" />
        <form onSubmit={handleSubmit}>
          <button
            className="w-full flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3
                       text-sm font-medium hover:bg-sky-100 hover:text-red-400 md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6 " />
            <div className="hidden md:block ">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
