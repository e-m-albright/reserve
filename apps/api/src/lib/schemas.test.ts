import { describe, expect, it } from 'vitest';
import { loginSchema, signupSchema } from './schemas';

describe('signupSchema', () => {
  it('validates valid signup input', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      inviteCode: 'INVITE-1234',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
      inviteCode: 'INVITE-1234',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]?.message).toBe('Invalid email format');
    }
  });

  it('rejects short password', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
      inviteCode: 'INVITE-1234',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]?.message).toBe('Password must be at least 8 characters');
    }
  });

  it('rejects missing invite code', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      inviteCode: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('validates valid login input', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects missing password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});
