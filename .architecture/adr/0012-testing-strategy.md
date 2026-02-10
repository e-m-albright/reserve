---
title: Testing Strategy
---

# Testing Strategy

## Decision: Start Simple, Build Up

## Phase 1: Steel Thread E2E Test (Start Here)

**What is a "Steel Thread" test?**
- Tests the critical path end-to-end
- Verifies the core functionality works
- Simple, focused, fast

**Our Steel Thread Test**:
```typescript
// Test: Complete booking flow
1. User signs up with invite code
2. User logs in
3. User creates booking configuration
4. User launches booking request
5. System processes booking (mock)
6. User views booking status
```

**Why Start Here?**
- ✅ Validates entire system works together
- ✅ Catches integration issues early
- ✅ Simple to write and maintain
- ✅ Gives confidence before adding features

**Tools**: Playwright (E2E) + Vitest (test runner)

## Phase 2: Add Unit Tests (As Needed)

**When to add**:
- Complex logic (encryption, JWT validation)
- Utility functions
- Business logic (booking matching, etc.)

**Tools**: Vitest

## Phase 3: Integration Tests

**What to test**:
- API endpoints
- Database operations
- Worker functions

**Tools**: Vitest + Miniflare (local Workers testing)

## Testing Stack

- **E2E**: Playwright
- **Unit/Integration**: Vitest
- **Local Workers**: Miniflare
- **CI**: GitHub Actions

## Example Steel Thread Test

```typescript
import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
  // 1. Signup
  await page.goto('/signup');
  await page.fill('[name="inviteCode"]', 'TEST-INVITE');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 2. Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 3. Create booking config
  await page.goto('/configure');
  await page.fill('[name="preferredTimes"]', '08:00,09:00');
  await page.fill('[name="bookingEmail"]', 'booking@example.com');
  await page.fill('[name="bookingPassword"]', 'booking-pass');
  await page.click('button[type="submit"]');
  
  // 4. Launch booking
  await page.click('button:has-text("Launch Booking")');
  
  // 5. Check status
  await page.goto('/status');
  await expect(page.locator('[data-testid="status"]')).toContainText('processing');
});
```
