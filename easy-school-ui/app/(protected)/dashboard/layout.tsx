// app/(protected)/dashboard/layout.tsx  (or your main protected layout)
import { getAbility } from '@/lib/authz/session';
import { links as ALL_LINKS, filterNav } from '@/lib/nav/menu';
import NavLinks from '@/app/dashboard/components/nav-links';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ability = await getAbility();
  const userPerms = ability?.list ?? [];
  const items = filterNav(ALL_LINKS, userPerms);

  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">
        <NavLinks items={items} />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
