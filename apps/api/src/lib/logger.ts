/**
 * Structured JSON logger for Cloudflare Workers
 * Follows pino interface patterns per AGENTS.md
 *
 * Usage:
 *   logger.info({ userId: user.id }, 'user logged in');
 *   logger.error({ err, requestId }, 'request failed');
 *
 * Child logger:
 *   const reqLogger = logger.child({ requestId: crypto.randomUUID() });
 *   reqLogger.info('handling request');
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface Logger {
  debug(context: LogContext, message: string): void;
  debug(message: string): void;
  info(context: LogContext, message: string): void;
  info(message: string): void;
  warn(context: LogContext, message: string): void;
  warn(message: string): void;
  error(context: LogContext, message: string): void;
  error(message: string): void;
  child(context: LogContext): Logger;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function formatError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      type: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  return { raw: String(err) };
}

function createLogger(baseContext: LogContext = {}): Logger {
  // Default to 'info' level - in Workers, env vars are accessed differently
  const minLevel = LOG_LEVELS.info;

  function log(level: LogLevel, contextOrMessage: LogContext | string, message?: string): void {
    if (LOG_LEVELS[level] < minLevel) return;

    let context: LogContext;
    let msg: string;

    if (typeof contextOrMessage === 'string') {
      context = {};
      msg = contextOrMessage;
    } else {
      context = contextOrMessage;
      msg = message ?? '';
    }

    // Process error objects
    const processedContext: LogContext = { ...baseContext };
    for (const [key, value] of Object.entries(context)) {
      if (key === 'err' || key === 'error') {
        processedContext.err = formatError(value);
      } else {
        processedContext[key] = value;
      }
    }

    const logEntry = {
      level,
      time: Date.now(),
      msg,
      ...processedContext,
    };

    // Output structured JSON
    const output = JSON.stringify(logEntry);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  return {
    debug(contextOrMessage: LogContext | string, message?: string) {
      log('debug', contextOrMessage, message);
    },
    info(contextOrMessage: LogContext | string, message?: string) {
      log('info', contextOrMessage, message);
    },
    warn(contextOrMessage: LogContext | string, message?: string) {
      log('warn', contextOrMessage, message);
    },
    error(contextOrMessage: LogContext | string, message?: string) {
      log('error', contextOrMessage, message);
    },
    child(context: LogContext): Logger {
      return createLogger({ ...baseContext, ...context });
    },
  };
}

export const logger = createLogger();
export type { Logger, LogContext };
