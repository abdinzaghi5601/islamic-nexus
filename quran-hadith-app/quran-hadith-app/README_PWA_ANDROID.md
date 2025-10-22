# 📱 Islamic Nexus - PWA & Android Quick Start

## 🎉 Setup Complete!

Your app now supports:
- **PWA** (Progressive Web App) - Installable in browsers
- **Android APK** - Native Android app via Capacitor
- **Offline Mode** - Works without internet connection

---

## 🚀 Quick Start - Build Android APK

### Step 1: Install Prerequisites
```bash
# Install Android Studio
# Download from: https://developer.android.com/studio

# Check Java version (need JDK 17+)
java -version
```

### Step 2: Build the App

**IMPORTANT**: Your app has API routes that need special handling. Choose one option:

**Option A - Quick Build (Temporary Fix)**:
```bash
# Temporarily disable API routes
mv src/app/api src/app/api_disabled

# Build
CAPACITOR_BUILD=true npm run build:capacitor

# Restore API routes
mv src/app/api_disabled src/app/api

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android
```

**Option B - Use Fixer Script**:
```bash
# Add static export to all API routes
node scripts/fix-api-routes-for-static-export.js

# Build and sync
npm run build:android

# Open Android Studio
npm run android:open
```

### Step 3: Build APK in Android Studio

1. In Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Install on Device
```bash
# Connect Android device via USB
# Enable USB Debugging on device

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🌐 Test PWA in Browser

```bash
# Build for PWA
CAPACITOR_BUILD=true npm run build:capacitor

# Serve locally
npx serve out

# Open browser: http://localhost:3000
# Click install icon in address bar
```

---

## 📁 What Was Added

### New Features
- ✅ PWA manifest (`/public/manifest.json`)
- ✅ Service worker for offline caching
- ✅ App icons (192x192, 512x512 PNG)
- ✅ Offline indicator component
- ✅ IndexedDB offline storage system
- ✅ Capacitor Android configuration
- ✅ Splash screen setup

### New Files
```
/public/manifest.json          # PWA configuration
/public/icon-*.png             # App icons
/src/lib/offline-storage.ts    # Offline database
/src/hooks/useOfflineStorage.ts # React hooks
/src/components/OfflineIndicator.tsx # UI component
/capacitor.config.ts           # Capacitor config
/android/                      # Android project folder
```

### Build Scripts Added
```bash
npm run build:web              # Build for web (with API routes)
npm run build:capacitor        # Build for Android (static export)
npm run build:android          # Build + sync to Android
npm run android:open           # Open Android Studio
npm run pwa:test               # Test PWA locally
npm run generate:icons         # Generate app icons
```

---

## 🔧 Customization

### Change App Icon
1. Replace `/public/icon.svg` with your logo
2. Run: `npm run generate:icons`
3. Rebuild app

### Change App Colors
Edit `/public/manifest.json`:
```json
"theme_color": "#16a34a",     // Your brand color
"background_color": "#ffffff"
```

### Change App Name
Edit these files:
1. `/public/manifest.json` → `name` and `short_name`
2. `/capacitor.config.ts` → `appName`

---

## 📖 Full Documentation

For complete setup, troubleshooting, and deployment guide, see:
- **[PWA_AND_ANDROID_COMPLETE_GUIDE.md](./PWA_AND_ANDROID_COMPLETE_GUIDE.md)** - Complete guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment options

---

## ⚠️ Important Notes

### API Routes Issue
Next.js static export (required for Android) doesn't support API routes. Your app has 52 API routes that need handling.

**Solutions**:
1. **For Android**: Use Option A (disable routes) or Option B (fixer script)
2. **For Web**: Deploy normally to Vercel (API routes work)
3. **Long-term**: Refactor to use Server Components instead of API routes

### Two Build Modes
- **Web Mode**: `npm run build:web` - API routes enabled
- **Capacitor Mode**: `CAPACITOR_BUILD=true npm run build:capacitor` - Static export

---

## 🐛 Quick Troubleshooting

**Build fails?**
→ Use Option A (temporarily move API folder)

**Blank screen in Android?**
→ Run `npx cap sync android` after every build

**PWA not installing?**
→ Build for production, serve via HTTPS or localhost

**Icons not showing?**
→ Run `npm run generate:icons` then rebuild

---

## 🎯 Next Steps

1. ✅ **Build Android APK** (follow Step 2 above)
2. ✅ **Test on device** (Step 4 above)
3. ✅ **Customize branding** (icons, colors, name)
4. ⏳ **Implement offline sync** for Quran/Hadith data
5. ⏳ **Prepare for Play Store** (see complete guide)

---

## 💡 Using Offline Features

### In Your Components

```typescript
import { useOnlineStatus, useOfflineQuran } from '@/hooks/useOfflineStorage';

function MyComponent() {
  const online = useOnlineStatus();
  const { ayahs, cacheAyahs } = useOfflineQuran();

  // Show offline indicator
  if (!online) {
    return <div>You're offline - showing cached data</div>;
  }

  // Cache data for offline use
  useEffect(() => {
    fetchData().then(data => cacheAyahs(data));
  }, []);
}
```

### Offline Indicator
Automatically shows when user goes offline (already added to layout)

---

**Ready to build?** Run `npm run build:android` and follow the steps above!

**Questions?** Check the [complete guide](./PWA_AND_ANDROID_COMPLETE_GUIDE.md) for detailed explanations.
