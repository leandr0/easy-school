import { RoleModel } from "../definitions/role_definitions";
import { UserModel } from "../definitions/user_definitions";

// helpers/roles.ts
export function extractRoleNames(user: UserModel): string[] {
  const names =
    Array.isArray(user.roles)
      ? user.roles
          .map(r => r?.role)                       // pick the name
          .filter((s): s is string => !!s && s.trim().length > 0)
          .map(s => s.toUpperCase())               // optional: normalize
      : [];

  // optional: also support old shape user.role?.role
  const single = (user as any)?.role?.role as string | undefined;
  if (single) names.push(single.toUpperCase());

  // dedupe
  return Array.from(new Set(names));
}


// Normalize roles to an array of uppercase names
function normalizeRoleNames(
  roles: string[] | RoleModel[] | undefined | null
): string[] {
  if (!roles) return [];
  if (typeof (roles as any[])[0] === 'string') {
    return (roles as string[]).map(r => r.toUpperCase());
  }
  return (roles as RoleModel[])
    .map(r => r?.role)
    .filter((s): s is string => !!s && s.trim().length > 0)
    .map(s => s.toUpperCase());
}

export function hasRole(
  roles: string[] | RoleModel[] | undefined | null,
  required: string
): boolean {
  const set = new Set(normalizeRoleNames(roles));
  return set.has(required.toUpperCase());
}

export function hasAnyRole(
  roles: string[] | RoleModel[] | undefined | null,
  required: string[]
): boolean {
  const set = new Set(normalizeRoleNames(roles));
  return required.some(r => set.has(r.toUpperCase()));
}

export function hasAllRoles(
  roles: string[] | RoleModel[] | undefined | null,
  required: string[]
): boolean {
  const set = new Set(normalizeRoleNames(roles));
  return required.every(r => set.has(r.toUpperCase()));
}

