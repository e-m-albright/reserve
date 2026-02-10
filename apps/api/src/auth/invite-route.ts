import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { generateInviteCode } from '../cli/invite';
import { invites } from '../db/schema';
import { logger } from '../lib/logger';
import type { Env } from '../types';
import { requireAuth } from './middleware';

/**
 * Admin-only route to generate invite codes
 * POST /api/auth/invites
 */
const inviteRoutes = new Hono<{ Bindings: Env }>();

inviteRoutes.post('/', requireAuth, async (c) => {
  const user = c.get('user');

  if (!user || !user.isAdmin) {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }

  try {
    const db = drizzle(c.env.DB);
    const code = generateInviteCode();
    const inviteId = nanoid();

    await db.insert(invites).values({
      id: inviteId,
      code,
      createdBy: user.userId,
    });

    return c.json({
      invite: {
        id: inviteId,
        code,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'invite generation failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default inviteRoutes;
