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

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
