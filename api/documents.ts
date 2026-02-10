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
        source as category,
        source,
        source_url as url,
        status
      FROM documents
      WHERE status = 'completed'
      ORDER BY
        CASE source
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
