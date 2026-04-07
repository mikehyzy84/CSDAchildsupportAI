# CSDAI — Child Support Directors Association Intelligence

AI-powered policy reference system for California child support professionals. Caseworkers ask questions in plain language and get cited answers drawn from California Family Code, federal Title IV-D regulations, and DCSS policies.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript, Tailwind CSS, Vite |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Database | Neon Postgres (full-text search via `tsvector`) |
| Voice | ElevenLabs Conversational AI |
| Hosting | Vercel (serverless functions in `/api`) |

## Project Structure

```
├── api/                  # Vercel serverless functions
│   ├── chat.ts           # Main AI chat endpoint (Anthropic + Neon)
│   ├── documents.ts      # Document listing endpoint
│   ├── feedback.ts       # Thumbs-up/down feedback
│   ├── admin.ts          # Analytics dashboard data
│   ├── sync.ts           # Scheduled sync stub (Vercel cron)
│   ├── elevenlabs-signed-url.ts  # Voice chat signed URL
│   ├── scrape-legal-docs.js      # Legal document scraper
│   └── admin/
│       └── ingest-missing-docs.js
├── db/
│   ├── schema.sql        # Full database schema
│   └── seed-*.sql        # Seed data files
├── scripts/              # PDF ingestion & SQL generation utilities
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── contexts/         # Auth context
│   ├── hooks/            # Custom hooks (search, annotations)
│   ├── pages/            # Route pages
│   ├── styles/           # California theme CSS
│   ├── types/            # TypeScript types
│   └── utils/            # Citation generator, search engine, reports
├── server.js             # Legacy local Express dev server (not used in production)
├── vercel.json           # Vercel routing & cron config
└── .env.example          # All required environment variables
```

## Prerequisites

- **Node.js** >= 18
- **npm** (ships with Node)
- A **Neon** (or any Postgres) database
- An **Anthropic** API key

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/mikehyzy84/csdachildsupportai.git
cd csdachildsupportai
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values. At minimum you need:

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude chat |
| `DATABASE_URL` | Yes | Neon/Postgres connection string |
| `ELEVENLABS_API_KEY` | No | ElevenLabs API key (voice chat) |
| `ELEVENLABS_AGENT_ID` | No | ElevenLabs agent ID (voice chat) |
| `SCRAPER_API_KEY` | No | Bearer token for `/api/scrape-legal-docs` |
| `NODE_ENV` | No | Set to `production` in deployed environments |

### 3. Set up the database

Run the schema against your Neon database:

```bash
psql $DATABASE_URL < db/schema.sql
```

Then seed it with policy documents:

```bash
psql $DATABASE_URL < db/seed-part1.sql
psql $DATABASE_URL < db/seed-part2.sql
psql $DATABASE_URL < db/seed-part3.sql
psql $DATABASE_URL < db/seed-part4.sql
psql $DATABASE_URL < db/seed-sourcebook.sql
```

### 4. Run locally

```bash
npm run dev
```

The Vite dev server starts at `http://localhost:5173`. API functions in `/api` are served by Vercel when deployed, but locally you can test them via `vercel dev` (requires the [Vercel CLI](https://vercel.com/docs/cli)).

```bash
npx vercel dev
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**.
4. Vercel automatically detects the Vite config and deploys the frontend + `/api` serverless functions.
5. The daily sync cron is configured in `vercel.json`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `node scripts/ingest-pdf.js <file>` | Ingest a PDF into the database |
| `node scripts/process-pdfs.cjs` | Batch-process PDFs |

## License

Private — CSDA internal use.
