// bff/env.ts
import 'server-only';

export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_EXT_URL ?? 'http://129.148.62.1:8080',
  API_TIMEOUT_MS: Number(process.env.API_TIMEOUT ?? 8000),
  API_RETRIES: Number(process.env.API_RETRIES ?? 1),
  API_TOKEN: process.env.API_TOKEN ?? '',

  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
