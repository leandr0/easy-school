// sign.ts (unchanged)
import { SignJWT } from 'jose';
import { UserModel } from './app/lib/definitions/user_definitions';
import { extractRoleNames } from './app/lib/helpers/role';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JwtClaims = {
  sub: string;
  username: string;
  roles: string[];
  ver?: number;
};

export async function generateJwtToken(user: UserModel) {
  const claims: JwtClaims = {
    sub: String(user.id),
    username: user.username!,   
    roles: extractRoleNames(user), // ensure this exists
  };

  return await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuer('easy-school')
    .setAudience('web')
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}
