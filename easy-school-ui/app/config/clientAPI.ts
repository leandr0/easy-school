// app/config/clients.ts
import { ApiClient } from "./api";

// Browser -> Next API (relative path, works in all envs)
export const browserApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://129.148.62.1:3000/api'
});

// Server (route handlers) -> External API (server-only env var)
export const externalApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_EXT_URL || 'http://129.148.62.1:8080'
});
