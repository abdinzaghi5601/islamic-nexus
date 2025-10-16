# Local Development Guide - Enhanced Word Modal

**Status:** ✅ Feature works perfectly on localhost
**Production:** ⏳ Pending database upgrade

---

## Quick Start

### Start Development Environment

```bash
# 1. Start MySQL
sudo service mysql start

# 2. Navigate to project
cd /mnt/c/Users/abdul/Desktop/MY\ Quran\ and\ Hadith\ \ Project/quran-hadith-app/quran-hadith-app

# 3. Start dev server
npm run dev
```

### Access the Feature

Open browser: **http://localhost:3000/quran/study/1/1**

Click any Arabic word to see the Enhanced Word Modal!

---

## Database Status

### Local Database (✅ Active)
```
DATABASE_URL="mysql://root:QuranApp2025!@localhost:3306/quran_hadith_dev"

Data Available:
- 77,429 words with morphology
- 53,924 dictionary entries
- 2,444 word roots
- 1,475 verb conjugations
- 6,236 ayahs with 4 translations
```

### Production Database (❌ Too Small)
```
DATABASE_URL="mysql://root:xxx@ballast.proxy.rlwy.net:11669/railway"

Storage: 500 MB (Full)
NLP Data: Not imported
Enhanced Modal: Won't work on production
```

---

## Testing the Feature

### Pages with Enhanced Word Modal

1. **Quran Study Pages:**
   - `http://localhost:3000/quran/study/1/1` (Al-Fatihah, Ayah 1)
   - `http://localhost:3000/quran/study/2/255` (Ayat al-Kursi)
   - `http://localhost:3000/quran/study/112/1` (Al-Ikhlas)

### How to Test

1. Navigate to a study page
2. Hover over Arabic words (see tooltip)
3. Click any word (opens Enhanced Modal)
4. Explore all 5 tabs:
   - Overview (meanings, dictionary)
   - Morphology (stem, lemma, affixes)
   - Grammar (POS, features)
   - Root (root letters, related words)
   - Examples (usage in Quran)

---

## What Works Where

| Feature | Local | Production |
|---------|-------|------------|
| Basic Quran reading | ✅ | ✅ |
| Translations | ✅ | ✅ |
| Search | ✅ | ✅ |
| Bookmarks | ✅ | ✅ |
| Hadith collections | ✅ | ✅ |
| **Enhanced Word Modal** | ✅ | ❌ |
| **Word morphology** | ✅ | ❌ |
| **Dictionary lookups** | ✅ | ❌ |
| **Root analysis** | ✅ | ❌ |

---

## Development Workflow

### Making Changes

```bash
# 1. Make code changes
# 2. Changes auto-reload in browser
# 3. Test locally
# 4. Commit to GitHub when ready

git add .
git commit -m "your message"
git push origin master
```

### Database Changes

```bash
# Update schema
npx prisma db push

# Regenerate client
npx prisma generate

# View data
npx prisma studio
```

---

## Switching Databases

### Use Local Database (Development)
```bash
# Edit .env file
DATABASE_URL="mysql://root:QuranApp2025!@localhost:3306/quran_hadith_dev"

# Then restart server
npm run dev
```

### Use Railway Database (Testing Production)
```bash
# Edit .env file
DATABASE_URL="mysql://root:xxx@ballast.proxy.rlwy.net:11669/railway"

# Note: Enhanced Word Modal won't work!
npm run dev
```

---

## Future Deployment Options

### When Ready to Deploy NLP Features to Production:

**Option A: Upgrade Railway**
```
Cost: $5/month
Storage: 5 GB
Steps:
1. Upgrade at https://railway.app/pricing
2. Run import scripts on production
3. Feature goes live!
```

**Option B: PlanetScale (Free 5 GB)**
```
Cost: Free
Storage: 5 GB
Steps:
1. Create PlanetScale account
2. Import data
3. Update DATABASE_URL in Vercel
```

**Option C: Supabase**
```
Cost: Free (500 MB) or $25/month (8 GB)
Storage: Depends on plan
Steps:
1. Create Supabase project
2. Import data
3. Update DATABASE_URL in Vercel
```

---

## Troubleshooting

### Modal Doesn't Open
```bash
# Check MySQL is running
sudo service mysql status

# Restart if needed
sudo service mysql start

# Check database connection
npx prisma db push
```

### No Data in Modal
```bash
# Verify imports completed
mysql -u root -p quran_hadith_dev

# Run this query:
SELECT COUNT(*) FROM ayah_words;
# Should return: 77429

SELECT COUNT(*) FROM arabic_dictionary;
# Should return: 53924
```

### Dev Server Won't Start
```bash
# Kill existing process
pkill -f "next dev"

# Clear cache
rm -rf .next

# Reinstall dependencies
npm install

# Try again
npm run dev
```

---

## Data Re-import (If Needed)

If you ever need to re-import the data:

```bash
# 1. Import Quran base data
npm run import:quran

# 2. Import dictionary
npm run import:dictionary

# 3. Import verbs
npm run import:verbs

# 4. Import morphology (takes ~60 minutes)
npm run import:morphology
```

---

## Git Workflow

### Current Setup
```
Local: master branch (with NLP features)
GitHub: master branch (pushed ✅)
Vercel: Auto-deploys from GitHub (code only, no data)
```

### Making Updates
```bash
# 1. Make changes locally
# 2. Test with local database
# 3. Commit and push
git add .
git commit -m "description"
git push origin master

# 4. Vercel auto-deploys (but NLP features won't work there yet)
```

---

## Performance Tips

### Keep MySQL Running
```bash
# Check status
sudo service mysql status

# Auto-start on boot (optional)
sudo systemctl enable mysql
```

### Monitor Database Size
```bash
# Check size
mysql -u root -p -e "SELECT table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
  FROM information_schema.TABLES
  WHERE table_schema = 'quran_hadith_dev'
  GROUP BY table_schema;"
```

### Clear Browser Cache
If changes aren't showing:
- Hard refresh: `Ctrl + F5`
- Clear cache in DevTools
- Try incognito window

---

## Summary

**What You Have:**
- ✅ Fully functional NLP features locally
- ✅ Complete Quran database with linguistics
- ✅ All code backed up on GitHub
- ✅ Perfect development environment

**What's Pending:**
- ⏳ Production database upgrade
- ⏳ NLP data on live website
- ⏳ Public access to Enhanced Word Modal

**Next Steps:**
1. Test the feature locally (http://localhost:3000)
2. Continue developing other features
3. Decide on production database when ready
4. Deploy NLP features when database is ready

---

**Created:** October 14, 2025
**Status:** Active - Local Development Mode
**Contact:** Test at http://localhost:3000/quran/study/1/1
