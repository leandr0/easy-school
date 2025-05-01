// Utility function to convert strings to ArrayBuffer
const textEncoder = new TextEncoder();
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { UserField } from './definitions';
const ENCRYPTION_KEY = 'K4fJmvZJYk3FXYdZ1QEnu7EZzX8Zri1PxAbLOMFFUP8='; 

const JWT_SECRET = process.env.JWT_SECRET || 'zcffHBNq4d2zxvOTiJ2r/PzSq45CGEnzapG12Qdc0lk='; // Store this securely

// Function to generate a JWT token
export function generateJwtToken(user: UserField): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf
      
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export const getServerSideProps = async (context:any) => {
  const { req } = context;

  // Parse cookies from the request headers
  const cookies = parse(req.headers.cookie || '');

  // Get the user token from the cookie
  const token = cookies.user;

  let user = null;

  // If a token exists, verify it
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET); // Verify the token with the secret
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  // Pass the user object to the page component via props
  return {
    props: { user },
  };
};

// Utility function to decode base64 and convert it to an ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}


// Helper function to import the AES-GCM key
export async function getKey(): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(ENCRYPTION_KEY); // Convert base64 to ArrayBuffer

  return await crypto.subtle.importKey(
    "raw",
    keyBuffer, // Pass the key as an ArrayBuffer
    { name: "AES-GCM" }, // Specify AES-GCM
    false, // Non-extractable key
    ["encrypt", "decrypt"] // Allow encryption and decryption
  );
}


/**
 * Encrypts a given JSON object using Web Crypto API.
 * @param jsonObj - The JSON object to encrypt.
 * @returns {Promise<string>} - The encrypted data as a base64-encoded string.
 */
export async function encrypt(data: object | string): Promise<string> {

  const jsonObj = typeof data === 'string' ? { value: data } : data;
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM IV
  const key = await getKey(); // Get encryption key
  const encodedPassword = new TextEncoder().encode(JSON.stringify(jsonObj));

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedPassword
  );

  // Return a string containing the IV and encrypted password, separated by a colon
  return `${bufferToBase64(iv)}:${bufferToBase64(encryptedData)}`;
}

export async function comparePasswords(plaintextPassword: string, storedPassword: string): Promise<boolean> {
  const [storedIvBase64, storedEncryptedPasswordBase64] = storedPassword.split(':');
  
  // Convert stored IV and encrypted password from base64 to ArrayBuffer
  const storedIv = base64ToArrayBuffer(storedIvBase64);
  const storedEncryptedPassword = base64ToArrayBuffer(storedEncryptedPasswordBase64);

  // Encrypt the incoming plaintext password using the same IV
  const key = await getKey(); // Get the encryption key
  const encodedPassword = new TextEncoder().encode(plaintextPassword);

  const encryptedPassword = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: storedIv },
    key,
    encodedPassword
  );

  // Convert the result to base64 for comparison
  const encryptedPasswordBase64 = bufferToBase64(encryptedPassword);

  // Compare the encrypted version of the input password to the stored one
  return encryptedPasswordBase64 === storedEncryptedPasswordBase64;
}

/**
 * Decrypts an encrypted string into a JSON object.
 * @param encryptedData - The encrypted base64-encoded string to decrypt.
 * @returns {Promise<object>} - The decrypted JSON object.
 */
// Updated function to decrypt data using AES-GCM
export async function decrypt(encryptedData: string): Promise<object> {
  const [ivBase64, encryptedBase64] = encryptedData.split(':');
  const iv = base64ToArrayBuffer(ivBase64);
  const encryptedArrayBuffer = base64ToArrayBuffer(encryptedBase64);
  const key = await getKey();

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedArrayBuffer
  );

  return JSON.parse(new TextDecoder().decode(decryptedData));
}



// Helper functions for base64 encoding/decoding
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
