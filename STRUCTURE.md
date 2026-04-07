# Project Structure

One-line description of every folder and key file in the repository.

```
├── api/                          Vercel serverless functions (the backend)
│   ├── chat.ts                   POST — Main AI Q&A: search DB → call Claude → return cited answer
│   ├── documents.ts              GET  — List all policy documents from the database
│   ├── feedback.ts               POST — Record thumbs-up/down on a chat response
│   ├── admin.ts                  GET  — Analytics data for the admin dashboard
│   ├── elevenlabs-signed-url.ts  POST — Generate short-lived signed URL for voice chat
│   ├── sync.ts                   GET/POST — Scheduled sync stub (Vercel cron, not yet implemented)
│   ├── scrape-legal-docs.js      POST — Scrape policy HTML from .gov sites into the DB
│   └── admin/
│       └── ingest-missing-docs.js POST — One-shot PDF download + ingestion
│
├── db/                           Database definitions and seed data
│   ├── schema.sql                Full Postgres schema (documents, chunks, chats + triggers)
│   ├── seed-part1.sql … part4.sql  Sourcebook chunks split into loadable parts
│   ├── seed-sourcebook.sql       Original unsplit sourcebook seed
│   └── seed-new-docs.sql         Seed data for sample policy/procedure PDFs
│
├── scripts/                      CLI utilities for PDF ingestion
│   ├── ingest-pdf.js             Ingest a single PDF directly into the database
│   ├── generate-seed-sql.js      Convert a PDF into a SQL seed file
│   ├── process-pdfs.js           Batch-process multiple PDFs → SQL (ES module)
│   ├── process-pdfs.cjs          Same as above but CommonJS
│   ├── split-sql.js              Split a large seed file into 4 parts
│   └── README.md                 Usage docs for the scripts
│
├── src/                          React frontend (Vite + TypeScript + Tailwind)
│   ├── main.tsx                  Entry point — mounts <App /> into the DOM
│   ├── App.tsx                   Root component — React Query, Auth context, router
│   ├── index.css                 Global CSS + Tailwind directives
│   ├── vite-env.d.ts             Vite TypeScript shims
│   │
│   ├── types/
│   │   └── index.ts              Shared TypeScript interfaces (Policy, User, Message, etc.)
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx        Role-based auth context (mock users for now)
│   │
│   ├── data/
│   │   └── mockData.ts           Sample policies, users, counties for local dev
│   │
│   ├── hooks/
│   │   └── useAnnotations.ts     In-memory annotation CRUD hook
│   │
│   ├── utils/
│   │   ├── citationGenerator.ts  APA/MLA/Chicago citation formatter
│   │   └── countyReportGenerator.ts  Builds county-specific policy reports
│   │
│   ├── styles/
│   │   └── california-theme.css  CSS variables and theme classes
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.tsx        Page shell (sidebar + footer + <Outlet />)
│   │   │   ├── Sidebar.tsx       Left nav with links and chat history
│   │   │   └── Footer.tsx        CSDA branding and quick links
│   │   ├── Auth/
│   │   │   └── RoleSelector.tsx  Role-picker modal shown on first load
│   │   ├── Admin/
│   │   │   ├── Dashboard.tsx     Tabbed admin container (Analytics, Users, Docs)
│   │   │   ├── Analytics.tsx     Live KPIs from /api/admin
│   │   │   ├── UserManagement.tsx  Mock user CRUD
│   │   │   └── DocumentManager.tsx  Document upload + annotation approval
│   │   └── Annotations/
│   │       ├── AnnotationForm.tsx  Create-annotation form
│   │       └── AnnotationsList.tsx  List annotations with status badges
│   │
│   └── pages/
│       ├── VoiceChat.tsx         Home page — voice + text AI chat (ElevenLabs)
│       ├── Documents.tsx         Browseable document library (from /api/documents)
│       ├── PolicyDetail.tsx      Single-policy view with citations + annotations
│       ├── Admin.tsx             Admin gate → Dashboard
│       ├── Reports.tsx           Report builder (select policies + county)
│       └── ReportPreview.tsx     Preview and download generated reports
│
├── public/                       Static assets (logos, images)
├── .bolt/                        Bolt.new project config
├── .env.example                  All required environment variables with descriptions
├── .gitignore                    Git ignore rules
├── deploy-netlify.cjs            Manual Netlify deploy script
├── index.html                    Vite HTML entry point
├── package.json                  Dependencies and npm scripts
├── vercel.json                   Vercel routing rules and cron schedule
├── vite.config.ts                Vite build configuration
├── tailwind.config.js            Tailwind CSS configuration
├── postcss.config.js             PostCSS plugins
├── tsconfig.json                 TypeScript base config
├── tsconfig.app.json             TypeScript config for the app
├── tsconfig.node.json            TypeScript config for Node scripts
└── eslint.config.js              ESLint configuration
```
