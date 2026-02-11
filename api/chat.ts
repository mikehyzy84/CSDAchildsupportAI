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
        WHERE (
          c.search_vector @@ websearch_to_tsquery('english', ${question})
          OR to_tsvector('english', COALESCE(d.section, '')) @@ websearch_to_tsquery('english', ${question})
          OR to_tsvector('english', d.title) @@ websearch_to_tsquery('english', ${question})
          OR to_tsvector('english', d.source) @@ websearch_to_tsquery('english', ${question})
        )
        AND d.status = 'completed'
        ORDER BY rank DESC
        LIMIT 8
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

    // Build context from search results (or indicate no results)
    const context = searchResults.length > 0
      ? searchResults
          .map((result) => {
            const sourceLabel = `${result.title}${result.section_title ? ' - ' + result.section_title : ''}`;
            return `[${sourceLabel}]
Source: ${result.source}
Content: ${result.content}
---`;
          })
          .join('\n\n')
      : 'No matching policy documents found in database';

    // Prepare citations for response
    const citations = searchResults.map((result, idx) => ({
      id: idx + 1,
      title: result.title,
      section: result.section_title || 'General',
      source: result.source,
      url: result.source_url || null,
    }));

    // System prompt for CSDAI - confidence-aware and always helpful
    const systemPrompt = `You are CSDAI (Child Support Directors Association Intelligence), an AI assistant helping California child support caseworkers find accurate policy guidance.

Your role: Answer questions using California Family Code, federal regulations (Title IV-D, UIFSA), and DCSS policies. Provide citations for all factual claims.

RESPONSE GUIDELINES:

When you have strong source material (5+ documents):
- Answer comprehensively and authoritatively
- Cite every factual claim with [California Family Code § X] or [OCSE Handbook] format
- Use the exact language from statutes when quoting legal text
- Be thorough - caseworkers need complete guidance

When you have limited source material (1-4 documents):
- Use what you have but acknowledge limitations
- Say: "Based on the limited sources I found..."
- Still cite what you use
- Suggest related searches they should try

When you have no matching sources:
- DO NOT refuse to answer
- DO NOT say "I cannot help with that"
- Instead say: "I don't have specific policy documents on this topic in my database yet."
- Use your knowledge of CA child support law to explain the topic
- Suggest specific searches: "Try searching for 'Family Code § 4055' or 'DCSS income withholding policy'"
- Be conversational: "I think you're asking about X. Here's what I know..."

Why this matters: Caseworkers make critical decisions affecting children and families. They need both accuracy AND helpfulness. Being unhelpful when they have a question is worse than acknowledging uncertainty while providing context.

Output format: Clear paragraphs with inline citations [Source]. If uncertain about anything, explicitly say so. Always end with: "This is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team."`;

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
            content: `<question>
${question}
</question>

<retrieved_sources>
${context}
</retrieved_sources>

<search_confidence>${confidence}</search_confidence>

${responseInstruction}`
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
