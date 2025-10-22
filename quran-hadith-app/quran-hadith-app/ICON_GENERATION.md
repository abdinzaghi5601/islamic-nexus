# PWA Icon Generation Guide

## Current Status
The app includes a placeholder icon.svg file. You need to generate PNG icons for the PWA.

## Option 1: Use Online Tool (Recommended - Easiest)
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your custom icon/logo (or use the icon.svg provided)
3. Download the generated icons
4. Place the following files in the `/public` folder:
   - icon-192x192.png
   - icon-512x512.png
   - favicon.ico (optional)

## Option 2: Use ImageMagick (If Installed)
Run these commands from the project root:

```bash
# Convert SVG to PNG icons
convert -background none public/icon.svg -resize 192x192 public/icon-192x192.png
convert -background none public/icon.svg -resize 512x512 public/icon-512x512.png
```

## Option 3: Use Node.js Sharp Library
Install and run:

```bash
npm install sharp-cli -g
sharp -i public/icon.svg -o public/icon-192x192.png resize 192 192
sharp -i public/icon.svg -o public/icon-512x512.png resize 512 512
```

## Icon Design Guidelines
- Use a simple, recognizable design
- Islamic themes: Crescent moon, star, Quran, mosque silhouette
- Ensure good contrast for visibility
- Use your brand colors (currently green #16a34a)
- Test on both light and dark backgrounds

## Quick Temporary Solution
I've created placeholder icons below. Replace them with your actual design when ready.
