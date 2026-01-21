import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const invites = sqliteTable('invites', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  createdBy: text('created_by').notNull().references(() => users.id),
  usedBy: text('used_by').references(() => users.id),
  usedAt: integer('used_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const bookingRequests = sqliteTable('booking_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status', {
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
    .notNull()
    .default('pending'),
  criteria: text('criteria').notNull(), // JSON string
  credentials: text('credentials').notNull(), // Encrypted JSON string
  result: text('result'), // JSON string
  error: text('error'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  bookingRequestId: text('booking_request_id').references(() => bookingRequests.id),
  level: text('level', { enum: ['info', 'warn', 'error'] }).notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'), // JSON string
  screenshotUrl: text('screenshot_url'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
