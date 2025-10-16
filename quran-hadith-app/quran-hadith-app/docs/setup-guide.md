# Setup Guide - Railway Database

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with GitHub (recommended) or email
4. You get $5 free credit, then $5/month for the Hobby plan

## Step 2: Create MySQL Database

1. After logging in, click **"New Project"**
2. Select **"Provision MySQL"**
3. Railway will automatically create a MySQL database instance
4. Wait for deployment to complete (~30 seconds)

## Step 3: Get Your Database Connection URL

1. Click on your MySQL service in the Railway dashboard
2. Go to the **"Variables"** tab
3. Look for `DATABASE_URL` or you'll see individual variables:
   - `MYSQL_URL` (this is what you need!)
   - Or manually construct from:
     - `MYSQLHOST`
     - `MYSQLPORT`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQLDATABASE`

4. The URL format will look like:
   ```
   mysql://root:password@containers-us-west-123.railway.app:6789/railway
   ```

## Step 4: Update Your Local Environment

1. Copy the `MYSQL_URL` or `DATABASE_URL` from Railway
2. Open your project in your code editor
3. Edit the `.env.local` file
4. Replace the DATABASE_URL line with your Railway URL:

   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@YOUR_HOST:PORT/railway"
   ```

   **Important:** Make sure the URL is wrapped in quotes!

## Step 5: Generate Prisma Client

Open your terminal in the project directory and run:

```bash
npm run db:generate
```

This creates the Prisma Client based on your schema.

## Step 6: Push Database Schema

Run this command to create all tables in your Railway database:

```bash
npm run db:push
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database schema in sync
✔ All tables created successfully
```

## Step 7: Seed Initial Data

Run the seed script to populate initial data:

```bash
npm run db:seed
```

This will create:
- 4 Quran translators (Sahih International, Yusuf Ali, Pickthall, Dr. Mustafa Khattab)
- 3 Tafsir books (Ibn Kathir, al-Jalalayn, Maarif-ul-Quran)
- 6 Hadith books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah)

## Step 8: Verify Database (Optional)

You can view your database with Prisma Studio:

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can browse your data.

## Troubleshooting

### Connection Issues

If you get connection errors:

1. **Check SSL requirement:**
   Railway requires SSL. Update your DATABASE_URL:
   ```env
   DATABASE_URL="mysql://root:pass@host:port/railway?sslaccept=strict"
   ```

2. **Firewall/Network:**
   Make sure your firewall allows outbound connections to Railway

3. **Verify URL format:**
   - No spaces in the URL
   - URL must be in quotes
   - Check username, password, host, port, database name

### Schema Issues

If `db:push` fails:

1. Check your Prisma schema for syntax errors
2. Make sure you ran `db:generate` first
3. Try `npx prisma validate` to check for errors

### Common Errors

**"Environment variable not found: DATABASE_URL"**
- Make sure .env.local exists in the project root
- Restart your terminal/IDE after editing .env.local

**"Can't reach database server"**
- Verify Railway database is running
- Check DATABASE_URL is correct
- Test internet connection

## Next Steps

After successful setup:

1. ✅ Database is ready
2. ✅ Initial data is seeded
3. ⏭️ Move to Phase 3: Import Quran, Hadith, and Tafsir data
4. ⏭️ Start building the API (Phase 4)

## Quick Reference Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create a migration (for production)
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Import data
npm run import:quran
npm run import:hadith
npm run import:tafsir
```

## Railway Dashboard Tips

- **Monitor Usage:** Check the "Metrics" tab to see database usage
- **Backups:** Railway provides automatic backups (available on paid plans)
- **Environment Variables:** Keep your DATABASE_URL private - never commit it to git
- **Pricing:** First $5 free, then $5/month for usage
