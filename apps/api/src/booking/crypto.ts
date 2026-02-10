/**
 * Credential encryption utilities using Web Crypto API
 * Encrypts booking site credentials before storing in database
 */

import type { BookingCredentials } from '../lib/schemas';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

/**
 * Derive an encryption key from the auth secret
 */
async function deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt credentials for storage
 * Returns base64 encoded string: salt:iv:ciphertext
 */
export async function encryptCredentials(
  credentials: BookingCredentials,
  secret: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(secret, salt);

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(credentials));

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, data);

  // Combine salt + iv + ciphertext into single buffer
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt credentials from storage
 */
export async function decryptCredentials(
  encrypted: string,
  secret: string
): Promise<BookingCredentials> {
  // Decode base64
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  // Extract salt, iv, and ciphertext
  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(secret, salt);

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}
