import { cookies } from 'next/headers';

export function authHeaders(): Record<string, string> {
  const token = cookies().get('user')?.value;
  if (!token) return {};                               // no Authorization key at all
  return { Authorization: `Bearer ${token}` };
}