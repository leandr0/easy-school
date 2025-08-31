// utils/time.ts
export const pad2 = (n: number) => String(n).padStart(2, '0');
export const toInt = (v: string | number) => Number(v);
export const inRange = (n: number, min: number, max: number) => n >= min && n <= max;
export const toMinutes = (h: number, m: number) => h * 60 + m;

export function isValidRange(sh: number, sm: number, eh: number, em: number) {
  if ([sh, sm, eh, em].some(Number.isNaN)) return { ok: false, msg: 'Horários inválidos' };
  if (![inRange(sh,0,23), inRange(eh,0,23), inRange(sm,0,59), inRange(em,0,59)].every(Boolean))
    return { ok: false, msg: 'Fora do intervalo permitido' };
  const start = toMinutes(sh, sm), end = toMinutes(eh, em);
  if (end <= start) return { ok: false, msg: 'Fim deve ser maior que início' };
  if (end - start < 60) return { ok: false, msg: 'Mínimo de 1h' };
  return { ok: true as const };
}
