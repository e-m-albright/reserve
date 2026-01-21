---
title: Architecture Decisions
---

# Architecture Decisions

This document captures key architectural decisions made for the Reserve project.

## UI Framework: HeroUI + Tremor

**Decision**: Use HeroUI (formerly NextUI) for UI components and Tremor for dashboard visualizations.

**Rationale**:
- HeroUI provides modern, accessible React components built for Next.js
- Excellent Zod validation support (v2.7.10+)
- Tremor specializes in dashboard/metrics visualization (perfect for monitoring page)
- Both work seamlessly with Tailwind CSS
- TypeScript-first with great DX

**Alternatives Considered**:
- shadcn/ui: Copy-paste approach, more manual setup
- Mantine: Full-featured but heavier bundle
- Headless UI: Too low-level for our needs

## Form Handling: React Hook Form + Zod

**Decision**: Use React Hook Form with Zod for form validation, integrated with HeroUI components.

**Rationale**:
- React Hook Form provides performant form state management
- Zod offers type-safe schema validation
- HeroUI natively supports Zod validation via `validationErrors` prop
- @hookform/resolvers provides seamless integration

## Infrastructure: Cloudflare-Native

**Decision**: Use Cloudflare for all infrastructure (D1, Workers, Pages, R2, Queues).

**Rationale**:
- Single vendor simplifies operations
- Cost-effective for small projects
- Excellent developer experience with Wrangler
- Global edge network for low latency
- No server management required

**Trade-offs**:
- D1 is SQLite (not PostgreSQL) - acceptable for this use case
- Workers have CPU time limits - automation may need optimization
- Less flexibility than multi-cloud approach

## Monorepo: pnpm Workspaces

**Decision**: Use pnpm workspaces for monorepo structure.

**Rationale**:
- Faster installs than npm/yarn
- Better disk space efficiency
- Excellent TypeScript workspace support
- Simple dependency management across packages

## Infrastructure as Code: Pulumi

**Decision**: Use Pulumi instead of Terraform for infrastructure management.

**Rationale**:
- TypeScript-native (matches our stack)
- Better developer experience
- Type-safe infrastructure code
- Easier to maintain alongside application code

## API Framework: Hono

**Decision**: Use Hono for Cloudflare Workers API.

**Rationale**:
- Lightweight and fast
- Built for edge environments
- Excellent TypeScript support
- Simple, Express-like API
- Better than raw Workers API for complex routes

## Database ORM: Drizzle

**Decision**: Use Drizzle ORM instead of Prisma or raw SQL.

**Rationale**:
- Lightweight and performant
- Excellent TypeScript inference
- Works well with D1 (SQLite)
- SQL-like syntax (easier for SQL developers)
- Better than Prisma for edge environments

## Automation Approach: HTTP First, Browser Fallback

**Decision**: Start with HTTP requests (fetch API), fallback to Browserless.io if needed.

**Rationale**:
- Cloudflare Workers don't support Puppeteer/Playwright natively
- HTTP requests are faster and cheaper
- Many booking sites work with proper headers
- Browserless.io provides managed browser service if needed
- Keeps everything Cloudflare-native initially

## Authentication: Custom JWT with `jose` Library

**Decision**: Implement custom JWT authentication using `jose` library in Cloudflare Workers.

**Rationale**:
- Cloudflare doesn't have a "Workers Auth" product (they have API Shield and Access, but those are for different use cases)
- Full control over auth flow (invite-only signup)
- `jose` is industry standard for JWT in edge environments
- Works seamlessly with Cloudflare Workers (uses Web Crypto API)
- HTTP-only cookies for security

**Implementation**:
- JWT signing/verification with `jose` library
- Secrets stored in Cloudflare Secrets Store
- HTTP-only, SameSite=Strict cookies
- Short expiration times (15 min access, 7 day refresh)

**See**: [AUTHENTICATION.md](./AUTHENTICATION.md)

## Credential Encryption: Application-Level + D1 Encryption at Rest

**Decision**: Encrypt sensitive credentials before storing, leveraging D1's built-in encryption.

**Rationale**:
- D1 provides automatic AES-256-GCM encryption at rest
- Additional application-level encryption for defense-in-depth
- Use Web Crypto API (available in Workers)
- Encryption key stored in Cloudflare Secrets Store

**See**: [CREDENTIAL_ENCRYPTION.md](./CREDENTIAL_ENCRYPTION.md)

## Real-time Updates: Polling → SSE

**Decision**: Start with polling, upgrade to Server-Sent Events if needed.

**Rationale**:
- Polling is simplest to implement
- Works everywhere, easy to debug
- Good enough for booking status updates (not real-time critical)
- SSE provides better UX and less server load if polling becomes bottleneck
- WebSockets only if bidirectional communication needed (unlikely)

**See**: [REALTIME_UPDATES.md](./REALTIME_UPDATES.md)

## Email Notifications: Cloudflare Email Routing

**Decision**: Use Cloudflare Email Routing for email notifications.

**Rationale**:
- Cloudflare-native solution
- Free tier available
- Simple setup
- Keeps stack unified

## State Management: React State + Server Components (No Zustand Initially)

**Decision**: Start without Zustand/Redux, use React's built-in state management.

**Rationale**:
- Next.js App Router encourages Server Components (fetch data on server)
- React `useState` and `useContext` handle most needs
- React Hook Form manages form state
- Simpler mental model, less to learn
- Can add Zustand later if state becomes complex

**When Zustand Would Be Needed**:
- Complex global state shared across many components
- State persistence across navigations
- Complex interdependent state updates
- (None of these apply to our initial features)

**See**: [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)

## Error Tracking & Monitoring: Cloudflare Analytics + Umami

**Decision**: Use Cloudflare Analytics (basic) + Umami (self-hosted) for comprehensive monitoring.

**Rationale**:
- Cloudflare Analytics: Free, built-in, good for basic metrics
- Umami: Privacy-focused, open-source, self-hostable
- Umami provides user behavior tracking, custom events, funnels
- Can self-host Umami on Cloudflare Pages (free)
- Better than Google Analytics (privacy, GDPR compliant)

**What We Track**:
- User events (signup, login, booking attempts)
- System events (errors, performance)
- Business metrics (success rate, usage patterns)

**See**: [MONITORING.md](./MONITORING.md)

## Testing: Start Simple with Steel Thread E2E Test

**Decision**: Start with a simple end-to-end "steel thread" test, add more tests as needed.

**Rationale**:
- Validates entire system works together
- Catches integration issues early
- Simple to write and maintain
- Build up test coverage gradually

**Steel Thread Test**:
- Tests critical path: signup → login → configure → book → status
- Uses Playwright for E2E testing
- Add unit tests (Vitest) for complex logic as needed

**See**: [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

## CI/CD: GitHub Actions

**Decision**: Use GitHub Actions for CI/CD pipeline.

**Rationale**:
- Free for public repos
- Excellent integration with GitHub
- Easy to set up
- Cloudflare Pages auto-deploys from GitHub, but we need Actions for:
  - Running tests before deploy
  - Deploying Workers (not auto-deployed by Pages integration)
  - Running Pulumi infrastructure updates

**Why Not Just Cloudflare Pages Integration?**
- Pages integration only deploys the frontend
- Workers need separate deployment (via Wrangler)
- We want to run tests before any deployment
- Infrastructure changes need Pulumi

## Rate Limiting: Cloudflare Rate Limiting Rules

**Decision**: Use Cloudflare Rate Limiting for both API protection and booking site requests.

**Rationale**:
- Built-in Cloudflare feature
- Protects our API from abuse
- Can rate limit our automation requests to booking sites (avoid detection)
- Configure via dashboard or Pulumi

**What We Rate Limit**:
- API endpoints (prevent abuse)
- Our automation requests to booking sites (avoid bot detection)

## Database Backups: Simple and Free

**Decision**: Use Cloudflare's built-in D1 backup (if available) or simple SQL export.

**Rationale**:
- Keep it simple
- Free solutions preferred
- D1 backups (if available) or periodic SQL exports
- R2 versioning for screenshots/logs

## Admin Invite Management: CLI/Terminal Initially

**Decision**: Start with CLI/terminal for invite management, add UI later if needed.

**Rationale**:
- Simple script or API endpoint for generating invites
- Can use Cloudflare dashboard or terminal
- Admin UI can be added later if needed
- Keeps initial scope smaller
