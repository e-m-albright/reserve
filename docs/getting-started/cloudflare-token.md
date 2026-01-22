---
title: Cloudflare API Token Setup
---

# Cloudflare API Token Setup

## Why Custom Token?

This project uses multiple Cloudflare services:
- **Workers** (API and automation)
- **D1** (database)
- **R2** (storage)
- **Queues** (job processing)
- **Pages** (frontend hosting)

No single template covers all of these, so you need a **Custom Token**.

## Step-by-Step Setup

### 1. Create Custom Token

1. Go to [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Click **"Create Custom Token"**

### 2. Configure Permissions

**Account Permissions** (select these):

- ✅ **Workers Scripts** → `Edit`
- ✅ **Workers KV Storage** → `Edit` (if using KV)
- ✅ **D1** → `Edit`
- ✅ **R2** → `Edit`
- ✅ **Queues** → `Edit`
- ✅ **Pages** → `Edit` (for Next.js frontend deployment)
- ✅ **Account Settings** → `Read` (to get Account ID)

**Zone Permissions** (only if using custom domains):
- ✅ **DNS** → `Edit` (if managing DNS)
- ✅ **Zone Settings** → `Read`

### 3. Set Account Resources

- **Include** → Select your Cloudflare account
- **Exclude** → Leave empty

### 4. Security Settings (Recommended)

- **Client IP Address Filtering**: Add your development IPs (optional but recommended)
- **TTL**: Set expiration date or leave blank for no expiration

### 5. Create Token

1. Click **"Continue to summary"**
2. Review permissions
3. Click **"Create Token"**
4. **Copy the token immediately** - you won't be able to see it again!

## Using the Token

Add it to your `.dev.vars` files:

```bash
# apps/api/.dev.vars
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_API_TOKEN=your-copied-token-here
```

## Finding Your Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your account name (top right)
3. The Account ID is shown in the right sidebar under "Account ID"
4. Or go to Workers & Pages → Overview → Account ID

## Security Best Practices

1. ✅ **Use separate tokens** for development and production
2. ✅ **Set expiration dates** on tokens
3. ✅ **Use IP filtering** when possible
4. ✅ **Rotate tokens regularly**
5. ❌ **Never commit tokens** to git (already in `.gitignore`)
6. ❌ **Don't share tokens** in screenshots or logs

## Token Permissions Reference

| Service | Permission | Why Needed |
|---------|-----------|------------|
| Workers Scripts | Edit | Deploy and update Workers |
| D1 | Edit | Create databases, run migrations |
| R2 | Edit | Create buckets, upload files |
| Queues | Edit | Create and manage queues |
| Pages | Edit | Deploy Next.js frontend |
| Account Settings | Read | Get Account ID for configs |

## Troubleshooting

### "Insufficient permissions" errors

- Verify all required permissions are set to `Edit`
- Check that the token is scoped to the correct account
- Ensure the token hasn't expired

### Token not working with Wrangler

- Make sure token is in `.dev.vars` (not `.env.local`)
- Verify `CLOUDFLARE_ACCOUNT_ID` is also set
- Check token hasn't been revoked

## Alternative: User API Token

If you prefer, you can use a **User API Token** instead (from "My Profile" section), but Custom Account Tokens are recommended for better security and scoping.
