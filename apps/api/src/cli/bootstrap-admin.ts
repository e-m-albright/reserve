#!/usr/bin/env node
/**
 * Bootstrap script to create the first admin user
 * This should be run once to create the initial admin account
 *
 * Usage (local):
 *   wrangler d1 execute reserve --command "INSERT INTO users (id, email, password_hash, is_admin, created_at) VALUES (...)"
 *
 * Or use Drizzle Studio: just db-studio
 *
 * For production, use Cloudflare dashboard or Pulumi to run SQL.
 */

import { hashPassword } from '../auth/utils';

/**
 * Generate a password hash for manual database insertion
 */
async function generatePasswordHash(password: string): Promise<string> {
  return await hashPassword(password);
}

/**
 * Instructions for bootstrapping admin user
 */
async function main() {
  const args = process.argv.slice(2);

  if (args[0] === 'hash' && args[1]) {
    // Generate password hash
    const hash = await generatePasswordHash(args[1]);
    console.log('Password hash:', hash);
    console.log('');
    console.log('To create admin user, insert into database:');
    console.log('1. Run: just db-studio');
    console.log('2. Insert into users table:');
    console.log('   - id: (generate with nanoid or UUID)');
    console.log('   - email: (your admin email from ADMIN_EMAIL env var)');
    console.log(`   - password_hash: ${hash}`);
    console.log('   - is_admin: true');
    console.log('   - created_at: (current timestamp)');
    return;
  }

  console.log('Bootstrap Admin User');
  console.log('===================');
  console.log('');
  console.log('This script helps bootstrap the first admin user.');
  console.log('');
  console.log('Usage:');
  console.log('  pnpm tsx src/cli/bootstrap-admin.ts hash <password>');
  console.log('');
  console.log('Example:');
  console.log('  pnpm tsx src/cli/bootstrap-admin.ts hash mySecurePassword123');
  console.log('');
  console.log('Then:');
  console.log('1. Copy the generated hash');
  console.log('2. Run: just db-studio');
  console.log('3. Insert into users table with the hash');
  console.log('4. Make sure email matches ADMIN_EMAIL in .dev.vars');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generatePasswordHash };
