# Reserve

An ethical booking assistant that helps users secure hard-to-get reservation slots.

## Tech Stack

- **Runtime**: Bun
- **Frontend**: SvelteKit 2, Svelte 5 (Runes), Tailwind CSS 4
- **Backend**: Cloudflare Workers (Hono)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (screenshots/logs)
- **Queue**: Cloudflare Queues
- **Infrastructure**: Pulumi (TypeScript)
- **Monorepo**: Bun workspaces + Turborepo
- **Linting**: Biome

## Current Status

### Implemented
- User authentication (signup/login/logout with JWT)
- Invite code system (generation, validation, one-time use)
- Admin user designation
- Protected routes with auth middleware
- Frontend pages (login, signup, home, booking requests)
- Booking request CRUD API and UI
- Database schema (users, invites, booking requests, logs)
- CLI tools for admin bootstrapping and invite generation
- Pulumi infrastructure (D1, R2, Queues)

### TODO
- Booking automation logic (browser automation worker)
- Credential encryption for stored booking site credentials
- Screenshot capture and R2 storage
- Admin dashboard UI
- Email notifications

## Getting Started

### Prerequisites

- [Bun](https://bun.sh)
- [Just](https://github.com/casey/just) — `brew install just`
- OrbStack or Docker (for local SQLite)
- Cloudflare account (for deployment)

### Setup

```bash
# Install dependencies and create env templates
just setup

# Start Docker services
just up

# Start development servers
just dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:8787`.

### Environment Files

- `apps/api/.dev.vars` — API worker secrets (AUTH_SECRET, ADMIN_EMAIL, Cloudflare credentials)
- `apps/automation/.dev.vars` — Automation worker secrets (AUTH_SECRET)
- `.env.local` — Frontend config (VITE_API_URL)

See [.agents/operations/secrets.md](.agents/operations/secrets.md) for details.

## Project Structure

```
reserve/
├── apps/
│   ├── web/          # SvelteKit frontend (Svelte 5)
│   ├── api/          # Cloudflare Workers API (Hono)
│   └── automation/   # Booking automation worker
├── packages/
│   └── shared/       # Shared types and utilities
├── infra/            # Pulumi infrastructure code
└── .architecture/    # Architecture decision records
```

## Commands

```bash
just setup            # First-time setup
just dev              # Start all dev servers
just up               # Start Docker services
just build            # Build all packages
just check            # Lint + typecheck
just --list           # See all commands
```

### Database

```bash
just db-generate      # Generate migrations from schema
just db-migrate       # Apply migrations
just db-studio        # Open Drizzle Studio GUI
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
| `/health` | GET | — | Health check |
| `/api/auth/signup` | POST | — | Register with invite code |
| `/api/auth/login` | POST | — | Authenticate user |
| `/api/auth/logout` | POST | — | Clear auth session |
| `/api/auth/me` | GET | Required | Get current user |
| `/api/auth/invites` | POST | Admin | Generate invite code |
| `/api/booking-requests` | GET | Required | List booking requests |
| `/api/booking-requests/:id` | GET | Required | Get booking request |
| `/api/booking-requests` | POST | Required | Create booking request |
| `/api/booking-requests/:id` | PUT | Required | Update booking request |
| `/api/booking-requests/:id` | DELETE | Required | Cancel booking request |

## Deployment

```bash
just deploy-api          # Deploy API worker
just deploy-automation   # Deploy automation worker
just deploy-infra        # Deploy Pulumi infrastructure
```
