/**
 * /api/documents — Document listing endpoint (GET)
 *
 * Returns every document in the `documents` table, ordered by category
 * (California first, then Federal, then everything else). Used by the
 * Documents page in the frontend to show the full policy library.
 *
 * Connects to: Neon Postgres via pg Pool (DATABASE_URL)
 *
 * Gotchas:
 *  - Uses the `pg` Pool driver (not the Neon serverless client) because
 *    this was written before the rest of the API adopted @neondatabase/serverless.
 *    Both work fine on Vercel, but this is the only endpoint using Pool.
 *  - Hard-capped at 1000 rows to prevent payload explosion.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all documents from the database
    const result = await pool.query(`
      SELECT
        id,
        title,
        category,
        source,
        url
      FROM documents
      ORDER BY
        CASE category
          WHEN 'California' THEN 1
          WHEN 'Federal' THEN 2
          ELSE 3
        END,
        title ASC
      LIMIT 1000
    `);

    return res.status(200).json({
      documents: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({
      error: 'Failed to fetch documents',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
