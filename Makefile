# Reserve - Developer Recipe Book (Makefile alternative)
# Use `make` or `make help` to see all commands
# Alternative to justfile - use whichever you prefer!

.PHONY: help install dev build lint format typecheck check
.PHONY: db-generate db-migrate db-studio db-reset
.PHONY: docker-up docker-down docker-logs docker-restart
.PHONY: deploy-api deploy-automation deploy-workers deploy-infra
.PHONY: test test-e2e test-unit test-watch
.PHONY: clean clean-all setup help

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)📚 Reserve Developer Recipe Book$(NC)"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ============================================================================
# DEVELOPMENT
# ============================================================================

install: ## Install all dependencies
	pnpm install

dev: ## Start all development servers
	@echo "$(BLUE)Starting all development servers...$(NC)"
	pnpm --filter web dev & \
	pnpm --filter api dev & \
	pnpm --filter automation dev & \
	wait

dev-web: ## Start only frontend
	pnpm --filter web dev

dev-api: ## Start only API
	pnpm --filter api dev

dev-automation: ## Start only automation worker
	pnpm --filter automation dev

# ============================================================================
# BUILDING
# ============================================================================

build: ## Build all packages
	pnpm build

build-web: ## Build frontend
	pnpm --filter web build

build-api: ## Build API
	pnpm --filter api build

build-automation: ## Build automation worker
	pnpm --filter automation build

# ============================================================================
# CODE QUALITY
# ============================================================================

lint: ## Lint all packages
	pnpm lint

lint-web: ## Lint frontend
	pnpm --filter web lint

lint-api: ## Lint API
	pnpm --filter api lint

lint-automation: ## Lint automation worker
	pnpm --filter automation lint

format: ## Format code with Prettier
	pnpm format

typecheck: ## Type check all packages
	pnpm typecheck

typecheck-web: ## Type check frontend
	pnpm --filter web typecheck

typecheck-api: ## Type check API
	pnpm --filter api typecheck

typecheck-automation: ## Type check automation worker
	pnpm --filter automation typecheck

check: lint typecheck ## Run all checks (lint + typecheck)
	@echo "$(GREEN)✅ All checks passed!$(NC)"

# ============================================================================
# DATABASE
# ============================================================================

db-generate: ## Generate database migrations
	pnpm --filter api db:generate

db-migrate: ## Run database migrations
	pnpm --filter api db:migrate

db-studio: ## Open Drizzle Studio (database GUI)
	pnpm --filter api db:studio

db-reset: ## Reset database (WARNING: destructive)
	@echo "$(YELLOW)⚠️  This will reset your database. Are you sure? (y/N)$(NC)"
	@read -r confirm && [ "$$confirm" = "y" ] || exit 1
	pnpm --filter api db:migrate --force

# ============================================================================
# DOCKER
# ============================================================================

docker-up: ## Start Docker services
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-restart: docker-down docker-up ## Restart Docker services
	@echo "$(GREEN)✅ Docker services restarted$(NC)"

# ============================================================================
# CLOUDFLARE / DEPLOYMENT
# ============================================================================

deploy-api: ## Deploy API worker
	pnpm --filter api deploy

deploy-automation: ## Deploy automation worker
	pnpm --filter automation deploy

deploy-workers: deploy-api deploy-automation ## Deploy all workers
	@echo "$(GREEN)✅ All workers deployed$(NC)"

deploy-infra: ## Deploy infrastructure with Pulumi
	cd infra && pulumi up

deploy-infra-preview: ## Preview infrastructure changes
	cd infra && pulumi preview

# ============================================================================
# TESTING
# ============================================================================

test: ## Run all tests
	pnpm test

test-e2e: ## Run E2E tests
	pnpm --filter web test:e2e

test-unit: ## Run unit tests
	pnpm test:unit

test-watch: ## Run tests in watch mode
	pnpm test:watch

# ============================================================================
# CLEANUP
# ============================================================================

clean: ## Clean all build artifacts
	rm -rf apps/*/dist apps/*/.next apps/*/.wrangler
	rm -rf packages/*/dist
	rm -rf .turbo
	@echo "$(GREEN)✅ Cleaned build artifacts$(NC)"

clean-all: clean ## Clean everything including node_modules
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	rm -rf pnpm-lock.yaml
	@echo "$(GREEN)✅ Cleaned everything. Run 'make install' to reinstall.$(NC)"

# ============================================================================
# SETUP / ONBOARDING
# ============================================================================

setup: ## First-time project setup
	@echo "$(BLUE)🚀 Setting up Reserve project...$(NC)"
	@echo ""
	@echo "1. Installing dependencies..."
	pnpm install
	@echo ""
	@echo "2. Setting up environment..."
	@if [ ! -f .env.local ]; then \
		cp .env.local.example .env.local; \
		echo "$(GREEN)✅ Created .env.local (please fill in your values)$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  .env.local already exists$(NC)"; \
	fi
	@echo ""
	@echo "3. Starting Docker services..."
	docker-compose up -d
	@echo ""
	@echo "4. Running database migrations..."
	pnpm --filter api db:migrate
	@echo ""
	@echo "$(GREEN)✅ Setup complete! Next steps:$(NC)"
	@echo "   - Fill in .env.local with your Cloudflare credentials"
	@echo "   - Run 'make dev' to start development servers"
	@echo "   - Run 'make help' to see all available commands"
