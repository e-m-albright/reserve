// Shared types and utilities

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  isAdmin: boolean;
}

export interface BookingRequest {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  criteria: BookingCriteria;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCriteria {
  preferredTimes: string[];
  dateRange: {
    start: string;
    end: string;
  };
  courseId?: string;
}

export interface BookingCredentials {
  email: string;
  password: string;
}

export interface BookingResult {
  success: boolean;
  slotId?: string;
  slotTime?: string;
  error?: string;
  screenshotUrl?: string;
}
