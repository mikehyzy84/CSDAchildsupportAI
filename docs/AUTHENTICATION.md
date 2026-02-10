# Authentication System Documentation

## Overview

ChildSupportIQ now has a complete authentication system with user management, role-based access control, and secure session handling.

## Features

- ✅ Secure login with email and password
- ✅ Password hashing with bcrypt
- ✅ Session management with httpOnly cookies
- ✅ Protected routes requiring authentication
- ✅ Role-based authorization (Worker, Supervisor, Manager, Admin)
- ✅ User management (add, edit, delete users)
- ✅ User profiles with name, email, role, and county

## Setup Instructions

### 1. Run Database Migration

Run the SQL migration to create the users and sessions tables:

```bash
psql $DATABASE_URL -f db/create-users-table.sql
```

This will create:
- `users` table with email, password_hash, name, role, county, active, timestamps
- `sessions` table for session management
- Default admin user (see login credentials below)

### 2. Install Dependencies

Dependencies are already installed (bcryptjs) but if needed:

```bash
npm install
```

### 3. Start the Application

```bash
npm run dev
```

## Default Login Credentials

A default admin account is created during migration:

- **Email:** admin@childsupportiq.com
- **Password:** admin123

⚠️ **Important:** Change this password after first login!

## User Roles

The system supports four roles with different permissions:

1. **Worker** - Basic access to search, documents, and reports
2. **Supervisor** - Same as Worker (can be extended with additional permissions)
3. **Manager** - Worker access + user management + admin panel access
4. **Admin** - Full access including managing other admin users

## User Management

### Accessing User Management

1. Login as Admin or Manager
2. Navigate to Admin panel
3. The user management interface allows you to:
   - View all users
   - Add new users
   - Edit user details (name, email, role, county, active status)
   - Delete users
   - Reset passwords

### Adding New Users

**Via API:**

```bash
POST /api/auth/users
Content-Type: application/json
Cookie: auth_token=<your-session-token>

{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "John Doe",
  "role": "Worker",
  "county": "Los Angeles"
}
```

**Via Admin Panel:**
- Navigate to /admin
- Click "Add User" button
- Fill in user details
- Submit form

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { success: true, user: User, token: string }
```

#### Logout
```
POST /api/auth/logout
Cookie: auth_token
Response: { success: true }
```

#### Get Current User
```
GET /api/auth/me
Cookie: auth_token
Response: { success: true, user: User }
```

### User Management (Admin/Manager Only)

#### List Users
```
GET /api/auth/users
Cookie: auth_token
Response: { success: true, users: User[] }
```

#### Create User
```
POST /api/auth/users
Cookie: auth_token
Body: { email, password, name, role, county }
Response: { success: true, user: User }
```

#### Update User
```
PUT /api/auth/users
Cookie: auth_token
Body: { id, email?, name?, role?, county?, active?, password? }
Response: { success: true, user: User }
```

#### Delete User
```
DELETE /api/auth/users?id=<user-id>
Cookie: auth_token
Response: { success: true }
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 10 rounds
- Plain text passwords are never stored
- Password hashes are never returned in API responses

### Session Security
- Sessions stored in database with expiration
- Session tokens are 32-byte random hex strings
- Tokens stored as httpOnly, Secure, SameSite=Strict cookies
- Sessions expire after 7 days of inactivity
- Invalid/expired sessions automatically redirect to login

### Authorization
- All protected routes require valid session
- Admin routes require Admin or Manager role
- Users cannot delete their own account
- Only Admin can create/modify/delete other Admin users

## Protected Routes

All routes except `/login` require authentication:

- `/` - Home (all authenticated users)
- `/chat` - Chat interface (all authenticated users)
- `/documents` - Document library (all authenticated users)
- `/reports` - Reports (all authenticated users)
- `/admin` - **Admin only** (requires Admin or Manager role)

## Frontend Components

### Login Page
`src/pages/Login.tsx` - Full-page login with ChildSupportIQ branding

### Protected Route
`src/components/Auth/ProtectedRoute.tsx` - Wrapper component for protected routes
- Shows loading spinner while checking auth
- Redirects to login if not authenticated
- Shows access denied if insufficient permissions

### Auth Context
`src/contexts/AuthContext.tsx` - Global authentication state
- `user` - Current user or null
- `login(email, password)` - Login function
- `logout()` - Logout function
- `hasRole(roles)` - Check if user has specific role(s)
- `isLoading` - Loading state during auth check

## Usage Examples

### Check if User is Logged In
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Check User Role
```tsx
import { useAuth } from '../contexts/AuthContext';

function AdminButton() {
  const { hasRole } = useAuth();

  if (!hasRole(['Admin', 'Manager'])) {
    return null;
  }

  return <button>Admin Action</button>;
}
```

### Logout
```tsx
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Sign Out
    </button>
  );
}
```

## Database Schema

### users Table
```sql
- id: UUID (primary key)
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: TEXT NOT NULL
- name: VARCHAR(255) NOT NULL
- role: VARCHAR(50) NOT NULL (Worker|Supervisor|Manager|Admin)
- county: VARCHAR(100) NULL
- active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP DEFAULT now()
- updated_at: TIMESTAMP DEFAULT now()
- last_login: TIMESTAMP NULL
```

### sessions Table
```sql
- id: UUID (primary key)
- user_id: UUID FOREIGN KEY -> users(id)
- token: TEXT UNIQUE NOT NULL
- expires_at: TIMESTAMP NOT NULL
- created_at: TIMESTAMP DEFAULT now()
- last_accessed: TIMESTAMP DEFAULT now()
```

## Troubleshooting

### "Not authenticated" errors
- Check that session token cookie is being sent
- Verify session hasn't expired (7 day limit)
- Clear cookies and login again

### "Access Denied" errors
- Verify user has required role for the route
- Check that user account is active

### Database connection errors
- Ensure DATABASE_URL environment variable is set
- Verify database tables exist (run migration)
- Check database connection permissions

### Password reset
Admins can reset passwords via API:
```bash
PUT /api/auth/users
Body: { id: "user-id", password: "new-password" }
```

## Next Steps

Consider adding:
- Password reset via email
- Two-factor authentication
- Password complexity requirements
- Account lockout after failed attempts
- Audit logging for user actions
- Email verification for new accounts

---

**Built by AI Product Studio**
CGI's Innovation Lab
© 2026 CGI, Inc.
