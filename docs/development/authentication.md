---
title: Authentication System
---

# Authentication System

## Overview

The authentication system uses:
- **Custom JWT** implementation with `jose` library
- **HTTP-only cookies** for secure token storage
- **PBKDF2** password hashing with Web Crypto API
- **Invite-only signup** flow

## API Endpoints

### Public Endpoints

#### `POST /api/auth/signup`
Create a new account with an invite code.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "inviteCode": "INVITE-XXXX-XXXX"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "isAdmin": false
  }
}
```

Sets an HTTP-only cookie with the JWT token.

#### `POST /api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "isAdmin": false
  }
}
```

Sets an HTTP-only cookie with the JWT token.

#### `POST /api/auth/logout`
Logout (clears auth cookie).

**Response:**
```json
{
  "message": "Logged out"
}
```

### Protected Endpoints

#### `GET /api/auth/me`
Get current authenticated user.

**Headers:** Requires auth cookie

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "isAdmin": false
  }
}
```

#### `POST /api/auth/invites` (Admin Only)
Generate a new invite code.

**Headers:** Requires admin auth cookie

**Response:**
```json
{
  "invite": {
    "id": "invite-id",
    "code": "INVITE-XXXX-XXXX",
    "createdAt": "2025-01-21T..."
  }
}
```

## Frontend Usage

### Login Page
Visit `/login` to sign in with email and password.

### Signup Page
Visit `/signup` to create an account with an invite code.

### Protected Routes
Use the `AuthGuard` component to protect routes:

```tsx
import { AuthGuard } from '@/components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <YourContent />
    </AuthGuard>
  );
}
```

### Getting Current User
```tsx
import { getCurrentUser } from '@/lib/auth';

const user = await getCurrentUser();
if (user) {
  console.log('Logged in as:', user.email);
}
```

## Creating the First Admin User

Since signup requires an invite code, you need to bootstrap the first admin user:

### Option 1: Manual Database Insert (Recommended for First User)

1. Generate a password hash:
   ```bash
   # Use the API's hashPassword function or create a temporary script
   ```

2. Insert directly into database via Drizzle Studio:
   ```bash
   just db-studio
   ```

3. In Drizzle Studio, insert into `users` table:
   - `id`: Generate with `nanoid()` or use a UUID
   - `email`: Your admin email (must match `ADMIN_EMAIL` in `.dev.vars`)
   - `password_hash`: Generated hash
   - `is_admin`: `true`
   - `created_at`: Current timestamp

4. Create an invite code for testing:
   - Insert into `invites` table:
     - `id`: Generate ID
     - `code`: `INVITE-XXXX-XXXX` (generate with `just invite-generate`)
     - `created_by`: The admin user ID you just created
     - `created_at`: Current timestamp

### Option 2: Use API After Bootstrap

Once you have one admin user, you can:
1. Log in as admin via `/login`
2. Use the `/api/auth/invites` endpoint to generate new invites
3. Share invites with new users

## Invite Code Management

### Generate Invite Code Format
```bash
just invite-generate
```

This generates a code in the format `INVITE-XXXX-XXXX`.

### Create Invite via API (Admin Only)

After logging in as admin:
```bash
curl -X POST http://localhost:8787/api/auth/invites \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Create Invite via Drizzle Studio

1. Run `just db-studio`
2. Navigate to `invites` table
3. Insert new row with:
   - `id`: Unique ID
   - `code`: Generated invite code
   - `created_by`: Admin user ID
   - `created_at`: Current timestamp

## Security Features

- **HTTP-only cookies**: Prevents XSS attacks
- **SameSite=Strict**: Prevents CSRF attacks
- **PBKDF2 hashing**: 100,000 iterations with SHA-256
- **JWT expiration**: 15 minutes for access tokens
- **Password requirements**: Minimum 8 characters

## Environment Variables

Required in `apps/api/.dev.vars`:
- `AUTH_SECRET`: 64-character hex string (generate with `just secret-generate`)
- `ADMIN_EMAIL`: Email address that will be granted admin privileges

## Testing Authentication

1. **Start API server:**
   ```bash
   just dev-api
   ```

2. **Test signup:**
   ```bash
   curl -X POST http://localhost:8787/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","inviteCode":"INVITE-XXXX-XXXX"}' \
     -c cookies.txt
   ```

3. **Test login:**
   ```bash
   curl -X POST http://localhost:8787/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}' \
     -c cookies.txt
   ```

4. **Test protected endpoint:**
   ```bash
   curl http://localhost:8787/api/auth/me \
     -b cookies.txt
   ```
