import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('/*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes will be added here
app.get('/api/*', (c) => {
  return c.json({ message: 'API endpoint placeholder' }, 404);
});

export default app;
