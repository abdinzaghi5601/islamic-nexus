# Vercel Deployment Error Fix Guide

## Problem
When clicking on dropdown options in the deployed Vercel app, you receive:
```
Application error: a server-side exception has occurred
Digest: 2994958187
```

## Root Cause
The application uses Prisma to connect to a MySQL database. The error occurs because:
1. **Missing Environment Variables** - `DATABASE_URL` is not set on Vercel
2. **Database Connection Failure** - The Railway MySQL database may not be accessible from Vercel

## Solution: Configure Environment Variables on Vercel

### Step 1: Access Vercel Project Settings
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `islamic-nexus`
3. Click on **Settings** tab
4. Navigate to **Environment Variables** section

### Step 2: Add Required Environment Variables

Add the following environment variables:

#### 1. DATABASE_URL (Required)
```
DATABASE_URL=mysql://root:bWhWOWQIRRtdbHGInkrugAqmwwRJUyDf@ballast.proxy.rlwy.net:11669/railway
```

#### 2. NEXTAUTH_URL (Required for Authentication)
```
NEXTAUTH_URL=https://islamic-nexus-9b5kforc2-abdullah-waheeds-projects-a8ccc672.vercel.app
```
(Replace with your actual Vercel deployment URL)

#### 3. NEXTAUTH_SECRET (Required for Authentication)
Generate a secret key by running:
```bash
openssl rand -base64 32
```

Then add it to Vercel:
```
NEXTAUTH_SECRET=<your-generated-secret>
```

### Step 3: Environment Variable Scope
Make sure to set the environment variables for:
- ✅ **Production**
- ✅ **Preview** (Optional, but recommended)
- ✅ **Development** (Optional)

### Step 4: Verify Prisma Client Generation

Your `package.json` already includes the postinstall script:
```json
"postinstall": "prisma generate"
```

This ensures Prisma Client is generated during deployment. ✅

### Step 5: Redeploy Your Application

After adding environment variables:

1. **Option A: Redeploy from Vercel Dashboard**
   - Go to **Deployments** tab
   - Click the **...** menu on the latest deployment
   - Click **Redeploy**

2. **Option B: Trigger a New Deployment**
   - Make a small commit to your repository
   - Push to the branch connected to Vercel
   - Vercel will automatically deploy

```bash
git add .
git commit -m "fix: add environment variables"
git push
```

## Verify the Fix

After redeployment:
1. Visit your Vercel deployment URL
2. Click on dropdown options (Quran, Hadith, Duas, etc.)
3. Pages should load without errors

## Additional Checks

### Check Database Connectivity
Ensure your Railway MySQL database:
- ✅ Is running and accessible
- ✅ Allows external connections
- ✅ Has the correct credentials in `DATABASE_URL`

### Check Vercel Deployment Logs
If errors persist:
1. Go to **Deployments** tab in Vercel
2. Click on the latest deployment
3. Check the **Build Logs** and **Function Logs**
4. Look for database connection errors or Prisma errors

### Common Error Messages

**"Can't reach database server"**
- The database URL is incorrect
- The database is not accessible from Vercel's IP addresses
- Railway might require IP whitelisting

**"PrismaClient is unable to run in this environment"**
- Prisma Client was not generated during build
- Run `npm install` locally and commit `node_modules/.prisma` (not recommended)
- Better: Ensure `postinstall` script runs during Vercel build

## Test Locally First

Before deploying, test with production environment variables locally:

```bash
# Copy production .env
cp .env .env.local

# Build the application
npm run build

# Start in production mode
npm start
```

If it works locally, it should work on Vercel.

## Still Having Issues?

Check the Vercel deployment logs for specific errors:
1. Build-time errors → Check **Build Logs**
2. Runtime errors → Check **Function Logs**
3. Database errors → Verify Railway database status

## Summary

✅ **Error boundaries added** - Better error handling for users
✅ **Environment variables guide** - Configure `DATABASE_URL` and `NEXTAUTH_SECRET` on Vercel
✅ **Deployment steps** - Redeploy after adding environment variables

After following these steps, your dropdown navigation should work correctly!
