import { RoleModel } from "../definitions/role_definitions";
import { UserModel } from "../definitions/user_definitions";


export function extractRoleNames(user: UserModel): string[] {
  const fromArray = (user.roles ?? []).flatMap((r) => {
    if (typeof r === "string") return [r];
    if (r && typeof r === "object") {
      const val =
        (r as any).name ??
        (r as any).role ??
        (r as any).code ??
        undefined;
      return typeof val === "string" && val.trim() ? [val] : [];
    }
    return [];
  });

  return Array.from(new Set([...fromArray].map((s) => s.toUpperCase())));
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

