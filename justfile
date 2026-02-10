# ╔══════════════════════════════════════════════════════╗
# ║  Reserve — Developer Commands                       ║
# ║  Install: brew install just                         ║
# ║  Usage:   just <command>                            ║
# ╚══════════════════════════════════════════════════════╝
#
# ┌──────────────────────────────────────────────────────┐
# │  Table of Contents                                   │
# ├──────────────────────────────────────────────────────┤
# │  🚀  Development ···· dev, dev-web, dev-api, ...     │
# │  📦  Building ······· build, build-web, build-api    │
# │  ✅  Code Quality ··· lint, format, typecheck, check │
# │  🧪  Testing ········ test, test-e2e                 │
# │  🗄️  Database ······· db-*, migration               │
# │  🐳  Docker ········· up, docker-*                   │
# │  🚢  Deployment ····· deploy-*                       │
# │  🔧  Utilities ······ secret-*, invite-*, admin-*    │
# │  🧹  Cleanup ········ clean, clean-all               │
# │  ⚙️  Setup ·········· setup, install                 │
# └──────────────────────────────────────────────────────┘

# Show all available commands (grouped)
default:
    @just --list

# ─────────────────────────────────────────────────────────
#  🚀 Development
# ─────────────────────────────────────────────────────────

# Install all dependencies
install:
    bun install

# Start all development servers (web + api + automation)
dev:
    @echo "Starting all development servers..."
    bun run --cwd apps/web dev &
    bunx wrangler dev -c apps/api/wrangler.toml &
    bunx wrangler dev -c apps/automation/wrangler.toml &
    @echo "Development servers running. Press Ctrl+C to stop all."

# Start only the frontend
dev-web:
    bun run --cwd apps/web dev

# Start only the API worker
dev-api:
    bunx wrangler dev -c apps/api/wrangler.toml

# Start only the automation worker
dev-automation:
    bunx wrangler dev -c apps/automation/wrangler.toml

# ─────────────────────────────────────────────────────────
#  📦 Building
# ─────────────────────────────────────────────────────────

# Build all packages
build:
    bun run build

# Build frontend
build-web:
    bun run --cwd apps/web build

# Build API worker
build-api:
    bun run --cwd apps/api build

# Build automation worker
build-automation:
    bun run --cwd apps/automation build

# ─────────────────────────────────────────────────────────
#  ✅ Code Quality
# ─────────────────────────────────────────────────────────

# Lint with Biome
lint:
    bun run lint

# Format with Biome
format:
    bun run format

# Type-check all packages
typecheck:
    bun run typecheck

# Run all checks (lint + typecheck)
check: lint typecheck

# ─────────────────────────────────────────────────────────
#  🧪 Testing
# ─────────────────────────────────────────────────────────

# Run all tests
test:
    bun run test

# Run end-to-end tests
test-e2e:
    bun run test:e2e

# ─────────────────────────────────────────────────────────
#  🗄️  Database
# ─────────────────────────────────────────────────────────

# Generate migrations from schema changes
db-generate:
    bun run --cwd apps/api db:generate

# Apply pending migrations
db-migrate:
    bun run --cwd apps/api db:migrate

# Open Drizzle Studio GUI
db-studio:
    bun run --cwd apps/api db:studio

# ⚠️  Reset database (destructive!)
db-reset:
    @echo "⚠️  This will reset your database. Are you sure? (y/N)"
    @read -r confirm && [ "$$confirm" = "y" ] || exit 1
    bun run --cwd apps/api db:migrate --force

# Create a named migration
migration name:
    bun run --cwd apps/api db:generate --name {{name}}

# ─────────────────────────────────────────────────────────
#  🐳 Docker
# ─────────────────────────────────────────────────────────

# Start Docker services (shorthand)
up: docker-up

# Start Docker / OrbStack services
docker-up:
    @if ! docker info >/dev/null 2>&1; then \
        echo "Docker/OrbStack daemon not running."; \
        echo "  OrbStack: run 'just orbstack-start' or open the app"; \
        echo "  Docker Desktop: start the app"; \
        exit 1; \
    fi
    docker compose up -d

# Stop Docker services
docker-down:
    docker compose down

# Tail Docker service logs
docker-logs:
    docker compose logs -f

# Restart Docker services
docker-restart: docker-down docker-up

# Check Docker service status
docker-status:
    @if ! docker info >/dev/null 2>&1; then \
        echo "Docker/OrbStack daemon not running"; \
    else \
        docker compose ps; \
    fi

# Start OrbStack (if installed)
orbstack-start:
    orbctl start || echo "OrbStack may already be running or not installed"

# ─────────────────────────────────────────────────────────
#  🚢 Deployment
# ─────────────────────────────────────────────────────────

# Deploy API worker to Cloudflare
deploy-api:
    bun run --cwd apps/api deploy

# Deploy automation worker to Cloudflare
deploy-automation:
    bun run --cwd apps/automation deploy

# Deploy all Cloudflare workers
deploy-workers: deploy-api deploy-automation

# Deploy infrastructure with Pulumi
deploy-infra:
    cd infra && pulumi up

# Preview infrastructure changes
deploy-infra-preview:
    cd infra && pulumi preview

# ─────────────────────────────────────────────────────────
#  🔧 Utilities
# ─────────────────────────────────────────────────────────

# Generate a secure AUTH_SECRET value
secret-generate:
    @bun -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    @echo "Copy this value to AUTH_SECRET in your .dev.vars files"

# Generate an invite code
invite-generate:
    @bun -e "const c = require('crypto'); const p1 = c.randomBytes(4).toString('hex').toUpperCase(); const p2 = c.randomBytes(4).toString('hex').toUpperCase(); console.log('INVITE-' + p1 + '-' + p2);"
    @echo ""
    @echo "To create this invite, run: just invite-post (after setting INVITE_AUTH_TOKEN)"

# Create an invite via API (admin only). Requires auth token from browser after login.
# 1. Log in at http://localhost:3000/login (or your dev URL)
# 2. DevTools → Application → Cookies → copy value of auth-token
# 3. export INVITE_AUTH_TOKEN="<paste token>"
# 4. just invite-post
invite-post:
    set -e
    api_url="${API_URL:-http://localhost:8787}"
    if [ -z "${INVITE_AUTH_TOKEN:-}" ]; then
        echo "Set INVITE_AUTH_TOKEN to your auth cookie (JWT) and run again."
        echo "  Log in at http://localhost:3000/login, then copy the auth-token cookie value."
        echo "  export INVITE_AUTH_TOKEN=\"<paste token>\""
        exit 1
    fi
    response=$(curl -s -X POST "${api_url}/api/auth/invites" \
        -H "Content-Type: application/json" \
        -H "Cookie: auth-token=${INVITE_AUTH_TOKEN}")
    if echo "$response" | grep -q '"code"'; then
        code=$(echo "$response" | bun -e "const d=require('fs').readFileSync(0,'utf8'); const j=JSON.parse(d); console.log(j.invite?.code || '')")
        echo "Created invite: $code"
    else
        echo "$response"
    fi

# Generate password hash for bootstrap admin
admin-hash password:
    @cd apps/api && bun tsx src/cli/bootstrap-admin.ts hash {{password}}

# Interactive admin setup wizard (creates admin user + invite code)
setup-admin:
    @bun run apps/api/src/cli/setup.ts

# Generate a new invite code (requires admin to be set up)
invite email:
    @bun run apps/api/src/cli/create-invite.ts {{email}}

# Upgrade all dependencies to latest
deps-upgrade:
    cd apps/web && bun update --latest
    cd apps/api && bun update --latest
    cd apps/automation && bun update --latest
    cd packages/shared && bun update --latest
    bun update --latest

# Show project tree (3 levels deep)
tree:
    tree -I 'node_modules|.svelte-kit|.wrangler|dist|.turbo|.next' -L 3

# ─────────────────────────────────────────────────────────
#  🧹 Cleanup
# ─────────────────────────────────────────────────────────

# Clean build artifacts
clean:
    rm -rf apps/*/dist apps/*/.svelte-kit apps/*/.wrangler apps/*/.next
    rm -rf packages/*/dist
    rm -rf .turbo

# Clean everything including node_modules
clean-all: clean
    rm -rf node_modules apps/*/node_modules packages/*/node_modules
    rm -rf bun.lockb
    @echo "Run 'just install' to reinstall."

# ─────────────────────────────────────────────────────────
#  ⚙️  Setup
# ─────────────────────────────────────────────────────────

# First-time project setup
setup:
    @echo "⚙️  Setting up Reserve..."
    @echo ""
    bun install
    @echo ""
    @if [ ! -f apps/api/.dev.vars ]; then \
        echo "AUTH_SECRET=change-me-local-secret" > apps/api/.dev.vars; \
        echo "ADMIN_EMAIL=admin@example.com" >> apps/api/.dev.vars; \
        echo "CLOUDFLARE_ACCOUNT_ID=" >> apps/api/.dev.vars; \
        echo "CLOUDFLARE_API_TOKEN=" >> apps/api/.dev.vars; \
        echo "Created apps/api/.dev.vars template"; \
    else \
        echo "apps/api/.dev.vars already exists"; \
    fi
    @if [ ! -f apps/automation/.dev.vars ]; then \
        echo "AUTH_SECRET=change-me-local-secret" > apps/automation/.dev.vars; \
        echo "Created apps/automation/.dev.vars template"; \
    else \
        echo "apps/automation/.dev.vars already exists"; \
    fi
    @if [ ! -f .env.local ]; then \
        echo "VITE_API_URL=http://localhost:8787" > .env.local; \
        echo "Created .env.local"; \
    else \
        echo ".env.local already exists"; \
    fi
    @echo ""
    @if docker info >/dev/null 2>&1; then \
        docker compose up -d && echo "Docker services started"; \
    else \
        echo "Docker/OrbStack not running. Run 'just up' when ready."; \
    fi
    @echo ""
    @echo "Setup complete! Next steps:"
    @echo "  → Fill in apps/api/.dev.vars with your Cloudflare credentials"
    @echo "  → Run 'just dev' to start development servers"
    @echo "  → Run 'just --list' to see all commands"
    @echo "  → See .agents/operations/secrets.md for secrets guide"
