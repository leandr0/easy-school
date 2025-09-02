// app/api/me/route.ts
'use server'
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/app/lib/authz';

export async function GET() {
  const token = cookies().get('user')?.value || '';



  const user = token ? await verifyJwt(token).catch(() => null) : null;



  if (!user) return NextResponse.json({ user: null }, { status: 200 });



  return NextResponse.json(user);
}
