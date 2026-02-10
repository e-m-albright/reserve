/**
 * Client-side auth utilities
 */

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  user: User;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * Get current user from API
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data: AuthResponse = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  return data.user;
}

/**
 * Signup user
 */
export async function signup(email: string, password: string, inviteCode: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email,
      password,
      inviteCode: inviteCode.toUpperCase(),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Signup failed');
  }

  const data: AuthResponse = await response.json();
  return data.user;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignore errors on logout
  }
}
