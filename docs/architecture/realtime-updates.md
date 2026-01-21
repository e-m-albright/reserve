---
title: Real-time Updates
---

# Real-time Updates: Trade-offs Analysis

## Options Comparison

### 1. Polling (Recommended to Start)

**How it works**: Frontend makes periodic requests (e.g., every 2-5 seconds) to check for updates.

**Pros**:
- ✅ Simplest to implement
- ✅ Works everywhere (no special server support needed)
- ✅ Easy to debug
- ✅ Works with Cloudflare Workers (no special setup)
- ✅ Handles reconnections automatically
- ✅ Good enough for booking status updates (not real-time critical)

**Cons**:
- ❌ Higher server load (more requests)
- ❌ Slight delay (up to polling interval)
- ❌ Wastes bandwidth when nothing changes
- ❌ Not truly "real-time"

**Best for**: Status updates that don't need instant notification (booking status, logs)

**Implementation**: 
```typescript
// Simple polling hook
useEffect(() => {
  const interval = setInterval(() => {
    fetchBookingStatus();
  }, 3000); // Poll every 3 seconds
  return () => clearInterval(interval);
}, []);
```

---

### 2. Server-Sent Events (SSE)

**How it works**: Server pushes updates to client over HTTP connection. Client keeps connection open.

**Pros**:
- ✅ True one-way real-time updates
- ✅ Simpler than WebSockets (just HTTP)
- ✅ Automatic reconnection built-in
- ✅ Works with Cloudflare Workers (via streaming responses)
- ✅ Lower latency than polling
- ✅ Less server load than polling

**Cons**:
- ❌ One-way only (client can't send data back easily)
- ❌ Connection limits (browsers limit ~6 per domain)
- ❌ More complex than polling
- ❌ Need to handle connection drops

**Best for**: Dashboard updates, notifications, live logs

**Implementation**:
```typescript
// Worker SSE endpoint
export default {
  async fetch(request, env) {
    const stream = new ReadableStream({
      start(controller) {
        // Send updates as they happen
        controller.enqueue(`data: ${JSON.stringify(update)}\n\n`);
      }
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  }
};
```

---

### 3. WebSockets

**How it works**: Full-duplex connection, both client and server can send messages.

**Pros**:
- ✅ True real-time bidirectional communication
- ✅ Lowest latency
- ✅ Most efficient for frequent updates
- ✅ Standard protocol

**Cons**:
- ❌ Most complex to implement
- ❌ Cloudflare Workers have limited WebSocket support (Durable Objects needed)
- ❌ Connection management is complex
- ❌ Need to handle reconnections, heartbeats
- ❌ Overkill for one-way status updates

**Best for**: Chat apps, collaborative editing, games

**Implementation**: Requires Durable Objects for stateful connections in Cloudflare.

---

## Recommendation for Reserve

### Phase 1: Start with Polling ✅
- **Why**: Simplest, works immediately, good enough for booking status
- **Frequency**: Poll every 3-5 seconds when user is on monitoring page
- **Optimization**: Only poll when page is visible (use Page Visibility API)

### Phase 2: Upgrade to SSE (if needed)
- **When**: If polling creates too much load or users want instant updates
- **Why**: Better UX, less server load, still simple
- **Implementation**: Add SSE endpoint to Workers, use EventSource API

### Phase 3: WebSockets (probably never needed)
- **When**: Only if we need bidirectional real-time communication
- **Why**: Overkill for status updates

## Implementation Plan

1. **Start**: Simple polling hook in React
2. **Optimize**: Only poll when tab is visible, stop when user navigates away
3. **Upgrade**: Add SSE endpoint if polling becomes a bottleneck
4. **Monitor**: Track polling frequency and server load
