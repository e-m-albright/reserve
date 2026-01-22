---
title: Testing Locally
---

# Testing the Application Locally

## Current Status

The project is currently a **skeleton** - the infrastructure is set up, but core functionality hasn't been implemented yet. Here's what you can test right now:

## What's Working

### 1. Frontend (Next.js)
- ✅ Home page loads at `http://localhost:3000` (or 3001 if 3000 is busy)
- ✅ Documentation at `http://localhost:3000/docs`
- ⏳ No functional features yet (login, booking config, etc.)

### 2. API Worker
- ✅ Health check endpoint: `http://localhost:8787/health`
- ⏳ Authentication endpoints (not implemented)
- ⏳ Booking endpoints (not implemented)

### 3. Automation Worker
- ✅ Queue consumer structure (ready to process jobs)
- ⏳ Booking logic (TODO)

### 4. Database
- ✅ Schema defined (users, invites, booking_requests, logs)
- ⏳ Migrations need to be run (requires local D1 database)

## Quick Test Checklist

### 1. Verify Services Are Running

```bash
# Start all services
just dev

# In separate terminals, verify each service:
```

**Frontend:**
```bash
curl http://localhost:3000
# Should return HTML
```

**API Worker:**
```bash
curl http://localhost:8787/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Docs:**
```bash
# Visit in browser
open http://localhost:3000/docs
```

### 2. Test Database Connection

```bash
# First, start Wrangler dev to create local D1 database
cd apps/api
wrangler dev
# (Let it start, then Ctrl+C)

# Generate migrations (if schema changed)
just db-generate

# Apply migrations
just db-migrate

# Open Drizzle Studio to view database
just db-studio
# Opens at http://localhost:4983
```

### 3. Test Queue (When Implemented)

```bash
# API worker sends to queue
curl -X POST http://localhost:8787/api/booking-requests \
  -H "Content-Type: application/json" \
  -d '{"criteria": {...}, "credentials": {...}}'

# Automation worker processes from queue automatically
```

## What Needs to Be Built

Based on the requirements, here's the implementation order:

### Phase 1: Authentication (First Priority)
1. **Invite code generation** (CLI/terminal for now)
2. **Signup flow** with invite code validation
3. **Login flow** with JWT generation
4. **Protected routes** middleware

### Phase 2: Core Features
5. **Booking configuration UI** (form to set criteria)
6. **Credential storage** (encrypted in D1)
7. **Request submission** (API endpoint to create booking request)

### Phase 3: Automation
8. **Booking automation logic** (HTTP requests to booking site)
9. **Queue processing** (automation worker consumes jobs)
10. **Status updates** (polling or SSE)

### Phase 4: Monitoring
11. **Dashboard UI** (view requests, status, logs)
12. **Screenshot capture** (on failures)
13. **Logging** (to R2)

## Next Steps to Build Functionality

### Start with Authentication

1. **Install JWT library:**
   ```bash
   cd apps/api
   pnpm add jose
   ```

2. **Create invite code** (CLI):
   ```bash
   just invite-generate
   # Output: INVITE-XXXX
   ```

3. **Implement signup endpoint** (`/api/auth/signup`)
4. **Implement login endpoint** (`/api/auth/login`)
5. **Add JWT middleware** for protected routes

### Then Build Booking UI

6. **Create booking form** (React Hook Form + Zod)
7. **Store credentials** (encrypted)
8. **Submit booking request** (API endpoint)

## Testing What Exists Now

```bash
# 1. Health check
curl http://localhost:8787/health

# 2. Check docs
open http://localhost:3000/docs

# 3. Check database (after running migrations)
just db-studio
```

## Troubleshooting

### "Cannot connect to D1 database"
- Run `wrangler dev` once to create local D1 database
- Then run migrations: `just db-migrate`

### "Queue configuration error"
- Fixed in latest code (queue format updated)
- Restart workers: `just dev`

### "Port already in use"
- Next.js will auto-select next available port
- Check terminal output for actual port number
