// app/dashboard/components/SignOutButton.tsx
'use client';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SignOutButton({ full }: { full?: boolean }) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/security/cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cookieName: 'user' }),
    });
    if (response.ok){
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        className={`w-full flex h-[48px] items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-red-400 ${full ? 'justify-start md:p-2 md:px-3' : 'justify-center'}`}
      >
        <PowerIcon className="w-6" />
        <span className="hidden md:block">Sign Out</span>
      </button>
    </form>
  );
}
