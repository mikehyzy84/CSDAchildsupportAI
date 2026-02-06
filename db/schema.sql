-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT,
    section TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_source ON documents(source);

-- Chunks table with full-text search
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    section_title TEXT,
    chunk_index INTEGER NOT NULL,
    search_vector tsvector,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_chunk_index UNIQUE (document_id, chunk_index)
);

CREATE INDEX idx_chunks_document_id ON chunks(document_id);
CREATE INDEX idx_chunks_search_vector ON chunks USING GIN(search_vector);

-- Trigger function to auto-update search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.section_title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate search_vector on insert/update
CREATE TRIGGER chunks_search_vector_update
    BEFORE INSERT OR UPDATE OF content, section_title
    ON chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_email TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    feedback TEXT CHECK (feedback IS NULL OR feedback IN ('positive', 'negative')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chats_session_id ON chats(session_id);
CREATE INDEX idx_chats_user_email ON chats(user_email);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX idx_chats_citations ON chats USING GIN(citations);

-- Function to search policies using websearch_to_tsquery
CREATE OR REPLACE FUNCTION search_policies(
    search_query TEXT,
    match_threshold FLOAT DEFAULT 0.1,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    content TEXT,
    section_title TEXT,
    chunk_index INTEGER,
    document_title TEXT,
    source TEXT,
    source_url TEXT,
    rank FLOAT
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on documents
CREATE TRIGGER documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
