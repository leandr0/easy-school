// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PAGES = new Set(['/', '/login', '/signup']);
// API endpoints that should be public (no auth)
const PUBLIC_API = new Set(['/api/security/login']); // add others if needed

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

function getBearer(auth: string | null) {
  return auth && auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isApi = pathname.startsWith('/api/');
  const isPublicPage = PUBLIC_PAGES.has(pathname);
  const isPublicApi = PUBLIC_API.has(pathname);

  // 1) BFF API protection
  if (isApi) {
    // Always let CORS preflight pass
    if (req.method === 'OPTIONS') return NextResponse.next();
    if (isPublicApi) return NextResponse.next();

    // Accept cookie token or Authorization header (for server→BFF)
    const cookieToken = req.cookies.get('user')?.value || '';
    const bearer = getBearer(req.headers.get('authorization'));
    const token = cookieToken || bearer;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      await jwtVerify(token, secret, { issuer: 'easy-school', audience: 'web' });
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 2) Page protection (redirect to /login if not authenticated)
  if (isPublicPage) return NextResponse.next();

  const pageToken = req.cookies.get('user')?.value;
  if (!pageToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(pageToken, secret, { issuer: 'easy-school', audience: 'web' });
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    // Protect all app pages except public + static
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|map)).*)',
    // Protect ALL /api routes (we allowlist the few public ones inside the middleware)
    '/api/:path*',
  ],
};
