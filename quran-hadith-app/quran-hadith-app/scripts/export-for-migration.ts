/**
 * Export database for Oracle Cloud migration
 * This creates a SQL dump that can be imported to MySQL
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const DATABASE_URL = process.env.DATABASE_URL || '';
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const BACKUP_FILE = path.join(BACKUP_DIR, `islamic_nexus_${TIMESTAMP}.sql`);

async function exportDatabase() {
  console.log('🔄 Starting database export for Oracle Cloud migration...\n');

  // Create backups directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('✅ Created backups directory');
  }

  try {
    // Try pg_dump with docker
    console.log('📦 Exporting database...');
    console.log(`📁 Output: ${BACKUP_FILE}\n`);

    const command = `docker run --rm postgres:16 pg_dump "${DATABASE_URL}" > "${BACKUP_FILE}"`;

    await execAsync(command);

    // Check if file exists and has content
    if (fs.existsSync(BACKUP_FILE)) {
      const stats = fs.statSync(BACKUP_FILE);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log('✅ Database exported successfully!\n');
      console.log('📊 Export Details:');
      console.log(`   File: ${BACKUP_FILE}`);
      console.log(`   Size: ${fileSizeMB} MB`);
      console.log(`   Date: ${new Date().toLocaleString()}\n`);

      console.log('🎯 Next Steps:');
      console.log('   1. Keep this backup file safe');
      console.log('   2. You\'ll upload it to Oracle Cloud VM');
      console.log('   3. Then import into MySQL database\n');

      return BACKUP_FILE;
    } else {
      throw new Error('Backup file was not created');
    }
  } catch (error: any) {
    console.error('❌ Export failed:', error.message);
    console.log('\n📝 Manual Export Instructions:');
    console.log('   1. Go to https://railway.app/');
    console.log('   2. Select your project');
    console.log('   3. Click on PostgreSQL service');
    console.log('   4. Go to "Data" tab');
    console.log('   5. Click "Export" button');
    console.log('   6. Download the SQL file\n');
    throw error;
  }
}

// Run export
exportDatabase()
  .then(() => {
    console.log('✅ Migration export complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to export database');
    process.exit(1);
  });
