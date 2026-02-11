import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookieToken = req.cookies?.auth_token;
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Find session and user
    const sessionResult = await sql`
      SELECT s.user_id, u.id, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token}
      AND s.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `;

    if (sessionResult.length === 0) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    const userId = sessionResult[0].user_id;
    const { name, email, county, currentPassword, password, profile_picture } = req.body;

    // Validate password change
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }

      const userResult = await sql`
        SELECT password_hash FROM users WHERE id = ${userId} LIMIT 1
      `;

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, userResult[0].password_hash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    // Check email uniqueness if changing
    if (email !== undefined) {
      const emailCheck = await sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase()} AND id != ${userId} LIMIT 1
      `;

      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    // Get current user data for fields not being updated
    const currentUser = await sql`
      SELECT name, email, county, password_hash, profile_picture
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (currentUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine final values (use provided or keep current)
    const finalName = name !== undefined ? name : currentUser[0].name;
    const finalEmail = email !== undefined ? email.toLowerCase() : currentUser[0].email;
    const finalCounty = county !== undefined ? county : currentUser[0].county;
    const finalPasswordHash = password ? await bcrypt.hash(password, 10) : currentUser[0].password_hash;
    const finalProfilePicture = profile_picture !== undefined ? profile_picture : currentUser[0].profile_picture;

    // Perform update with all values using tagged template
    const result = await sql`
      UPDATE users
      SET
        name = ${finalName},
        email = ${finalEmail},
        county = ${finalCounty},
        password_hash = ${finalPasswordHash},
        profile_picture = ${finalProfilePicture},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, email, name, role, county, active, profile_picture, created_at, last_login
    `;

    return res.status(200).json({
      success: true,
      user: result[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
