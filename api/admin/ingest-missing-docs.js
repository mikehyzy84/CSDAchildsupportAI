const { neon } = require('@neondatabase/serverless');
const pdf = require('pdf-parse');

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// Hardcoded URLs for missing documents
const MISSING_DOCS = [
  {
    url: 'https://www.acf.hhs.gov/sites/default/files/documents/ocse/essentials_for_attorneys_3rd_ch14.pdf',
    title: 'Essentials for Attorneys - Chapter 14: Military Parents',
    source: 'Federal OCSE',
    category: 'Federal',
  }
];

// Chunk text into ~1000 character pieces
function chunkText(text, chunkSize = 1000) {
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Main handler
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    console.log('=== STARTING PDF INGESTION ===');
    console.log(`Processing ${MISSING_DOCS.length} documents...`);

    const results = [];

    for (const doc of MISSING_DOCS) {
      console.log(`\nFetching: ${doc.url}`);

      // Fetch PDF
      const pdfResponse = await fetch(doc.url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
      }

      const arrayBuffer = await pdfResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`PDF downloaded, size: ${buffer.length} bytes`);

      // Extract text from PDF
      console.log('Extracting text...');
      const pdfData = await pdf(buffer);
      const fullText = pdfData.text;

      console.log(`Extracted ${fullText.length} characters from ${pdfData.numpages} pages`);

      // Clean up text
      const cleanedText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

      // Chunk the text
      const chunks = chunkText(cleanedText);
      console.log(`Created ${chunks.length} chunks`);

      // Insert document into database
      console.log('Inserting document...');
      const documentResult = await sql`
        INSERT INTO documents (title, source, source_url, content, status)
        VALUES (
          ${doc.title},
          ${doc.source},
          ${doc.url},
          ${cleanedText},
          'completed'
        )
        RETURNING id
      `;

      const documentId = documentResult[0].id;
      console.log(`Document inserted with ID: ${documentId}`);

      // Insert chunks
      console.log('Inserting chunks...');
      let chunkCount = 0;

      for (let i = 0; i < chunks.length; i++) {
        await sql`
          INSERT INTO chunks (document_id, content, chunk_index, section_title)
          VALUES (
            ${documentId},
            ${chunks[i]},
            ${i},
            ${`Chapter 14 - Part ${i + 1}`}
          )
        `;
        chunkCount++;

        if ((i + 1) % 10 === 0) {
          console.log(`  Inserted ${i + 1}/${chunks.length} chunks...`);
        }
      }

      console.log(`✓ Successfully inserted ${chunkCount} chunks`);

      results.push({
        title: doc.title,
        url: doc.url,
        documentId,
        chunks: chunkCount,
        pages: pdfData.numpages,
        characters: cleanedText.length
      });
    }

    console.log('\n=== INGESTION COMPLETE ===');
    console.log(`Total documents processed: ${results.length}`);
    console.log(`Total chunks created: ${results.reduce((sum, r) => sum + r.chunks, 0)}`);

    return res.status(200).json({
      success: true,
      processed: results.length,
      results,
      message: 'Documents ingested successfully. You can now delete this endpoint.'
    });

  } catch (error) {
    console.error('=== INGESTION ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
};
