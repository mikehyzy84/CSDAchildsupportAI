import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple logging utility
const isDevelopment = process.env.NODE_ENV !== 'production';
const log = {
  debug: (...args: any[]) => isDevelopment && console.log('[DEBUG]', ...args),
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};

// Log API key status in development only (never log keys in production)
if (isDevelopment) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  log.debug('Anthropic API Key check:', apiKey ? `${apiKey.substring(0, 10)}... (${apiKey.length} chars)` : 'NOT FOUND');
  log.debug('Model to be used: claude-sonnet-4-20250514');
}

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
  responseType?: 'summary' | 'detailed' | 'voice';
  answer?: string; // For voice mode - pre-generated answer
  skipGeneration?: boolean; // Skip AI generation, just save the conversation
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

  // Validate required environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    log.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({
      error: 'Server configuration error',
      answer: 'The server is not properly configured. Please contact your system administrator.',
      citations: [],
      sessionId: 'unknown'
    });
  }

  if (!process.env.DATABASE_URL) {
    log.error('DATABASE_URL is not set');
    return res.status(500).json({
      error: 'Server configuration error',
      answer: 'The server is not properly configured. Please contact your system administrator.',
      citations: [],
      sessionId: 'unknown'
    });
  }

  try {
    const {
      question,
      userEmail,
      sessionId,
      responseType = 'summary',
      answer: providedAnswer,
      skipGeneration = false
    } = req.body as ChatRequest;

    // DEBUG: Log incoming request (development only)
    log.debug('=== CHAT API REQUEST ===');
    log.debug('Question received:', question);
    log.debug('Session ID:', sessionId);
    log.debug('User email:', userEmail);
    log.debug('Response type:', responseType);
    log.debug('========================');

    // Validate required fields
    if (!question || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields: question, sessionId',
        answer: 'Please provide both a question and session ID.',
        citations: [],
        sessionId: sessionId || 'unknown'
      });
    }

    // If skipGeneration is true, just save the provided answer and return
    if (skipGeneration && providedAnswer) {
      try {
        await sql`
          INSERT INTO chats (session_id, user_email, question, answer, citations)
          VALUES (
            ${sessionId},
            ${userEmail || null},
            ${question},
            ${providedAnswer},
            ${JSON.stringify([])}
          )
        `;

        return res.status(200).json({
          answer: providedAnswer,
          citations: [],
          sessionId,
          saved: true
        });
      } catch (logError) {
        log.error('Failed to save voice interaction:', logError);
        return res.status(500).json({
          error: 'Failed to save conversation',
          sessionId
        });
      }
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
        SELECT DISTINCT ON (d.id)
          COALESCE(c.id::text, d.id::text || '-doc') as id,
          d.id as document_id,
          COALESCE(c.content, d.title || E'\n\nSection: ' || COALESCE(d.section, 'N/A') || E'\n\nThis document is available. Search for specific topics within this document for more detailed information.') as content,
          COALESCE(c.section_title, d.section, 'General') as section_title,
          COALESCE(c.chunk_index, 0) as chunk_index,
          d.title,
          d.source,
          d.source_url,
          CASE
            WHEN d.section ILIKE '%fresno%' OR d.title ILIKE '%fresno%' OR d.source ILIKE '%fresno%' THEN 1.0
            WHEN d.section ILIKE '%los angeles%' OR d.title ILIKE '%los angeles%' OR d.source ILIKE '%los angeles%' THEN 1.0
            WHEN d.section ILIKE '%san diego%' OR d.title ILIKE '%san diego%' OR d.source ILIKE '%san diego%' THEN 1.0
            WHEN c.search_vector IS NOT NULL THEN ts_rank(c.search_vector, websearch_to_tsquery('english', ${question}))
            ELSE 0.5
          END as rank
        FROM documents d
        LEFT JOIN chunks c ON c.document_id = d.id
        WHERE (
          (c.search_vector IS NOT NULL AND c.search_vector @@ websearch_to_tsquery('english', ${question}))
          OR c.content ILIKE '%fresno%'
          OR c.content ILIKE '%los angeles%'
          OR c.content ILIKE '%san diego%'
          OR d.section ILIKE '%fresno%'
          OR d.title ILIKE '%fresno%'
          OR d.source ILIKE '%fresno%'
          OR d.section ILIKE '%los angeles%'
          OR d.title ILIKE '%los angeles%'
          OR d.source ILIKE '%los angeles%'
          OR d.section ILIKE '%san diego%'
          OR d.title ILIKE '%san diego%'
          OR d.source ILIKE '%san diego%'
        )
        ORDER BY d.id, rank DESC
        LIMIT 20
      `;

      // DEBUG: Log database search results (development only)
      log.debug('=== DATABASE SEARCH RESULTS ===');
      log.debug('Number of results:', searchResults?.length || 0);
      log.debug('================================');
    } catch (dbError) {
      log.error('Database search error:', dbError);
      // Return a friendly error instead of failing
      return res.status(200).json({
        answer: "I'm having trouble searching the policy database right now. Please try again in a moment. If the issue persists, contact your system administrator.\n\nThis is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.",
        citations: [],
        sessionId,
        error: 'Database search temporarily unavailable'
      });
    }

    // Calculate confidence level based on number of results
    const confidence = searchResults.length >= 5 ? 'high' :
                      searchResults.length >= 2 ? 'medium' :
                      searchResults.length >= 1 ? 'low' : 'none';

    log.debug('Search confidence:', confidence, `(${searchResults.length} results)`);

    // Build context from search results with clear structure
    const context = searchResults.length > 0
      ? searchResults
          .map((result, idx) => {
            return `DOCUMENT ${idx + 1}: ${result.title}
Source: ${result.source}
Section: ${result.section_title || 'General'}

${result.content}

---`;
          })
          .join('\n\n')
      : 'No policy documents were retrieved from the database.';

    // Prepare citations for response
    const citations = searchResults.map((result, idx) => ({
      id: idx + 1,
      title: result.title,
      section: result.section_title || 'General',
      source: result.source,
      url: result.source_url || null,
    }));

    // System prompt - direct and assertive
    const systemPrompt = `You are ChildSupportIQ, the California Child Support Directors Association AI assistant. You help caseworkers, attorneys, and child support professionals with policy questions.

CRITICAL INSTRUCTIONS:

1. RETRIEVED DOCUMENTS ARE YOUR SOURCE OF TRUTH
   - Policy documents retrieved from the ChildSupportIQ knowledge base are provided below in <retrieved_sources>
   - READ THEM CAREFULLY and base your answer on their content
   - NEVER say "I don't have documents" or "I don't have information on this topic" if documents are present in <retrieved_sources>
   - The documents ARE your authoritative source - treat them as such

2. HOW TO USE RETRIEVED DOCUMENTS
   - If documents are from a specific county (e.g., "Section: Fresno County"), acknowledge that explicitly
   - Example: "According to Fresno County's Initial Pleading Practices..."
   - Quote or paraphrase the document content directly
   - Reference document titles when citing information

3. RESPONSE STYLE
   - Lead with the answer - be direct and actionable
   - Caseworkers need clear guidance, not hedging
   - If you have 1-4 relevant documents, that's ENOUGH - use them fully
   - Only mention limitations if the documents truly don't address the question
   - Format answers in clear paragraphs with inline citations like [Document Title]

4. WHEN DOCUMENTS DON'T FULLY ANSWER THE QUESTION
   - Use what's provided first
   - Then fill gaps with California child support law knowledge
   - Suggest specific follow-up searches if helpful

5. ALWAYS END WITH
   "This is policy guidance, not legal advice. Verify decisions with your supervisor or legal team."

Remember: If documents are in <retrieved_sources>, you HAVE the information. Use it confidently.`;

    // Build user message with XML structure (Anthropic best practice)
    const responseInstruction = responseType === 'detailed'
      ? 'Provide detailed step-by-step guidance.'
      : 'Provide a brief summary.';

    // Call Anthropic API with error handling - ALWAYS call regardless of chunk count
    let answer: string;
    try {
      log.debug('Calling Anthropic API with model: claude-sonnet-4-20250514');
      log.debug('Context length:', context.length);
      log.debug('Confidence level:', confidence);

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `USER QUESTION:
${question}

RETRIEVED POLICY DOCUMENTS (use these to answer):
${context}

${searchResults.length > 0
  ? `You have ${searchResults.length} relevant document(s) above. Read them and provide a substantive answer based on their content. ${responseInstruction}`
  : `No documents were found. Provide general California child support guidance and suggest specific searches.`}`
          }
        ]
      });

      log.debug('Anthropic API response received successfully');

      // Extract answer from Anthropic response
      answer = message.content[0].type === 'text'
        ? message.content[0].text
        : 'Unable to generate response';
    } catch (aiError) {
      // Log Anthropic API errors
      log.error('Anthropic API error:', aiError instanceof Error ? aiError.message : String(aiError));

      if (aiError && typeof aiError === 'object' && 'status' in aiError) {
        log.error('API Status:', (aiError as any).status);
      }

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
      log.error('Failed to log chat:', logError);
      // Continue anyway - don't fail the user's request just because logging failed
    }

    // Return response
    const finalResponse = {
      answer,
      citations,
      sessionId
    };

    // DEBUG: Log final response (development only)
    log.debug('Final response - Answer length:', answer?.length || 0, 'Citations:', citations?.length || 0);

    return res.status(200).json(finalResponse);

  } catch (error) {
    log.error('Chat API error:', error);
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
