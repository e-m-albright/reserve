import * as cloudflare from '@pulumi/cloudflare';
import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();

// D1 Database
const database = new cloudflare.D1Database('reserve-db', {
  name: 'reserve',
  accountId: config.require('cloudflareAccountId'),
});

// R2 Bucket for logs and screenshots
const logsBucket = new cloudflare.R2Bucket('reserve-logs', {
  name: 'reserve-logs',
  accountId: config.require('cloudflareAccountId'),
});

// Queue for booking jobs
const bookingQueue = new cloudflare.Queue('booking-queue', {
  name: 'booking-queue',
  accountId: config.require('cloudflareAccountId'),
});

// Export resources
export const databaseId = database.id;
export const databaseName = database.name;
export const logsBucketName = logsBucket.name;
export const queueName = bookingQueue.name;
