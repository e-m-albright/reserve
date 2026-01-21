---
title: Monitoring & Analytics Strategy
---

# Monitoring & Analytics Strategy

## Decision: Cloudflare Analytics + Umami (Self-hosted)

## Cloudflare Analytics Limitations

**What Cloudflare Analytics Provides**:
- ✅ Basic page views
- ✅ Request counts
- ✅ Error rates
- ✅ Geographic data
- ✅ Basic performance metrics

**What Cloudflare Analytics Lacks**:
- ❌ User behavior tracking (clicks, form interactions)
- ❌ Custom events (booking attempts, errors)
- ❌ User funnels (signup → configure → book)
- ❌ Real-time dashboards
- ❌ Historical data retention (limited)
- ❌ Custom metrics

## Solution: Umami

**What is Umami?**
- Open-source, privacy-focused analytics
- Self-hosted (can run on Cloudflare Pages/Workers or separate)
- GDPR compliant
- Lightweight (~2KB script)
- Beautiful dashboards

**Why Umami?**
- ✅ Free and open-source
- ✅ Privacy-focused (no cookies, GDPR compliant)
- ✅ Can self-host on Cloudflare Pages
- ✅ Custom events support
- ✅ User funnels and behavior tracking
- ✅ Real-time dashboards
- ✅ Better than Google Analytics (privacy)

**Alternatives Considered**:
- Google Analytics: Privacy concerns, heavy
- Plausible: Paid, but simpler
- Posthog: More features but heavier
- Custom solution: Too much work

## Implementation Plan

### Phase 1: Cloudflare Analytics (Free)
- Basic metrics out of the box
- No setup needed
- Use for basic monitoring

### Phase 2: Add Umami (Self-hosted)
- Deploy Umami to Cloudflare Pages (or separate service)
- Add Umami script to Next.js app
- Track custom events:
  - User signups
  - Booking attempts
  - Errors
  - Form submissions

### Phase 3: Custom Metrics (if needed)
- Use Cloudflare Workers Analytics Engine
- Track custom metrics (booking success rate, etc.)
- Export to dashboard

## What We'll Track

### User Events
- Signup (with invite code)
- Login
- Booking configuration created
- Booking request launched
- Booking success/failure

### System Events
- API errors
- Worker execution time
- Queue processing time
- Database query performance

### Business Metrics
- Active users
- Booking success rate
- Average time to book
- Peak usage times
