---
title: Configuration
---

# Configuration

Configuration guide for Reserve project.

## Environment Variables

### Cloudflare Workers

Workers use `.dev.vars` files for local development:

**Location**: `apps/api/.dev.vars` and `apps/automation/.dev.vars`

```bash
# apps/api/.dev.vars
AUTH_SECRET=your-local-jwt-secret
ADMIN_EMAIL=admin@example.com
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

See [Secrets Management](../operations/secrets.md) for production secrets.

### Next.js Frontend

Frontend uses `.env.local` for public environment variables:

**Location**: `.env.local` (root)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Wrangler Configuration

Workers are configured via `wrangler.toml`:

- `apps/api/wrangler.toml` - API worker config
- `apps/automation/wrangler.toml` - Automation worker config

Update database IDs after creating D1 databases:

```toml
[[d1_databases]]
binding = "DB"
database_name = "reserve"
database_id = "your-actual-database-id"
```

## Next.js Configuration

Frontend configuration in `apps/web/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

module.exports = nextConfig;
```

## TypeScript Configuration

TypeScript configs:
- Root: `tsconfig.json` (base config)
- Apps: `apps/*/tsconfig.json` (extends root)
- Packages: `packages/*/tsconfig.json` (extends root)

## Database Configuration

Database migrations and schema:
- Schema: `apps/api/src/db/schema.ts`
- Config: `apps/api/drizzle.config.ts`
- Migrations: `apps/api/migrations/`

## See Also

- [Secrets Management](../operations/secrets.md) - Managing secrets securely
- [Setup Guide](./setup.md) - Complete setup instructions
