# Reserve - Developer Recipe Book
# Modern command runner using Just (https://github.com/casey/just)
# Install: cargo install just (or brew install just)

# Default recipe (run with `just`)
default:
    @just --list

# ============================================================================
# DEVELOPMENT
# ============================================================================

# Install all dependencies
install:
    pnpm install

# Start development servers (all apps)
dev:
    @echo "Starting all development servers..."
    pnpm --filter web dev &
    pnpm --filter api dev &
    pnpm --filter automation dev &
    @echo "Development servers running. Press Ctrl+C to stop all."

# Start only frontend
dev-web:
    pnpm --filter web dev

# Start only API
dev-api:
    pnpm --filter api dev

# Start only automation worker
dev-automation:
    pnpm --filter automation dev

# ============================================================================
# BUILDING
# ============================================================================

# Build all packages
build:
    # Remove Next.js lock file if it exists (from interrupted builds)
    @rm -f apps/web/.next/lock 2>/dev/null || true
    pnpm build

# Build specific package
build-web:
    pnpm --filter web build

build-api:
    pnpm --filter api build

build-automation:
    pnpm --filter automation build

# ============================================================================
# CODE QUALITY
# ============================================================================

# Lint all packages
lint:
    pnpm lint

# Lint specific package
lint-web:
    pnpm --filter web lint

lint-api:
    pnpm --filter api lint

lint-automation:
    pnpm --filter automation lint

# Format code with Prettier
format:
    pnpm format

# Type check all packages
typecheck:
    pnpm typecheck

# Type check specific package
typecheck-web:
    pnpm --filter web typecheck

typecheck-api:
    pnpm --filter api typecheck

typecheck-automation:
    pnpm --filter automation typecheck

# Run all checks (lint + typecheck)
check: lint typecheck
    @echo "✅ All checks passed!"

# ============================================================================
# DATABASE
# ============================================================================

# Generate database migrations
db-generate:
    pnpm --filter api db:generate

# Run database migrations
db-migrate:
    pnpm --filter api db:migrate

# Open Drizzle Studio (database GUI)
db-studio:
    pnpm --filter api db:studio

# Reset database (WARNING: destructive)
db-reset:
    @echo "⚠️  This will reset your database. Are you sure? (y/N)"
    @read -r confirm && [ "$$confirm" = "y" ] || exit 1
    pnpm --filter api db:migrate --force

# ============================================================================
# DOCKER / ORBSTACK
# ============================================================================

# Start OrbStack (if using OrbStack)
orbstack-start:
    @echo "🚀 Starting OrbStack..."
    orbctl start || echo "⚠️  OrbStack may already be running or not installed"

# Start Docker/OrbStack services (database, etc.)
# Works with both Docker Desktop and OrbStack
docker-up:
    @if ! docker info >/dev/null 2>&1; then \
        echo "⚠️  Docker/OrbStack daemon not running"; \
        echo "   For OrbStack: run 'just orbstack-start' or open the OrbStack app"; \
        echo "   For Docker Desktop: start Docker Desktop"; \
        exit 1; \
    fi
    docker compose up -d
    @echo "✅ Docker/OrbStack services started"

# Stop Docker/OrbStack services
docker-down:
    docker compose down

# View Docker/OrbStack logs
docker-logs:
    docker compose logs -f

# Restart Docker/OrbStack services
docker-restart: docker-down docker-up
    @echo "✅ Docker/OrbStack services restarted"

# Check Docker/OrbStack status
docker-status:
    @if ! docker info >/dev/null 2>&1; then \
        echo "⚠️  Docker/OrbStack daemon not running"; \
    else \
        docker compose ps; \
    fi

# ============================================================================
# CLOUDFLARE / DEPLOYMENT
# ============================================================================

# Deploy API worker
deploy-api:
    pnpm --filter api deploy

# Deploy automation worker
deploy-automation:
    pnpm --filter automation deploy

# Deploy all workers
deploy-workers: deploy-api deploy-automation
    @echo "✅ All workers deployed"

# Deploy infrastructure with Pulumi
deploy-infra:
    cd infra && pulumi up

# Preview infrastructure changes
deploy-infra-preview:
    cd infra && pulumi preview

# ============================================================================
# TESTING
# ============================================================================

# Run all tests
test:
    pnpm test

# Run E2E tests
test-e2e:
    pnpm --filter web test:e2e

# Run unit tests
test-unit:
    pnpm test:unit

# Run tests in watch mode
test-watch:
    pnpm test:watch

# ============================================================================
# CLEANUP
# ============================================================================

# Clean all build artifacts
clean:
    rm -rf apps/*/dist apps/*/.next apps/*/.wrangler
    rm -rf packages/*/dist
    rm -rf .turbo
    @echo "✅ Cleaned build artifacts"

# Clean node_modules (nuclear option)
clean-all: clean
    rm -rf node_modules apps/*/node_modules packages/*/node_modules
    rm -rf pnpm-lock.yaml
    @echo "✅ Cleaned everything. Run 'just install' to reinstall."

# ============================================================================
# UTILITIES
# ============================================================================

# Show project structure
tree:
    tree -I 'node_modules|.next|.wrangler|dist|.turbo' -L 3

# Check for outdated dependencies
outdated:
    pnpm outdated

# Update dependencies (interactive)
update:
    pnpm update --interactive

# Create a new migration
migration name:
    pnpm --filter api db:generate --name {{name}}

# Generate invite code (admin utility)
invite-generate:
    @node -e "console.log('INVITE-' + require('crypto').randomBytes(4).toString('hex').toUpperCase())"

# ============================================================================
# DOCUMENTATION (FUMADOCS)
# ============================================================================

# Install Fumadocs dependencies
docs-install:
    cd apps/web && pnpm add fumadocs-core fumadocs-mdx fumadocs-ui @types/mdx

# Start docs development server
# Fumadocs is integrated into the Next.js app - docs are served at /docs route
docs-dev:
    @echo "📚 Starting Next.js dev server with Fumadocs..."
    @echo "⚠️  Note: First run will generate .source/ folder (this is normal)"
    @echo ""
    @echo "📖 Once the server starts, visit:"
    @echo "   http://localhost:3000/docs"
    @echo "   (or http://localhost:3001/docs if port 3000 is in use)"
    @echo ""
    cd apps/web && pnpm dev

# Build documentation
docs-build:
    cd apps/web && pnpm build

# View docs locally (after build)
docs-preview:
    cd apps/web && pnpm start
    @echo "📚 Production docs available at http://localhost:3000/docs"

# Open docs in browser (macOS)
docs-open:
    @echo "🌐 Opening docs in browser..."
    @open http://localhost:3000/docs || echo "⚠️  Make sure the dev server is running first (just docs-dev)"

# Generate docs source files
docs-generate:
    cd apps/web && pnpm build
    @echo "✅ Generated docs source files in .source/"

# Clean docs build artifacts
docs-clean:
    rm -rf apps/web/.source
    rm -rf apps/web/.next
    @echo "✅ Cleaned docs build artifacts"

# Upgrade all dependencies to latest versions
deps-upgrade:
    @echo "🚀 Upgrading dependencies to latest versions..."
    cd apps/web && pnpm update --latest
    cd apps/api && pnpm update --latest
    cd apps/automation && pnpm update --latest
    cd packages/shared && pnpm update --latest
    pnpm update --latest
    @echo "✅ All dependencies upgraded!"

# Fix peer dependency warnings (suppress known safe warnings)
deps-fix-warnings:
    @echo "🔧 Note: Tremor React warnings are expected - React 19 is backward compatible"
    @echo "These warnings can be safely ignored. Tremor will add React 19 support soon."
    @echo "See: https://github.com/tremorlabs/tremor-npm/issues/1072"

# ============================================================================
# SETUP / ONBOARDING
# ============================================================================

# First-time setup
setup:
    @echo "🚀 Setting up Reserve project..."
    @echo ""
    @echo "1. Installing dependencies..."
    pnpm install
    @echo ""
    @echo "2. Setting up environment..."
    @if [ ! -f apps/api/.dev.vars ]; then \
        echo "AUTH_SECRET=change-me-local-secret" > apps/api/.dev.vars; \
        echo "ADMIN_EMAIL=admin@example.com" >> apps/api/.dev.vars; \
        echo "CLOUDFLARE_ACCOUNT_ID=" >> apps/api/.dev.vars; \
        echo "CLOUDFLARE_API_TOKEN=" >> apps/api/.dev.vars; \
        echo "✅ Created apps/api/.dev.vars template"; \
    else \
        echo "⚠️  apps/api/.dev.vars already exists"; \
    fi
    @if [ ! -f apps/automation/.dev.vars ]; then \
        echo "AUTH_SECRET=change-me-local-secret" > apps/automation/.dev.vars; \
        echo "✅ Created apps/automation/.dev.vars template"; \
    else \
        echo "⚠️  apps/automation/.dev.vars already exists"; \
    fi
    @if [ ! -f .env.local ]; then \
        echo "NEXT_PUBLIC_API_URL=http://localhost:8787" > .env.local; \
        echo "✅ Created .env.local for Next.js frontend"; \
    else \
        echo "⚠️  .env.local already exists"; \
    fi
    @echo ""
    @echo "3. Starting Docker/OrbStack services..."
    @if docker info >/dev/null 2>&1; then \
        docker compose up -d && echo "✅ Docker/OrbStack services started"; \
    else \
        echo "⚠️  Docker/OrbStack daemon not running"; \
        echo "   For OrbStack: run 'just orbstack-start' or open the OrbStack app"; \
        echo "   For Docker Desktop: start Docker Desktop"; \
        echo "   Then run 'just docker-up' to start services"; \
    fi
    @echo ""
    @echo "4. Database setup..."
    @echo "   Note: Run 'wrangler dev' once to create local D1 database, then:"
    @echo "   - 'just db-generate' to generate migrations from schema changes"
    @echo "   - 'just db-migrate' to apply migrations (requires local DB or D1 connection)"
    @echo ""
    @echo "✅ Setup complete! Next steps:"
    @echo "   - Fill in apps/api/.dev.vars with your Cloudflare credentials"
    @echo "   - Fill in apps/automation/.dev.vars with AUTH_SECRET"
    @echo "   - For production: use 'wrangler secret put <NAME>' to set secrets"
    @echo "   - Run 'just dev' to start development servers"
    @echo "   - Run 'just --list' to see all available commands"
    @echo ""
    @echo "📚 See docs/operations/secrets.md for secrets management guide"

# ============================================================================
# HELP
# ============================================================================

# Show all available commands
help: default
    @echo ""
    @echo "📚 Reserve Developer Recipe Book"
    @echo ""
    @echo "Quick start:"
    @echo "  just setup          - First-time project setup"
    @echo "  just dev            - Start all development servers"
    @echo "  just build          - Build all packages"
    @echo "  just check          - Run lint + typecheck"
    @echo ""
    @echo "See all commands: just --list"
    @echo "Get help for a command: just <command> --help"
