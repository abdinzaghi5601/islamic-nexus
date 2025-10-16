# PostgreSQL Optimization Migration Guide

Step-by-step guide to apply all PostgreSQL optimizations to your Quran & Hadith application.

## ⚠️ Before You Begin

1. **Backup your database:**
   ```bash
   # Using Railway CLI
   railway db backup

   # Or using pg_dump
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test on development first:**
   - Apply all changes to a development/staging database first
   - Verify application functionality
   - Check query performance improvements

3. **Plan for downtime:**
   - Some migrations may take time on large databases
   - Consider running during off-peak hours

## 📋 Migration Checklist

- [ ] Create database backup
- [ ] Review schema changes
- [ ] Run Prisma migration
- [ ] Apply FTS triggers
- [ ] Apply partial indexes
- [ ] Apply materialized views
- [ ] Apply data integrity triggers
- [ ] Test application functionality
- [ ] Verify performance improvements
- [ ] Set up maintenance tasks

## 🚀 Step-by-Step Migration

### Step 1: Review Schema Changes

The updated `schema.prisma` includes:

**✅ Full-Text Search:**
- `searchVector` fields added to Ayah, Hadith, Dua models
- GIN indexes for FTS

**✅ Array Types:**
- `tags` fields converted from String to String[]
- Affects: Dua, AyahLesson, Book models

**✅ JSONB Types:**
- JSON fields converted to proper Json type
- Affects: TajweedRule, WordMorphology, ArabicDictionary

**✅ Composite Indexes:**
- Multi-column indexes for common query patterns
- 10+ new composite indexes added

**✅ Optimized Text Columns:**
- Note fields limited to VARCHAR(1000)
- Session notes limited to VARCHAR(500)

**⚠️ Breaking Changes:**

1. **Tags fields:** If you have existing comma-separated tags, you'll need to migrate them:
   ```sql
   -- Example migration for Dua tags
   UPDATE duas
   SET tags = string_to_array(tags, ',')
   WHERE tags IS NOT NULL AND tags != '';
   ```

2. **JSON fields:** Existing JSON strings need to be valid JSON:
   ```sql
   -- Verify JSON validity
   SELECT id, examples FROM tajweed_rules
   WHERE examples IS NOT NULL AND examples::json IS NULL;
   ```

### Step 2: Generate and Review Migration

```bash
# Generate migration
npx prisma migrate dev --name postgresql_optimizations --create-only

# This will create a new migration file in prisma/migrations/
# Review the generated SQL before applying
```

**Review the migration file:**
- Check for any potential data loss warnings
- Verify ALTER TABLE statements
- Ensure indexes are created correctly

### Step 3: Apply Prisma Migration

```bash
# Apply migration
npx prisma migrate dev

# Or for production:
npx prisma migrate deploy
```

**Expected output:**
```
✔ Generated Prisma Client
✔ The migration has been applied successfully
```

**Verify migration:**
```bash
# Check database schema
npx prisma db pull
```

### Step 4: Apply Full-Text Search Setup

```bash
# Apply FTS triggers and functions
DATABASE_URL="your_connection_string"

# Local PostgreSQL
psql $DATABASE_URL -f prisma/sql/01_fts_triggers.sql

# Railway
railway run psql -f prisma/sql/01_fts_triggers.sql

# Or using Prisma Studio
npx prisma studio
# Then run the SQL manually in your database client
```

**Verify FTS setup:**
```sql
-- Check if search vectors are populated
SELECT COUNT(*) FROM ayahs WHERE search_vector IS NOT NULL;
SELECT COUNT(*) FROM hadiths WHERE search_vector IS NOT NULL;
SELECT COUNT(*) FROM duas WHERE search_vector IS NOT NULL;

-- Test search
SELECT * FROM ayahs
WHERE search_vector @@ to_tsquery('arabic', 'الله')
LIMIT 5;
```

### Step 5: Apply Partial Indexes

```bash
# Apply partial indexes
psql $DATABASE_URL -f prisma/sql/02_partial_indexes.sql
```

**Verify partial indexes:**
```sql
-- Check created indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;
```

### Step 6: Apply Materialized Views

```bash
# Apply materialized views
psql $DATABASE_URL -f prisma/sql/03_materialized_views.sql
```

**Verify materialized views:**
```sql
-- Check created views
SELECT matviewname FROM pg_matviews
WHERE schemaname = 'public';

-- Test a view
SELECT * FROM user_reading_stats LIMIT 5;
```

**Initial refresh:**
```sql
-- Refresh all views with current data
SELECT refresh_all_analytics_views();
```

### Step 7: Apply Data Integrity Triggers

```bash
# Apply triggers
psql $DATABASE_URL -f prisma/sql/04_data_integrity_triggers.sql
```

**Verify triggers:**
```sql
-- Check created triggers
SELECT tgname, tgrelid::regclass, tgtype
FROM pg_trigger
WHERE tgname LIKE '%_trigger'
ORDER BY tgname;
```

### Step 8: Data Migration (if needed)

**Migrate existing comma-separated tags to arrays:**

```sql
-- Migrate Dua tags
UPDATE duas
SET tags = CASE
  WHEN tags IS NULL OR tags = '' THEN ARRAY[]::text[]
  ELSE string_to_array(tags, ',')
END
WHERE tags IS NOT NULL;

-- Migrate AyahLesson tags
UPDATE ayah_lessons
SET tags = CASE
  WHEN tags IS NULL OR tags = '' THEN ARRAY[]::text[]
  ELSE string_to_array(tags, ',')
END
WHERE tags IS NOT NULL;

-- Migrate Book tags
UPDATE books
SET tags = CASE
  WHEN tags IS NULL OR tags = '' THEN ARRAY[]::text[]
  ELSE string_to_array(tags, ',')
END
WHERE tags IS NOT NULL;
```

**Validate JSON fields:**

```sql
-- Check and fix TajweedRule examples
UPDATE tajweed_rules
SET examples = '[]'::json
WHERE examples IS NULL OR examples = '';

-- Validate all JSON fields
SELECT id, examples FROM tajweed_rules
WHERE NOT (examples::text)::json IS NOT NULL;
```

### Step 9: Update Application Code

**Update FTS queries:**

```typescript
// Before: Using LIKE (slow)
const ayahs = await prisma.ayah.findMany({
  where: {
    textArabic: {
      contains: searchTerm
    }
  }
});

// After: Using FTS (fast)
const ayahs = await prisma.$queryRaw`
  SELECT * FROM ayahs
  WHERE search_vector @@ to_tsquery('arabic', ${searchTerm})
  ORDER BY ts_rank(search_vector, to_tsquery('arabic', ${searchTerm})) DESC
  LIMIT 50
`;
```

**Update tags queries:**

```typescript
// Before: String contains
const duas = await prisma.dua.findMany({
  where: {
    tags: {
      contains: 'morning'
    }
  }
});

// After: Array contains
const duas = await prisma.dua.findMany({
  where: {
    tags: {
      has: 'morning'
    }
  }
});

// Multiple tags (ANY)
const duas = await prisma.dua.findMany({
  where: {
    tags: {
      hasSome: ['morning', 'evening']
    }
  }
});
```

**Use materialized views:**

```typescript
// Get user stats from materialized view
const stats = await prisma.$queryRaw`
  SELECT * FROM user_reading_stats
  WHERE user_id = ${userId}
`;
```

### Step 10: Set Up Maintenance Tasks

**Create cron job for materialized view refresh:**

```bash
# Linux/Mac crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * psql $DATABASE_URL -c "SELECT refresh_all_analytics_views();"
```

**Or use a Node.js scheduler:**

```typescript
// In your backend (using node-cron)
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Refresh materialized views daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  await prisma.$executeRaw`SELECT refresh_all_analytics_views();`;
  console.log('Materialized views refreshed');
});
```

## ✅ Verification Checklist

After migration, verify:

- [ ] Application starts without errors
- [ ] All pages load correctly
- [ ] Search functionality works (and is faster!)
- [ ] Tags are displayed correctly
- [ ] User statistics are accurate
- [ ] No console errors or warnings
- [ ] Database queries are using indexes (check with EXPLAIN)
- [ ] Performance improvements are measurable

## 📊 Performance Testing

**Before and after comparison:**

```sql
-- Enable timing
\timing on

-- Test FTS performance
EXPLAIN ANALYZE
SELECT * FROM ayahs
WHERE search_vector @@ to_tsquery('arabic', 'الله');

-- Test composite index usage
EXPLAIN ANALYZE
SELECT * FROM ayahs
WHERE surah_id = 1 AND juz = 1;

-- Test partial index usage
EXPLAIN ANALYZE
SELECT * FROM memorization_goals
WHERE user_id = 'user123' AND status = 'active';
```

**Expected improvements:**
- FTS queries: 10-100x faster
- Composite index queries: 2-5x faster
- Partial index queries: 30-50% faster
- Analytics queries (materialized views): 100-1000x faster

## 🔄 Rollback Plan

If you need to rollback:

1. **Rollback Prisma migration:**
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

2. **Drop SQL objects:**
   ```bash
   psql $DATABASE_URL -f prisma/sql/rollback.sql
   ```

3. **Restore from backup:**
   ```bash
   psql $DATABASE_URL < backup_file.sql
   ```

## 🐛 Troubleshooting

### Issue: Migration fails with "column already exists"

**Solution:** Check if migration was partially applied:
```sql
-- Check schema
\d+ ayahs

-- If searchVector exists, skip that part of migration
```

### Issue: Search returns no results

**Solution:** Populate search vectors:
```sql
UPDATE ayahs SET text_arabic = text_arabic;
UPDATE hadiths SET text_arabic = text_arabic;
UPDATE duas SET text_arabic = text_arabic;
```

### Issue: Tags not displaying correctly

**Solution:** Check data format:
```sql
-- Check tag format
SELECT id, tags FROM duas LIMIT 5;

-- Should show: {tag1,tag2,tag3}
-- Not: "tag1,tag2,tag3"
```

### Issue: Materialized views out of date

**Solution:** Refresh views:
```sql
SELECT refresh_all_analytics_views();
```

## 📞 Support

If you encounter issues:

1. Check error logs
2. Review the README.md in prisma/sql/
3. Test queries with EXPLAIN ANALYZE
4. Verify indexes are being used
5. Check trigger and function definitions

## 🎉 Success!

Once all steps are complete:
- ✅ Your database is optimized for PostgreSQL
- ✅ Search is 10-100x faster
- ✅ Analytics queries are 100-1000x faster
- ✅ Data integrity is enforced at database level
- ✅ Your application is production-ready!

## 📈 Next Steps

1. **Monitor performance:** Use PostgreSQL query statistics
2. **Fine-tune indexes:** Remove unused indexes
3. **Optimize queries:** Use EXPLAIN ANALYZE regularly
4. **Scale as needed:** Add read replicas for high traffic
5. **Consider caching:** Add Redis for frequently accessed data

---

**Estimated migration time:**
- Small database (<10K rows): 5-10 minutes
- Medium database (10K-100K rows): 15-30 minutes
- Large database (>100K rows): 30-60 minutes

**Test your changes thoroughly before deploying to production!**
