import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './auth/routes';
import bookingRoutes from './booking/routes';
import { requestLogger } from './middleware/request-logger';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Request logging middleware (first, to capture all requests)
app.use('*', requestLogger);

// CORS middleware - allow credentials from frontend
app.use(
  '/*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.route('/api/auth', authRoutes);

// Booking request routes
app.route('/api/booking-requests', bookingRoutes);

export default app;
