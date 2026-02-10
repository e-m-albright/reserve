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

/**
 * Get current user from API
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      credentials: 'include',
      cache: 'no-store',
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
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignore errors on logout
  }
}
