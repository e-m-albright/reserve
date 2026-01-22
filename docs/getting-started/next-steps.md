---
title: Next Steps - Building Functionality
---

# Next Steps: Building Functionality

## Current Status

✅ **Infrastructure Ready:**
- Monorepo structure
- Database schema defined
- Workers configured
- Frontend skeleton
- Documentation system

⏳ **Functionality Needed:**
- Authentication (signup/login)
- Booking configuration UI
- API endpoints
- Automation logic
- Monitoring dashboard

## Implementation Roadmap

### Step 1: Fix Queue Config & Start Workers

The queue configuration needs to be fixed first. Once fixed, you can start all workers:

```bash
just dev
```

This should start:
- Web app on `http://localhost:3000`
- API worker on `http://localhost:8787`
- Automation worker (queue consumer)

### Step 2: Set Up Local Database

```bash
# Start Wrangler dev once to create local D1 database
cd apps/api
wrangler dev
# Let it start, then Ctrl+C

# Apply migrations
just db-migrate

# View database
just db-studio
# Opens at http://localhost:4983
```

### Step 3: Build Authentication (First Feature)

**Install JWT library:**
```bash
cd apps/api
pnpm add jose
```

**Create these endpoints:**
1. `POST /api/auth/signup` - Sign up with invite code
2. `POST /api/auth/login` - Login with email/password
3. `GET /api/auth/me` - Get current user (protected)

**Frontend:**
1. Login page component
2. Signup page component
3. Protected route wrapper

### Step 4: Build Booking Configuration

**Frontend:**
1. Booking form (React Hook Form + Zod)
2. Credential storage form
3. Request submission

**API:**
1. `POST /api/booking-requests` - Create booking request
2. `GET /api/booking-requests` - List user's requests
3. `GET /api/booking-requests/:id` - Get request status

### Step 5: Implement Automation

**Automation Worker:**
1. HTTP request logic to booking site
2. Slot parsing and matching
3. Booking submission
4. Error handling and logging

## Quick Test Commands

```bash
# Test health endpoint (when API is running)
curl http://localhost:8787/health

# Test docs
open http://localhost:3000/docs

# View database (after migrations)
just db-studio
```

## What to Build First?

**Recommended order:**
1. ✅ Fix queue config (blocking workers from starting)
2. ✅ Set up local D1 database
3. ⏳ Authentication (signup/login) - **Start here for functionality**
4. ⏳ Booking configuration UI
5. ⏳ API endpoints
6. ⏳ Automation logic

The authentication system is the foundation - everything else depends on users being able to sign up and log in.
