const ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';

export function corsHeaders(origin: string | null) {
  const allowed = origin && origin === ORIGIN ? origin : ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  };
}
