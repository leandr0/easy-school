import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import type { User, UserField } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { authConfig } from 'auth.config';
import { encrypt,comparePasswords,getKey } from './app/lib/session';
import { login } from './app/services/security/loginService';
import { UserModel } from './app/lib/definitions/user_definitions';



// Function to compare password using bcrypt
export async function loginUser(email: string, password: string): Promise<UserModel | undefined> {
  // Fetch the user based on email
  const user = await login(email,password);

  if (user) {
    console.log('Password matched');
    return user;
  } else {
    console.error('Password does not match');
    return undefined;
  }
}
