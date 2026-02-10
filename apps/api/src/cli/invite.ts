#!/usr/bin/env node
/**
 * CLI tool to generate invite codes
 * Usage: pnpm tsx src/cli/invite.ts [--admin]
 */

import { drizzle } from 'drizzle-orm/d1';
import { nanoid } from 'nanoid';
import { invites } from '../db/schema';
import type { Env } from '../types';

// Generate a readable invite code (e.g., INVITE-XXXX-XXXX)
function generateInviteCode(): string {
  const part1 = nanoid(4).toUpperCase();
  const part2 = nanoid(4).toUpperCase();
  return `INVITE-${part1}-${part2}`;
}

async function createInvite(env: Env, adminUserId: string): Promise<string> {
  const db = drizzle(env.DB);
  const code = generateInviteCode();
  const inviteId = nanoid();

  await db.insert(invites).values({
    id: inviteId,
    code,
    createdBy: adminUserId,
  });

  return code;
}

async function main() {
  // This script is meant to be run via wrangler or with D1 access
  // For local development, we'll need to get the DB from env
  console.log('Invite code generation');
  console.log('====================');
  console.log('');
  console.log('To generate an invite code, you can:');
  console.log('1. Use the API endpoint (requires admin auth)');
  console.log('2. Use Wrangler to run this script with DB access');
  console.log('3. Use Drizzle Studio to manually insert invites');
  console.log('');
  console.log("For now, here's a generated code you can manually insert:");
  console.log(`Code: ${generateInviteCode()}`);
  console.log('');
  console.log('To insert manually via Drizzle Studio:');
  console.log('1. Run: just db-studio');
  console.log('2. Navigate to invites table');
  console.log('3. Insert with:');
  console.log('   - id: (any unique ID)');
  console.log('   - code: (the code above)');
  console.log('   - created_by: (admin user ID)');
  console.log('   - created_at: (current timestamp)');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generateInviteCode, createInvite };
