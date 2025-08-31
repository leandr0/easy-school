// app/api/me/route.ts
'use server'
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/app/lib/authz';

export async function GET() {
  const token = cookies().get('user')?.value || '';

  console.log(`BFF Token ${token}`);

  const user = token ? await verifyJwt(token).catch(() => null) : null;

  console.log(`BFF User ${JSON.stringify(user)}`);

  if (!user) return NextResponse.json({ user: null }, { status: 200 });



  return NextResponse.json(user);
}
