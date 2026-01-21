# Reserve

A fullstack webapp to help ethically fight reservation bots by securing booking slots.

## Architecture

- **Frontend**: Next.js 14+ (Cloudflare Pages)
- **API**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (for screenshots/logs)
- **Queue**: Cloudflare Queues (for job processing)
- **Infrastructure**: Pulumi (TypeScript)

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), HeroUI, Tremor, Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (screenshots/logs)
- **Queue**: Cloudflare Queues
- **Infrastructure**: Pulumi (TypeScript)
- **Monorepo**: pnpm workspaces
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Cloudflare account
- Docker & Docker Compose (for local development)
- **Just** (optional, recommended) - `brew install just` or `cargo install just`
  - Alternative: Use `make` (usually pre-installed) or direct `pnpm` commands

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

3. Set up local development:
```bash
# Start local D1 database (via Docker)
docker-compose up -d

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
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

Use **Just** (recommended) or **Make** for a curated command list:

```bash
just setup      # First-time setup
just dev        # Start all development servers
just build      # Build all packages
just check      # Run lint + typecheck
just docs-dev   # Start docs server (view at http://localhost:3000/docs)
just --list     # See all available commands
```

### Documentation

Project documentation is built with **Fumadocs** and integrated into the Next.js app:

```bash
just docs-dev   # Start dev server with docs
# Then visit: http://localhost:3000/docs
```

The docs are served at the `/docs` route when the Next.js dev server is running.

Or use **Make**:
```bash
make setup      # First-time setup
make dev        # Start all development servers
make help       # See all available commands
```

### Direct pnpm Commands

- `pnpm dev` - Start development server (frontend)
- `pnpm build` - Build all packages (uses Turborepo)
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Type check all packages

See [Developer Recipes](./docs/development/recipes.md) for complete command reference.

## Documentation

- **[Getting Started](./docs/getting-started/README.md)** - Setup and installation
- **[Architecture](./docs/architecture/README.md)** - System design and decisions
- **[Development](./docs/development/README.md)** - Developer guides
- **[Operations](./docs/operations/README.md)** - Deployment and operations
- **[Documentation Guide](./DOCUMENTATION.md)** - Documentation tools and organization

## Deployment

Deploy infrastructure with Pulumi:
```bash
cd infra
pulumi up
```

Deploy to Cloudflare:
- Frontend: Automatically via Cloudflare Pages (connected to git)
- Workers: `wrangler deploy` from respective app directories
