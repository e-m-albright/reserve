# Reserve

An ethical booking assistant that helps users secure hard-to-get reservation slots.

## Tech Stack

- **Runtime**: Bun
- **Frontend**: Next.js 16 (App Router), React 19, HeroUI, Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (screenshots/logs)
- **Queue**: Cloudflare Queues
- **Infrastructure**: Pulumi (TypeScript)
- **Monorepo**: Bun workspaces + Turborepo
- **Documentation**: Fumadocs (integrated into Next.js app)
- **Linting**: Biome

## Current Status

### Implemented
- User authentication (signup/login/logout with JWT + PBKDF2)
- Invite code system (generation, validation, one-time use)
- Admin user designation
- Protected routes with auth middleware
- Frontend pages (login, signup, home with auth states)
- Database schema (users, invites, booking requests, logs)
- CLI tools for admin bootstrapping and invite generation
- Documentation site with Fumadocs

### In Progress / TODO
- Booking request API endpoints (CRUD)
- Booking automation logic (browser automation)
- Credential encryption for stored booking site credentials
- Screenshot capture and R2 storage
- Admin dashboard UI
- Booking status monitoring UI
- Email notifications

## Getting Started

### Prerequisites

- Bun (https://bun.sh)
- Cloudflare account (for deployment)
- OrbStack or Docker (for local services)
- **Just** (recommended) - `brew install just` or `cargo install just`

### Setup

1. Install dependencies:
```bash
bun install
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
│   ├── web/          # Next.js 16 frontend (React 19)
│   ├── api/          # Cloudflare Workers API (Hono)
│   └── automation/   # Booking automation worker
├── packages/
│   └── shared/       # Shared types and utilities
├── infra/            # Pulumi infrastructure code
├── docs/             # MDX documentation (Fumadocs)
└── .architecture/    # Architecture decision records
```

## Development

### Quick Commands

```bash
just setup      # First-time setup
just dev        # Start all development servers
just build      # Build all packages
just check      # Run lint + typecheck
just docs-dev   # Start docs server (http://localhost:3000/docs)
just --list     # See all available commands
```

### Database Commands

```bash
just db-generate  # Generate migrations from schema
just db-migrate   # Apply migrations
just db-studio    # Open Drizzle Studio GUI
```

### Admin Utilities

```bash
just admin-hash <password>   # Generate password hash for bootstrap admin
just invite-generate         # Generate invite code format
just secret-generate         # Generate AUTH_SECRET value
```

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | - | Health check |
| `/api/auth/signup` | POST | - | Register with invite code |
| `/api/auth/login` | POST | - | Authenticate user |
| `/api/auth/logout` | POST | - | Clear auth session |
| `/api/auth/me` | GET | Required | Get current user |
| `/api/auth/invites` | POST | Admin | Generate invite code |

## Documentation

Project documentation is available at `/docs` when running the dev server, or browse the [`docs/`](./docs/) directory.

## Deployment

Deploy infrastructure with Pulumi:
```bash
cd infra
pulumi up
```

Deploy to Cloudflare:
- Frontend: Cloudflare Pages (connected to git)
- Workers: `just deploy-api` or `just deploy-automation`
