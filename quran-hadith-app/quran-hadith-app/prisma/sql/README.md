# PostgreSQL Optimization Scripts

This directory contains advanced PostgreSQL optimization scripts for the Quran & Hadith application. These scripts provide performance enhancements beyond what Prisma schema can express.

## 📋 Overview

1. **01_fts_triggers.sql** - Full-Text Search setup
2. **02_partial_indexes.sql** - Partial indexes for filtered queries
3. **03_materialized_views.sql** - Materialized views for analytics
4. **04_data_integrity_triggers.sql** - Database triggers for data integrity

## 🚀 Quick Start

### Step 1: Migrate Your Schema

First, apply the updated Prisma schema:

```bash
npx prisma migrate dev --name postgresql_optimizations
```

This will create migration files for:
- Full-text search vector columns
- Composite indexes
- PostgreSQL array types for tags
- JSONB fields

### Step 2: Apply SQL Scripts

After migration, apply the SQL scripts in order:

```bash
# Connect to your PostgreSQL database
DATABASE_URL="postgresql://user:password@host:port/database"

# Apply scripts in order
psql $DATABASE_URL -f prisma/sql/01_fts_triggers.sql
psql $DATABASE_URL -f prisma/sql/02_partial_indexes.sql
psql $DATABASE_URL -f prisma/sql/03_materialized_views.sql
psql $DATABASE_URL -f prisma/sql/04_data_integrity_triggers.sql
```

Or using the Railway CLI:

```bash
# If using Railway
railway run psql -f prisma/sql/01_fts_triggers.sql
railway run psql -f prisma/sql/02_partial_indexes.sql
railway run psql -f prisma/sql/03_materialized_views.sql
railway run psql -f prisma/sql/04_data_integrity_triggers.sql
```

## 📚 Detailed Features

### 1. Full-Text Search (FTS)

**Performance Impact:** 10-100x faster than LIKE queries

**Features:**
- Automatic search vector updates via triggers
- Multi-language support (Arabic, English)
- GIN indexes for fast lookups
- Ranking and relevance scoring

**Usage Example:**

```typescript
// Raw SQL query using Prisma
const results = await prisma.$queryRaw`
  SELECT * FROM ayahs
  WHERE search_vector @@ to_tsquery('arabic', 'الله')
  ORDER BY ts_rank(search_vector, to_tsquery('arabic', 'الله')) DESC
  LIMIT 10
`;
```

**Alternative: Using Prisma client extensions:**

```typescript
// You can also create a helper function
async function searchAyahs(query: string) {
  return prisma.$queryRaw`
    SELECT *, ts_rank(search_vector, to_tsquery('arabic', ${query})) as rank
    FROM ayahs
    WHERE search_vector @@ to_tsquery('arabic', ${query})
    ORDER BY rank DESC
  `;
}
```

### 2. Partial Indexes

**Performance Impact:** 30-50% smaller indexes, faster filtered queries

**Features:**
- Active memorization goals only
- Bookmarks with notes
- Hadiths by grade (Sahih, Hasan, etc.)
- Sajdah verses
- Recent reading history

**Benefits:**
- Smaller index size
- Faster query performance
- Better cache utilization

### 3. Materialized Views

**Performance Impact:** 100-1000x faster for analytics queries

**Available Views:**
- `user_reading_stats` - Reading statistics per user
- `user_memorization_progress` - Memorization progress tracking
- `user_vocabulary_mastery` - Vocabulary learning stats
- `user_learning_streaks` - Learning streak tracking
- `popular_content_stats` - Most popular ayahs/hadiths
- `hadith_book_stats` - Hadith book statistics

**Refresh Schedule:**

```bash
# Refresh all views (run daily)
psql $DATABASE_URL -c "SELECT refresh_all_analytics_views();"

# Or refresh individual views
psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW CONCURRENTLY user_reading_stats;"
```

**Setup Cron Job (Linux/Mac):**

```bash
# Add to crontab (runs at 2 AM daily)
0 2 * * * psql $DATABASE_URL -c "SELECT refresh_all_analytics_views();"
```

**Usage Example:**

```typescript
// Get user reading stats from materialized view
const stats = await prisma.$queryRaw`
  SELECT * FROM user_reading_stats
  WHERE user_id = ${userId}
`;

// Get top 10 popular ayahs
const popularAyahs = await prisma.$queryRaw`
  SELECT * FROM popular_content_stats
  WHERE content_type = 'ayah'
  ORDER BY popularity_score DESC
  LIMIT 10
`;
```

### 4. Database Triggers

**Features:**
- Auto-update hadith book counts
- Auto-update surah ayah counts
- Validate ayah number ranges
- Auto-update memorization goal status
- Update daily learning progress
- Prevent duplicate bookmarks

**Benefits:**
- Automatic data consistency
- No application-level logic needed
- Guaranteed integrity at database level

## 🔧 Configuration

### Connection Pooling

The schema is configured for connection pooling. Update your `.env`:

```env
# For Railway (already has pooling built-in)
DATABASE_URL="postgresql://user:pass@host:port/db"

# For custom PgBouncer setup
DATABASE_URL="postgresql://user:pass@host:port/db?pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host:port/db"
```

Update `schema.prisma` if using separate pooled/direct URLs:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED") // Uncomment for separate direct connection
}
```

## 📊 Performance Expectations

| Feature | Performance Gain | Use Case |
|---------|-----------------|----------|
| Full-Text Search | 10-100x | Text search across ayahs/hadiths |
| Composite Indexes | 2-5x | Multi-column queries |
| Partial Indexes | 30-50% faster | Filtered queries |
| Materialized Views | 100-1000x | Analytics dashboards |
| Array Types | 2-3x | Tag filtering |
| JSONB | 5-10x | JSON querying |

## 🔍 Monitoring & Maintenance

### Check Query Performance

```sql
-- Enable query timing
\timing on

-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT * FROM ayahs
WHERE search_vector @@ to_tsquery('arabic', 'الله');

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Monitor Materialized View Freshness

```sql
-- Check when views were last refreshed
SELECT schemaname, matviewname, last_refresh
FROM pg_matview_refresh_history
WHERE schemaname = 'public';
```

### Database Statistics

```sql
-- Update table statistics (run after bulk imports)
ANALYZE ayahs;
ANALYZE hadiths;
ANALYZE duas;

-- Vacuum tables (reclaim storage)
VACUUM ANALYZE ayahs;
```

## 🚨 Troubleshooting

### Issue: Full-text search not working

**Solution:** Ensure search vectors are populated:

```sql
-- Check if search_vector is populated
SELECT COUNT(*) FROM ayahs WHERE search_vector IS NOT NULL;

-- If empty, run update
UPDATE ayahs SET text_arabic = text_arabic;
```

### Issue: Materialized views out of date

**Solution:** Refresh views manually:

```sql
SELECT refresh_all_analytics_views();
```

### Issue: Slow query performance

**Solution:** Check if indexes are being used:

```sql
EXPLAIN ANALYZE your_query_here;
```

Look for "Seq Scan" (bad) vs "Index Scan" (good) in the output.

## 🔄 Rolling Back

To remove these optimizations:

```sql
-- Drop all triggers
DROP TRIGGER IF EXISTS ayah_search_vector_update ON ayahs;
DROP TRIGGER IF EXISTS hadith_search_vector_update ON hadiths;
-- ... (drop other triggers)

-- Drop materialized views
DROP MATERIALIZED VIEW IF EXISTS user_reading_stats;
DROP MATERIALIZED VIEW IF EXISTS user_memorization_progress;
-- ... (drop other views)

-- Drop partial indexes
DROP INDEX IF EXISTS idx_active_memorization_goals;
DROP INDEX IF EXISTS idx_sahih_hadiths;
-- ... (drop other partial indexes)
```

## 📖 Additional Resources

- [PostgreSQL Full-Text Search Documentation](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Indexes Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [Materialized Views Documentation](https://www.postgresql.org/docs/current/sql-creatematerializedview.html)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

## 🤝 Contributing

When adding new optimizations:

1. Document the performance impact
2. Provide usage examples
3. Include rollback instructions
4. Test on a copy of production data first

## ⚠️ Important Notes

- **Test first:** Always test on a development/staging database before production
- **Backup:** Create a database backup before applying these scripts
- **Monitor:** Monitor query performance after applying optimizations
- **Refresh schedule:** Set up automatic refresh for materialized views
- **Index maintenance:** Run VACUUM ANALYZE periodically
