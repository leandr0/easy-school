'use client';

import UsersTable from './UsersTable';
import UsersListMobile from './UsersListMobile';
import type { User } from '@/bff/schemas';
import { formatBRDate } from '@/app/lib/dates';
import Link from 'next/link';
import { UserModel } from '@/app/lib/definitions/user_definitions';

type Props = { users: UserModel[] };

export default function UsersViews({ users }: Props) {
    // function lives here and is passed down
    const formatDate = formatBRDate;

    return (
        <>
            <div className="md:hidden relative pt-14">

                <Link
                    href="/dashboard/adm/user/create"           // or /dashboard/adm/user/create
                    className="absolute top-0 right-0 w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl shadow-lg z-10"
                    aria-label="Criar usuário"
                >
                    +
                </Link>
                <UsersListMobile users={users} formatDate={formatDate} />
            </div>
            <div className="hidden md:block">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/dashboard/adm/user/create"
                        className="rounded-md bg-purple-600 text-white px-4 py-2 hover:bg-purple-700"
                    >
                        + Create User
                    </Link>
                </div>
                <UsersTable users={users} formatDate={formatDate} />
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Voltar
                </Link>
            </div>
        </>
    );
}
