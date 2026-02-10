import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

// Helper function to verify admin access
async function verifyAdminAccess(req: VercelRequest): Promise<{ authorized: boolean; userId?: string; userRole?: string }> {
  const cookieToken = req.cookies?.auth_token;
  const headerToken = req.headers.authorization?.replace('Bearer ', '');
  const token = cookieToken || headerToken;

  if (!token) {
    return { authorized: false };
  }

  const sessionResult = await sql`
    SELECT s.user_id, u.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ${token}
    AND s.expires_at > CURRENT_TIMESTAMP
    LIMIT 1
  `;

  if (sessionResult.rows.length === 0) {
    return { authorized: false };
  }

  const session = sessionResult.rows[0];

  // Only Admin and Manager can manage users
  if (session.role !== 'Admin' && session.role !== 'Manager') {
    return { authorized: false };
  }

  return { authorized: true, userId: session.user_id, userRole: session.role };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Verify admin access for all operations
    const authCheck = await verifyAdminAccess(req);
    if (!authCheck.authorized) {
      return res.status(403).json({ error: 'Unauthorized - Admin or Manager access required' });
    }

    // GET - List all users
    if (req.method === 'GET') {
      const usersResult = await sql`
        SELECT id, email, name, role, county, active, created_at, last_login
        FROM users
        ORDER BY created_at DESC
      `;

      return res.status(200).json({
        success: true,
        users: usersResult.rows
      });
    }

    // POST - Create new user
    if (req.method === 'POST') {
      const { email, password, name, role, county } = req.body;

      // Validate required fields
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Email, password, name, and role are required' });
      }

      // Validate role
      const validRoles = ['Worker', 'Supervisor', 'Manager', 'Admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Only Admin can create Admin users
      if (role === 'Admin' && authCheck.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Only Admin users can create other Admin users' });
      }

      // Check if email already exists
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
      `;

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await sql`
        INSERT INTO users (email, password_hash, name, role, county, active)
        VALUES (
          ${email.toLowerCase()},
          ${passwordHash},
          ${name},
          ${role},
          ${county || null},
          true
        )
        RETURNING id, email, name, role, county, active, created_at
      `;

      return res.status(201).json({
        success: true,
        user: newUser.rows[0]
      });
    }

    // PUT - Update user
    if (req.method === 'PUT') {
      const { id, email, name, role, county, active, password } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Check if user exists
      const existingUser = await sql`
        SELECT id, role FROM users WHERE id = ${id} LIMIT 1
      `;

      if (existingUser.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Only Admin can modify Admin users or change role to Admin
      if ((existingUser.rows[0].role === 'Admin' || role === 'Admin') && authCheck.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Only Admin users can modify Admin accounts' });
      }

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (email !== undefined) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email.toLowerCase());
      }
      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (role !== undefined) {
        const validRoles = ['Worker', 'Supervisor', 'Manager', 'Admin'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
        updates.push(`role = $${paramIndex++}`);
        values.push(role);
      }
      if (county !== undefined) {
        updates.push(`county = $${paramIndex++}`);
        values.push(county || null);
      }
      if (active !== undefined) {
        updates.push(`active = $${paramIndex++}`);
        values.push(active);
      }
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updates.push(`password_hash = $${paramIndex++}`);
        values.push(passwordHash);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(id);
      const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, email, name, role, county, active, created_at, last_login
      `;

      const updatedUser = await sql.query(query, values);

      return res.status(200).json({
        success: true,
        user: updatedUser.rows[0]
      });
    }

    // DELETE - Delete user
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Check if user exists
      const existingUser = await sql`
        SELECT id, role FROM users WHERE id = ${id} LIMIT 1
      `;

      if (existingUser.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Only Admin can delete Admin users
      if (existingUser.rows[0].role === 'Admin' && authCheck.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Only Admin users can delete Admin accounts' });
      }

      // Prevent deleting self
      if (existingUser.rows[0].id === authCheck.userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      // Delete user (sessions will be cascade deleted)
      await sql`
        DELETE FROM users WHERE id = ${id}
      `;

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('User management error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
