# ADR 0004: Frontend Framework

**Status:** Accepted (Updated)
**Date:** 2026-02-10
**Decision Makers:** Project team

## Context

The web application needs:
- Server-side rendering for SEO and performance
- Modern component architecture
- Type-safe development experience
- Alignment with AGENTS.md standards

## Decision

Use **SvelteKit 2** with **Svelte 5** and **Tailwind CSS v4**:

1. **SvelteKit 2** for framework
   - File-based routing (`+page.svelte`, `+layout.svelte`)
   - Server-side rendering by default
   - Form actions for mutations
   - Built-in loading states

2. **Svelte 5** for UI
   - Runes for reactive state (`$state`, `$derived`, `$effect`)
   - Simpler than React hooks
   - Smaller bundle sizes
   - Native two-way binding

3. **Tailwind CSS v4**
   - Via `@tailwindcss/vite` plugin
   - Same utility classes as before
   - Dark mode support

## Previous Decision (Superseded)

Previously used Next.js 15 + React 19 + HeroUI. Migrated to SvelteKit because:
- AGENTS.md explicitly supports SvelteKit patterns
- Simpler reactivity model (runes vs hooks)
- Smaller bundle sizes
- Fumadocs removal simplified the migration

## Alternatives Considered

### Keep Next.js + React
- **Pros:** Larger ecosystem, team familiarity
- **Cons:** Heavier bundles, more complex state management, AGENTS.md prefers Svelte

### Astro
- **Pros:** Excellent for static content, partial hydration
- **Cons:** Less suited for interactive applications with auth

## Consequences

### Positive
- Full alignment with AGENTS.md
- Smaller client bundles (~30KB vs ~100KB+ with React)
- Simpler component model (no useEffect footguns)
- Native form handling without libraries
- Better TypeScript integration with runes

### Negative
- Smaller ecosystem than React
- Team needs to learn Svelte 5 patterns
- Some React component libraries not available

### Migration Notes
- HeroUI → native Tailwind (no component library currently)
- react-hook-form → native Svelte form handling
- Next.js routing → SvelteKit routing (nearly identical)
- Fumadocs → removed (docs moved to .agents/.architecture)

## Implementation Notes

```svelte
<script lang="ts">
  // Svelte 5 runes
  let count = $state(0);
  let doubled = $derived(count * 2);

  // Props
  let { title = 'Default' } = $props();

  // Effects
  $effect(() => {
    console.log(`Count is ${count}`);
  });
</script>

<button onclick={() => count++}>
  {count} (doubled: {doubled})
</button>
```

## References

- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- AGENTS.md SvelteKit section
