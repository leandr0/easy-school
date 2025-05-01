import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import type { User, UserField } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { authConfig } from 'auth.config';
import { encrypt,comparePasswords,getKey } from './app/lib/session';

// Function to fetch the user from the database
async function getUser(email: string): Promise<UserField | undefined> {
  try {
    const user = await sql<UserField>`
    SELECT pres.id,pres.name,pres.email,us.password, pres.cpf
    FROM users us
    INNER JOIN prestador pres
    ON pres.user_id = us.id
    WHERE us.email = ${email}
    AND us.active IS true`;

    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Function to compare password using bcrypt
export async function loginUser(email: string, password: string): Promise<UserField | undefined> {
  // Fetch the user based on email
  const user = await getUser(email);

  // Ensure the user exists and has a valid password
  if (!user || !user.password) {
    console.error('User not found or password is missing.');
    return undefined;
  }

  console.log('Password from database:', user.password);

  // Compare the plaintext password with the hashed password stored in the database
  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    console.log('Password matched');
    return user;
  } else {
    console.error('Password does not match');
    return undefined;
  }
}
