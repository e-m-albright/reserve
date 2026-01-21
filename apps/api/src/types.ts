export interface Env {
  DB: D1Database;
  LOGS: R2Bucket;
  BOOKING_QUEUE: Queue;
  AUTH_SECRET: string;
  ADMIN_EMAIL: string;
}
