// app/config/clients.ts
import { ApiClient } from "./api";

// bffApiClient is used from BOTH contexts:
//  - Client Components running in the browser, where a relative path like
//    "/api" resolves correctly against the page's own origin.
//  - Server-side code (Server Components / *.server.ts files, e.g.
//    dashboard.server.ts) that also calls this app's own /api routes, but
//    runs in Node during SSR - Node's fetch() has no page origin, so a
//    relative URL throws ("Failed to parse URL from /api/...") instead of
//    resolving. That surfaces as a generic, hard-to-diagnose "error occurred
//    in the Server Components render" in production.
// So: browser keeps the relative/configured path; server-side builds an
// absolute URL pointing back at this same Next.js process (frontend and
// backend run in the same container here, so localhost:$PORT is correct).
function resolveBffBaseURL(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  const isServer = typeof window === 'undefined';

  if (!isServer) return configured;
  if (/^https?:\/\//i.test(configured)) return configured; // already absolute

  const port = process.env.PORT || 3000;
  return `http://localhost:${port}${configured}`;
}

export const bffApiClient = new ApiClient({
  baseURL: resolveBffBaseURL()
});

// Server (route handlers) -> External API (server-only env var)
// Fallback assumes the Spring backend runs alongside this app (e.g. same
// Docker container/host) rather than pointing at a specific remote server.
export const externalApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_EXT_URL || 'http://localhost:8080'
});
