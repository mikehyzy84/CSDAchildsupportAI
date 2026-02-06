import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total searches for today
    const todayResult = await sql`
      SELECT COUNT(*) as count
      FROM chats
      WHERE created_at >= CURRENT_DATE
    `;
    const total_searches_today = parseInt(todayResult[0]?.count || '0');

    // Get total searches for this week
    const weekResult = await sql`
      SELECT COUNT(*) as count
      FROM chats
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `;
    const total_searches_week = parseInt(weekResult[0]?.count || '0');

    // Get total searches for this month
    const monthResult = await sql`
      SELECT COUNT(*) as count
      FROM chats
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `;
    const total_searches_month = parseInt(monthResult[0]?.count || '0');

    // Get top 10 search queries
    const topSearchesResult = await sql`
      SELECT
        question as query,
        COUNT(*) as count
      FROM chats
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY question
      ORDER BY count DESC
      LIMIT 10
    `;
    const top_searches = topSearchesResult.map((row: any) => ({
      query: row.query,
      count: parseInt(row.count)
    }));

    // Get daily activity for the last 7 days
    const activityResult = await sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as searches
      FROM chats
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const user_activity = activityResult.map((row: any) => ({
      date: row.date,
      searches: parseInt(row.searches)
    }));

    // Get feedback statistics
    const goodFeedbackResult = await sql`
      SELECT COUNT(*) as count
      FROM chats
      WHERE feedback = 'positive'
    `;
    const count_good_feedback = parseInt(goodFeedbackResult[0]?.count || '0');

    const badFeedbackResult = await sql`
      SELECT COUNT(*) as count
      FROM chats
      WHERE feedback = 'negative'
    `;
    const count_bad_feedback = parseInt(badFeedbackResult[0]?.count || '0');

    // Get last sync timestamp from documents table
    const lastSyncResult = await sql`
      SELECT MAX(updated_at) as last_sync
      FROM documents
    `;
    const last_sync_timestamp = lastSyncResult[0]?.last_sync || null;

    // Return analytics data
    return res.status(200).json({
      total_chats_today: total_searches_today,
      total_chats_week: total_searches_week,
      total_chats_month: total_searches_month,
      count_good_feedback,
      count_bad_feedback,
      top_questions: top_searches,
      user_activity,
      last_sync_timestamp
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
