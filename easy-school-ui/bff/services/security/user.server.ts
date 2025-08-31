import { externalApiClient, bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders, requireAuth } from "@/app/lib/authz.server";
import { User } from "@/app/lib/definitions";
import { UserModel } from "@/app/lib/definitions/user_definitions";
import { headers as nextHeaders } from 'next/headers';

//const clientApi = externalApiClient.resource('/security/users');
const clientApi = bffApiClient.resource('/security/users');

export async function getAllUsers(): Promise<any> {

  await requireAuth(['ADMIN']);

  const data = await clientApi.get<UserModel[]>('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

  return data;
}


export async function findUser(user_id: any): Promise<UserModel> {

  await requireAuth(['ADMIN']);

  const data = await clientApi.get<UserModel>(`/${user_id}`, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

  return data;
}


export async function createUser(user: UserModel): Promise<any> {

  await requireAuth(['ADMIN']);
  
  const data = await clientApi.post<UserModel>(user, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

  return data;
}


export async function updateUser(user: UserModel): Promise<UserModel> {
  await requireAuth(['ADMIN']);
  
  const data = await clientApi.put<UserModel>(user, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

  return data;
}

export async function callBff<T>(path: string, init: RequestInit = {}): Promise<T> {

  const bearer = await bearerHeaders();

  console.log(`Bearer ${JSON.stringify(bearer)}`);

  const h = new Headers(init.headers);
  const cookieHeader = nextHeaders().get('cookie');
  if (cookieHeader && !h.has('cookie')) h.set('cookie', cookieHeader);

  const res = await fetch(path, { ...init, headers: bearer, cache: 'no-store' });
  const ctype = res.headers.get('content-type') || '';
  const body = ctype.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof body === 'string' ? body : JSON.stringify(body);
    throw new Error(`BFF ${res.status}: ${msg}`);
  }
  return body as T;
}








