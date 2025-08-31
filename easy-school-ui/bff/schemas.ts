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


export const WeekDaySchema = z.object({
  id: z.number(),
  week_day: z.string(),  
});
export type WeekDaySchema = z.infer<typeof WeekDaySchema>;

export const CalendarRangeHourDaySchema = z.object({
  id: z.number().optional(),
  week_day: WeekDaySchema,
  start_hour: z.string().regex(/^([01]\d|2[0-3])$/, 'Hora inválida'),
  start_minute: z.string().regex(/^[0-5]\d$/, 'Minuto inválido'),
  end_hour: z.string().regex(/^([01]\d|2[0-3])$/, 'Hora inválida'),
  end_minute: z.string().regex(/^[0-5]\d$/, 'Minuto inválido'),
});
export type CalendarRangeHourDaySchema = z.infer<typeof CalendarRangeHourDaySchema>;

export const TeacherSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string(),
  status: z.boolean().default(true),
  compensation: z.string(),
  start_date: z.string(),
  language_ids: z.array(z.string()).min(1, 'Selecione ao menos um idioma'),
  calendar_range_hour_days: z.array(CalendarRangeHourDaySchema).min(1, 'Informe ao menos um intervalo'),
});
export type TeacherSchema = z.infer<typeof TeacherSchema>;




