const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Add "export const dynamic = 'force-static'" to all API routes
 * This allows them to work with Next.js static export for Capacitor
 */

const apiRoutesPattern = 'src/app/api/**/route.ts';
const files = glob.sync(apiRoutesPattern);

console.log(`Found ${files.length} API route files`);

let fixed = 0;
let skipped = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');

  // Check if already has the export
  if (content.includes('export const dynamic')) {
    console.log(`✓ Skipped (already has dynamic export): ${file}`);
    skipped++;
    return;
  }

  // Add the export at the top of the file (after imports)
  const lines = content.split('\n');
  let insertIndex = 0;

  // Find the last import statement
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import{')) {
      insertIndex = i + 1;
    }
    if (lines[i].trim().length === 0 && insertIndex > 0) {
      insertIndex = i + 1;
      break;
    }
  }

  // Insert the export statement
  lines.splice(insertIndex, 0, '', '// Force static generation for Capacitor compatibility', 'export const dynamic = "force-static";', 'export const revalidate = false;', '');

  const newContent = lines.join('\n');
  fs.writeFileSync(file, newContent, 'utf8');

  console.log(`✓ Fixed: ${file}`);
  fixed++;
});

console.log(`\n✅ Complete!`);
console.log(`   Fixed: ${fixed} files`);
console.log(`   Skipped: ${skipped} files`);
console.log(`\nNote: Some API routes may not work properly with static export.`);
console.log(`For production, consider refactoring to use Server Components instead.`);
