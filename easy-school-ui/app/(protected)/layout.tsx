import { getAbility } from '@/lib/authz/session';
import { CanProvider } from '@/components/Can';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const ability = await getAbility();
  if (!ability) return null;
  return <CanProvider perms={ability.list}>{children}</CanProvider>;
}
