/**
 * Client-side booking request utilities
 */

export interface BookingCriteria {
  site: string;
  targetDate: string;
  timePreference: 'morning' | 'afternoon' | 'evening' | 'any';
  partySize: number;
  notes?: string;
}

export interface BookingCredentials {
  username: string;
  password: string;
}

export interface BookingRequest {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  criteria: BookingCriteria;
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * List user's booking requests
 */
export async function listBookingRequests(): Promise<BookingRequest[]> {
  const response = await fetch(`${API_URL}/api/booking-requests`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch booking requests');
  }

  const data = await response.json();
  return data.requests;
}

/**
 * Get a specific booking request
 */
export async function getBookingRequest(id: string): Promise<BookingRequest> {
  const response = await fetch(`${API_URL}/api/booking-requests/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch booking request');
  }

  const data = await response.json();
  return data.request;
}

/**
 * Create a new booking request
 */
export async function createBookingRequest(
  criteria: BookingCriteria,
  credentials: BookingCredentials
): Promise<BookingRequest> {
  const response = await fetch(`${API_URL}/api/booking-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ criteria, credentials }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create booking request');
  }

  const data = await response.json();
  return data.request;
}

/**
 * Update a booking request
 */
export async function updateBookingRequest(
  id: string,
  criteria: Partial<BookingCriteria>
): Promise<void> {
  const response = await fetch(`${API_URL}/api/booking-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ criteria }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update booking request');
  }
}

/**
 * Delete a booking request
 */
export async function deleteBookingRequest(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/booking-requests/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete booking request');
  }
}

/**
 * Format status for display
 */
export function formatStatus(status: BookingRequest['status']): string {
  const labels: Record<BookingRequest['status'], string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  };
  return labels[status];
}

/**
 * Get status color class
 */
export function getStatusColor(status: BookingRequest['status']): string {
  const colors: Record<BookingRequest['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[status];
}
