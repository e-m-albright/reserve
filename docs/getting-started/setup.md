---
title: Setup Guide
---

# Setup Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   
   For **Cloudflare Workers** (API and Automation), use `.dev.vars` files:
   ```bash
   # Create .dev.vars files (templates created by 'just setup')
   # Edit apps/api/.dev.vars with your secrets
   # Edit apps/automation/.dev.vars with your secrets
   ```
   
   For **Next.js frontend**, use `.env.local`:
   ```bash
   # .env.local is for Next.js public env vars only
   NEXT_PUBLIC_API_URL=http://localhost:8787
   ```
   
   See [CLOUDFLARE_SECRETS.md](./CLOUDFLARE_SECRETS.md) for details.

3. **Set up Cloudflare resources:**
   
   First, get your Cloudflare Account ID and API token from the Cloudflare dashboard.
   
   Then, create the D1 database and R2 bucket:
   ```bash
   # Using Wrangler CLI
   wrangler d1 create reserve
   wrangler r2 bucket create reserve-logs
   wrangler queues create booking-queue
   ```
   
   Update the IDs in `apps/api/wrangler.toml` and `apps/automation/wrangler.toml` with the actual database IDs.

4. **Run database migrations:**
   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development:**
   ```bash
   # From root
   pnpm dev  # Starts Next.js frontend
   
   # In separate terminals:
   cd apps/api && pnpm dev  # Starts API worker
   cd apps/automation && pnpm dev  # Starts automation worker
   ```

## Infrastructure Deployment

Deploy infrastructure with Pulumi:

```bash
cd infra
pulumi login  # First time only
pulumi stack init dev
pulumi config set cloudflare:accountId YOUR_ACCOUNT_ID
pulumi up
```

## Local Development Notes

- For local D1 development, use `wrangler d1 execute reserve --local --file=./schema.sql`
- The automation worker will need to be tested against the actual booking site
- Consider using Cloudflare's local development tools (`wrangler dev`) for testing Workers locally

## Next Steps

1. Implement authentication (invite-only signup)
2. Build the booking configuration UI
3. Implement the automation logic for the ForeUp booking site
4. Add logging and screenshot capture
5. Set up monitoring and alerts
