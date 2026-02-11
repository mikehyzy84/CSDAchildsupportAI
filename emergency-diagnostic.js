import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

console.log('EMERGENCY DIAGNOSTIC - FINDING THE PROBLEM\n');

async function emergencyCheck() {
  try {
    // Check 1: Find ALL Fresno documents regardless of status
    console.log('=== ALL FRESNO DOCUMENTS (no status filter) ===');
    const allDocs = await sql`
      SELECT id, title, section, source, status, created_at
      FROM documents
      WHERE section ILIKE '%fresno%' OR title ILIKE '%fresno%' OR source ILIKE '%fresno%'
      ORDER BY status, created_at
    `;

    console.log(`Found ${allDocs.length} total documents:\n`);
    allDocs.forEach((doc, i) => {
      console.log(`${i+1}. ${doc.title}`);
      console.log(`   Status: ${doc.status} ${doc.status !== 'completed' ? '❌ NOT COMPLETED' : '✅'}`);
      console.log(`   Section: ${doc.section}`);
      console.log(`   Source: ${doc.source}`);
      console.log('');
    });

    // Check 2: Test the actual query
    const question = 'What is the policy for Fresno County?';
    console.log('=== TESTING ACTUAL QUERY ===');
    console.log(`Question: "${question}"\n`);

    const results = await sql`
      SELECT DISTINCT ON (d.id)
        d.id, d.title, d.section, d.source, d.status
      FROM documents d
      LEFT JOIN chunks c ON c.document_id = d.id
      WHERE (
        (c.search_vector IS NOT NULL AND c.search_vector @@ websearch_to_tsquery('english', ${question}))
        OR c.content ILIKE '%fresno%'
        OR d.section ILIKE '%fresno%'
        OR d.title ILIKE '%fresno%'
        OR d.source ILIKE '%fresno%'
      )
      AND d.status = 'completed'
      ORDER BY d.id
    `;

    console.log(`Query with status='completed' filter returned: ${results.length} documents\n`);
    results.forEach((doc, i) => {
      console.log(`${i+1}. ${doc.title} (status: ${doc.status})`);
    });

    // THE PROBLEM
    const blockedCount = allDocs.length - results.length;
    if (blockedCount > 0) {
      console.log(`\n❌ PROBLEM IDENTIFIED: ${blockedCount} documents are blocked by status filter!\n`);

      const blocked = allDocs.filter(d => d.status !== 'completed');
      console.log('Blocked documents:');
      blocked.forEach(doc => {
        console.log(`  - ${doc.title} (status: ${doc.status})`);
      });

      console.log('\n=== FIX ===');
      console.log('Run this SQL in Neon console:\n');
      const ids = blocked.map(d => `'${d.id}'`).join(',');
      console.log(`UPDATE documents SET status = 'completed' WHERE id IN (${ids});\n`);
    } else {
      console.log('\n✅ All documents have status=completed. Problem is elsewhere.\n');
    }

  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

emergencyCheck();
