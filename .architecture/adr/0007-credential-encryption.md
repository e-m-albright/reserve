---
title: Credential Encryption Strategy
---

# Credential Encryption Strategy

## Decision: Application-Level Encryption + D1 Encryption at Rest

### Two Layers of Protection

1. **D1 Encryption at Rest** (Automatic)
   - Cloudflare automatically encrypts all D1 data with AES-256-GCM
   - No configuration needed
   - Keys managed by Cloudflare

2. **Application-Level Encryption** (Our Responsibility)
   - Encrypt sensitive credentials BEFORE storing in D1
   - Use Web Crypto API (available in Workers)
   - Encryption key stored in Cloudflare Secrets Store

## Implementation

### Encryption Key Management
- Store encryption key in **Cloudflare Secrets Store** (not in code)
- Use AES-GCM algorithm (symmetric encryption)
- Key rotation: Generate new key, re-encrypt data, update secret

### Encryption Flow

```typescript
// Encrypt before storing
async function encryptCredential(plaintext: string, env: Env): Promise<string> {
  const key = await getEncryptionKey(env);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  // Store: iv + encrypted data (base64 encoded)
  return base64Encode(iv) + ':' + base64Encode(encrypted);
}

// Decrypt when needed
async function decryptCredential(encrypted: string, env: Env): Promise<string> {
  const [ivStr, dataStr] = encrypted.split(':');
  const key = await getEncryptionKey(env);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64Decode(ivStr) },
    key,
    base64Decode(dataStr)
  );
  return new TextDecoder().decode(decrypted);
}
```

### What Gets Encrypted
- ✅ Booking site passwords
- ✅ Booking site usernames/emails (if sensitive)
- ❌ User passwords (hashed, not encrypted)
- ❌ Public data (booking criteria, status)

### Security Best Practices
- Never log decrypted credentials
- Only decrypt when absolutely necessary (during booking attempt)
- Use separate encryption keys per environment (dev/prod)
- Rotate keys periodically
- Store encryption key in Secrets Store with RBAC
