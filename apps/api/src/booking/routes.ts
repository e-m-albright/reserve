import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import type { AuthContext } from '../auth/middleware';
import { requireAuth } from '../auth/middleware';
import { bookingRequests } from '../db/schema';
import { logger } from '../lib/logger';
import { createBookingRequestSchema, updateBookingRequestSchema } from '../lib/schemas';
import type { Env } from '../types';
import { encryptCredentials } from './crypto';

const booking = new Hono<{ Bindings: Env }>();

// All routes require auth
booking.use('*', requireAuth);

/**
 * GET /api/booking-requests
 * List user's booking requests (or all for admin)
 */
booking.get('/', async (c) => {
  try {
    const user = c.get('user') as AuthContext;
    const db = drizzle(c.env.DB);

    const whereClause = user.isAdmin ? undefined : eq(bookingRequests.userId, user.userId);

    const requests = await db
      .select({
        id: bookingRequests.id,
        status: bookingRequests.status,
        criteria: bookingRequests.criteria,
        result: bookingRequests.result,
        error: bookingRequests.error,
        createdAt: bookingRequests.createdAt,
        updatedAt: bookingRequests.updatedAt,
        userId: bookingRequests.userId,
      })
      .from(bookingRequests)
      .where(whereClause)
      .orderBy(desc(bookingRequests.createdAt))
      .limit(100);

    // Parse JSON fields
    const parsed = requests.map((r) => ({
      ...r,
      criteria: JSON.parse(r.criteria),
      result: r.result ? JSON.parse(r.result) : null,
    }));

    return c.json({ requests: parsed });
  } catch (error) {
    logger.error({ err: error }, 'list booking requests failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * GET /api/booking-requests/:id
 * Get a specific booking request
 */
booking.get('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthContext;
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);

    const request = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!request) {
      return c.json({ error: 'Booking request not found' }, 404);
    }

    // Check ownership unless admin
    if (!user.isAdmin && request.userId !== user.userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    return c.json({
      request: {
        id: request.id,
        status: request.status,
        criteria: JSON.parse(request.criteria),
        result: request.result ? JSON.parse(request.result) : null,
        error: request.error,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        userId: request.userId,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'get booking request failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * POST /api/booking-requests
 * Create a new booking request
 */
booking.post('/', async (c) => {
  try {
    const user = c.get('user') as AuthContext;
    const body = await c.req.json();
    const result = createBookingRequestSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return c.json({ error: firstError?.message ?? 'Validation failed' }, 400);
    }

    const { criteria, credentials } = result.data;
    const db = drizzle(c.env.DB);

    // Encrypt credentials before storing
    const encryptedCredentials = await encryptCredentials(credentials, c.env.AUTH_SECRET);

    const requestId = nanoid();
    const now = new Date();

    await db.insert(bookingRequests).values({
      id: requestId,
      userId: user.userId,
      status: 'pending',
      criteria: JSON.stringify(criteria),
      credentials: encryptedCredentials,
      createdAt: now,
      updatedAt: now,
    });

    // Queue for processing (if queue is available)
    try {
      await c.env.BOOKING_QUEUE.send({
        requestId,
        action: 'process',
      });
    } catch (queueError) {
      logger.warn({ err: queueError, requestId }, 'failed to queue booking request');
      // Continue - the request is saved, just not queued
    }

    return c.json(
      {
        request: {
          id: requestId,
          status: 'pending',
          criteria,
          createdAt: now,
          updatedAt: now,
        },
      },
      201
    );
  } catch (error) {
    logger.error({ err: error }, 'create booking request failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * PUT /api/booking-requests/:id
 * Update a booking request (only pending requests can be updated)
 */
booking.put('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthContext;
    const id = c.req.param('id');
    const body = await c.req.json();
    const result = updateBookingRequestSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return c.json({ error: firstError?.message ?? 'Validation failed' }, 400);
    }

    const db = drizzle(c.env.DB);

    // Get existing request
    const existing = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!existing) {
      return c.json({ error: 'Booking request not found' }, 404);
    }

    // Check ownership unless admin
    if (!user.isAdmin && existing.userId !== user.userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Only pending requests can be updated (unless admin is changing status)
    if (existing.status !== 'pending' && !user.isAdmin) {
      return c.json({ error: 'Only pending requests can be updated' }, 400);
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (result.data.criteria) {
      updates.criteria = JSON.stringify(result.data.criteria);
    }

    if (result.data.status && user.isAdmin) {
      updates.status = result.data.status;
    }

    await db.update(bookingRequests).set(updates).where(eq(bookingRequests.id, id));

    return c.json({ message: 'Updated' });
  } catch (error) {
    logger.error({ err: error }, 'update booking request failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * DELETE /api/booking-requests/:id
 * Cancel/delete a booking request (only pending requests)
 */
booking.delete('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthContext;
    const id = c.req.param('id');
    const db = drizzle(c.env.DB);

    // Get existing request
    const existing = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!existing) {
      return c.json({ error: 'Booking request not found' }, 404);
    }

    // Check ownership unless admin
    if (!user.isAdmin && existing.userId !== user.userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Only pending requests can be deleted (unless admin)
    if (existing.status !== 'pending' && !user.isAdmin) {
      return c.json({ error: 'Only pending requests can be deleted' }, 400);
    }

    await db.delete(bookingRequests).where(eq(bookingRequests.id, id));

    return c.json({ message: 'Deleted' });
  } catch (error) {
    logger.error({ err: error }, 'delete booking request failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default booking;
