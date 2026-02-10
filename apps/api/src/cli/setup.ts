#!/usr/bin/env bun
/**
 * Interactive setup script for Reserve
 * Creates admin user and initial invite code
 *
 * Usage:
 *   bun run apps/api/src/cli/setup.ts
 *   just setup-admin
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import * as readline from 'node:readline';

/**
 * Hash password using Web Crypto API (PBKDF2)
 * Inlined here to avoid importing jose dependency
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const saltArray = Array.from(salt);
  return `${saltArray.map((b) => b.toString(16).padStart(2, '0')).join('')}:${hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

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

function runD1Command(sql: string): boolean {
  try {
    execSync(`bunx wrangler d1 execute reserve --local --command "${sql.replace(/"/g, '\\"')}"`, {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    return true;
  } catch (_error) {
    return false;
  }
}

function checkD1Exists(): boolean {
  try {
    execSync('bunx wrangler d1 execute reserve --local --command "SELECT 1"', {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════╗');
  console.log('║     Reserve Admin Setup Wizard        ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');

  // Check if .dev.vars exists
  const devVarsPath = 'apps/api/.dev.vars';
  if (!existsSync(devVarsPath)) {
    console.log('⚠️  No .dev.vars file found. Run "just setup" first.');
    rl.close();
    process.exit(1);
  }

  // Check D1 database
  console.log('Checking local D1 database...');
  if (!checkD1Exists()) {
    console.log('⚠️  Local D1 database not found.');
    console.log('   Run "just dev-api" once to initialize it, then run this script again.');
    rl.close();
    process.exit(1);
  }
  console.log('✅ D1 database found\n');

  // Get admin email
  const devVars = readFileSync(devVarsPath, 'utf-8');
  const adminEmailMatch = devVars.match(/ADMIN_EMAIL=(.+)/);
  const defaultEmail = adminEmailMatch?.[1]?.trim() || '';

  let email = await prompt(`Admin email${defaultEmail ? ` [${defaultEmail}]` : ''}: `);
  if (!email && defaultEmail) {
    email = defaultEmail;
  }
  if (!email || !email.includes('@')) {
    console.log('❌ Invalid email address');
    rl.close();
    process.exit(1);
  }

  // Get password
  const password = await prompt('Admin password (min 8 chars): ');
  if (password.length < 8) {
    console.log('❌ Password must be at least 8 characters');
    rl.close();
    process.exit(1);
  }

  console.log('\nCreating admin account...');

  // Generate password hash
  const passwordHash = await hashPassword(password);
  const userId = generateId();
  const now = Math.floor(Date.now() / 1000);

  // Check if user already exists
  try {
    const checkResult = execSync(
      `bunx wrangler d1 execute reserve --local --command "SELECT id FROM users WHERE email = '${email.toLowerCase()}'"`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );
    if (checkResult.includes('"results":[{')) {
      console.log('⚠️  User with this email already exists.');
      const proceed = await prompt('Create invite code only? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        rl.close();
        process.exit(0);
      }
    } else {
      // Create user
      const insertUserSql = `INSERT INTO users (id, email, password_hash, is_admin, created_at) VALUES ('${userId}', '${email.toLowerCase()}', '${passwordHash}', 1, ${now})`;
      if (!runD1Command(insertUserSql)) {
        console.log('❌ Failed to create user. Database may need migration.');
        console.log('   Run: just db-migrate');
        rl.close();
        process.exit(1);
      }
      console.log('✅ Admin user created');
    }
  } catch {
    // Table might not exist
    console.log('❌ Database tables not found. Run migrations first:');
    console.log('   just db-migrate');
    rl.close();
    process.exit(1);
  }

  // Get user ID (either new or existing)
  let finalUserId = userId;
  try {
    const result = execSync(
      `bunx wrangler d1 execute reserve --local --command "SELECT id FROM users WHERE email = '${email.toLowerCase()}'" --json`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );
    const parsed = JSON.parse(result);
    if (parsed[0]?.results?.[0]?.id) {
      finalUserId = parsed[0].results[0].id;
    }
  } catch {
    // Use the newly created ID
  }

  // Create invite code
  console.log('\nCreating invite code...');
  const inviteCode = generateInviteCode();
  const inviteId = generateId();

  const insertInviteSql = `INSERT INTO invites (id, code, created_by, created_at) VALUES ('${inviteId}', '${inviteCode}', '${finalUserId}', ${now})`;
  if (!runD1Command(insertInviteSql)) {
    console.log('⚠️  Could not create invite code (may already have one)');
  } else {
    console.log('✅ Invite code created');
  }

  // Summary
  console.log(`\n${'═'.repeat(50)}`);
  console.log('');
  console.log('🎉 Setup complete!');
  console.log('');
  console.log('Admin Account:');
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${'*'.repeat(password.length)}`);
  console.log('');
  console.log('Invite Code (for signing up other users):');
  console.log(`   ${inviteCode}`);
  console.log('');
  console.log('Next steps:');
  console.log('   1. Start the servers:  just dev');
  console.log('   2. Open the app:       http://localhost:5173');
  console.log('   3. Login with your admin credentials');
  console.log('   4. Share invite codes with users via API:');
  console.log('      POST /api/auth/invites (requires admin auth)');
  console.log('');

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err.message);
  rl.close();
  process.exit(1);
});
