import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!);

interface FeedbackRequest {
  chatId: string;
  feedback: 'good' | 'bad';
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chatId, feedback } = req.body as FeedbackRequest;

    // Validate required fields
    if (!chatId || !feedback) {
      return res.status(400).json({ error: 'Missing required fields: chatId, feedback' });
    }

    // Validate feedback value
    if (feedback !== 'good' && feedback !== 'bad') {
      return res.status(400).json({ error: 'Invalid feedback value. Must be "good" or "bad"' });
    }

    // Map "good"/"bad" to database values "positive"/"negative"
    const feedbackValue = feedback === 'good' ? 'positive' : 'negative';

    // Update feedback in database
    const result = await sql`
      UPDATE chats
      SET feedback = ${feedbackValue}
      WHERE id = ${chatId}
      RETURNING id
    `;

    // Check if chat was found and updated
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Feedback API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
