# Database Seeding Guide

This project has two ways to seed the database with policy documents:

## 🤖 Automatic (GitHub Actions)

When you create a Pull Request, GitHub Actions automatically:
1. Creates a preview Neon database branch
2. Installs all dependencies
3. Imports all 6 seed files
4. Comments on the PR with details

**No manual action needed!** Just create a PR and the preview database will be populated.

## 🔧 Manual (Local Development)

For your local or main database:

### Prerequisites
- PostgreSQL client tools installed
  - Mac: `brew install postgresql`
  - Ubuntu: `sudo apt-get install postgresql-client`
  - Windows: Install from [postgresql.org](https://www.postgresql.org/download/)

### Setup

1. Create a `.env` file in the project root:
```bash
DATABASE_URL=your_neon_connection_string_here
```

2. Get your Neon connection string from:
   - Neon Dashboard → Your Project → Connection Details
   - Should look like: `postgresql://user:pass@host.neon.tech/database?sslmode=require`

3. Run the import script:
```bash
npm run import-seeds
```

### What Gets Imported

The script imports all documents from:
- `db/seed-part1.sql` - CSDA Attorney Sourcebook (Part 1)
- `db/seed-part2.sql` - CSDA Attorney Sourcebook (Part 2)
- `db/seed-part3.sql` - CSDA Attorney Sourcebook (Part 3)
- `db/seed-part4.sql` - CSDA Attorney Sourcebook (Part 4)
- `db/seed-sourcebook.sql` - Complete Sourcebook
- `db/seed-new-docs.sql` - Additional Documents

Total: ~900KB of federal and state child support policy documents

### Troubleshooting

**Error: DATABASE_URL not set**
- Make sure `.env` file exists in project root
- Check that `DATABASE_URL=...` is on its own line

**Error: psql command not found**
- Install PostgreSQL client tools (see Prerequisites)

**Error: Failed to import**
- Check database connection string
- Verify database is accessible
- Ensure you have write permissions

### Verification

After import, visit `/documents` page to see all imported documents.

You can also check with:
```bash
curl http://localhost:5173/api/test-docs
```

This will show document counts by source and status.
