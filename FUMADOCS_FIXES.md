# Fumadocs Setup Fixes

## Issues Fixed

### 1. ESLint 9 Migration ✅
- Renamed `.eslintrc.json` → `eslint.config.mjs` for API, automation, and shared packages
- Updated dependencies to use `typescript-eslint` package
- Added `@eslint/js` and `globals` packages

### 2. Next.js Config ✅
- Fixed `createMDX` usage - now properly wraps config
- Changed to use `withMDX` wrapper pattern

### 3. Route Conflict ✅
- Removed `/docs/page.tsx` (conflicted with `/docs/[[...slug]]`)
- The catch-all route handles both root and nested docs

### 4. TypeScript Errors ⚠️
- Added `@ts-expect-error` comments for Fumadocs imports
- These errors will resolve after first build generates `.source/` folder
- TypeScript config updated to include `.source/**/*` in includes

## Next Steps

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run dev server** (this generates the `.source/` folder):
   ```bash
   just docs-dev
   # or
   cd apps/web && pnpm dev
   ```

3. **After first build**, TypeScript errors should resolve automatically

## Known Temporary Issues

- TypeScript will show errors for Fumadocs imports until `.source/` is generated
- This is expected - run `pnpm dev` once to generate the types
- After that, typecheck should pass

## Testing

```bash
# Lint (should work now)
just lint

# Typecheck (will have Fumadocs errors until first build)
just typecheck

# Start dev server (generates types)
just docs-dev
```
