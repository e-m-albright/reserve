---
title: Architecture Documentation
---

# Architecture Documentation

This section covers the system architecture, design decisions, and technical details.

## Overview

- **[Requirements](./REQUIREMENTS.md)** - Functional and technical requirements
- **[Decisions](./decisions.md)** - Architecture decision records (ADRs)

## Key Decisions

- **[Authentication](./authentication.md)** - JWT authentication strategy
- **[Real-time Updates](./realtime-updates.md)** - Polling vs SSE vs WebSockets
- **[State Management](./state-management.md)** - Client state approach
- **[Credential Encryption](./credential-encryption.md)** - Security practices

## Technical Deep Dives

- **[Rate Limiting](./rate-limiting.md)** - Rate limiting strategy
- **[Monitoring](./monitoring.md)** - Analytics and monitoring approach
- **[Testing Strategy](./testing-strategy.md)** - Testing approach

## Stack

- **Frontend**: Next.js 14+ (App Router), HeroUI, Tremor
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Infrastructure**: Pulumi (TypeScript)
