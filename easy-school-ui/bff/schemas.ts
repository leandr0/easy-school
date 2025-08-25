// bff/schemas.ts
import { z } from 'zod';

const StatusSchema = z
  .union([z.boolean(), z.number(), z.string()])
  .transform((v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    const s = String(v).toLowerCase();
    return s === 'true' || s === 't' || s === '1' || s === 'y';
  });

export const UserSchemaRaw = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  username: z.string().email(),
  status: StatusSchema,
  // allow either key to come from the backend
  created_at: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const UserSchema = UserSchemaRaw.transform((u) => ({
  id: u.id,
  username: u.username,
  status: u.status,
  created_at: u.created_at ?? u.createdAt ?? null,
}));

export type User = z.infer<typeof UserSchema>;

export const RoleSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  role: z.string(),
  code: z.union([z.string(), z.number()]).transform(String),
});
export type Role = z.infer<typeof RoleSchema>;

