# ADR 0005: Logging Strategy

**Status:** Accepted
**Date:** 2026-02-09
**Decision Makers:** Project team

## Context

The application needs consistent, structured logging for:
- Debugging and troubleshooting
- Request tracing across services
- Performance monitoring
- Security auditing

Constraints:
- Cloudflare Workers doesn't support Node.js pino directly
- Logs need to be structured (JSON) for log aggregation
- Request context (IDs, timing) needed for tracing

## Decision

Implement **custom structured logger** following pino interface patterns:

1. **Logger interface** matching pino API
   - `debug()`, `info()`, `warn()`, `error()` methods
   - Context object + message signature
   - `child()` for scoped loggers

2. **Structured JSON output**
   - Timestamp, level, message, context fields
   - Error serialization with stack traces
   - Consistent format across all services

3. **Request logging middleware**
   - Auto-generate request IDs (UUID)
   - Measure request duration
   - Log at appropriate level based on status code
   - Inject logger into request context

4. **Log levels by status code**
   - 5xx: error
   - 4xx: warn
   - 2xx/3xx: info

## Alternatives Considered

### pino directly
- **Pros:** Battle-tested, extensive features
- **Cons:** Node.js dependencies don't work in Workers

### console.log everywhere
- **Pros:** Zero setup
- **Cons:** No structure, no context, hard to parse

### Third-party logging service SDK
- **Pros:** Built-in aggregation, alerting
- **Cons:** External dependency, vendor lock-in, cost

### Workers-specific logging (wrangler tail)
- **Pros:** Built into platform
- **Cons:** Limited structure, no persistence

## Consequences

### Positive
- Consistent log format across all services
- Request tracing via request IDs
- Performance visibility via duration tracking
- pino-compatible interface (easy migration if needed)

### Negative
- Custom implementation to maintain
- No log levels configurable at runtime (would need env var support)
- Console output only (need external aggregation)

### Risks
- Log volume in production (mitigate with appropriate log levels)
- Missing pino features (add as needed)

## Implementation Notes

```typescript
// Logger usage
import { logger } from '../lib/logger';

logger.info({ userId: user.id }, 'user logged in');
logger.error({ err: error, requestId }, 'request failed');

// Child logger with context
const reqLogger = logger.child({ requestId: crypto.randomUUID() });
reqLogger.info('handling request');

// Request logging middleware output
{
  "level": "info",
  "time": 1707523200000,
  "msg": "request completed",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/auth/login",
  "status": 200,
  "duration": 45
}
```

## Future Considerations

- Add log shipping to external service (Axiom, Datadog)
- Runtime log level configuration via environment variable
- Structured error codes for alerting rules

## References

- [pino API](https://getpino.io/)
- [Cloudflare Workers Logging](https://developers.cloudflare.com/workers/observability/logs/)
- AGENTS.md logging patterns
