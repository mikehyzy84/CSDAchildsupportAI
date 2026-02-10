import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  citations: any[];
  created_at: string;
}

interface ChatSession {
  session_id: string;
  first_question: string;
  message_count: number;
  last_updated: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { sessionId } = req.query;

    // If sessionId provided, return all messages for that session
    if (sessionId) {
      const messages = await sql<ChatMessage[]>`
        SELECT
          id,
          question,
          answer,
          citations,
          created_at
        FROM chats
        WHERE session_id = ${sessionId as string}
        ORDER BY created_at ASC
      `;

      return res.status(200).json({ messages });
    }

    // Otherwise, return list of all sessions
    const sessions = await sql<ChatSession[]>`
      SELECT
        session_id,
        MIN(question) as first_question,
        COUNT(*) as message_count,
        MAX(created_at) as last_updated
      FROM chats
      GROUP BY session_id
      ORDER BY MAX(created_at) DESC
      LIMIT 50
    `;

    return res.status(200).json({ sessions });

  } catch (error) {
    console.error('Chat history error:', error);
    return res.status(500).json({
      error: 'Failed to fetch chat history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
