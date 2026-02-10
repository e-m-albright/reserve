import { SignJWT, jwtVerify } from 'jose';

// JWT configuration
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
const COOKIE_NAME = 'auth-token';

export interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  type: 'access' | 'refresh';
}

/**
 * Hash password using Web Crypto API (PBKDF2)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );

  // Combine salt and hash for storage
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const saltArray = Array.from(salt);
  return `${Array.from(saltArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}:${hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, hashHex] = hash.split(':');
  if (!saltHex || !hashHex) return false;

  const saltBytes = saltHex.match(/.{1,2}/g);
  if (!saltBytes) return false;

  const salt = Uint8Array.from(saltBytes.map((byte) => Number.parseInt(byte, 16)));

  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const computedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return computedHash === hashHex;
}

/**
 * Sign JWT token
 */
export async function signJWT(
  payload: Omit<JWTPayload, 'type'>,
  type: 'access' | 'refresh',
  secret: string
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);

  const jwt = await new SignJWT({
    ...payload,
    type,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(type === 'access' ? ACCESS_TOKEN_EXPIRY : REFRESH_TOKEN_EXPIRY)
    .sign(secretKey);

  return jwt;
}

/**
 * Verify JWT token
 */
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const secretKey = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ['HS256'],
  });

  return payload as unknown as JWTPayload;
}

/**
 * Set auth cookie on response
 */
export function setAuthCookie(token: string, response: Response, isRefresh = false): void {
  const maxAge = isRefresh ? 60 * 60 * 24 * 7 : 60 * 15; // 7 days or 15 minutes

  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`
  );
}

/**
 * Get auth token from cookie
 */
export function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const authCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!authCookie) return null;

  return authCookie.split('=')[1] || null;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(response: Response): void {
  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
  );
}
