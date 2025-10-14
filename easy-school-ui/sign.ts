// sign.ts (unchanged)
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { UserLoginModel, UserModel } from './app/lib/definitions/user_definitions';
import { extractRoleNames } from './app/lib/helpers/role';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

type ProfileType = "student" | "teacher" | "none";

export type JwtClaims = JWTPayload & {
  sub: string;                 // user id
  username: string;            // login/email
  roles: string[];             // role names
  profile_id?: string | null;  // id of student/teacher entity (if any)
  profile_type: string | null;   // which profile is active
  ver?: number;                // optional versioning for token rotation
};

export async function generateJwtToken(user: UserLoginModel) {
  const profile_type =  user.profile_type;
  const profile_id = user.profile_id;

  
  

  const claims: JwtClaims = {
    sub: String(user.id),
    username: user.username,
    roles: extractRoleNames(user),
    profile_id,
    profile_type,
    ver: 1, // optional: bump when you rotate keys / change claim shape
    iss: "easy-school",
    aud: "web",
  };

  return await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuer("easy-school")
    .setAudience("web")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJwtToken(token: string) {
  const { payload } = await jwtVerify<JwtClaims>(token, secret, {
    issuer: "easy-school",
    audience: "web",
  });
  return payload;
}

function deriveProfile(user: UserModel): { profile_id: string | null; profile_type: ProfileType } {
  
  if (user.student?.id) {
    return { profile_id: String(user.student.id), profile_type: "student" };
  }
  if (user.teacher?.id) {
    return { profile_id: String(user.teacher.id), profile_type: "teacher" };
  }
  return { profile_id: null, profile_type: "none" };
}