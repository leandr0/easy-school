import { apiClient } from "@/app/config/api";
import { UserModel } from "@/app/lib/definitions/user_definitions";

import { bffApiClient } from '@/app/config/clientAPI';
import { RoleModel } from "@/app/lib/definitions/role_definitions";
import { bearerHeaders, requireAuth } from "@/app/lib/authz.server";

const clientApi = bffApiClient.resource('/security/roles');

export async function fetchRoles(): Promise<RoleModel[]> {

    await requireAuth(['ADMIN']);

    const roles: RoleModel[] = await clientApi.get<RoleModel[]>('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });

    return roles;
  
}