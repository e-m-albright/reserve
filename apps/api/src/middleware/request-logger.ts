import type { Context, Next } from 'hono';
import type { AuthContext } from '../auth/middleware';
import { type Logger, logger } from '../lib/logger';
import type { Env } from '../types';

/**
 * Request logging middleware for Hono
 * Per AGENTS.md: Centralized request logging with timing
 *
 * Adds requestId to context and logs request completion with duration.
 */

declare module 'hono' {
  interface ContextVariableMap {
    requestId: string;
    logger: Logger;
    user: AuthContext;
  }
}

export async function requestLogger(c: Context<{ Bindings: Env }>, next: Next) {
  const requestId = crypto.randomUUID();
  const start = performance.now();
  const reqLogger = logger.child({ requestId });

  // Make logger available to route handlers
  c.set('requestId', requestId);
  c.set('logger', reqLogger);

  // Add request ID to response headers for tracing
  c.header('X-Request-ID', requestId);

  try {
    await next();
  } finally {
    const duration = Math.round(performance.now() - start);
    const status = c.res.status;

    // Log at appropriate level based on status code
    const logData = {
      method: c.req.method,
      path: c.req.path,
      status,
      duration,
      userAgent: c.req.header('user-agent'),
    };

    if (status >= 500) {
      reqLogger.error(logData, 'request completed');
    } else if (status >= 400) {
      reqLogger.warn(logData, 'request completed');
    } else {
      reqLogger.info(logData, 'request completed');
    }
  }
}
