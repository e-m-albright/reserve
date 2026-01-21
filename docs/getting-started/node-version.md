---
title: Node.js Version Management
---

# Node.js Version Management

## Required Version

This project requires **Node.js >=20.9.0** (Next.js 16 requirement).

## Using fnm (Fast Node Manager)

If you're using `fnm`, the project includes a `.nvmrc` file that specifies Node.js 22.

### First Time Setup

```bash
# Install Node.js 22 (if not already installed)
fnm install 22

# Use Node.js 22 for this project
fnm use

# Verify version
node --version  # Should show v22.x.x
```

### Automatic Activation

If you have fnm's shell integration enabled, it will automatically switch to the correct Node.js version when you `cd` into the project directory.

### Manual Activation

If automatic switching doesn't work:

```bash
# In the project root
fnm use

# Or specify version
fnm use 22
```

## Using nvm (Node Version Manager)

If you're using `nvm` instead:

```bash
# Install and use Node.js 22
nvm install 22
nvm use 22
```

## Verifying Your Version

```bash
node --version
# Should show: v20.9.0 or higher (preferably v22.x.x)
```

## Troubleshooting

If you see "Node.js version '>=20.9.0' is required" errors:

1. Check your current version: `node --version`
2. If it's < 20.9.0, activate the correct version:
   - `fnm use` (if using fnm)
   - `nvm use 22` (if using nvm)
3. Verify: `node --version` should show v20.9.0 or higher
4. Try your command again

## Project Configuration

- `.nvmrc` - Specifies Node.js 22 for fnm/nvm
- `.node-version` - Alternative version file (for some tools)
- `package.json` - `engines.node` specifies ">=20.9.0"
