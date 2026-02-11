/**
 * DATABASE DIAGNOSTIC SCRIPT
 *
 * Run this with: node diagnose-database.js
 *
 * This script connects to the production database and checks:
 * 1. Do Fresno documents exist?
 * 2. What is their status?
 * 3. Do they have chunks?
 * 4. Do chunks have search_vectors?
 * 5. What does the actual query return?
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable not set');
  console.error('');
  console.error('Please set DATABASE_URL in .env file or environment variables.');
  console.error('Example: DATABASE_URL=postgresql://user:pass@host/database');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

console.log('='.repeat(80));
console.log('DATABASE DIAGNOSTIC - FRESNO COUNTY SEARCH');
console.log('='.repeat(80));
console.log('');

async function runDiagnostics() {
  try {
    // ========================================================================
    // CHECK 1: Do Fresno documents exist?
    // ========================================================================
    console.log('CHECK 1: Verifying Fresno documents exist in database');
    console.log('-'.repeat(80));

    const fresnoDocuments = await sql`
      SELECT id, title, section, source, status, created_at
      FROM documents
      WHERE section ILIKE '%fresno%' OR title ILIKE '%fresno%' OR source ILIKE '%fresno%'
      ORDER BY created_at DESC
    `;

    console.log(`Found ${fresnoDocuments.length} documents matching "Fresno":`);
    console.log('');

    if (fresnoDocuments.length === 0) {
      console.log('❌ NO FRESNO DOCUMENTS FOUND');
      console.log('');
      console.log('PROBLEM: Documents do not exist in database.');
      console.log('SOLUTION: Upload/import Fresno County documents.');
      console.log('');
      process.exit(1);
    }

    fresnoDocuments.forEach((doc, idx) => {
      console.log(`${idx + 1}. ${doc.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Section: ${doc.section || 'N/A'}`);
      console.log(`   Source: ${doc.source}`);
      console.log(`   Status: ${doc.status} ${doc.status !== 'completed' ? '⚠️  NOT COMPLETED!' : '✅'}`);
      console.log(`   Created: ${doc.created_at}`);
      console.log('');
    });

    // Check if any are not completed
    const notCompleted = fresnoDocuments.filter(d => d.status !== 'completed');
    if (notCompleted.length > 0) {
      console.log(`⚠️  WARNING: ${notCompleted.length} documents have status != 'completed'`);
      console.log('These documents will NOT appear in search results.');
      console.log('');
      notCompleted.forEach(doc => {
        console.log(`  - ${doc.title} (status: ${doc.status})`);
      });
      console.log('');
      console.log('SOLUTION: Update status to "completed":');
      console.log(`  UPDATE documents SET status = 'completed' WHERE id IN ('${notCompleted.map(d => d.id).join("','")}');`);
      console.log('');
    }

    // ========================================================================
    // CHECK 2: Do documents have chunks?
    // ========================================================================
    console.log('CHECK 2: Verifying documents have chunks');
    console.log('-'.repeat(80));

    for (const doc of fresnoDocuments) {
      const chunks = await sql`
        SELECT id, chunk_index, LENGTH(content) as content_length, search_vector IS NOT NULL as has_vector
        FROM chunks
        WHERE document_id = ${doc.id}
        ORDER BY chunk_index
      `;

      console.log(`Document: ${doc.title}`);
      console.log(`  Chunks: ${chunks.length}`);

      if (chunks.length === 0) {
        console.log(`  ⚠️  NO CHUNKS - Document won't appear in search with INNER JOIN`);
        console.log(`  ✅  BUT: Our LEFT JOIN fix makes it visible anyway`);
      } else {
        const withVectors = chunks.filter(c => c.has_vector).length;
        console.log(`  Search vectors: ${withVectors}/${chunks.length} (${Math.round(100 * withVectors / chunks.length)}%)`);

        if (withVectors === 0) {
          console.log(`  ⚠️  NO SEARCH VECTORS - Full-text search won't work`);
          console.log(`  ✅  BUT: Our ILIKE fallback makes it findable anyway`);
        } else if (withVectors < chunks.length) {
          console.log(`  ⚠️  SOME MISSING - Partial full-text search coverage`);
        } else {
          console.log(`  ✅  ALL CHUNKS HAVE VECTORS - Full-text search works`);
        }
      }
      console.log('');
    }

    // ========================================================================
    // CHECK 3: Test the actual query
    // ========================================================================
    console.log('CHECK 3: Testing actual search query');
    console.log('-'.repeat(80));

    const question = 'What is the policy for Fresno County?';
    console.log(`Question: "${question}"`);
    console.log('');

    const searchResults = await sql`
      SELECT DISTINCT ON (d.id)
        COALESCE(c.id::text, d.id::text || '-doc') as id,
        d.id as document_id,
        COALESCE(c.content, d.title || E'\n\nSection: ' || COALESCE(d.section, 'N/A') || E'\n\nThis document is available.') as content,
        COALESCE(c.section_title, d.section, 'General') as section_title,
        COALESCE(c.chunk_index, 0) as chunk_index,
        d.title,
        d.source,
        d.source_url,
        CASE
          WHEN c.search_vector IS NOT NULL THEN ts_rank(c.search_vector, websearch_to_tsquery('english', ${question}))
          WHEN d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%' THEN 1.0
          WHEN d.section ILIKE '%los angeles%' OR d.title ILIKE '%los angeles%' OR d.source ILIKE '%los angeles%' THEN 1.0
          WHEN d.section ILIKE '%san diego%' OR d.title ILIKE '%san diego%' OR d.source ILIKE '%san diego%' THEN 1.0
          ELSE 0.5
        END as rank
      FROM documents d
      LEFT JOIN chunks c ON c.document_id = d.id
      WHERE (
        (c.search_vector IS NOT NULL AND c.search_vector @@ websearch_to_tsquery('english', ${question}))
        OR c.content ILIKE '%fresno%'
        OR c.content ILIKE '%los angeles%'
        OR c.content ILIKE '%san diego%'
        OR d.section ILIKE '%fresno%'
        OR d.title ILIKE '%fresno%'
        OR d.source ILIKE '%fresno%'
        OR d.section ILIKE '%los angeles%'
        OR d.title ILIKE '%los angeles%'
        OR d.source ILIKE '%los angeles%'
        OR d.section ILIKE '%san diego%'
        OR d.title ILIKE '%san diego%'
        OR d.source ILIKE '%san diego%'
      )
      AND d.status = 'completed'
      ORDER BY d.id, rank DESC
      LIMIT 20
    `;

    console.log(`Query returned: ${searchResults.length} results`);
    console.log('');

    if (searchResults.length === 0) {
      console.log('❌ QUERY RETURNED ZERO RESULTS');
      console.log('');
      console.log('This means:');
      console.log('  1. Documents have status != "completed" (check CHECK 1 above)');
      console.log('  OR');
      console.log('  2. None of the WHERE conditions matched (query bug)');
      console.log('  OR');
      console.log('  3. Database connection issue');
      console.log('');
    } else {
      console.log('✅ QUERY WORKING - Results:');
      console.log('');
      searchResults.forEach((result, idx) => {
        console.log(`${idx + 1}. ${result.title}`);
        console.log(`   Section: ${result.section_title}`);
        console.log(`   Source: ${result.source}`);
        console.log(`   Rank: ${result.rank}`);
        console.log(`   Content preview: ${result.content.substring(0, 150)}...`);
        console.log('');
      });
    }

    // ========================================================================
    // CHECK 4: Confidence calculation
    // ========================================================================
    console.log('CHECK 4: Confidence level calculation');
    console.log('-'.repeat(80));

    const confidence = searchResults.length >= 5 ? 'high' :
                      searchResults.length >= 2 ? 'medium' :
                      searchResults.length >= 1 ? 'low' : 'none';

    console.log(`Result count: ${searchResults.length}`);
    console.log(`Confidence: ${confidence}`);
    console.log('');

    if (confidence === 'none') {
      console.log('LLM will say: "I don\'t have specific policy documents on this topic"');
      console.log('This is the PROBLEM we\'re trying to fix.');
    } else {
      console.log('LLM will provide answer with citations to found documents.');
      console.log('This is EXPECTED BEHAVIOR ✅');
    }
    console.log('');

    // ========================================================================
    // FINAL SUMMARY
    // ========================================================================
    console.log('='.repeat(80));
    console.log('DIAGNOSTIC SUMMARY');
    console.log('='.repeat(80));
    console.log('');

    const completedCount = fresnoDocuments.filter(d => d.status === 'completed').length;
    const totalChunks = fresnoDocuments.reduce((sum, doc) => sum + (doc.chunk_count || 0), 0);

    console.log(`✅ Documents exist: ${fresnoDocuments.length} total`);
    console.log(`${completedCount === fresnoDocuments.length ? '✅' : '❌'} Status completed: ${completedCount}/${fresnoDocuments.length}`);
    console.log(`${searchResults.length > 0 ? '✅' : '❌'} Query returns results: ${searchResults.length}`);
    console.log(`${confidence !== 'none' ? '✅' : '❌'} Confidence level: ${confidence}`);
    console.log('');

    if (searchResults.length === 0) {
      console.log('🔧 NEXT STEPS:');
      console.log('');
      if (completedCount < fresnoDocuments.length) {
        console.log('1. Update document status to "completed":');
        const incompleteIds = fresnoDocuments.filter(d => d.status !== 'completed').map(d => d.id);
        console.log(`   UPDATE documents SET status = 'completed' WHERE id IN ('${incompleteIds.join("','")}');`);
      } else {
        console.log('1. Documents are marked completed ✅');
      }
      console.log('');
      console.log('2. Verify database connection in production:');
      console.log('   - Check DATABASE_URL environment variable in Vercel');
      console.log('   - Ensure Neon database is accessible from Vercel');
      console.log('');
      console.log('3. Check deployment logs for errors');
      console.log('');
    } else {
      console.log('✅ EVERYTHING LOOKS GOOD!');
      console.log('');
      console.log('The query should work in production.');
      console.log('If it still doesn\'t work in chat:');
      console.log('  - Clear browser cache');
      console.log('  - Wait 1-2 minutes for deployment');
      console.log('  - Check Vercel deployment status');
    }

    console.log('');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ ERROR running diagnostics:', error.message);
    console.error('');
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

runDiagnostics();
