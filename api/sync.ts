/**
 * /api/sync — Scheduled document sync endpoint (GET / POST) [STUB]
 *
 * Intended to be called by the Vercel cron defined in vercel.json
 * (daily at noon UTC). Will eventually re-scrape official sources and
 * update the documents table. Currently returns a placeholder response.
 *
 * Connects to: nothing yet
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow GET and POST requests (cron jobs use GET)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Stub response - scraping logic will be added later
    return res.status(200).json({
      status: 'ok',
      message: 'Sync endpoint ready',
      lastSync: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
