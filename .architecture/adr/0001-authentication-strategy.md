# ADR 0001: Authentication Strategy

**Status:** Accepted
**Date:** 2026-02-09
**Decision Makers:** Project team

## Context

The application requires user authentication with secure session management. Key requirements:
- Protect against XSS token theft
- Support token refresh without requiring re-login
- Work within Cloudflare Workers constraints
- Enable stateless authentication for edge deployment

## Decision

Implement JWT-based authentication with httpOnly cookies:

1. **Access tokens** (short-lived, 15 minutes)
   - Stored in httpOnly cookie
   - Used for API authentication

2. **Refresh tokens** (long-lived, 7 days)
   - Stored in separate httpOnly cookie
   - Used only at `/api/auth/refresh` endpoint

3. **Cookie security settings**
   - `httpOnly: true` - prevents JavaScript access
   - `secure: true` - HTTPS only in production
   - `sameSite: 'lax'` - CSRF protection
   - `path: '/'` for access, `/api/auth` for refresh

4. **JWT library:** jose (Edge-compatible, no Node.js dependencies)

## Alternatives Considered

### Session-based auth with database
- **Pros:** Immediate revocation, familiar pattern
- **Cons:** Database lookup per request, stateful, higher latency at edge

### JWT in localStorage
- **Pros:** Simple implementation
- **Cons:** Vulnerable to XSS, tokens accessible to JavaScript

### OAuth/OIDC providers
- **Pros:** Offload auth complexity, social login
- **Cons:** External dependency, invite-only system doesn't need social login

## Consequences

### Positive
- Tokens not accessible to client-side JavaScript (XSS protection)
- Stateless verification at edge (low latency)
- Automatic cookie handling by browsers
- Token refresh transparent to users

### Negative
- Cannot revoke tokens before expiry (mitigated by short access token lifetime)
- Requires CORS configuration for cross-origin requests
- Slightly more complex cookie management

### Risks
- Token theft via cookie if HTTPS compromised (mitigated by secure flag)
- Refresh token rotation not implemented (acceptable for current threat model)

## Implementation Notes

```typescript
// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: ACCESS_TOKEN_EXPIRY,
};
```

## References

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [jose library](https://github.com/panva/jose)
