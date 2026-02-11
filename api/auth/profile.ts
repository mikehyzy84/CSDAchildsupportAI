import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase limit for profile pictures
    },
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow PUT for profile updates
  if (req.method !== 'PUT') {
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

    const session = sessionResult[0];
    const userId = session.user_id;

    // Get update data
    const { name, email, county, currentPassword, password, profile_picture } = req.body;

    // Validate if changing password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }

      // Verify current password
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

    // Build update query parts
    const updates: string[] = [];

    if (name !== undefined) {
      updates.push(`name = '${name.replace(/'/g, "''")}'`);
    }

    if (email !== undefined) {
      // Check if email is already taken by another user
      const emailCheck = await sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase()} AND id != ${userId} LIMIT 1
      `;

      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'Email is already in use' });
      }

      updates.push(`email = '${email.toLowerCase().replace(/'/g, "''")}'`);
    }

    if (county !== undefined) {
      updates.push(`county = ${county ? `'${county.replace(/'/g, "''")}'` : 'NULL'}`);
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = '${passwordHash.replace(/'/g, "''")}'`);
    }

    if (profile_picture !== undefined) {
      updates.push(`profile_picture = ${profile_picture ? `'${profile_picture.replace(/'/g, "''")}'` : 'NULL'}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Perform update using string interpolation
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = '${userId}'
      RETURNING id, email, name, role, county, active, profile_picture, created_at, last_login
    `;

    const result = await sql(query);

    return res.status(200).json({
      success: true,
      user: result[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
