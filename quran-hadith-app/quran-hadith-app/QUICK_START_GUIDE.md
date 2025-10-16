# Quick Start Guide - Phase 1 Enhanced Features

## Running the Application

### Development Mode

```bash
cd quran-hadith-app/quran-hadith-app
npm run dev
```

Visit: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## Testing New Features

### 1. Daily Content Carousel (Homepage)

**URL:** `http://localhost:3000`

**What to Test:**
- [ ] Page loads with carousel displaying random content
- [ ] Carousel auto-rotates every 7 seconds
- [ ] Hover to pause auto-rotation
- [ ] Click left/right arrows to navigate
- [ ] Click dot indicators to jump to specific slide
- [ ] Click refresh button to load new random content
- [ ] Click "Read Full Context" links to navigate to content
- [ ] Verify Arabic text displays correctly (RTL)
- [ ] Check transliteration shows for duas
- [ ] Test responsive design on mobile

**Expected Slides:**
1. **Verse of the Moment** - Random Ayah with translation
2. **Hadith of the Moment** - Random Hadith with grade
3. **Dua of the Moment** - Random Dua with transliteration

### 2. Enhanced Navigation

**What to Test:**

**Desktop (>1024px):**
- [ ] Hover over "Quran" to see mega menu
- [ ] Hover over "Hadith" to see mega menu
- [ ] Hover over "Duas & More" to see mega menu
- [ ] Type in search bar and press Enter
- [ ] Click popular surahs in Quran dropdown
- [ ] Click hadith books in Hadith dropdown
- [ ] Click "Search All Content" button

**Mobile (<1024px):**
- [ ] Click hamburger menu icon
- [ ] Menu slides in from top
- [ ] Click any menu item to navigate
- [ ] Menu closes after navigation
- [ ] Click search icon to go to search page
- [ ] Admin links appear in mobile menu

### 3. Interactive Ayah Cards

**URL:** `http://localhost:3000/quran/1` (or any surah)

**What to Test:**
- [ ] Hover over ayah card to reveal action buttons
- [ ] Click translation badges to toggle translations
- [ ] Click copy button - check clipboard
- [ ] Click share button - verify share dialog
- [ ] Click expand/collapse button
- [ ] Click "View Tafsir & Detailed Study" button
- [ ] Verify smooth hover animations
- [ ] Test on mobile (buttons always visible)

**Copy Test:**
```
Expected clipboard format:
[Arabic text]

[Translator]: [Translation text]

Reference: [Surah] X:Y
```

### 4. Reading Mode Selector

**Note:** This component needs to be integrated into a Quran page. For now, the component is ready to use.

**Future Integration Test:**
- [ ] Click settings icon to open modal
- [ ] Switch between reading modes
- [ ] Adjust font size settings
- [ ] Toggle Arabic script style
- [ ] Toggle display options
- [ ] Verify settings persist in localStorage
- [ ] Check modal close functionality

### 5. Breadcrumb Navigation

**URL:** `http://localhost:3000/quran/1` (or deeper pages)

**What to Test:**
- [ ] Breadcrumbs appear on non-home pages
- [ ] Home icon shows at start
- [ ] Segments are properly formatted
- [ ] Click breadcrumb links to navigate
- [ ] Current page is highlighted
- [ ] No breadcrumbs on homepage
- [ ] Responsive design on mobile

---

## API Testing

### Daily Content API

**Endpoint:** `http://localhost:3000/api/daily-content`

**Test with cURL:**
```bash
curl http://localhost:3000/api/daily-content
```

**Expected Response:**
```json
{
  "ayah": {
    "id": 123,
    "arabic": "...",
    "translation": "...",
    "translator": "Dr. Mustafa Khattab",
    "reference": "Al-Baqarah 2:255",
    "surahNumber": 2,
    "ayahNumber": 255,
    "link": "/quran/2#ayah-255"
  },
  "hadith": {
    "id": 456,
    "arabic": "...",
    "english": "...",
    "reference": "Sahih Bukhari 1",
    "bookName": "Sahih al-Bukhari",
    "grade": "Sahih",
    "link": "/hadith/1/chapter/1#hadith-456"
  },
  "dua": {
    "id": 789,
    "title": "Morning Dua",
    "arabic": "...",
    "transliteration": "...",
    "english": "...",
    "category": "Morning & Evening",
    "reference": "Quran 2:201",
    "link": "/duas#dua-789"
  },
  "metadata": {
    "generatedAt": "2025-10-13T...",
    "totalAyahs": 6236,
    "totalHadiths": 34532,
    "totalDuas": 50
  }
}
```

**Test Multiple Times:**
```bash
# Should return different content each time
curl http://localhost:3000/api/daily-content
curl http://localhost:3000/api/daily-content
curl http://localhost:3000/api/daily-content
```

---

## Browser Testing

### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations
- [ ] Share API works

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations
- [ ] Share API fallback works

### Safari (Desktop)
- [ ] All features work
- [ ] No console errors
- [ ] RTL text correct
- [ ] Share API works

### Mobile Browsers
- [ ] Touch interactions work
- [ ] Responsive layout correct
- [ ] Hamburger menu works
- [ ] Carousel swipe (if added)

---

## Responsive Testing

### Desktop (1920x1080)
- [ ] Full navigation visible
- [ ] MegaMenu displays correctly
- [ ] Search bar in header
- [ ] Carousel full width
- [ ] No horizontal scroll

### Tablet (768x1024)
- [ ] Navigation adapts
- [ ] Search bar visible
- [ ] Carousel responsive
- [ ] Readable text sizes
- [ ] No horizontal scroll

### Mobile (375x667)
- [ ] Hamburger menu
- [ ] Mobile search button
- [ ] Carousel stacks
- [ ] Touch-friendly buttons
- [ ] No horizontal scroll

---

## Performance Testing

### Page Load Times
- [ ] Homepage loads < 2 seconds
- [ ] API response < 200ms
- [ ] Smooth animations (60fps)
- [ ] No layout shift

### Network Testing
- [ ] Test on slow 3G
- [ ] Test with throttling
- [ ] Check bundle sizes
- [ ] Verify caching

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all elements
- [ ] Enter to activate buttons
- [ ] Escape to close modals
- [ ] Arrow keys in carousel
- [ ] Focus indicators visible

### Screen Reader
- [ ] ARIA labels present
- [ ] Alt text for images
- [ ] Semantic HTML
- [ ] Proper heading hierarchy
- [ ] Skip navigation links

---

## Common Issues & Solutions

### Issue: Carousel not loading
**Solution:** Check database connection and ensure data exists

### Issue: Arabic text not displaying
**Solution:** Ensure proper UTF-8 encoding and RTL CSS

### Issue: Share button not working
**Solution:** Test on HTTPS (share API requires secure context)

### Issue: Build errors
**Solution:** Run `npm install` and clear `.next` cache

### Issue: API returns 500 error
**Solution:** Check database connection and Prisma schema

---

## Development Tips

### Hot Reload
- Save any file to trigger hot reload
- Check console for errors
- Clear browser cache if needed

### Database
```bash
# Check database connection
npm run db:studio

# Regenerate Prisma client
npm run db:generate
```

### Debugging
```bash
# Check logs
console.log in components

# Network tab
Monitor API calls in DevTools

# React DevTools
Install React DevTools extension
```

---

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Gather user feedback** on new features
3. **Monitor analytics** for engagement metrics
4. **Plan Phase 2** implementation
5. **Document lessons learned**

---

## Support

If you encounter issues:
1. Check console for errors
2. Verify database connection
3. Clear cache and rebuild
4. Check this guide for solutions
5. Review component source code

---

**Happy Testing!**

*Last Updated: October 13, 2025*
*Phase: 1 Complete ✅*
