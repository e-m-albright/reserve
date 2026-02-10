import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './auth/routes';
import { requestLogger } from './middleware/request-logger';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Request logging middleware (first, to capture all requests)
app.use('*', requestLogger);

// CORS middleware
app.use('/*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.route('/api/auth', authRoutes);

// API routes will be added here
app.get('/api/*', (c) => {
  return c.json({ message: 'API endpoint placeholder' }, 404);
});

export default app;
