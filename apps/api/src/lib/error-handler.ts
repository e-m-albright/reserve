import type { Context } from 'hono';
import { AppError } from './errors';
import { logger } from './logger';

/**
 * Handle API errors and return appropriate JSON response
 * Per AGENTS.md API Error Handler pattern
 */
export function handleApiError(c: Context, error: unknown) {
  if (error instanceof AppError) {
    return c.json({ error: { code: error.code, message: error.message } }, error.statusCode as 400);
  }

  logger.error({ err: error }, 'unexpected error');
  return c.json(
    { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
    500
  );
}
