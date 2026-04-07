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

See [STRUCTURE.md](STRUCTURE.md) for a full annotated tree of every folder and file.

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

## API Endpoints

All endpoints are Vercel serverless functions in the `/api` directory.

### `POST /api/chat`

Main AI Q&A endpoint. Searches the database for relevant policy chunks, sends them to Claude, and returns a cited answer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | Yes | The user's question in plain language |
| `sessionId` | string | Yes | Browser session identifier |
| `userEmail` | string | No | User's email for logging |
| `responseType` | `"summary"` \| `"detailed"` | No | Controls answer length (default: `"summary"`) |

**Returns:** `{ answer, citations: [{id, title, section, source, url}], sessionId }`

**Notes:** Blocks questions containing SSNs or case numbers. Always returns an answer, even with zero search results.

---

### `GET /api/documents`

Lists all policy documents.

**Returns:** `{ documents: [{id, title, category, source, url}], count }`

---

### `POST /api/feedback`

Records thumbs-up/down on a chat response.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chatId` | string | Yes | The chat record UUID |
| `feedback` | `"good"` \| `"bad"` | Yes | User's rating |

**Returns:** `{ success: true }` or `404` if chat not found.

---

### `GET /api/admin`

Returns analytics data for the admin dashboard. **No auth** — protect before public deployment.

**Returns:** `{ total_chats_today, total_chats_week, total_chats_month, count_good_feedback, count_bad_feedback, top_questions, user_activity, last_sync_timestamp }`

---

### `POST /api/elevenlabs-signed-url`

Generates a short-lived signed URL for ElevenLabs voice chat. The frontend calls this before opening a WebSocket connection.

**Returns:** `{ signedUrl }` — pass this to `conversation.startSession({ signedUrl })`.

---

### `POST /api/scrape-legal-docs`

Scrapes policy content from .gov websites and inserts into the database. Requires `Authorization: Bearer <SCRAPER_API_KEY>` header.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sources` | array | No | Custom URLs to scrape (defaults to CA + federal sites) |

**Returns:** `{ message, results: { success, failed, totalDocuments, totalChunks } }`

---

### `GET /api/sync` | `POST /api/sync`

Scheduled sync endpoint (stub). Called daily by Vercel cron. Currently returns a placeholder.

---

### `POST /api/admin/ingest-missing-docs`

One-shot PDF ingestion. Downloads a hardcoded federal PDF, extracts text, and inserts into the database. **No auth** — designed to be called once then removed.

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
