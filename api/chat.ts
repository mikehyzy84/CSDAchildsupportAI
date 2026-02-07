import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Log API key status (first 10 chars only for security)
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('Anthropic API Key check:', apiKey ? `${apiKey.substring(0, 10)}... (${apiKey.length} chars)` : 'NOT FOUND');
console.log('Model to be used: claude-sonnet-4-20250514');

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
  id: string;
  document_id: string;
  content: string;
  section_title: string;
  chunk_index: number;
  title: string;
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

    // DEBUG: Log incoming request
    console.log('=== CHAT API REQUEST ===');
    console.log('Question received:', question);
    console.log('Session ID:', sessionId);
    console.log('User email:', userEmail);
    console.log('Response type:', responseType);
    console.log('Request body:', JSON.stringify(req.body));
    console.log('========================');

    // Validate required fields
    if (!question || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields: question, sessionId',
        answer: 'Please provide both a question and session ID.',
        citations: [],
        sessionId: sessionId || 'unknown'
      });
    }

    // Check for sensitive information
    if (containsSensitiveInfo(question)) {
      return res.status(400).json({
        error: "I noticed your question may contain personal information like Social Security Numbers or case numbers. For your privacy and security, please rephrase your question without including any personal identifiers. I'm here to help with general policy guidance!",
        answer: "For your privacy and security, please rephrase your question without including personal identifiers like SSNs or case numbers.",
        citations: [],
        sessionId
      });
    }

    // Search for relevant policy chunks using direct SQL query
    // This replaces the search_policies function to avoid database function dependencies
    let searchResults: SearchResult[] = [];
    try {
      searchResults = await sql<SearchResult[]>`
        SELECT
          c.id,
          c.document_id,
          c.content,
          c.section_title,
          c.chunk_index,
          d.title,
          d.source,
          d.source_url,
          ts_rank(c.search_vector, websearch_to_tsquery('english', ${question})) as rank
        FROM chunks c
        JOIN documents d ON c.document_id = d.id
        WHERE c.search_vector @@ websearch_to_tsquery('english', ${question})
          AND d.status = 'completed'
        ORDER BY rank DESC
        LIMIT 8
      `;

      // DEBUG: Log search results
      console.log('=== DATABASE SEARCH RESULTS ===');
      console.log('Number of results:', searchResults?.length || 0);
      console.log('Results:', JSON.stringify(searchResults, null, 2));
      console.log('================================');
    } catch (dbError) {
      console.error('Database search error:', dbError);
      // Return a friendly error instead of failing
      return res.status(200).json({
        answer: "I'm having trouble searching the policy database right now. Please try again in a moment. If the issue persists, contact your system administrator.\n\nThis is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.",
        citations: [],
        sessionId,
        error: 'Database search temporarily unavailable'
      });
    }

    // Handle no results case
    if (!searchResults || searchResults.length === 0) {
      console.log('=== NO RESULTS FOUND ===');
      console.log('Returning no results response');
      console.log('========================');

      const noResultsAnswer = "I couldn't find relevant policy guidance for your question. Please try rephrasing your question or contact your local child support office for specific guidance.\n\nThis is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.";

      // Try to log the interaction (but don't fail if logging fails)
      try {
        await sql`
          INSERT INTO chats (session_id, user_email, question, answer, citations)
          VALUES (${sessionId}, ${userEmail || null}, ${question}, ${noResultsAnswer}, ${JSON.stringify([])})
        `;
      } catch (logError) {
        console.error('Failed to log chat (no results):', logError);
      }

      return res.status(200).json({
        answer: noResultsAnswer,
        citations: [],
        sessionId
      });
    }

    // Build context from search results
    const context = searchResults
      .map((result) => {
        const sourceLabel = `${result.title}${result.section_title ? ' - ' + result.section_title : ''}`;
        return `[${sourceLabel}]
Source: ${result.source}
Content: ${result.content}
---`;
      })
      .join('\n\n');

    // Prepare citations for response
    const citations = searchResults.map((result, idx) => ({
      id: idx + 1,
      title: result.title,
      section: result.section_title || 'General',
      source: result.source,
      url: result.source_url || null,
    }));

    // System prompt for CSDAI
    const systemPrompt = `You are CSDAI — Child Support Directors Association Intelligence. ONLY answer from provided sources. When citing, use the actual document title and section from the context (e.g., "According to 2024 CSDA Attorney Sourcebook - Section 3a"). Never give legal advice. Never accept personal case details. End answers with: "This is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team."`;

    // Build user message based on response type
    const responseInstruction = responseType === 'detailed'
      ? 'Provide detailed step-by-step guidance.'
      : 'Provide a brief summary.';

    // Call Anthropic API with error handling
    let answer: string;
    try {
      console.log('=== CALLING ANTHROPIC API ===');
      console.log('Calling Anthropic API with model: claude-sonnet-4-20250514');
      console.log('Question:', question);
      console.log('Context length:', context.length);

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

      console.log('Anthropic API response received successfully');
      console.log('=============================');

      // Extract answer from Anthropic response
      answer = message.content[0].type === 'text'
        ? message.content[0].text
        : 'Unable to generate response';
    } catch (aiError) {
      // Detailed error logging
      console.error('=== ANTHROPIC API ERROR ===');
      console.error('Error type:', aiError instanceof Error ? aiError.constructor.name : typeof aiError);
      console.error('Error message:', aiError instanceof Error ? aiError.message : String(aiError));
      console.error('Full error object:', JSON.stringify(aiError, null, 2));

      if (aiError && typeof aiError === 'object' && 'status' in aiError) {
        console.error('API Status:', (aiError as any).status);
        console.error('API Error:', (aiError as any).error);
      }

      console.error('Model used:', 'claude-sonnet-4-20250514');
      console.error('API Key present:', !!process.env.ANTHROPIC_API_KEY);
      console.error('==========================');

      // Return search results with a fallback message
      answer = `I found relevant policy information but encountered an error generating a detailed response. Here are the key sources:\n\n${citations.map((c, i) => `${i + 1}. ${c.title} - ${c.section}`).join('\n')}\n\nPlease review these sources or try again. This is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.`;
    }

    // Try to log the interaction (but don't fail the response if logging fails)
    try {
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
    } catch (logError) {
      console.error('Failed to log chat:', logError);
      // Continue anyway - don't fail the user's request just because logging failed
    }

    // Return response
    const finalResponse = {
      answer,
      citations,
      sessionId
    };

    // DEBUG: Log final response
    console.log('=== FINAL RESPONSE ===');
    console.log('Answer length:', answer?.length || 0);
    console.log('Number of citations:', citations?.length || 0);
    console.log('Full response:', JSON.stringify(finalResponse, null, 2));
    console.log('======================');

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    // Always return a user-friendly error message
    return res.status(500).json({
      error: 'An unexpected error occurred',
      answer: 'I encountered an unexpected error while processing your question. Please try again. If the issue persists, contact your system administrator.\n\nThis is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.',
      citations: [],
      sessionId: req.body?.sessionId || 'unknown',
      technicalDetails: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
