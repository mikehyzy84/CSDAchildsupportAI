import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface DocumentChunk {
  content: string;
  section_title: string;
  chunk_index: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Document ID is required' });
  }

  try {
    // Fetch document metadata
    const documentResult = await sql`
      SELECT
        id,
        title,
        source,
        source_url,
        section,
        status,
        created_at
      FROM documents
      WHERE id = ${id}
      LIMIT 1
    `;

    if (documentResult.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = documentResult[0];

    // Fetch all chunks for this document, ordered by chunk_index
    const chunksResult = await sql<DocumentChunk[]>`
      SELECT
        content,
        section_title,
        chunk_index
      FROM chunks
      WHERE document_id = ${id}
      ORDER BY chunk_index ASC
    `;

    // Reconstruct full content from chunks
    const fullContent = chunksResult.map(chunk => chunk.content).join('\n\n');

    return res.status(200).json({
      document: {
        ...document,
        content: fullContent,
        chunks: chunksResult,
      },
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({
      error: 'Failed to fetch document',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
