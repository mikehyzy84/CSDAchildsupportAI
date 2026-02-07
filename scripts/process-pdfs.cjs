const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// PDF configurations
const pdfConfigs = [
  {
    file: 'Policy_Sample.pdf',
    title: 'Case Conflict of Interest Reporting Policy',
    source: 'county_policy',
    section: 'Fresno County',
    status: 'completed',
    sourceUrl: null
  },
  {
    file: 'Procedure_Sample1.pdf',
    title: 'Initial Pleading Practices',
    source: 'county_procedure',
    section: 'Fresno County',
    status: 'completed',
    sourceUrl: null
  },
  {
    file: 'Procedure_Sample2.pdf',
    title: 'Calculating Guideline Child Support',
    source: 'county_procedure',
    section: 'Fresno County',
    status: 'completed',
    sourceUrl: null
  }
];

// Function to chunk text into ~2000 character pieces
function chunkText(text, maxChunkSize = 2000) {
  const chunks = [];
  let currentChunk = '';

  // Split by paragraphs (double newlines) or sentences
  const paragraphs = text.split(/\n\n+/);

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // If adding this paragraph exceeds the chunk size
    if (currentChunk.length + trimmedParagraph.length + 2 > maxChunkSize) {
      // If current chunk is not empty, save it
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // If the paragraph itself is larger than maxChunkSize, split it further
      if (trimmedParagraph.length > maxChunkSize) {
        const sentences = trimmedParagraph.split(/\.\s+/);
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 2 > maxChunkSize) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = '';
            }

            // If single sentence is too long, force split it
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

  // Add the last chunk if it exists
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Function to escape SQL strings
function escapeSqlString(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

// Main processing function
async function processPdfs() {
  const sqlStatements = [];

  sqlStatements.push('-- Generated SQL INSERT statements for new documents and chunks');
  sqlStatements.push('-- Generated on: ' + new Date().toISOString());
  sqlStatements.push('-- Note: Document IDs are auto-generated UUIDs by the database');
  sqlStatements.push('');

  for (const config of pdfConfigs) {
    const pdfPath = path.join(__dirname, '..', config.file);

    console.log(`Processing ${config.file}...`);

    try {
      // Read and parse PDF
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      const text = data.text;

      console.log(`  Extracted ${text.length} characters`);

      // Chunk the text
      const chunks = chunkText(text);
      console.log(`  Created ${chunks.length} chunks`);

      // Generate INSERT statement for document (UUID will be auto-generated)
      sqlStatements.push('-- Document: ' + config.title);
      sqlStatements.push('INSERT INTO documents (title, source, source_url, section, status, created_at, updated_at)');
      sqlStatements.push('VALUES (');
      sqlStatements.push(`  ${escapeSqlString(config.title)},`);
      sqlStatements.push(`  ${escapeSqlString(config.source)},`);
      sqlStatements.push(`  ${config.sourceUrl ? escapeSqlString(config.sourceUrl) : 'NULL'},`);
      sqlStatements.push(`  ${escapeSqlString(config.section)},`);
      sqlStatements.push(`  ${escapeSqlString(config.status)},`);
      sqlStatements.push(`  NOW(),`);
      sqlStatements.push(`  NOW()`);
      sqlStatements.push(');');
      sqlStatements.push('');

      // Generate INSERT statements for chunks (using subquery for document_id)
      chunks.forEach((chunk, index) => {
        sqlStatements.push(`-- Chunk ${index + 1} of ${chunks.length} for document: ${config.title}`);
        sqlStatements.push('INSERT INTO chunks (document_id, content, section_title, chunk_index, search_vector, created_at)');
        sqlStatements.push('VALUES (');
        sqlStatements.push(`  (SELECT id FROM documents WHERE title = ${escapeSqlString(config.title)}),`);
        sqlStatements.push(`  ${escapeSqlString(chunk)},`);
        sqlStatements.push(`  ${escapeSqlString(config.title)},`);
        sqlStatements.push(`  ${index},`);
        sqlStatements.push(`  to_tsvector('english', ${escapeSqlString(chunk)}),`);
        sqlStatements.push(`  NOW()`);
        sqlStatements.push(');');
        sqlStatements.push('');
      });

    } catch (error) {
      console.error(`Error processing ${config.file}:`, error.message);
    }
  }

  // Write to file
  const outputPath = path.join(__dirname, '..', 'db', 'seed-new-docs.sql');
  fs.writeFileSync(outputPath, sqlStatements.join('\n'));

  console.log(`\nSQL file generated: ${outputPath}`);
}

// Run the script
processPdfs().catch(console.error);
