# Reserve

A fullstack webapp to help ethically fight reservation bots by securing booking slots.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), HeroUI, Tremor, Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (screenshots/logs)
- **Queue**: Cloudflare Queues
- **Infrastructure**: Pulumi (TypeScript)
- **Monorepo**: pnpm workspaces + Turborepo
- **Documentation**: Fumadocs (integrated into Next.js app)

## Getting Started

### Prerequisites

- Node.js >=20.9.0 (Next.js 16 requirement)
- pnpm >=8.0.0
- Cloudflare account (for deployment)
- OrbStack or Docker (for local database)
- **Just** (recommended) - `brew install just` or `cargo install just`
  - Alternative: Use `make` or direct `pnpm` commands

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Run setup to create .dev.vars templates
just setup

# Or manually create:
# - apps/api/.dev.vars (for API worker secrets)
# - apps/automation/.dev.vars (for automation worker secrets)
# - .env.local (for Next.js frontend public vars)
```

See [Secrets Management](./docs/operations/secrets.md) for secrets management.

3. Start local services:
```bash
# Start OrbStack/Docker (for local database)
just orbstack-start  # or open OrbStack app
just docker-up

# Start development servers
just dev
```

### Project Structure

```
reserve/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Cloudflare Workers API
│   └── automation/   # Booking automation worker
├── packages/
│   └── shared/       # Shared types and utilities
├── infra/            # Pulumi infrastructure code
└── docker-compose.yml
```

## Development

### Quick Commands

Use **Just** (recommended) for a curated command list:

```bash
just setup      # First-time setup
just dev        # Start all development servers
just build      # Build all packages
just check      # Run lint + typecheck
just docs-dev   # Start docs server (view at http://localhost:3000/docs)
just --list     # See all available commands
```

Or use **Make** or direct **pnpm** commands. See [Developer Recipes](./docs/development/recipes.md) for the complete command reference.

## Documentation

Project documentation is available at `/docs` when running the dev server, or browse the [`docs/`](./docs/) directory:

- **[Getting Started](./docs/getting-started/)** - Setup and installation
- **[Architecture](./docs/architecture/)** - System design and decisions
- **[Development](./docs/development/)** - Developer guides and recipes
- **[Operations](./docs/operations/)** - Deployment and operations
- **[Reference](./docs/reference/)** - API and configuration reference

## Deployment

Deploy infrastructure with Pulumi:
```bash
cd infra
pulumi up
```

Deploy to Cloudflare:
- Frontend: Automatically via Cloudflare Pages (connected to git)
- Workers: `wrangler deploy` from respective app directories
