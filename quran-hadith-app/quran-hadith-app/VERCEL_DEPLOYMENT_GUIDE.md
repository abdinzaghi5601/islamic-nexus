# 🚀 Vercel Deployment Guide - Islamic Nexus

**Repository:** https://github.com/abdinzaghi5601/islamic-nexus
**Vercel Dashboard:** https://vercel.com/abdullah-waheeds-projects-a8ccc672

---

## 📋 Step-by-Step Deployment

### Step 1: Import Project to Vercel

1. **Go to your Vercel Dashboard:** https://vercel.com/abdullah-waheeds-projects-a8ccc672

2. **Click "Add New"** → **"Project"**

3. **Import Git Repository:**
   - Select "GitHub"
   - Find and select: `abdinzaghi5601/islamic-nexus`
   - Click "Import"

### Step 2: Configure Project Settings

Vercel will auto-detect your Next.js project. Verify these settings:

**Framework Preset:** Next.js (should be auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

**Development Command:**
```bash
npm run dev
```

### Step 3: Add Environment Variables

⚠️ **CRITICAL:** You must add these environment variables before deploying!

Click **"Environment Variables"** and add:

#### Required Variables:

**1. DATABASE_URL**
```
mysql://root:bWhWOWQIRRtdbHGInkrugAqmwwRJUyDf@ballast.proxy.rlwy.net:11669/railway
```
- Environment: Production, Preview, Development (select all)

**2. NEXTAUTH_SECRET**
```bash
# Generate a new secret with this command locally:
openssl rand -base64 32
```
Then add the generated value.
- Environment: Production, Preview, Development (select all)

**3. NEXTAUTH_URL**
```
https://your-vercel-domain.vercel.app
```
⚠️ Update this after first deployment with your actual Vercel URL
- Environment: Production

For Preview/Development, add:
```
https://islamic-nexus-git-master-abdullah-waheeds-projects-a8ccc672.vercel.app
```

#### Optional Variables (for future):

**4. MEILISEARCH_HOST** (Skip for now)
```
https://your-instance.meilisearch.io
```

**5. MEILISEARCH_API_KEY** (Skip for now)
```
your-api-key
```

**6. NEXT_PUBLIC_API_URL** (Optional)
```
https://your-vercel-domain.vercel.app
```

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Vercel will show you the deployment URL

---

## 🔧 Post-Deployment Configuration

### 1. Update NEXTAUTH_URL

After your first deployment:

1. **Copy your Vercel deployment URL** (e.g., `https://islamic-nexus.vercel.app`)
2. **Go to:** Settings → Environment Variables
3. **Edit `NEXTAUTH_URL`** and update to your actual domain
4. **Redeploy** the project

### 2. Test Your Deployment

Visit these URLs to verify everything works:

**Homepage:**
```
https://your-app.vercel.app
```

**API Endpoint:**
```
https://your-app.vercel.app/api/quran/ayah-complete/2/255
```

**Study Page:**
```
https://your-app.vercel.app/quran/study/2/255
```

### 3. Check Build Logs

If deployment fails:
1. Click on the failed deployment
2. Check "Build Logs" for errors
3. Common issues:
   - Missing environment variables
   - Database connection issues
   - Build errors

---

## 🎯 Expected Build Output

Your build should show:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (200/200)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.2 kB
├ ○ /api/quran/ayah-complete/[surah]/[ayah]
├ ○ /quran/study/[surah]/[ayah]          ...
└ ...
```

---

## 🔐 Security Checklist

✅ **Verify `.gitignore` includes:**
```
.env
.env.local
.env*.local
```

✅ **Never commit:**
- Database passwords
- API keys
- Secret keys

✅ **Use Vercel Environment Variables** for all secrets

---

## 🌍 Custom Domain (Optional)

### Add Your Own Domain:

1. **Go to:** Project Settings → Domains
2. **Add Domain:** `yourdomain.com`
3. **Configure DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

### Example:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🐛 Troubleshooting

### Build Fails with "DATABASE_URL not found"

**Solution:** Add DATABASE_URL to environment variables in Vercel

### Build Fails with "Module not found"

**Solution:**
```bash
# Run locally first to verify:
npm install
npm run build
```
Then commit any missing dependencies.

### Page Shows "Internal Server Error"

**Solution:**
1. Check Vercel Function Logs
2. Verify DATABASE_URL is correct
3. Ensure database is accessible from Vercel IPs

### API Endpoint Returns 500

**Solution:**
1. Check your Railway database is online
2. Verify connection string is correct
3. Check Vercel Function Logs for errors

---

## ⚡ Performance Optimization

### After Deployment:

1. **Enable Edge Runtime** (for faster API responses):
   Add to your API routes:
   ```typescript
   export const runtime = 'edge';
   ```

2. **Enable ISR** (Incremental Static Regeneration):
   Add to study pages:
   ```typescript
   export const revalidate = 3600; // Revalidate every hour
   ```

3. **Add Caching Headers:**
   Already configured in your API responses

---

## 📊 Monitoring

### View Analytics:

1. **Go to:** Your Project → Analytics
2. **Monitor:**
   - Page views
   - API calls
   - Performance metrics
   - Error rates

### Set Up Alerts:

1. **Go to:** Project Settings → Alerts
2. **Configure:**
   - Deployment failures
   - Error rate threshold
   - Performance degradation

---

## 🚀 Continuous Deployment

### Automatic Deployments:

Vercel will automatically deploy when you:
- Push to `master` branch → Production
- Create a PR → Preview deployment
- Push to other branches → Preview deployment

### Manual Deployments:

1. **Go to:** Deployments tab
2. **Click:** "Redeploy" on any previous deployment

---

## 📝 Quick Reference

### Vercel CLI (Optional)

Install:
```bash
npm i -g vercel
```

Deploy from terminal:
```bash
vercel
```

Add environment variable:
```bash
vercel env add DATABASE_URL
```

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [x] Code pushed to GitHub
- [ ] Environment variables added to Vercel
- [ ] Database is accessible from internet
- [ ] `.env.local` is in `.gitignore`
- [ ] Build succeeds locally
- [ ] All features tested locally

After deployment:

- [ ] Test homepage loads
- [ ] Test API endpoint works
- [ ] Test study page works
- [ ] Update NEXTAUTH_URL
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Build completes without errors
✅ Homepage loads and shows content
✅ API endpoint returns data:
   ```
   https://your-app.vercel.app/api/quran/ayah-complete/2/255
   ```
✅ Study page displays correctly:
   ```
   https://your-app.vercel.app/quran/study/2/255
   ```
✅ Navigation works
✅ Themes and hadiths display

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs
**Next.js Deployment:** https://nextjs.org/docs/deployment

**Common Issues:**
- Environment variables: https://vercel.com/docs/projects/environment-variables
- Build errors: https://vercel.com/docs/concepts/deployments/build-step
- Function logs: https://vercel.com/docs/observability/runtime-logs

---

**Last Updated:** 2025-10-11
**Status:** Ready for Deployment
**Repository:** https://github.com/abdinzaghi5601/islamic-nexus

🚀 **You're ready to deploy! Follow the steps above and your app will be live in minutes!**
