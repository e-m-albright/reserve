---
title: Developer Recipe Book
---

# Developer Recipe Book

A curated collection of commands to manage the Reserve project. Choose your preferred tool:

- **Just** (recommended) - Modern, clean syntax: `just <command>`
- **Make** - Traditional, widely available: `make <command>`
- **Turborepo** - For parallel task execution: `turbo run <task>`
- **pnpm scripts** - Direct package.json scripts

## Quick Start

```bash
# First time setup
just setup          # or: make setup

# Start development
just dev            # or: make dev

# See all commands
just --list         # or: make help
```

## Installation

### Just (Recommended)
```bash
# macOS
brew install just

# Linux (cargo)
cargo install just

# Or download from: https://github.com/casey/just
```

### Make
```bash
# Usually pre-installed on macOS/Linux
# Windows: Install via Chocolatey or WSL
```

### Turborepo
```bash
# Already included in package.json
pnpm install
```

## Command Reference

### Development
- `just dev` / `make dev` - Start all development servers
- `just dev-web` / `make dev-web` - Start only frontend
- `just dev-api` / `make dev-api` - Start only API
- `just dev-automation` / `make dev-automation` - Start only automation worker

### Building
- `just build` / `make build` - Build all packages
- `just build-web` / `make build-web` - Build frontend
- `just build-api` / `make build-api` - Build API

### Code Quality
- `just lint` / `make lint` - Lint all packages
- `just format` / `make format` - Format code
- `just typecheck` / `make typecheck` - Type check all packages
- `just check` / `make check` - Run lint + typecheck

### Database
- `just db-generate` / `make db-generate` - Generate migrations
- `just db-migrate` / `make db-migrate` - Run migrations
- `just db-studio` / `make db-studio` - Open Drizzle Studio

### Docker
- `just docker-up` / `make docker-up` - Start Docker services
- `just docker-down` / `make docker-down` - Stop Docker services
- `just docker-logs` / `make docker-logs` - View logs

### Deployment
- `just deploy-api` / `make deploy-api` - Deploy API worker
- `just deploy-automation` / `make deploy-automation` - Deploy automation worker
- `just deploy-infra` / `make deploy-infra` - Deploy infrastructure

### Testing
- `just test` / `make test` - Run all tests
- `just test-e2e` / `make test-e2e` - Run E2E tests
- `just test-unit` / `make test-unit` - Run unit tests

### Utilities
- `just clean` / `make clean` - Clean build artifacts
- `just invite-generate` / `make invite-generate` - Generate invite code
- `just migration <name>` / `make migration NAME=<name>` - Create migration

## Turborepo Integration

Turborepo provides intelligent task orchestration with caching and parallelization:

```bash
# Run tasks with Turborepo (faster, cached)
turbo run build      # Build all packages in parallel
turbo run lint       # Lint all packages
turbo run test       # Test all packages

# Filter to specific packages
turbo run build --filter=web
turbo run lint --filter=api

# Run tasks in dependency order
turbo run build --filter=...web  # Build web and its dependencies
```

**Benefits**:
- ✅ Only rebuilds what changed
- ✅ Parallel execution
- ✅ Local caching (faster rebuilds)
- ✅ Remote caching (team-wide, optional)

## Why Multiple Tools?

- **Just/Make**: Human-readable recipe book, easy to discover commands
- **Turborepo**: Intelligent task orchestration, caching, parallelization
- **pnpm scripts**: Direct access, IDE integration

Use **Just** or **Make** for day-to-day commands, **Turborepo** for CI/CD and complex builds.

## Tips

1. **Start with `just setup`** or `make setup` for first-time setup
2. **Use `just --list`** or `make help` to discover commands
3. **Turborepo** handles complex builds automatically
4. **Docker** services start automatically with `just docker:up`
5. **Database** migrations run with `just db:migrate`

## Adding New Commands

### To Justfile:
```bash
# Add your command
my-command:
    @echo "Running my command..."
    pnpm --filter web my-script
```

### To Makefile:
```make
my-command: ## Description of command
	pnpm --filter web my-script
```

### To package.json:
```json
{
  "scripts": {
    "my-command": "pnpm --filter web my-script"
  }
}
```

Then use: `just my-command`, `make my-command`, or `pnpm my-command`
