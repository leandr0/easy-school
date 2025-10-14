'use client';
import React, { createContext, useContext, useMemo } from 'react';
import type { Permission } from '@/lib/authz/permissions';

type Ctx = { can: (p: Permission) => boolean };
const Ctx = createContext<Ctx>({ can: () => false });

export function CanProvider({ perms, children }: { perms: Permission[]; children: React.ReactNode }) {
  const can = useMemo(
    () => (p: Permission) => perms.includes('admin.all' as Permission) || perms.includes(p),
    [perms]
  );
  return <Ctx.Provider value={{ can }}>{children}</Ctx.Provider>;
}

export function Can({
  perm,
  children,
  fallback = null,
}: {
  perm: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can } = useContext(Ctx);
  return can(perm) ? <>{children}</> : <>{fallback}</>;
}

export function useCan() {
  return useContext(Ctx).can;
}

export function Cannot({ perm, children }: { perm: Permission; children: React.ReactNode }) {
  const { can } = useContext(Ctx);
  return !can(perm) ? <>{children}</> : null;
}