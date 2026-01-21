---
title: Rate Limiting Strategy
---

# Rate Limiting Strategy

## What Are We Rate Limiting?

### 1. Our API Endpoints (Protect Ourselves)

**Why**: Prevent abuse, DDoS, brute force attacks

**What to Rate Limit**:
- Login attempts (prevent brute force)
- Signup requests (prevent spam)
- API endpoints (general protection)
- Booking request creation (prevent abuse)

**Configuration**:
- Login: 5 attempts per 15 minutes per IP
- Signup: 3 attempts per hour per IP
- API: 100 requests per minute per IP
- Booking creation: 1 request per user (enforced in app logic too)

**Implementation**: Cloudflare Rate Limiting rules

---

### 2. Our Automation Requests to Booking Sites (Avoid Detection)

**Why**: Booking sites may detect and block automated requests if we're too aggressive

**What to Rate Limit**:
- Requests to ForeUp booking site
- Navigation between pages
- Form submissions

**Configuration**:
- Add random jitter/delays (100-500ms)
- Limit requests per minute (e.g., max 10 requests/minute)
- Respect booking site's rate limits (if detectable)

**Implementation**: Custom logic in automation worker + Cloudflare Rate Limiting

---

## Implementation

### Cloudflare Rate Limiting Rules

Configure via Cloudflare Dashboard or Pulumi:

```typescript
// Example: Rate limit login endpoint
new cloudflare.RateLimit('login-rate-limit', {
  zoneId: zone.id,
  threshold: 5,
  period: 900, // 15 minutes
  match: {
    request: {
      urlPattern: '*/api/auth/login',
      schemes: ['HTTP', 'HTTPS'],
    },
  },
  action: {
    mode: 'simulate', // Start with simulate, change to 'ban' later
    timeout: 900,
  },
});
```

### Application-Level Rate Limiting

For booking site requests, implement in automation worker:

```typescript
// Add jitter to requests
const delay = Math.random() * 400 + 100; // 100-500ms
await new Promise(resolve => setTimeout(resolve, delay));

// Track request rate
const requestsThisMinute = await getRequestCount(userId);
if (requestsThisMinute > 10) {
  await waitUntilNextMinute();
}
```

## Best Practices

- Start with "simulate" mode to test
- Monitor rate limit hits
- Adjust thresholds based on usage
- Use different limits for authenticated vs anonymous users
- Consider user-based rate limiting (not just IP-based)
