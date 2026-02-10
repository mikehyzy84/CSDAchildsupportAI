#!/usr/bin/env node

const { spawn } = require('child_process');
// Try to load .env file if it exists
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not required if env vars are already set
}

const fs = require('fs');
const path = require('path');

// Seed files to import in order
const seedFiles = [
  'db/seed-part1.sql',
  'db/seed-part2.sql',
  'db/seed-part3.sql',
  'db/seed-part4.sql',
  'db/seed-sourcebook.sql',
  'db/seed-new-docs.sql',
];

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  console.error('   Please set it in your .env file or environment');
  process.exit(1);
}

console.log('🚀 Starting database seed import...\n');

let completedCount = 0;

// Function to run a single seed file
function runSeedFile(filePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(process.cwd(), filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${filePath}`);
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    console.log(`📄 Importing ${filePath}...`);

    const psql = spawn('psql', [databaseUrl, '-f', fullPath], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    psql.stdout.on('data', (data) => {
      output += data.toString();
    });

    psql.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    psql.on('close', (code) => {
      if (code === 0) {
        completedCount++;
        console.log(`✅ Successfully imported ${filePath}`);
        console.log(`   Progress: ${completedCount}/${seedFiles.length}\n`);
        resolve();
      } else {
        console.error(`❌ Failed to import ${filePath}`);
        console.error(`   Error output: ${errorOutput}`);
        reject(new Error(`psql exited with code ${code}`));
      }
    });

    psql.on('error', (err) => {
      if (err.code === 'ENOENT') {
        console.error('❌ psql command not found');
        console.error('   Please install PostgreSQL client tools');
        console.error('   On Mac: brew install postgresql');
        console.error('   On Ubuntu: sudo apt-get install postgresql-client');
      }
      reject(err);
    });
  });
}

// Import all seed files sequentially
(async () => {
  try {
    for (const file of seedFiles) {
      await runSeedFile(file);
    }

    console.log('✨ All seed files imported successfully!');
    console.log(`   Total files imported: ${completedCount}/${seedFiles.length}`);
    console.log('\n🎉 Database is now populated with documents');
    console.log('   You can now view them at /documents\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error(`   Completed: ${completedCount}/${seedFiles.length} files`);
    process.exit(1);
  }
})();
