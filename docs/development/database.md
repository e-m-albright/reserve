---
title: Database Setup and Migrations
---

# Database Setup and Migrations

## Local Development

For local development, we use **Wrangler's local D1 emulation** which creates a SQLite database file.

### First Time Setup

1. **Start Wrangler dev server** (creates local D1 database):
   ```bash
   just dev-api
   # or
   cd apps/api && wrangler dev
   ```
   
   This creates the local database at:
   ```
   apps/api/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/reserve.sqlite
   ```

2. **Generate migrations** from your schema:
   ```bash
   just db-generate
   # or
   pnpm --filter api db:generate
   ```

3. **Apply migrations**:
   ```bash
   just db-migrate
   # or
   pnpm --filter api db:migrate
   ```

### Schema Changes Workflow

1. Edit `apps/api/src/db/schema.ts`
2. Generate migration: `just db-generate`
3. Review the migration file in `apps/api/migrations/`
4. Apply migration: `just db-migrate`

## Cloudflare D1 (Production)

For production, you'll use Cloudflare D1 via HTTP API.

### Configuration

Update `apps/api/drizzle.config.ts` to use D1 HTTP API:

```typescript
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
```

### Commands

- `just db-generate` - Generate migrations from schema
- `just db-migrate` - Apply migrations to database
- `just db-studio` - Open Drizzle Studio (database GUI)

## Drizzle Studio

View and edit your database with a GUI:

```bash
just db-studio
# or
pnpm --filter api db:studio
```

This opens a web interface at `http://localhost:4983` (or similar port).

## Troubleshooting

### "Database file not found" errors

Run `wrangler dev` once to create the local database file, then try migrations again.

### Migration errors

- Check that your schema changes are valid
- Review the generated migration SQL file
- For production, ensure your Cloudflare credentials are set correctly
