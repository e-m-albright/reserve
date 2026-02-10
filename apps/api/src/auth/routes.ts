import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { invites, users } from '../db/schema';
import { logger } from '../lib/logger';
import { loginSchema, signupSchema } from '../lib/schemas';
import type { Env } from '../types';
import inviteRoutes from './invite-route';
import { requireAuth } from './middleware';
import { clearAuthCookie, hashPassword, setAuthCookie, signJWT, verifyPassword } from './utils';

const auth = new Hono<{ Bindings: Env }>();

/**
 * POST /api/auth/signup
 * Sign up with invite code
 */
auth.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return c.json({ error: firstError?.message ?? 'Validation failed' }, 400);
    }

    const { email, password, inviteCode } = result.data;
    const db = drizzle(c.env.DB);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .then((rows) => rows[0]);

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Verify invite code
    const invite = await db
      .select()
      .from(invites)
      .where(eq(invites.code, inviteCode.toUpperCase()))
      .limit(1)
      .then((rows) => rows[0]);

    if (!invite) {
      return c.json({ error: 'Invalid invite code' }, 400);
    }

    if (invite.usedBy) {
      return c.json({ error: 'Invite code already used' }, 400);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = nanoid();
    const isAdmin = email.toLowerCase() === c.env.ADMIN_EMAIL.toLowerCase();

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      isAdmin,
    });

    // Mark invite as used
    await db
      .update(invites)
      .set({
        usedBy: userId,
        usedAt: new Date(),
      })
      .where(eq(invites.id, invite.id));

    // Generate JWT
    const token = await signJWT(
      {
        userId,
        email: email.toLowerCase(),
        isAdmin,
      },
      'access',
      c.env.AUTH_SECRET
    );

    // Set cookie
    const response = c.json({
      user: {
        id: userId,
        email: email.toLowerCase(),
        isAdmin,
      },
    });

    setAuthCookie(token, response);

    return response;
  } catch (error) {
    logger.error({ err: error }, 'signup failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return c.json({ error: firstError?.message ?? 'Validation failed' }, 400);
    }

    const { email, password } = result.data;
    const db = drizzle(c.env.DB);

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Generate JWT
    const token = await signJWT(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      'access',
      c.env.AUTH_SECRET
    );

    // Set cookie
    const response = c.json({
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

    setAuthCookie(token, response);

    return response;
  } catch (error) {
    logger.error({ err: error }, 'login failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * GET /api/auth/me
 * Get current user (protected)
 */
auth.get('/me', requireAuth, async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({
    user: {
      id: user.userId,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

/**
 * POST /api/auth/logout
 * Logout (clear cookie)
 */
auth.post('/logout', async (c) => {
  const response = c.json({ message: 'Logged out' });
  clearAuthCookie(response);
  return response;
});

// Invite management routes (admin only)
auth.route('/invites', inviteRoutes);

export default auth;
