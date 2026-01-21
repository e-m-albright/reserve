# Upgrade Notes - Latest Packages

## Upgraded Packages

### Web App (`apps/web`)
- **Next.js**: 14 → 16
- **React**: 18 → 19
- **React DOM**: 18 → 19
- **Tailwind CSS**: 3 → 4
- **Zod**: 3 → 4
- **framer-motion**: 10 → 11.5.6+
- **ESLint**: 8 → 9
- **Fumadocs**: Added v16 (requires Next.js 16+)

### API & Automation (`apps/api`, `apps/automation`)
- **ESLint**: 8 → 9
- **TypeScript ESLint**: 7 → 8

### Shared Package
- **ESLint**: 8 → 9

## Breaking Changes

### Next.js 16
- React 19 is required
- Some APIs may have changed
- Check [Next.js 16 migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-16)

### React 19
- New JSX transform (automatic)
- Some hooks behavior changed
- Check [React 19 release notes](https://react.dev/blog/2024/12/05/react-19)

### Tailwind CSS 4
- New CSS-first configuration
- Some utility classes may have changed
- Check [Tailwind CSS 4 migration guide](https://tailwindcss.com/docs/upgrade-guide)

### Zod 4
- Some API changes
- Check [Zod 4 changelog](https://github.com/colinhacks/zod/releases)

### ESLint 9
- **Migrated to flat config format** (`eslint.config.js`)
- Replaced `.eslintrc.json` files with new flat config
- Updated dependencies: `@eslint/js`, `typescript-eslint`, `globals`
- Next.js web app still uses `.eslintrc.json` (Next.js handles it)
- Check [ESLint 9 migration guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

## Configuration Changes

### Next.js Config
- Renamed `next.config.js` → `next.config.mjs` (for Fumadocs MDX support)
- Added Fumadocs MDX plugin

### Tailwind Config
- Added Fumadocs UI content paths
- Updated for Tailwind CSS 4 compatibility

### Global CSS
- Updated to use Tailwind CSS 4 `@import` syntax
- Added Fumadocs CSS imports

### TypeScript Config
- Added Fumadocs path alias: `fumadocs-mdx:collections/*`

## New Files Created

- `apps/web/source.config.ts` - Fumadocs configuration
- `apps/web/src/lib/source.ts` - Fumadocs source loader
- `apps/web/src/app/docs/[[...slug]]/page.tsx` - Docs pages
- `apps/web/src/app/docs/[[...slug]]/layout.tsx` - Docs layout
- `apps/web/src/app/docs/page.tsx` - Docs index page

## Testing After Upgrade

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Type check**:
   ```bash
   pnpm typecheck
   ```

3. **Lint**:
   ```bash
   pnpm lint
   ```

4. **Build**:
   ```bash
   pnpm build
   ```

5. **Test docs**:
   ```bash
   just docs-dev
   # Visit http://localhost:3000/docs
   ```

## Known Issues

### Tremor React + React 19
- **Warning**: Tremor React doesn't officially support React 19 yet (see [issue #1072](https://github.com/tremorlabs/tremor-npm/issues/1072))
- **Status**: Using Tremor v4.0.0-beta which may have partial support
- **Impact**: Peer dependency warnings are expected but safe to ignore
- **Why Safe**: React 19 is backward compatible with React 18 code
- **Workaround**: Added `.npmrc` with `strict-peer-dependencies=false` to suppress warnings
- **Future**: Monitor Tremor releases for official React 19 support

### Other Issues
- ✅ **ESLint 9 flat config**: Migrated API, automation, and shared packages to `eslint.config.js`. Web app keeps `.eslintrc.json` (Next.js handles it).
- Tailwind CSS 4: Some HeroUI components may need updates for full compatibility.
- React 19: Some third-party libraries may not be fully compatible yet (see Tremor React above).

## Rollback

If you need to rollback:
```bash
git checkout HEAD~1 -- apps/web/package.json
pnpm install
```
