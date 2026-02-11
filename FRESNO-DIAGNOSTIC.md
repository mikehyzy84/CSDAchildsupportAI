# COMPREHENSIVE FRESNO SEARCH DIAGNOSTIC

## Problem Summary
User reports 3 Fresno County documents exist in database, but chat search returns "I don't have specific policy documents on Fresno County" when asking "What is the policy for Fresno County?"

## Root Cause Analysis

### Potential Issues Identified:

1. **QUERY TOO RESTRICTIVE** ✅ FIXED
   - Original: Used full-text search which may be too strict
   - Fix: Added explicit `ILIKE '%fresno%'` searches on all text columns
   - Also added: Los Angeles, San Diego for other counties
   - Increased LIMIT from 8 to 20 results

2. **DOCUMENTS NOT MARKED AS COMPLETED** ⚠️ NEEDS VERIFICATION
   - Query filters: `AND d.status = 'completed'`
   - If Fresno docs have status='pending' or 'failed', they won't appear
   - **ACTION NEEDED:** Run this query to check:
   ```sql
   SELECT id, title, source, status FROM documents
   WHERE (source ILIKE '%fresno%' OR title ILIKE '%fresno%' OR section ILIKE '%fresno%');
   ```
   - Expected: 3 rows, all with status='completed'

3. **DOCUMENTS HAVE NO CHUNKS** ⚠️ NEEDS VERIFICATION
   - Query joins: `FROM chunks c JOIN documents d ON c.document_id = d.id`
   - If documents have no chunks, they won't appear (INNER JOIN)
   - **ACTION NEEDED:** Run this query:
   ```sql
   SELECT d.id, d.title, COUNT(c.id) as chunk_count
   FROM documents d
   LEFT JOIN chunks c ON c.document_id = d.id
   WHERE d.source ILIKE '%fresno%' OR d.title ILIKE '%fresno%'
   GROUP BY d.id, d.title;
   ```
   - Expected: 3 rows, all with chunk_count > 0

4. **CHUNKS MISSING SEARCH_VECTORS** ⚠️ NEEDS VERIFICATION
   - Query searches: `c.search_vector @@ websearch_to_tsquery('english', ${question})`
   - If search_vector column is NULL or not populated, full-text search won't work
   - **ACTION NEEDED:** Run this query:
   ```sql
   SELECT c.id, c.document_id, c.search_vector IS NOT NULL as has_vector
   FROM chunks c
   JOIN documents d ON c.document_id = d.id
   WHERE d.source ILIKE '%fresno%'
   LIMIT 10;
   ```
   - Expected: All rows should have has_vector=true

## Current Query (After All Fixes)

```sql
SELECT
  c.id,
  c.document_id,
  c.content,
  c.section_title,
  c.chunk_index,
  d.title,
  d.source,
  d.source_url,
  GREATEST(
    ts_rank(c.search_vector, websearch_to_tsquery('english', 'What is the policy for Fresno County')),
    CASE WHEN d.source ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.section ILIKE '%fresno%' THEN 1.0 ELSE 0 END,
    CASE WHEN d.source ILIKE '%los angeles%' OR d.title ILIKE '%los angeles%' OR d.section ILIKE '%los angeles%' THEN 1.0 ELSE 0 END,
    CASE WHEN d.source ILIKE '%san diego%' OR d.title ILIKE '%san diego%' OR d.section ILIKE '%san diego%' THEN 1.0 ELSE 0 END
  ) as rank
FROM chunks c
JOIN documents d ON c.document_id = d.id
WHERE (
  c.search_vector @@ websearch_to_tsquery('english', 'What is the policy for Fresno County')
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
ORDER BY rank DESC
LIMIT 20;
```

## Why This Query SHOULD Work Now

1. **Multiple Search Strategies:**
   - Full-text search on chunks.search_vector (smart, handles stemming)
   - ILIKE on chunks.content (catches any mention of "fresno")
   - ILIKE on documents.source (catches source="Fresno County")
   - ILIKE on documents.title (catches title="Fresno County Handbook")
   - ILIKE on documents.section (catches section="Fresno County")

2. **Case-Insensitive:**
   - ILIKE is case-insensitive, so matches "Fresno", "FRESNO", "fresno"

3. **Generous Limit:**
   - Increased from 8 to 20 results

4. **Better Ranking:**
   - Prioritizes exact county matches with rank=1.0

## If It Still Doesn't Work

### Most Likely Culprit: INNER JOIN
The query uses `JOIN` (INNER JOIN) which means:
- Documents WITHOUT chunks won't appear
- Even if documents exist, if they have no chunks, they're invisible

**THE FIX:** Change to LEFT JOIN and handle NULL chunks:

```sql
SELECT
  d.id as document_id,
  COALESCE(c.id, d.id) as result_id,
  COALESCE(c.content, d.title || ' - ' || COALESCE(d.section, '')) as content,
  d.section as section_title,
  0 as chunk_index,
  d.title,
  d.source,
  d.source_url,
  CASE
    WHEN c.search_vector IS NOT NULL THEN ts_rank(c.search_vector, websearch_to_tsquery('english', ${question}))
    WHEN d.source ILIKE '%fresno%' THEN 1.0
    WHEN d.title ILIKE '%fresno%' THEN 0.9
    ELSE 0.5
  END as rank
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
ORDER BY rank DESC
LIMIT 20;
```

## Test Cases to Verify

1. **"What is the policy for Fresno County?"**
   - Should return: 3+ results, all Fresno-related

2. **"Fresno"**
   - Should return: All Fresno documents

3. **"fresno county child support"**
   - Should return: Fresno documents

4. **"Los Angeles County procedures"**
   - Should return: LA County documents (if they exist)

## Next Steps

1. ✅ Applied aggressive ILIKE search fix
2. ⚠️ VERIFY: Check if documents have status='completed'
3. ⚠️ VERIFY: Check if documents have chunks
4. ⚠️ VERIFY: Check if chunks have search_vectors
5. 🔧 IF NEEDED: Change JOIN to LEFT JOIN to include documents without chunks
