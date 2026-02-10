import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Count documents by source and status
    const counts = await sql`
      SELECT
        source,
        status,
        COUNT(*) as count
      FROM documents
      GROUP BY source, status
      ORDER BY source, status
    `;

    // Get total count
    const total = await sql`
      SELECT COUNT(*) as total FROM documents
    `;

    // Get sample documents
    const samples = await sql`
      SELECT id, title, source, status
      FROM documents
      LIMIT 10
    `;

    return res.status(200).json({
      total: total[0]?.total || 0,
      counts,
      samples,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
