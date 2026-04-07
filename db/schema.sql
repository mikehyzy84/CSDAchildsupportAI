-- =============================================================================
-- CSDAI Database Schema
--
-- Three tables:
--   documents  — one row per ingested policy document (PDF, scraped page, etc.)
--   chunks     — each document is split into searchable text chunks
--   chats      — every user question + AI answer is logged here
--
-- Full-text search uses Postgres tsvector/tsquery. A trigger on `chunks`
-- auto-builds the search_vector column on every insert/update, so you never
-- need to set it manually.
-- =============================================================================

-- uuid-ossp gives us uuid_generate_v4() for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- DOCUMENTS — one row per source document
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,                  -- human-readable document name
    source      TEXT NOT NULL,                  -- origin label, e.g. "California DCSS", "Federal OCSE"
    source_url  TEXT,                           -- original URL the doc was fetched from (nullable)
    section     TEXT,                           -- broad section grouping, e.g. "California State Guidelines"
    status      TEXT DEFAULT 'pending'          -- processing pipeline state
                CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()       -- auto-bumped by trigger below
);

-- Speed up queries that filter by status or source
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_source ON documents(source);

-- -----------------------------------------------------------------------------
-- CHUNKS — searchable text fragments belonging to a document
--
-- Each document is split into overlapping or sequential chunks during
-- ingestion. The search_vector column powers full-text search; it is
-- maintained automatically by the trigger at the bottom of this file.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chunks (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id   UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,  -- parent doc
    content       TEXT NOT NULL,                 -- the actual chunk text
    section_title TEXT,                          -- section heading extracted during ingestion
    chunk_index   INTEGER NOT NULL,              -- ordering: 0, 1, 2, … within the document
    search_vector tsvector,                      -- auto-populated by trigger (do not set manually)
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_chunk_index UNIQUE (document_id, chunk_index)  -- prevent duplicate chunks
);

-- Foreign-key lookups and full-text search index (GIN for tsvector)
CREATE INDEX idx_chunks_document_id ON chunks(document_id);
CREATE INDEX idx_chunks_search_vector ON chunks USING GIN(search_vector);

-- Trigger function: builds a weighted search_vector from section_title (A) and content (B)
-- so that matches in section titles rank higher than body text.
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.section_title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fire the trigger before any insert or content/title update on chunks
CREATE TRIGGER chunks_search_vector_update
    BEFORE INSERT OR UPDATE OF content, section_title
    ON chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- -----------------------------------------------------------------------------
-- CHATS — every user question and AI-generated answer
--
-- Used for analytics (/api/admin), feedback tracking, and audit trail.
-- The citations column stores the array of source references as JSONB.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chats (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  TEXT NOT NULL,                   -- groups messages within one browser session
    user_email  TEXT,                            -- optional; null for anonymous users
    question    TEXT NOT NULL,                   -- the user's original question
    answer      TEXT NOT NULL,                   -- Claude's full response
    citations   JSONB DEFAULT '[]'::jsonb,       -- [{id, title, section, source, url}, …]
    feedback    TEXT                             -- null until rated; then "positive" or "negative"
                CHECK (feedback IS NULL OR feedback IN ('positive', 'negative')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Common query patterns: lookup by session, by user, by date, and JSONB search
CREATE INDEX idx_chats_session_id ON chats(session_id);
CREATE INDEX idx_chats_user_email ON chats(user_email);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX idx_chats_citations ON chats USING GIN(citations);

-- -----------------------------------------------------------------------------
-- HELPER FUNCTION: search_policies
--
-- Convenience wrapper around the full-text search query. Called by some
-- older code paths; the main /api/chat endpoint uses an inline SQL query
-- instead, but this is kept for compatibility.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION search_policies(
    search_query TEXT,
    match_threshold FLOAT DEFAULT 0.1,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    chunk_id       UUID,
    document_id    UUID,
    content        TEXT,
    section_title  TEXT,
    chunk_index    INTEGER,
    document_title TEXT,
    source         TEXT,
    source_url     TEXT,
    rank           FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS chunk_id,
        c.document_id,
        c.content,
        c.section_title,
        c.chunk_index,
        d.title AS document_title,
        d.source,
        d.source_url,
        ts_rank(c.search_vector, websearch_to_tsquery('english', search_query)) AS rank
    FROM chunks c
    JOIN documents d ON c.document_id = d.id
    WHERE c.search_vector @@ websearch_to_tsquery('english', search_query)
        AND d.status = 'completed'
    ORDER BY rank DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- HELPER TRIGGER: auto-update documents.updated_at on any row change
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
