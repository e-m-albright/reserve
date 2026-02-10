import type { Context, Next } from 'hono';
import type { Env } from '../types';
import { getAuthToken, verifyJWT } from './utils';

export interface AuthContext {
  userId: string;
  email: string;
  isAdmin: boolean;
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const token = getAuthToken(c.req.raw);

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verifyJWT(token, c.env.AUTH_SECRET);

    // Store user info in context
    c.set('user', {
      userId: payload.userId,
      email: payload.email,
      isAdmin: payload.isAdmin,
    } as AuthContext);

    await next();
  } catch (_error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

/**
 * Optional auth middleware (doesn't fail if no token)
 */
export async function optionalAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const token = getAuthToken(c.req.raw);

  if (token) {
    try {
      const payload = await verifyJWT(token, c.env.AUTH_SECRET);
      c.set('user', {
        userId: payload.userId,
        email: payload.email,
        isAdmin: payload.isAdmin,
      } as AuthContext);
    } catch {
      // Invalid token, continue without auth
    }
  }

  await next();
}
