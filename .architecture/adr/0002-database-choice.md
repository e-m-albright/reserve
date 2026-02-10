# ADR 0002: Database Choice

**Status:** Accepted
**Date:** 2026-02-09
**Decision Makers:** Project team

## Context

The application needs persistent storage for users, invites, booking requests, and logs. Requirements:
- Low latency for edge deployment
- Simple operational model (no separate database server)
- Type-safe queries in TypeScript
- Migration support for schema evolution

## Decision

Use **Drizzle ORM** with **Cloudflare D1** (SQLite):

1. **Drizzle ORM** for database operations
   - Type-safe schema definition
   - Auto-generated Zod schemas via drizzle-zod
   - Lightweight, edge-compatible

2. **Cloudflare D1** for storage
   - SQLite at the edge (low latency)
   - Included in Workers platform (no separate service)
   - Automatic replication and backups

3. **Schema patterns**
   - UUID primary keys (text type)
   - Timestamps as integers (Unix epoch)
   - JSON stored as text columns with application-level parsing

## Alternatives Considered

### PostgreSQL (Neon, Supabase)
- **Pros:** Full SQL features, JSON columns, more mature tooling
- **Cons:** External service, connection overhead from edge, higher cost

### PlanetScale (MySQL)
- **Pros:** Serverless MySQL, good scaling
- **Cons:** External dependency, no foreign keys in serverless mode

### Turso (libSQL)
- **Pros:** SQLite-compatible, edge replicas
- **Cons:** Additional service to manage, less integrated with Cloudflare

### Drizzle vs Prisma
- **Prisma:** More features, larger bundle, query engine overhead
- **Drizzle:** Lighter weight, better edge compatibility, simpler mental model

## Consequences

### Positive
- Zero cold start from database connections
- Type safety from schema to query results
- Schema and validation in single source of truth (drizzle-zod)
- No external database service to manage

### Negative
- SQLite limitations (no JSONB, limited concurrent writes)
- D1 is still maturing (some features in beta)
- Less ecosystem tooling compared to PostgreSQL

### Risks
- D1 scaling limits for high-write workloads (acceptable for current use case)
- Migration tooling less mature than Prisma

## Implementation Notes

```typescript
// Schema definition with drizzle-zod integration
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  // ...
});

// Auto-generated Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
```

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [drizzle-zod](https://orm.drizzle.team/docs/zod)
