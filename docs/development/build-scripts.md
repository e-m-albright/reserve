---
title: Build Scripts Configuration
---

# Build Scripts Configuration

## What Are Build Scripts?

When you install npm/pnpm packages, some packages need to run "build scripts" (like `postinstall`) to:
- Compile native binaries (C/C++ code to machine code)
- Set up platform-specific files
- Optimize package installation

## Why pnpm Blocks Them

pnpm blocks build scripts by default as a **security feature** to prevent supply chain attacks. Malicious packages could run harmful code during installation.

## Our Approved Packages

We've approved the following packages because they're legitimate and necessary:

- **esbuild** - Fast JavaScript bundler, needs native binaries
- **workerd** - Cloudflare Workers runtime, needs native binaries  
- **sharp** - High-performance image processing, needs native compilation
- **@heroui/shared-utils** - UI component library, needs build steps
- **unrs-resolver** - Dependency that requires compilation

## Configuration

Approved packages are configured in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  "@heroui/shared-utils": true
  "esbuild": true
  "sharp": true
  "unrs-resolver": true
  "workerd": true
```

## If You See Warnings

If you see warnings about other packages needing build scripts:

1. **Check if it's legitimate** - Well-known packages like `@swc/core`, `better-sqlite3` are usually safe
2. **Approve interactively** - Run `pnpm approve-builds` to select packages
3. **Or add manually** - Add to `allowBuilds` in `pnpm-workspace.yaml`

## Security Best Practice

Only approve packages you trust. When in doubt:
- Check the package's GitHub repo
- Look for recent security advisories
- Prefer packages with many downloads and active maintenance
