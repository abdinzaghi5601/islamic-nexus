# Deployment Guide - Islamic Nexus PWA + Capacitor

## Overview
Your app now supports **three deployment modes**:

1. **Web PWA** (Browser installable app)
2. **Android APK** (Google Play Store ready)
3. **Web Server** (Traditional Next.js deployment with API routes)

---

## Quick Start

### For PWA Testing (Browser)
```bash
# Build for PWA
npm run build:pwa

# Serve locally
npx serve out

# Or use any static file server
```

### For Android APK
```bash
# 1. Build the app
npm run build:pwa

# 2. Sync to Android
npm run cap:sync

# 3. Open Android Studio
npm run cap:open:android

# 4. In Android Studio:
#    - Click "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"
#    - Find APK in: android/app/build/outputs/apk/debug/
```

---

## Important: API Routes & Static Export

### The Challenge
Next.js static export (`output: 'export'`) doesn't support API routes. This is required for Capacitor/Android.

### The Solution
We have two approaches:

#### Option 1: Client-Side Data Fetching (Current Setup)
- Use Prisma Client directly in Server Components
- No API routes needed for static export
- Works for both PWA and Android

#### Option 2: Dual Mode (Recommended for Production)
Create two build configurations:

**For Web Deployment** (with API routes):
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // output: 'export', // COMMENTED OUT for web deployment
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
```

**For Android/PWA** (static export):
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export', // ENABLED for Capacitor
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
```

---

## Current Build Error Fix

The build is failing because analytics API routes can't be static. Here's how to fix:

### Quick Fix (Disable Static Export Temporarily)
```bash
# 1. Comment out 'output: export' in next.config.ts
# 2. Run: npm run build
# 3. Deploy to Vercel/traditional hosting
```

### Permanent Fix for Android (Recommended)
1. Move analytics data fetching to Server Components
2. Remove `/api/analytics/*` routes
3. Use Prisma Client directly in components

I'll create this fix now if you'd like!

---

## Building the Android APK

### Prerequisites
- Android Studio installed
- Java JDK 17+ installed
- Android SDK configured

### Steps

1. **Build the Next.js app**
```bash
npm run build:pwa
```

2. **Sync Capacitor**
```bash
npx cap sync android
```

3. **Open in Android Studio**
```bash
npx cap open android
```

4. **Build APK in Android Studio**
   - Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Wait for build to complete
   - Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Install on Device**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Building for Release (Google Play Store)

1. **Generate Signing Key**
```bash
keytool -genkey -v -keystore islamic-nexus-release.keystore -alias islamic-nexus -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing** in `android/app/build.gradle`

3. **Build Release APK**
   - In Android Studio: Build → Generate Signed Bundle / APK
   - Select APK
   - Choose keystore file
   - Build

---

## PWA Features

### Offline Support
- ✅ Service Worker caching
- ✅ IndexedDB for offline data
- ✅ Automatic sync when online
- ✅ Offline indicator

### Install Prompts
- Desktop: Chrome/Edge will show "Install" button
- Mobile: "Add to Home Screen" option in browser menu

### Testing PWA
1. Build: `npm run build:pwa`
2. Serve: `npx serve out`
3. Open: `http://localhost:3000`
4. DevTools → Application → Service Workers (check registration)
5. DevTools → Application → Manifest (check PWA config)

---

## Offline Database Strategy

### Current Setup
- **IndexedDB** for web/PWA (browser storage)
- **SQLite** capability for native Android (via Capacitor plugin)

### Data Sync Flow
1. User visits app online → Data cached to IndexedDB
2. User goes offline → App reads from IndexedDB
3. User comes back online → Sync new data

### Implementing Offline Sync
Use the provided hooks:

```typescript
import { useOfflineQuran, useOnlineStatus } from '@/hooks/useOfflineStorage';

function QuranReader() {
  const online = useOnlineStatus();
  const { ayahs, cacheAyahs } = useOfflineQuran();

  // Fetch from API when online, cache for offline
  useEffect(() => {
    if (online) {
      fetch('/api/quran/surahs')
        .then(res => res.json())
        .then(data => cacheAyahs(data));
    }
  }, [online]);

  return <div>{/* Render ayahs */}</div>;
}
```

---

## Production Deployment Options

### 1. Vercel (Web + PWA)
```bash
# Disable output: 'export' in next.config.ts
vercel deploy
```

### 2. Static Hosting (PWA Only)
```bash
# Keep output: 'export' enabled
npm run build:pwa
# Upload 'out' folder to:
# - Netlify
# - GitHub Pages
# - Firebase Hosting
# - Any static host
```

### 3. Google Play Store (Android)
- Build release APK (see above)
- Create Google Play Console account
- Upload APK
- Complete store listing
- Submit for review

---

## Troubleshooting

### Build Fails with "API route not compatible"
**Solution**: Disable `output: 'export'` OR remove/refactor API routes

### App doesn't work offline
**Check**:
- Service worker registered? (DevTools → Application)
- Data cached? (DevTools → Application → IndexedDB)
- Offline indicator showing?

### Android app shows blank screen
**Check**:
- `out` folder exists and has content
- `capacitor.config.ts` has `webDir: 'out'`
- Run `npx cap sync android` after every build

### Icons not showing
```bash
# Regenerate icons
npm run generate:icons
# Then rebuild
npm run build:pwa
```

---

## Next Steps

1. **Choose your primary deployment target**:
   - Web-only? → Use traditional Next.js (disable static export)
   - Android-only? → Keep static export, refactor API routes
   - Both? → Set up dual-build system

2. **Implement data sync** using the offline hooks provided

3. **Test offline functionality** thoroughly

4. **Build and test Android APK**

5. **Prepare for Play Store submission**

---

## Need Help?

- PWA Testing: https://web.dev/pwa-checklist/
- Capacitor Docs: https://capacitorjs.com/docs
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Android Publish: https://developer.android.com/studio/publish

---

**Status**: ✅ PWA configured | ✅ Capacitor configured | ⚠️ API routes need refactoring for static export
