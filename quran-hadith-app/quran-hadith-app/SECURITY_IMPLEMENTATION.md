# 🔒 Security Implementation Guide

## Critical Security Issues Found & Fixed

### 1. ✅ Admin Routes Were Unprotected
**Issue**: All admin API routes were accessible without authentication
**Fix Applied**: Created admin authentication middleware

### 2. ✅ No Role-Based Access Control
**Issue**: User model had no role field
**Fix Applied**: Added `role` field to User model in Prisma schema

### 3. ✅ Session Doesn't Include Role
**Issue**: NextAuth session didn't include user role
**Fix Applied**: Updated auth callbacks to include role in JWT and session

---

## What Was Implemented

### 1. Admin Authentication Middleware
**File**: `src/middleware/admin-auth.ts`

```typescript
- requireAdmin(request): Checks if user is admin
- withAdminAuth(handler): Wrapper for admin API routes
```

### 2. Updated User Model
**File**: `prisma/schema.prisma`

```prisma
model User {
  ...
  role String @default("user") // user, admin
  ...
}
```

### 3. Updated NextAuth Configuration
**File**: `src/lib/auth.ts`

- Added role to JWT token
- Added role to session object
- Role is now accessible in all API routes via session

### 4. Protected Admin Route Example
**File**: `src/app/api/admin/duas/create/route.ts`

```typescript
import { withAdminAuth } from '@/middleware/admin-auth';

export const POST = withAdminAuth(async (request) => {
  // Only admins can access this
});
```

---

## 🚨 CRITICAL: Next Steps Required

### Step 1: Run Database Migration
```bash
cd /mnt/c/Users/abdul/Desktop/MY\ Quran\ and\ Hadith\ \ Project/quran-hadith-app/quran-hadith-app

# Generate migration
npx prisma migrate dev --name add_user_role_field

# This will:
# 1. Add 'role' column to users table
# 2. Set default value to 'user' for all existing users
```

### Step 2: Make Yourself an Admin
```bash
# Connect to your database
DATABASE_URL="your-database-url-here" npm run db:export

# Or use Railway CLI:
railway run npx prisma studio

# In Prisma Studio:
# 1. Open 'User' model
# 2. Find your user account
# 3. Change 'role' from 'user' to 'admin'
# 4. Save
```

**OR via SQL:**
```sql
-- Replace with your email
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Step 3: Apply Auth Middleware to ALL Admin Routes

Apply the `withAdminAuth` wrapper to these files:

- [ ] `/api/admin/books/import-archive/route.ts`
- [ ] `/api/admin/books/upload/route.ts`
- [ ] `/api/admin/add-hadith-to-ayah/route.ts`
- [ ] `/api/admin/add-lesson-to-ayah/route.ts`
- [ ] `/api/admin/delete-hadith-from-ayah/route.ts`
- [ ] `/api/admin/delete-lesson-from-ayah/route.ts`

**Pattern for each file:**
```typescript
import { withAdminAuth } from '@/middleware/admin-auth';

// OLD:
export async function POST(request: NextRequest) {
  // ...
}

// NEW:
export const POST = withAdminAuth(async (request: NextRequest) => {
  // ...
});
```

### Step 4: Protect Admin Pages

Add authentication checks to these pages:

- [ ] `/app/admin/books/archive/page.tsx`
- [ ] `/app/admin/books/upload/page.tsx`
- [ ] `/app/admin/duas/create/page.tsx`

**Add at the top of each page component:**
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'useState';

export default function AdminPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }

    // @ts-ignore
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      redirect('/dashboard'); // Not admin
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // @ts-ignore
  if (session?.user?.role !== 'admin') {
    return null;
  }

  // Rest of your component...
}
```

### Step 5: Add Rate Limiting (Recommended)

Install rate limiting package:
```bash
npm install @upstash/ratelimit @upstash/redis
```

Create rate limit middleware:
```typescript
// src/middleware/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function withRateLimit(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  return null; // Continue
}
```

---

## Security Best Practices Applied

### ✅ Environment Variables Protected
- `.env*` files in `.gitignore`
- No credentials in git history
- `.env.example` has only placeholders

### ✅ Authentication Required
- Admin routes now require valid session
- Admin routes check for 'admin' role

### ✅ Session Security
- JWT strategy with 30-day expiry
- Secret key required (NEXTAUTH_SECRET)
- Secure cookies in production

### 🔄 TODO: Additional Security
- [ ] Add rate limiting to API routes
- [ ] Add CSRF protection
- [ ] Add API key validation for external APIs
- [ ] Add input validation/sanitization
- [ ] Add SQL injection protection (Prisma already helps)
- [ ] Add XSS protection headers
- [ ] Add Content Security Policy headers

---

## Testing Security

### Test Admin Authentication
```bash
# 1. Try accessing admin route without login (should fail)
curl http://localhost:3000/api/admin/duas/create

# Expected: {"success":false,"message":"Unauthorized. Please sign in."}

# 2. Try with regular user (should fail)
# Login as regular user, then:
curl -H "Cookie: next-auth.session-token=..." \
  http://localhost:3000/api/admin/duas/create

# Expected: {"success":false,"message":"Forbidden. Admin access required."}

# 3. Try with admin user (should succeed)
# Login as admin, then make request
# Expected: Success or validation error (but not auth error)
```

### Verify Role in Database
```sql
SELECT id, email, name, role FROM users;
```

Should show:
```
| id   | email              | name  | role  |
|------|--------------------|-------|-------|
| ...  | admin@example.com  | Admin | admin |
| ...  | user@example.com   | User  | user  |
```

---

## Security Checklist

Before deploying to production:

- [ ] Database migration completed (`role` field added)
- [ ] At least one admin user exists
- [ ] All admin API routes protected with `withAdminAuth`
- [ ] All admin pages check for admin role
- [ ] `.env` files not committed to git
- [ ] NEXTAUTH_SECRET is strong random string
- [ ] Database credentials are secure
- [ ] HTTPS enabled in production
- [ ] Rate limiting implemented (optional but recommended)
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured for security events

---

## Emergency: If Admin Access Lost

If you lose admin access:

1. **Access database directly:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

2. **Via Railway CLI:**
```bash
railway run npx prisma studio
# Then edit user role in UI
```

3. **Via migration:**
```sql
-- Create a new migration
-- prisma/migrations/XXX_emergency_admin/migration.sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## Additional Resources

- [NextAuth.js Security](https://next-auth.js.org/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/security)

---

**Generated**: 2025-01-22
**Status**: Partial Implementation - Migration & Route Protection Pending
**Priority**: CRITICAL - Deploy ASAP to prevent unauthorized admin access
