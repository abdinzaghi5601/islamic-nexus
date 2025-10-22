# 🚀 Islamic Nexus - PWA + Android Complete Setup Guide

## ✅ What's Been Implemented

Your Islamic Nexus app is now fully configured with:

### PWA Features
- ✅ Service Worker for offline caching
- ✅ Web App Manifest (`/manifest.json`)
- ✅ App icons (192x192, 512x512)
- ✅ "Add to Home Screen" functionality
- ✅ Offline indicator component
- ✅ IndexedDB storage for offline data

### Capacitor/Android Features
- ✅ Capacitor configured for Android builds
- ✅ Android project generated (`/android` folder)
- ✅ SQLite plugin for offline database
- ✅ Network detection plugin
- ✅ Splash screen configuration
- ✅ App preferences storage

### Offline Storage System
- ✅ `offline-storage.ts` - Complete IndexedDB wrapper
- ✅ `useOfflineStorage.ts` - React hooks for offline data
- ✅ `OfflineIndicator.tsx` - UI component for offline status

---

## 🎯 Current Status & Next Steps

### **IMPORTANT: API Routes Issue**

Your app has **52 API routes** that are incompatible with static export (required for Capacitor/Android).

### You have 3 options:

#### **Option 1: Separate Web & Android Builds** (Recommended - Easiest)
- **Web version**: Deploy with Vercel/hosting → API routes work normally
- **Android version**: Use static export → Refactor pages to fetch data directly (no API routes)

#### **Option 2: Refactor to Server Components** (Best long-term)
- Move data fetching from API routes to Server Components
- Use Prisma Client directly in components
- Works for both web and Android

#### **Option 3: Hybrid Approach**
- Detect environment (web vs Capacitor)
- Use API routes for web, direct DB access for Android

---

## 📱 Building for Android - Step by Step

### Prerequisites

1. **Install Android Studio**
   - Download: https://developer.android.com/studio
   - Install Android SDK
   - Accept SDK licenses: `yes | sdkmanager --licenses`

2. **Install Java JDK 17**
   ```bash
   # Check if installed
   java -version

   # Should show version 17.x
   ```

3. **Set Environment Variables**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
   ```

### Build Process

#### Step 1: Fix API Routes (Choose your approach)

**Quick Fix - Disable problematic routes**:
```bash
# Temporarily move API folder to prevent build errors
mv src/app/api src/app/api_disabled

# Build
CAPACITOR_BUILD=true npm run build:capacitor

# Restore API folder
mv src/app/api_disabled src/app/api
```

**OR use the fixer script** (adds static export to all routes):
```bash
node scripts/fix-api-routes-for-static-export.js
CAPACITOR_BUILD=true npm run build:capacitor
```

#### Step 2: Sync to Android
```bash
npx cap sync android
```

#### Step 3: Open in Android Studio
```bash
npx cap open android
```

#### Step 4: Build APK in Android Studio

1. In Android Studio menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete (2-5 minutes)
3. Click "locate" link in notification
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Step 5: Install on Device

**Via USB**:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Via Android Studio**:
- Click green "Run" button
- Select connected device or emulator

---

## 🌐 Testing PWA (Without Android)

### Build and Test Locally

```bash
# Option 1: Build for Capacitor (static export)
CAPACITOR_BUILD=true npm run build:capacitor
npx serve out

# Option 2: Build for web (with API routes)
npm run build:web
npm start
```

### Test PWA Features

1. **Open in Browser**: http://localhost:3000
2. **Open DevTools** (F12)
3. **Check Service Worker**:
   - Application tab → Service Workers
   - Should show "Activated and running"
4. **Check Manifest**:
   - Application tab → Manifest
   - Verify app name, icons, theme color
5. **Test Offline**:
   - Network tab → Set to "Offline"
   - Reload page → Should still work
6. **Install PWA**:
   - Desktop: Look for install icon in address bar
   - Mobile: Browser menu → "Add to Home Screen"

---

## 📦 What Files Were Created/Modified

### New Files Created
```
quran-hadith-app/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── icon.svg                   # Source icon
│   ├── icon-192x192.png           # App icon (small)
│   ├── icon-512x512.png           # App icon (large)
│   ├── apple-touch-icon.png       # iOS icon
│   └── sw.js                      # Service worker (auto-generated)
├── src/
│   ├── lib/
│   │   └── offline-storage.ts     # Offline database functions
│   ├── hooks/
│   │   └── useOfflineStorage.ts   # React hooks for offline data
│   └── components/
│       └── OfflineIndicator.tsx   # Offline UI indicator
├── scripts/
│   ├── generate-icons.js          # Icon generation script
│   ├── convert-icons-to-png.js    # SVG to PNG converter
│   └── fix-api-routes-for-static-export.js  # API route fixer
├── android/                       # Capacitor Android project
├── capacitor.config.ts            # Capacitor configuration
├── next.config.capacitor.ts       # Next.js config for Capacitor
├── DEPLOYMENT_GUIDE.md            # Deployment instructions
├── ICON_GENERATION.md             # Icon creation guide
└── PWA_AND_ANDROID_COMPLETE_GUIDE.md  # This file
```

### Modified Files
```
├── next.config.ts                 # Added PWA support + conditional export
├── package.json                   # Added build scripts
└── src/app/layout.tsx             # Added PWA metadata + OfflineIndicator
```

---

## 🔧 Useful Commands

```bash
# Development
npm run dev                        # Start dev server

# PWA Building
npm run build:web                  # Build for web (with API routes)
npm run build:capacitor            # Build for Capacitor (static export)
npm run pwa:test                   # Build & serve PWA locally

# Android Building
npm run build:android              # Build & sync to Android
npm run android:open               # Open Android Studio
npm run android:dev                # Build + sync + open Android Studio

# Capacitor
npm run cap:sync                   # Sync web assets to Android
npx cap sync                       # Same as above

# Icons
npm run generate:icons             # Generate PNG icons from SVG

# Utilities
npx serve out                      # Serve static build
adb devices                        # List connected Android devices
adb install path/to/app.apk       # Install APK on device
```

---

## 🎨 Customizing Your App

### Change App Icon
1. Replace `/public/icon.svg` with your design
2. Run: `npm run generate:icons`
3. Rebuild: `npm run build:android`

### Change App Colors
Edit `/public/manifest.json`:
```json
{
  "theme_color": "#16a34a",        // Green - change to your brand color
  "background_color": "#ffffff"    // White background
}
```

Also update `capacitor.config.ts`:
```typescript
SplashScreen: {
  backgroundColor: "#16a34a",      // Match your theme color
  spinnerColor: "#ffffff"
}
```

### Change App Name
1. Edit `/public/manifest.json` → `"name"` and `"short_name"`
2. Edit `capacitor.config.ts` → `appName`
3. Edit `android/app/src/main/res/values/strings.xml`

---

## 📊 Offline Data Strategy

### How It Works

1. **User Online**: Data fetched from API → Cached in IndexedDB
2. **User Offline**: Data served from IndexedDB cache
3. **User Back Online**: Sync new data automatically

### Using Offline Hooks in Your Components

```typescript
import { useOfflineQuran, useOnlineStatus } from '@/hooks/useOfflineStorage';

function QuranPage() {
  const online = useOnlineStatus();
  const { ayahs, cacheAyahs, loading } = useOfflineQuran();

  useEffect(() => {
    if (online) {
      // Fetch fresh data and cache it
      fetch('/api/quran/surahs')
        .then(res => res.json())
        .then(data => cacheAyahs(data));
    }
  }, [online]);

  return (
    <div>
      {!online && <p>You're offline - showing cached data</p>}
      {loading ? <Spinner /> : <AyahList ayahs={ayahs} />}
    </div>
  );
}
```

### Manual Caching

```typescript
import { saveToOfflineStorage, getFromOfflineStorage, STORES } from '@/lib/offline-storage';

// Cache data
await saveToOfflineStorage(STORES.QURAN, { id: 1, text: 'Bismillah...' });

// Retrieve data
const ayah = await getFromOfflineStorage(STORES.QURAN, 1);
```

---

## 🚀 Deployment

### Web Deployment (Vercel)
```bash
# Make sure output: 'export' is NOT in next.config.ts
npm run build:web
vercel deploy
```

### Android APK (Google Play Store)

1. **Generate Signing Key**:
```bash
keytool -genkey -v -keystore islamic-nexus-release.keystore \
  -alias islamic-nexus -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing** in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/islamic-nexus-release.keystore')
            storePassword 'your-password'
            keyAlias 'islamic-nexus'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Build Release APK**:
   - Android Studio → Build → Generate Signed Bundle / APK
   - Choose APK → Next
   - Select keystore file → Enter passwords → Next
   - Release build variant → Finish

4. **Upload to Play Store**:
   - Create developer account: https://play.google.com/console
   - Create new app
   - Upload APK
   - Complete store listing
   - Submit for review

---

## 🐛 Troubleshooting

### Build fails with "API route not compatible"
**Solution**: Temporarily rename `src/app/api` to `src/app/api_disabled`, build, then rename back

### Android app shows blank screen
**Checklist**:
- [ ] Run `npx cap sync android` after every build
- [ ] Check `capacitor.config.ts` has `webDir: 'out'`
- [ ] Verify `out` folder exists and has content
- [ ] Check Android logs: `adb logcat | grep Capacitor`

### Service Worker not registering
**Checklist**:
- [ ] Build for production (`npm run build:capacitor`)
- [ ] Serve via HTTPS or localhost
- [ ] Check DevTools → Application → Service Workers
- [ ] Clear cache and hard reload

### Icons not showing
```bash
npm run generate:icons
npm run build:android
npx cap sync android
```

### App name not changing
Edit these files:
1. `/public/manifest.json`
2. `capacitor.config.ts`
3. `/android/app/src/main/res/values/strings.xml`

---

## 📚 Additional Resources

- **PWA Checklist**: https://web.dev/pwa-checklist/
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Android Studio**: https://developer.android.com/studio
- **Play Store Publishing**: https://support.google.com/googleplay/android-developer/answer/9859152

---

## ✨ Summary

You now have:
- ✅ Full PWA support with offline capabilities
- ✅ Android app configuration via Capacitor
- ✅ Offline data storage with IndexedDB
- ✅ React hooks for easy offline integration
- ✅ Build scripts for both web and Android

### Next Actions:
1. **Fix API routes** (choose your approach from above)
2. **Build for Android**: `npm run build:android`
3. **Open Android Studio**: `npm run android:open`
4. **Build APK** and test on device
5. **Customize icons and branding**
6. **Implement offline data sync** in your pages

---

**Questions?** Check the troubleshooting section or consult the docs linked above.

**Ready to build?** Run `npm run build:android` and follow the steps in "Building for Android"!
