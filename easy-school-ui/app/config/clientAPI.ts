// app/config/clients.ts
import { ApiClient } from "./api";

// Browser -> Next API (relative path, works in all envs)
export const bffApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
});

// Server (route handlers) -> External API (server-only env var)
// Fallback assumes the Spring backend runs alongside this app (e.g. same
// Docker container/host) rather than pointing at a specific remote server.
export const externalApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_EXT_URL || 'http://localhost:8080'
});
