import { redirect } from 'next/navigation';
import { getAbility } from './session';
import type { Permission } from './permissions';

export async function authorizePage(perm: Permission) {
  const ability = await getAbility();
  if (!ability || !ability.can(perm)) redirect('/403');
}
