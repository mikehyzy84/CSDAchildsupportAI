import { Client } from 'pg';
import cheerio from 'cheerio';

/**
 * Automated Legal Document Scraper
 * Scrapes child support policy documents from official sources and stores them in the database
 */

// List of sources to scrape
const SOURCES = [
  {
    url: 'https://www.childsup.ca.gov/resources/',
    type: 'ca_state_policy',
    section: 'California State Guidelines'
  },
  {
    url: 'https://www.acf.hhs.gov/css/laws-and-policy',
    type: 'federal_policy',
    section: 'Federal Guidelines'
  }
];

/**
 * Chunk text into approximately equal sized pieces
 */
function chunkText(text, maxChunkSize = 2000) {
  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split(/\n\n+/);

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    if (currentChunk.length + trimmedParagraph.length + 2 > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      if (trimmedParagraph.length > maxChunkSize) {
        const sentences = trimmedParagraph.split(/\.\s+/);
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 2 > maxChunkSize) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = '';
            }
            if (sentence.length > maxChunkSize) {
              for (let i = 0; i < sentence.length; i += maxChunkSize) {
                chunks.push(sentence.substring(i, i + maxChunkSize).trim());
              }
            } else {
              currentChunk = sentence + '.';
            }
          } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence + '.';
          }
        }
      } else {
        currentChunk = trimmedParagraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Scrape a single URL and extract policy content
 */
async function scrapeUrl(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CSDAI-Bot/1.0 (Child Support Policy Indexer)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, and navigation elements
    $('script, style, nav, header, footer').remove();

    // Extract main content (adjust selectors based on target sites)
    const mainContent = $('main, article, .content, #content').first();
    const text = mainContent.length > 0
      ? mainContent.text()
      : $('body').text();

    // Clean up whitespace
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    return cleanText;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

/**
 * Store document and chunks in database
 */
async function storeDocument(client, title, source, sourceUrl, section, content) {
  try {
    // Insert document
    const docResult = await client.query(
      `INSERT INTO documents (title, source, source_url, section, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'completed', NOW(), NOW())
       RETURNING id`,
      [title, source, sourceUrl, section]
    );

    const documentId = docResult.rows[0].id;

    // Chunk the content
    const chunks = chunkText(content);

    // Insert chunks
    for (let i = 0; i < chunks.length; i++) {
      await client.query(
        `INSERT INTO chunks (document_id, content, section_title, chunk_index, search_vector, created_at)
         VALUES ($1, $2, $3, $4, to_tsvector('english', $2), NOW())`,
        [documentId, chunks[i], title, i]
      );
    }

    return { documentId, chunkCount: chunks.length };
  } catch (error) {
    console.error('Error storing document:', error.message);
    throw error;
  }
}

/**
 * Main scraper function
 */
export default async function handler(req, res) {
  // Only allow POST requests (for security)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authorization (add your own auth logic)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SCRAPER_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const results = {
    success: [],
    failed: [],
    totalDocuments: 0,
    totalChunks: 0
  };

  try {
    await client.connect();

    // Process custom URLs from request body if provided
    const customSources = req.body?.sources || SOURCES;

    for (const source of customSources) {
      console.log(`Scraping ${source.url}...`);

      const content = await scrapeUrl(source.url);

      if (!content) {
        results.failed.push({
          url: source.url,
          error: 'Failed to extract content'
        });
        continue;
      }

      try {
        // Generate title from URL
        const title = source.title || new URL(source.url).pathname.split('/').filter(Boolean).pop() || 'Untitled Document';

        const result = await storeDocument(
          client,
          title,
          source.type,
          source.url,
          source.section,
          content
        );

        results.success.push({
          url: source.url,
          documentId: result.documentId,
          chunkCount: result.chunkCount
        });

        results.totalDocuments++;
        results.totalChunks += result.chunkCount;
      } catch (error) {
        results.failed.push({
          url: source.url,
          error: error.message
        });
      }
    }

    return res.status(200).json({
      message: 'Scraping completed',
      results
    });

  } catch (error) {
    console.error('Scraper error:', error);
    return res.status(500).json({
      error: 'Scraping failed',
      message: error.message,
      results
    });
  } finally {
    await client.end();
  }
}
