// app/lib/dates.ts
export function normalizeToISO(ts: string) {
  let s = ts;
  if (!s.includes('T')) s = s.replace(' ', 'T');
  if (/([+-]\d{2})$/.test(s)) s = s.replace(/([+-]\d{2})$/, '$1:00');
  return s;
}

export function formatBRDate(ts?: string | null) {
  if (!ts) return '—';
  const d = new Date(normalizeToISO(ts));
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d); // dd/MM/yyyy
}
