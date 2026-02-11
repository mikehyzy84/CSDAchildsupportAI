-- COMPREHENSIVE QUERY TEST SCENARIOS
-- This file tests the chat search query under all possible data conditions

-- ============================================================================
-- SCENARIO 1: Documents WITH chunks and search_vectors
-- ============================================================================
-- Expected: Should find these easily via full-text search or ILIKE
-- Test query (simplified version of actual):
SELECT 'SCENARIO 1: Documents with chunks' as test_name;
SELECT
  d.id as document_id,
  d.title,
  d.section,
  d.source,
  COUNT(c.id) as chunk_count,
  COUNT(c.search_vector) as chunks_with_vectors
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%'
GROUP BY d.id, d.title, d.section, d.source;

-- ============================================================================
-- SCENARIO 2: Documents WITHOUT chunks (uploaded but not processed)
-- ============================================================================
-- Problem: INNER JOIN excludes these
-- Solution: LEFT JOIN includes these
SELECT 'SCENARIO 2: Documents without chunks' as test_name;
SELECT
  d.id,
  d.title,
  d.section,
  d.status,
  COUNT(c.id) as chunk_count
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE (d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%')
  AND d.status = 'completed'
GROUP BY d.id, d.title, d.section, d.status
HAVING COUNT(c.id) = 0;
-- Expected: If any rows returned, these documents were INVISIBLE with INNER JOIN
-- With LEFT JOIN, they now appear!

-- ============================================================================
-- SCENARIO 3: Documents with chunks but NO search_vectors
-- ============================================================================
-- Problem: Full-text search fails, but ILIKE should still work
SELECT 'SCENARIO 3: Chunks without search vectors' as test_name;
SELECT
  d.id,
  d.title,
  c.id as chunk_id,
  c.search_vector IS NULL as missing_vector,
  LENGTH(c.content) as content_length
FROM documents d
JOIN chunks c ON c.document_id = d.id
WHERE (d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%')
  AND c.search_vector IS NULL
LIMIT 5;
-- Expected: If rows returned, full-text search won't work, but ILIKE will

-- ============================================================================
-- SCENARIO 4: Test the ACTUAL query with Fresno
-- ============================================================================
SELECT 'SCENARIO 4: Actual query test - Fresno County' as test_name;
SELECT DISTINCT ON (d.id)
  d.id as document_id,
  d.title,
  d.section,
  d.source,
  CASE
    WHEN c.search_vector IS NOT NULL THEN 'Has vector - FTS works'
    WHEN c.id IS NOT NULL THEN 'Has chunks but no vector - ILIKE only'
    ELSE 'No chunks - Document metadata only'
  END as search_method,
  CASE
    WHEN c.search_vector IS NOT NULL THEN ts_rank(c.search_vector, websearch_to_tsquery('english', 'What is the policy for Fresno County'))
    WHEN d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%' THEN 1.0
    ELSE 0.5
  END as rank
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE (
  (c.search_vector IS NOT NULL AND c.search_vector @@ websearch_to_tsquery('english', 'What is the policy for Fresno County'))
  OR c.content ILIKE '%fresno%'
  OR d.section ILIKE '%fresno%'
  OR d.title ILIKE '%fresno%'
  OR d.source ILIKE '%fresno%'
)
AND d.status = 'completed'
ORDER BY d.id, rank DESC;
-- Expected: Should return ALL 3 Fresno documents regardless of chunk status

-- ============================================================================
-- SCENARIO 5: Verify document status
-- ============================================================================
SELECT 'SCENARIO 5: Check document status' as test_name;
SELECT
  id,
  title,
  section,
  status,
  created_at,
  updated_at
FROM documents
WHERE section ILIKE '%fresno%' OR title ILIKE '%fresno%' OR source ILIKE '%fresno%';
-- Expected: All 3 documents should have status='completed'
-- If any have status='pending', 'processing', or 'failed', they won't appear in search

-- ============================================================================
-- SCENARIO 6: Count total results for different search terms
-- ============================================================================
SELECT 'SCENARIO 6: Result counts by search term' as test_name;

-- Test: "fresno"
SELECT 'fresno' as search_term, COUNT(DISTINCT d.id) as document_count
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE (d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%' OR c.content ILIKE '%fresno%')
  AND d.status = 'completed'

UNION ALL

-- Test: "fresno county"
SELECT 'fresno county' as search_term, COUNT(DISTINCT d.id) as document_count
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE (d.section ILIKE '%fresno county%' OR d.title ILIKE '%fresno county%' OR d.source ILIKE '%fresno county%' OR c.content ILIKE '%fresno county%')
  AND d.status = 'completed'

UNION ALL

-- Test: "What is the policy for Fresno County"
SELECT 'full question' as search_term, COUNT(DISTINCT d.id) as document_count
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE (
  (c.search_vector IS NOT NULL AND c.search_vector @@ websearch_to_tsquery('english', 'What is the policy for Fresno County'))
  OR c.content ILIKE '%fresno%'
  OR d.section ILIKE '%fresno%'
  OR d.title ILIKE '%fresno%'
  OR d.source ILIKE '%fresno%'
)
AND d.status = 'completed';

-- Expected: All three should return 3 documents

-- ============================================================================
-- SCENARIO 7: Verify search_vector population rate
-- ============================================================================
SELECT 'SCENARIO 7: Search vector coverage' as test_name;
SELECT
  d.id,
  d.title,
  COUNT(c.id) as total_chunks,
  COUNT(c.search_vector) as chunks_with_vectors,
  ROUND(100.0 * COUNT(c.search_vector) / NULLIF(COUNT(c.id), 0), 2) as vector_coverage_pct
FROM documents d
LEFT JOIN chunks c ON c.document_id = d.id
WHERE d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%'
GROUP BY d.id, d.title;
-- Expected: 100% coverage for good search performance
-- If <100%, ILIKE fallbacks are critical

-- ============================================================================
-- DIAGNOSTIC OUTPUT
-- ============================================================================
SELECT '
========================================
INTERPRETATION GUIDE
========================================

SCENARIO 1: Lists all Fresno documents with their chunk counts
  - If count = 0, document has no chunks (invisible with INNER JOIN)
  - If chunks_with_vectors < chunk_count, some chunks lack search vectors

SCENARIO 2: Lists Fresno documents with NO chunks
  - These were INVISIBLE with INNER JOIN
  - Now visible with LEFT JOIN

SCENARIO 3: Lists chunks without search_vectors
  - Full-text search will miss these
  - ILIKE on content/metadata is critical

SCENARIO 4: The actual query test
  - Should return 3 results
  - If less, indicates a remaining issue

SCENARIO 5: Document status check
  - All should be "completed"
  - Any other status means the document is filtered out

SCENARIO 6: Result counts by search term
  - All three searches should return 3 documents
  - If not, the query logic has a bug

SCENARIO 7: Search vector coverage
  - 100% = Full-text search works perfectly
  - <100% = Need ILIKE fallbacks (which we have)
  - 0% = Full-text search completely fails, ILIKE critical

========================================
KEY FIXES APPLIED
========================================

1. LEFT JOIN instead of INNER JOIN
   - Documents without chunks now appear

2. Multiple search strategies:
   - Full-text search (smart, handles stemming)
   - ILIKE on chunk content (catches mentions)
   - ILIKE on document metadata (title, section, source)

3. NULL-safe search_vector check
   - Only attempts FTS if vector exists

4. DISTINCT ON (d.id)
   - Prevents duplicate results from multiple chunks

5. Increased LIMIT to 20
   - More generous result set

6. Better ranking logic
   - Prioritizes exact county name matches

========================================
' as diagnostic_guide;
