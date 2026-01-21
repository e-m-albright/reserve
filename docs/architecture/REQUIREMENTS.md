---
title: Reserve - Requirements & Architecture
---

# Reserve - Requirements & Architecture

A fullstack webapp that helps folks ethically fight reservation bots by securing their own slots for different booking services.

## Target Booking Site

We'll be focusing on:
- **ForeUp Software**: https://app.foreupsoftware.com/index.php/booking/19765/2431#teetimes
- Starting with "Bethpage" golf course in New York

## Functional Requirements

### Frontend Features

1. **Entry Login Gate**
   - Authentication required to access the application
   - Secure login flow

2. **Invite-Only Signup**
   - Sign up flow that's inaccessible without an invite code
   - Admin-controlled invite generation

3. **Booking Configuration Interface**
   - Set desired time picking criteria
   - Store and manage booking site login credentials (encrypted)
   - Manage outstanding requests (limit: 1 active request per user)
   - Launch booking requests

4. **Monitoring Dashboard**
   - Review page for monitoring request fulfillment status
   - Real-time updates on booking attempts
   - Success/failure notifications
   - Historical logs and screenshots

### Backend Automation

1. **Competitive Booking Logic**
   - Navigate booking site quickly and competitively
   - Avoid bot detection:
     - Proper header metadata (User-Agent, Accept, etc.)
     - Random jitter/delays in navigation
     - Realistic browser fingerprinting
     - Cookie management
   - Handle rate limiting and CAPTCHAs if encountered

2. **Slot Selection**
   - Parse available slots from booking site
   - Match slots against user's criteria
   - Select best available slot

3. **User Communication**
   - Real-time status updates via WebSockets or polling
   - Success/failure notifications
   - Email notifications (optional)

4. **Admin Logging**
   - Log all actions and process outcomes
   - Capture screenshots on failures
   - Store logs in R2 for admin review
   - Admin dashboard for monitoring all requests

## Technical Architecture

### Stack Decisions

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Components**: HeroUI (formerly NextUI) + Tremor
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Deployment**: Cloudflare Pages

#### Backend
- **API Framework**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Storage**: Cloudflare R2 (for screenshots/logs)
- **Queue**: Cloudflare Queues (for booking job processing)
- **Deployment**: Cloudflare Workers

#### Automation
- **Worker**: Cloudflare Worker (queue consumer)
- **Approach**: HTTP requests with proper headers (fetch API)
- **Fallback**: Browserless.io integration if needed for complex JS-heavy sites

#### Infrastructure
- **IaC**: Pulumi (TypeScript)
- **Monorepo**: pnpm workspaces
- **Local Development**: Docker Compose (for supporting services)

#### Developer Experience
- **Language**: TypeScript (strict mode)
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler

### Project Structure

```
reserve/
├── apps/
│   ├── web/              # Next.js frontend (Cloudflare Pages)
│   ├── api/              # Cloudflare Workers API (Hono)
│   └── automation/       # Booking automation worker (Queue consumer)
├── packages/
│   └── shared/           # Shared TypeScript types and utilities
├── infra/                # Pulumi infrastructure code
└── Configuration files   # ESLint, Prettier, TypeScript, etc.
```

### Cloudflare Resources

- **D1 Database**: User data, booking requests, invites, logs
- **R2 Bucket**: Screenshots, log files
- **Cloudflare Queues**: Booking job queue
- **Cloudflare Pages**: Frontend hosting
- **Cloudflare Workers**: API and automation workers

## Decisions Made

✅ **Cloudflare-native stack** - All infrastructure on Cloudflare for simplicity
✅ **Monorepo structure** - Single codebase with pnpm workspaces
✅ **Next.js 14+** - Modern React framework with App Router
✅ **HeroUI + Tremor** - UI components and dashboard visualization
✅ **Pulumi** - Infrastructure as Code (TypeScript)
✅ **Drizzle ORM** - Type-safe database queries
✅ **Hono** - Fast, lightweight API framework for Workers
✅ **TypeScript** - Strict type checking throughout
✅ **ESLint + Prettier** - Code quality and formatting

## Decisions Made (Finalized)

### Authentication & Security
- ✅ **Authentication Strategy**: Custom JWT implementation using `jose` library
  - JWT signed/verified in Cloudflare Workers
  - HTTP-only cookies for security
  - Secrets stored in Cloudflare Secrets Store
  - See [AUTHENTICATION.md](./AUTHENTICATION.md) for details

- ✅ **Credential Encryption**: Application-level encryption + D1 encryption at rest
  - Encrypt sensitive credentials before storing (Web Crypto API)
  - Encryption key in Cloudflare Secrets Store
  - D1 provides automatic AES-256-GCM encryption at rest
  - See [CREDENTIAL_ENCRYPTION.md](./CREDENTIAL_ENCRYPTION.md) for details

- ✅ **Session Management**: HTTP-only cookies with SameSite=Strict
  - Secure, prevents XSS and CSRF
  - Short expiration times (15 min access, 7 day refresh)

### Form Handling
- ✅ **React Hook Form Integration**: 
  - HeroUI supports Zod validation natively (v2.7.10+)
  - Will use React Hook Form + Zod + HeroUI Form components

### State Management
- ✅ **Client State**: Start without Zustand/Redux
  - Use React `useState` and `useContext` for client state
  - Use Server Components for data fetching
  - Add Zustand later only if state becomes complex
  - See [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) for details

### Error Tracking & Monitoring
- ✅ **Error Tracking**: Cloudflare Analytics + R2 logging
  - Cloudflare Analytics for basic metrics
  - R2 for detailed logs and screenshots
  - No Sentry initially (keep it simple)

- ✅ **Monitoring**: Cloudflare Analytics + Umami (self-hosted)
  - Cloudflare Analytics for basic metrics (free)
  - Umami for user behavior tracking and custom events
  - Self-host Umami on Cloudflare Pages
  - See [MONITORING.md](./MONITORING.md) for details

### Testing Strategy
- ✅ **Unit Tests**: Vitest (faster, better ESM support)
- ✅ **E2E Tests**: Playwright (better for modern apps)
- ✅ **Integration Tests**: Test Workers locally with Miniflare
- ✅ **Start Simple**: Begin with a small end-to-end "steel thread" test
  - Test critical path: signup → login → create booking → check status
  - Add more tests as features are built

### CI/CD
- ✅ **GitHub Actions**: Yes - automated testing, linting, deployment
  - Test/lint on PR
  - Auto-deploy on main branch
  - Cloudflare Pages auto-deploys from GitHub, but we need Actions for:
    - Running tests before deploy
    - Deploying Workers (not auto-deployed by Pages integration)
    - Running Pulumi infrastructure updates
  - See CI/CD setup in project tasks

### User Notifications
- ✅ **Real-time Updates**: Start with polling, upgrade to SSE if needed
  - Phase 1: Simple polling (every 3-5 seconds)
  - Phase 2: Upgrade to Server-Sent Events if polling becomes bottleneck
  - WebSockets only if bidirectional communication needed (unlikely)
  - See [REALTIME_UPDATES.md](./REALTIME_UPDATES.md) for detailed trade-offs

- ✅ **Email Notifications**: Cloudflare Email Routing
  - Cloudflare-native solution
  - Free tier available
  - Simple setup

### Rate Limiting & Security
- ✅ **Rate Limiting**: Cloudflare Rate Limiting rules
  - Rate limit API endpoints (prevent abuse)
  - Rate limit our automation requests to booking sites (avoid detection)
  - Configure via Cloudflare dashboard or Pulumi

- ✅ **CSRF Protection**: Next.js built-in + SameSite cookies
  - Next.js provides CSRF protection
  - SameSite=Strict cookies add extra layer

### Admin Features
- ✅ **Admin Dashboard**: Role-based access with `isAdmin` flag
  - Same app, different UI based on role
  - Admin routes protected by middleware

- ✅ **Invite Management**: CLI/terminal for now, UI later
  - Can manage invites via terminal/Cloudflare dashboard initially
  - Admin UI can be added later if needed
  - Simple script or API endpoint for invite generation

### Local Development
- [ ] **D1 Local Emulation**: 
  - Use Wrangler's local D1 or SQLite directly?
  - **Recommendation**: Wrangler's local D1 emulation

- [ ] **Queue Testing**: 
  - How to test queue consumers locally?
  - **Recommendation**: Wrangler dev mode supports local queue testing

### Data Migration & Backup
- ✅ **Database Migrations**: Drizzle Kit migrations
  - Version controlled migrations
  - Run via CI/CD or manual

- ✅ **Backup Strategy**: Simple and free
  - D1: Use Cloudflare's built-in backup (if available) or export SQL
  - R2: Enable versioning for screenshots/logs
  - Keep it simple, no complex backup infrastructure needed

## Next Steps

1. ✅ Set up monorepo structure
2. ✅ Configure HeroUI + Tremor
3. ✅ Finalize architecture decisions
4. ⏳ Implement authentication (invite-only signup with JWT)
5. ⏳ Build booking configuration UI
6. ⏳ Implement automation worker logic
7. ⏳ Set up logging and screenshot capture
8. ⏳ Build monitoring dashboard
9. ⏳ Set up CI/CD pipeline (GitHub Actions)
10. ⏳ Add testing infrastructure (start with steel thread E2E test)
11. ⏳ Set up Umami analytics
12. ⏳ Configure rate limiting

## Notes

- Automation approach: Start with HTTP requests (fetch API) with proper headers. If the booking site requires heavy JavaScript execution, integrate Browserless.io or similar service.
- All Cloudflare-native approach keeps infrastructure simple and cost-effective.
- Monorepo structure allows shared types and utilities across frontend/backend.
