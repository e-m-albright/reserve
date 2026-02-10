import { z } from 'zod';

/**
 * Form/API input validation schemas
 * Per AGENTS.md: Use Zod for all external data validation
 *
 * Database types are inferred from Drizzle in src/db/schema.ts.
 * These form schemas handle user input validation with custom error messages.
 */

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  inviteCode: z.string().min(1, 'Invite code is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Booking request schemas
 */
export const bookingCriteriaSchema = z.object({
  site: z.string().min(1, 'Site is required'),
  targetDate: z.string().min(1, 'Target date is required'),
  timePreference: z.enum(['morning', 'afternoon', 'evening', 'any']).default('any'),
  partySize: z.number().int().min(1).max(20).default(2),
  notes: z.string().max(500).optional(),
});

export const bookingCredentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createBookingRequestSchema = z.object({
  criteria: bookingCriteriaSchema,
  credentials: bookingCredentialsSchema,
});

export const updateBookingRequestSchema = z.object({
  criteria: bookingCriteriaSchema.optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingCriteria = z.infer<typeof bookingCriteriaSchema>;
export type BookingCredentials = z.infer<typeof bookingCredentialsSchema>;
export type CreateBookingRequestInput = z.infer<typeof createBookingRequestSchema>;
export type UpdateBookingRequestInput = z.infer<typeof updateBookingRequestSchema>;
