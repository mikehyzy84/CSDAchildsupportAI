import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!);

// SSN and case number detection patterns
const SENSITIVE_PATTERNS = [
  /\d{3}-\d{2}-\d{4}/g, // SSN format: 123-45-6789
  /\bcase\s*#?\s*\d{6,}/gi, // Case numbers with 6+ digits
];

function containsSensitiveInfo(text: string): boolean {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(text));
}

interface ChatRequest {
  question: string;
  userEmail?: string;
  sessionId: string;
  responseType?: 'summary' | 'detailed';
}

interface SearchResult {
  chunk_id: string;
  document_id: string;
  content: string;
  section_title: string;
  chunk_index: number;
  document_title: string;
  source: string;
  source_url: string;
  rank: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, userEmail, sessionId, responseType = 'summary' } = req.body as ChatRequest;

    // Validate required fields
    if (!question || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields: question, sessionId' });
    }

    // Check for sensitive information
    if (containsSensitiveInfo(question)) {
      return res.status(400).json({
        error: "I noticed your question may contain personal information like Social Security Numbers or case numbers. For your privacy and security, please rephrase your question without including any personal identifiers. I'm here to help with general policy guidance!"
      });
    }

    // Search for relevant policy chunks
    const searchResults = await sql<SearchResult[]>`
      SELECT * FROM search_policies(${question}, 0.1, 10)
    `;

    // Handle no results case
    if (!searchResults || searchResults.length === 0) {
      const noResultsAnswer = "I couldn't find relevant policy guidance for your question. Please try rephrasing your question or contact your local child support office for specific guidance.\n\nThis is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.";

      // Log the interaction
      await sql`
        INSERT INTO chats (session_id, user_email, question, answer, citations)
        VALUES (${sessionId}, ${userEmail || null}, ${question}, ${noResultsAnswer}, ${JSON.stringify([])})
      `;

      return res.status(200).json({
        answer: noResultsAnswer,
        citations: [],
        sessionId
      });
    }

    // Build context from search results
    const context = searchResults
      .map((result, idx) => {
        return `[Source ${idx + 1}] ${result.document_title} - ${result.section_title || 'General'}
Source: ${result.source}
Content: ${result.content}
---`;
      })
      .join('\n\n');

    // Prepare citations for response
    const citations = searchResults.map((result, idx) => ({
      id: idx + 1,
      title: result.document_title,
      section: result.section_title || 'General',
      source: result.source,
      url: result.source_url || null,
    }));

    // System prompt for CSDAI
    const systemPrompt = `You are CSDAI — Child Support Directors Association Intelligence. ONLY answer from provided sources. Cite every claim as "According to [Source, Section]". Never give legal advice. Never accept personal case details. End answers with: "This is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team."`;

    // Build user message based on response type
    const responseInstruction = responseType === 'detailed'
      ? 'Provide detailed step-by-step guidance.'
      : 'Provide a brief summary.';

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Based on the following policy documents, answer this question: "${question}"

${responseInstruction}

Policy Context:
${context}

Remember to cite sources and end with the required disclaimer.`
        }
      ]
    });

    // Extract answer from Anthropic response
    const answer = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Unable to generate response';

    // Log the interaction to database
    await sql`
      INSERT INTO chats (session_id, user_email, question, answer, citations)
      VALUES (
        ${sessionId},
        ${userEmail || null},
        ${question},
        ${answer},
        ${JSON.stringify(citations)}
      )
    `;

    // Return response
    return res.status(200).json({
      answer,
      citations,
      sessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
