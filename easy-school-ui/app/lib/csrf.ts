// app/lib/csrf.ts
import { cookies, headers } from 'next/headers';
import { UnauthorizedError } from '@/app/lib/errors';

export function assertCsrf() {
  const cookieToken = cookies().get('csrf')?.value;
  const headerToken = headers().get('x-csrf-token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new UnauthorizedError(); // treat as 401
  }
}
