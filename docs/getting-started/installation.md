---
title: Installation
---

# Installation

Installation instructions for Reserve dependencies and tools.

## Prerequisites

- **Node.js** 18+ - [Download](https://nodejs.org/)
- **pnpm** 8+ - Install via Corepack (comes with Node.js 18+)
- **Docker** - [Download](https://www.docker.com/)
- **Cloudflare Account** - [Sign up](https://dash.cloudflare.com/sign-up)

## Install Node.js and pnpm

```bash
# Install Node.js 18+ (if not already installed)
# macOS
brew install node

# Or use nvm
nvm install 18
nvm use 18

# Enable Corepack (comes with Node.js 18+)
corepack enable

# Verify installation
node --version  # Should be 18+
pnpm --version  # Should be 8+
```

## Install Docker

```bash
# macOS
brew install --cask docker

# Or download from https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

## Install Just (Optional, Recommended)

```bash
# macOS
brew install just

# Linux (via cargo)
cargo install just

# Verify installation
just --version
```

## Install Project Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd reserve

# Install all dependencies
pnpm install

# Or use the setup command
just setup
```

## Verify Installation

```bash
# Check that all tools are available
node --version
pnpm --version
docker --version
just --version  # if installed

# Verify project setup
pnpm --filter web typecheck
pnpm --filter api typecheck
```

## Next Steps

- [Setup Guide](./setup.md) - Configure your environment
- [Getting Started](../getting-started/README.md) - Complete setup process
