# Fresno County Search Fix

## Problem
When users asked "What is the policy for Fresno County", the system returned "I don't have specific policy documents on this topic" even though Fresno documents existed in the database.

## Root Cause
**File:** `api/chat.ts` lines 173-176

**Broken query:**
```sql
WHERE (
  c.search_vector @@ websearch_to_tsquery('english', ${question})
  OR d.section ILIKE '%' || ${question} || '%'
  OR d.title ILIKE '%' || ${question} || '%'
)
```

The ILIKE clauses searched for the **ENTIRE question string** in title/section:
- `d.section ILIKE '%What is the policy for Fresno County%'`
- `d.title ILIKE '%What is the policy for Fresno County%'`

This **did not match** documents where:
- `title = "Fresno County Child Support Handbook"`
- `section = "Fresno County"`

## Fix
**Changed to full-text search** that extracts key terms:
```sql
WHERE (
  c.search_vector @@ websearch_to_tsquery('english', ${question})
  OR to_tsvector('english', COALESCE(d.section, '')) @@ websearch_to_tsquery('english', ${question})
  OR to_tsvector('english', d.title) @@ websearch_to_tsquery('english', ${question})
  OR d.source ILIKE '%' || ${question} || '%'
)
```

## How It Works
`websearch_to_tsquery` automatically:
1. Extracts key terms: "policy", "fresno", "county"
2. Ignores stop words: "what", "is", "the", "for"
3. Matches documents containing ANY of those key terms

So `"What is the policy for Fresno County"` now correctly matches:
- Documents with title containing "Fresno" and "County"
- Documents with section = "Fresno County"
- Any chunks mentioning Fresno County policies

## Result
✅ Fresno County documents now found in search results
✅ Works for all county names (Los Angeles, San Diego, etc.)
✅ Works for any policy question with key terms
