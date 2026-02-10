# ADR 0003: API Framework

**Status:** Accepted
**Date:** 2026-02-09
**Decision Makers:** Project team

## Context

The backend API needs a framework for:
- HTTP routing and middleware
- Request/response handling
- Integration with Cloudflare Workers runtime
- Type-safe request handling

## Decision

Use **Hono** framework deployed on **Cloudflare Workers**:

1. **Hono** for HTTP framework
   - Ultralight (~14KB), designed for edge
   - Express-like API (familiar patterns)
   - Built-in middleware ecosystem
   - First-class TypeScript support

2. **Cloudflare Workers** for runtime
   - Global edge deployment
   - Integrated with D1, R2, Queues
   - Pay-per-request pricing
   - No cold starts (V8 isolates)

3. **Middleware stack**
   - Request logging (custom, with timing)
   - CORS handling (hono/cors)
   - Error handling (custom AppError classes)
   - Auth middleware (JWT validation)

## Alternatives Considered

### Express.js on Node.js
- **Pros:** Most popular, huge ecosystem
- **Cons:** Not edge-native, requires Node.js runtime

### Fastify on Node.js
- **Pros:** Fast, good TypeScript, validation built-in
- **Cons:** Not designed for edge, heavier than needed

### itty-router
- **Pros:** Extremely minimal, Workers-native
- **Cons:** Less middleware ecosystem, fewer features

### AWS Lambda + API Gateway
- **Pros:** Mature, good tooling
- **Cons:** Cold starts, more complex deployment, vendor lock-in

### Hono on other runtimes (Deno, Bun)
- **Pros:** Hono is multi-runtime
- **Cons:** Cloudflare ecosystem integration (D1, R2, Queues) is compelling

## Consequences

### Positive
- Sub-millisecond cold starts (V8 isolates)
- Global edge deployment with single deploy command
- Tight integration with Cloudflare services
- Familiar Express-like patterns reduce learning curve

### Negative
- Workers runtime constraints (no Node.js APIs)
- 1MB compressed script limit (manageable)
- Cloudflare-specific bindings in code

### Risks
- Vendor lock-in to Cloudflare (mitigated by Hono's multi-runtime support)
- Less community support compared to Express

## Implementation Notes

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestLogger } from './middleware/request-logger';

const app = new Hono<{ Bindings: Env }>();

app.use('*', requestLogger);
app.use('/*', cors());
app.route('/api/auth', authRoutes);

export default app;
```

## References

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
