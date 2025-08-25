// bff/http.ts
import 'server-only';
import { ENV } from './env';

async function fetchWithTimeout(input: RequestInfo, init: RequestInit & { timeout?: number } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), init.timeout ?? ENV.API_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal, headers: { 'Content-Type': 'application/json', ...(init.headers || {}) } });
  } finally {
    clearTimeout(t);
  }
}

export async function upstream<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetchWithTimeout(`${ENV.API_BASE_URL}${path}`, init);
  const ctype = res.headers.get('content-type') || '';
  const body = ctype.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof body === 'string' ? body : JSON.stringify(body);
    throw new Error(`Upstream ${res.status}: ${msg}`);
  }
  return body as T;
}
