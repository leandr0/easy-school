// verify.ts (using jose)
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: 'easy-school',
    audience: 'web',
  });
  // Return only what you expect to use
  return {
    id: String(payload.sub),
    username: String(payload.username),
    roles: (payload.role),
  };
}
