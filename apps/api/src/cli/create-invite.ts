#!/usr/bin/env bun
/**
 * CLI tool to create invite codes
 *
 * Usage:
 *   bun run apps/api/src/cli/create-invite.ts <admin-email>
 *   just invite admin@example.com
 */

import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get paths for wrangler execution
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '../../../..');
const WRANGLER_CONFIG = 'apps/api/wrangler.toml';

function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 21);
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part1 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `INVITE-${part1}-${part2}`;
}

async function main() {
  const adminEmail = process.argv[2];

  if (!adminEmail) {
    console.log('Usage: just invite <admin-email>');
    console.log('');
    console.log('Creates a new invite code using the specified admin account.');
    console.log('The admin must already exist in the database.');
    process.exit(1);
  }

  // Look up admin user
  let adminId: string;
  try {
    const result = execSync(
      `bunx wrangler d1 execute reserve --local -c ${WRANGLER_CONFIG} --command "SELECT id, is_admin FROM users WHERE email = '${adminEmail.toLowerCase()}'" --json`,
      { cwd: ROOT_DIR, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const parsed = JSON.parse(result);
    const user = parsed[0]?.results?.[0];

    if (!user) {
      console.log(`❌ User not found: ${adminEmail}`);
      process.exit(1);
    }

    if (!user.is_admin) {
      console.log(`❌ User is not an admin: ${adminEmail}`);
      process.exit(1);
    }

    adminId = user.id;
  } catch (_error) {
    console.log('❌ Failed to query database. Is the API running?');
    console.log('   Run: just dev-api');
    process.exit(1);
  }

  // Create invite
  const inviteCode = generateInviteCode();
  const inviteId = generateId();
  const now = Math.floor(Date.now() / 1000);

  try {
    execSync(
      `bunx wrangler d1 execute reserve --local -c ${WRANGLER_CONFIG} --command "INSERT INTO invites (id, code, created_by, created_at) VALUES ('${inviteId}', '${inviteCode}', '${adminId}', ${now})"`,
      { cwd: ROOT_DIR, stdio: 'pipe' }
    );

    console.log('');
    console.log('✅ Invite code created!');
    console.log('');
    console.log(`   ${inviteCode}`);
    console.log('');
    console.log('Share this code with the user. They can sign up at /signup');
    console.log('');
  } catch (_error) {
    console.log('❌ Failed to create invite code');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
