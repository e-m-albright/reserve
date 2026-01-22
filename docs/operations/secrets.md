---
title: Cloudflare Secrets Management
---

# Cloudflare Secrets Management

## Overview

For Cloudflare Workers, we use **`.dev.vars`** for local development and **Wrangler secrets** for production. This is the recommended approach, not `.env.local`.

## Local Development

### Using `.dev.vars`

Create `.dev.vars` files in each Worker directory (not `.env.local`):

```bash
# apps/api/.dev.vars
AUTH_SECRET=your-local-secret-here
ADMIN_EMAIL=admin@example.com
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# apps/automation/.dev.vars
AUTH_SECRET=your-local-secret-here
```

**Important**:
- `.dev.vars` is automatically loaded by Wrangler during `wrangler dev`
- These files are gitignored (never commit secrets!)
- Use `.dev.vars.<environment>` for environment-specific vars

### Environment-Specific Files

```bash
.dev.vars              # Default local dev
.dev.vars.staging      # Staging environment
.dev.vars.production   # Production environment
```

## Production Secrets

### Setting Secrets with Wrangler

```bash
# Set a secret for production
cd apps/api
wrangler secret put AUTH_SECRET

# Set a secret for a specific environment
wrangler secret put AUTH_SECRET --env staging

# List secrets (names only, not values)
wrangler secret list
```

**Important**:
- Secrets are encrypted and stored securely
- Once set, values cannot be retrieved (only updated/deleted)
- Secrets are scoped to each Worker/environment

## Cloudflare API Token Setup

### Required Permissions

For this project, you need a **Custom API Token** with permissions for:

1. **Cloudflare Workers** - Deploy and manage Workers
2. **Cloudflare D1** - Create and manage databases
3. **Cloudflare R2** - Create and manage buckets
4. **Cloudflare Queues** - Create and manage queues
5. **Cloudflare Pages** - Deploy Pages projects (if using Pages)

### Creating the Token

1. Go to [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Click **"Create Custom Token"**
4. Configure permissions:

   **Account Permissions:**
   - **Workers Scripts**: Edit
   - **Workers KV Storage**: Edit
   - **D1**: Edit
   - **R2**: Edit
   - **Queues**: Edit
   - **Pages**: Edit (if deploying to Pages)
   - **Account Settings**: Read (for account ID)

   **Zone Permissions** (if using custom domains):
   - **DNS**: Edit (if managing DNS records)
   - **Zone Settings**: Read

5. **Account Resources**: Select your account
6. **Client IP Address Filtering**: Optional (recommended for security)
7. **TTL**: Set expiration (or leave blank for no expiration)
8. Click **"Continue to summary"** → **"Create Token"**

### Using the Token

Add the token to your `.dev.vars` files:

```bash
# apps/api/.dev.vars
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_API_TOKEN=your-api-token-here
```

**Security Notes:**
- Never commit API tokens to git
- Use different tokens for development and production
- Rotate tokens regularly
- Use IP filtering when possible

See [Cloudflare API Token Setup](../getting-started/cloudflare-token.md) for detailed token creation instructions.

## Cloudflare Secrets Store (Beta) - For Shared Secrets

If you have secrets shared across multiple Workers, use Secrets Store:

```bash
# Create a secrets store
wrangler secrets-store store create shared-secrets

# Add a secret to the store
wrangler secrets-store secret create <store-id> AUTH_SECRET

# Bind to Worker in wrangler.toml
secrets_store_secrets = ["AUTH_SECRET"]
```

## Accessing Secrets in Code

```typescript
// In your Worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Access via env object
    const authSecret = env.AUTH_SECRET;
    const adminEmail = env.ADMIN_EMAIL;
    
    // Use the secrets...
  }
}

// Type definition
interface Env {
  AUTH_SECRET: string;
  ADMIN_EMAIL: string;
  DB: D1Database;
  // ...
}
```

## Migration from .env.local

1. **Create `.dev.vars` files** in each Worker directory
2. **Copy values** from `.env.local` to appropriate `.dev.vars` files
3. **Set production secrets** using `wrangler secret put`
4. **Remove `.env.local`** (or keep it for Next.js frontend if needed)

## Best Practices

1. ✅ **Never commit `.dev.vars`** - Already in `.gitignore`
2. ✅ **Use different secrets per environment** - Don't reuse prod secrets in dev
3. ✅ **Rotate secrets regularly** - Especially if compromised
4. ✅ **Use Secrets Store for shared secrets** - Avoid duplication
5. ✅ **Document required secrets** - In README or setup docs
6. ❌ **Don't use `vars` in wrangler.toml for secrets** - They're unencrypted
7. ❌ **Don't hardcode secrets in code** - Always use env variables

## Required Secrets

### API Worker (`apps/api/.dev.vars`)

```bash
# JWT signing secret - use a long, random string (at least 32 characters)
# Generate with: openssl rand -hex 32
# Or: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=your-random-secret-here-minimum-32-chars

# Admin user email - your email address for admin access
ADMIN_EMAIL=your-email@example.com

# Cloudflare credentials (from dashboard)
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_API_TOKEN=your-api-token-here
```

**AUTH_SECRET**:
- Used for signing and verifying JWTs
- Should be a long, random, cryptographically secure string
- Minimum 32 characters recommended
- Generate with: `openssl rand -hex 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Never share or commit this value**

**ADMIN_EMAIL**:
- Your email address for admin access
- Used to identify the first admin user
- Can be any valid email address you control

### Automation Worker (`apps/automation/.dev.vars`)

```bash
# Same AUTH_SECRET as API worker (for JWT verification if needed)
AUTH_SECRET=your-random-secret-here-minimum-32-chars
```

**Notes**:
- **Same AUTH_SECRET**: Use the same value as the API worker so both can verify JWTs
- **No Cloudflare API credentials needed**: The automation worker doesn't need `CLOUDFLARE_ACCOUNT_ID` or `CLOUDFLARE_API_TOKEN` for local dev
  - D1 and R2 are accessed via bindings (configured in `wrangler.toml`)
  - Queue consumption is handled by Wrangler automatically
  - API tokens are only needed for deploying/managing resources, not for runtime access

### Next.js Frontend (`.env.local` - OK for frontend)
```
NEXT_PUBLIC_API_URL=http://localhost:8787
# Frontend can use .env.local for public env vars
```

## Setup Script

Add to `justfile`:
```bash
# Create .dev.vars template files
setup-secrets:
    @if [ ! -f apps/api/.dev.vars ]; then \
        echo "AUTH_SECRET=change-me" > apps/api/.dev.vars; \
        echo "ADMIN_EMAIL=admin@example.com" >> apps/api/.dev.vars; \
        echo "✅ Created apps/api/.dev.vars template"; \
    fi
    @if [ ! -f apps/automation/.dev.vars ]; then \
        echo "AUTH_SECRET=change-me" > apps/automation/.dev.vars; \
        echo "✅ Created apps/automation/.dev.vars template"; \
    fi
```
