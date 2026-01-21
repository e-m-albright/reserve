---
title: Authentication Strategy
---

# Authentication Strategy

## Decision: Custom JWT Implementation using Cloudflare Workers

**Note**: Cloudflare doesn't have a "Workers Auth" product, but we'll implement JWT authentication using Cloudflare Workers with the `jose` library (industry standard for JWT in edge environments).

## Implementation Approach

### Libraries
- **`jose`** - JWT signing/verification using Web Crypto API (works in Workers)
- **`@sagi.io/workers-jwt`** - Alternative, simpler JWT library for Workers

### Flow
1. User signs up with invite code → password hashed with Web Crypto API
2. User logs in → JWT issued (signed with secret from Cloudflare Secrets)
3. JWT stored in HTTP-only cookie (secure, SameSite=Strict)
4. Worker middleware validates JWT on each request
5. User ID extracted from JWT for authorization

### Security Features
- HTTP-only cookies (prevents XSS)
- SameSite=Strict (prevents CSRF)
- Short expiration times (15 min access token, 7 day refresh token)
- Secure password hashing (Web Crypto API PBKDF2 or Argon2)
- Secrets stored in Cloudflare Secrets Store

### Why Not Cloudflare Access?
- Cloudflare Access is for protecting entire apps behind SSO
- We need custom invite-only signup flow
- We need user management in our database
- Access is more for enterprise SSO integration
