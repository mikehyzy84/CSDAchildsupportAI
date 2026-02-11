import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from cookie or Authorization header
    const cookieToken = req.cookies?.auth_token;
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Find session and user
    const sessionResult = await sql`
      SELECT
        s.user_id, s.expires_at,
        u.id, u.email, u.name, u.role, u.county, u.active
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token}
      AND s.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `;

    if (sessionResult.length === 0) {
      // Invalid or expired session
      res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    const user = sessionResult[0];

    // Check if user is active
    if (!user.active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Update last accessed time for session
    await sql`
      UPDATE sessions
      SET last_accessed = CURRENT_TIMESTAMP
      WHERE token = ${token}
    `;

    // Return user data
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      county: user.county,
      active: user.active
    };

    return res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Verify session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
