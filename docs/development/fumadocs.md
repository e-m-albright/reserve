---
title: Fumadocs Documentation System
---

# Fumadocs Documentation System

## How It Works

Fumadocs is **integrated into your Next.js app**, not a separate documentation server. This means:

- The docs are part of your web application
- They're served at the `/docs` route when the Next.js dev server runs
- They get built and deployed with your app

## Viewing the Docs

### Development Mode

1. Start the Next.js dev server:
   ```bash
   just docs-dev
   # or
   just dev-web
   ```

2. Open your browser to:
   ```
   http://localhost:3000/docs
   ```
   
   (If port 3000 is in use, Next.js will use 3001, 3002, etc. Check the terminal output for the actual port)

### Production Build

After building:
```bash
just build
just docs-preview  # Starts production server
```

Then visit: `http://localhost:3000/docs`

## Documentation Structure

All docs are in the `docs/` directory:
- `docs/index.mdx` - Main docs landing page (at `/docs`)
- `docs/getting-started/` - Setup guides (at `/docs/getting-started/`)
- `docs/architecture/` - System design (at `/docs/architecture/`)
- etc.

## Features

- **Automatic navigation** - Sidebar generated from your docs structure
- **Search** - Built-in search functionality
- **Syntax highlighting** - Code blocks with Shiki
- **MDX support** - Use React components in your docs
- **Table of contents** - Auto-generated from headings

## Adding New Docs

1. Create a `.md` or `.mdx` file in `docs/`
2. Add frontmatter with `title`:
   ```markdown
   ---
   title: My New Doc
   ---
   
   # My New Doc
   ```
3. The file will automatically appear in the docs site

## Configuration

- `apps/web/source.config.ts` - Defines which directory contains docs
- `apps/web/src/lib/source.ts` - Loads and processes docs
- `apps/web/src/app/docs/[[...slug]]/` - Next.js route that renders docs
