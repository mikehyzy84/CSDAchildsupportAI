import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = 3001;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

app.use(cors());
app.use(express.json());

// Mock Supabase functions for now
const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

const searchPoliciesWithEmbedding = async (embedding, limit = 10) => {
  // Mock data - replace with actual Supabase search
  return [
    {
      id: '1',
      title: 'Child Support Guidelines',
      source: 'Massachusetts',
      content: 'The 2023 Massachusetts Child Support Guidelines establish formulas for calculating child support obligations based on income, number of children, and parenting time. For two children, the base obligation is calculated using both parents\' combined available income.',
      similarity: 0.85
    },
    {
      id: '2', 
      title: 'OCSE Enforcement Procedures',
      source: 'Federal',
      content: 'Federal enforcement tools include wage garnishment, tax refund interception, passport denial for arrears over $2,500, and license suspension. States must attempt wage withholding before utilizing other enforcement remedies.',
      similarity: 0.78
    },
    {
      id: '5',
      title: 'Medical Support Requirements',
      source: 'Massachusetts',
      content: 'Parents are required to provide health insurance coverage for children when available at reasonable cost through employment or other group coverage. Reasonable cost is defined as coverage that does not exceed 5% of the gross income.',
      similarity: 0.72
    }
  ];
};

const generateSummary = async (query, policies) => {
  const context = policies.map((p, i) => `[${i + 1}] ${p.title} (${p.source}): ${p.content}`).join('\n\n');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert assistant for Massachusetts child support policy. Provide concise, accurate answers based on the provided policy documents. Always cite your sources using the format [1], [2], etc. corresponding to the numbered documents provided.'
        },
        {
          role: 'user',
          content: `Based on the following policy documents, answer this question: "${query}"\n\nPolicy Documents:\n${context}`
        }
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

const generateSuggestions = async (query, policies) => {
  const context = policies.map(p => `${p.title}: ${p.content.substring(0, 100)}...`).join('\n');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate 3-5 related follow-up questions based on the user query and available policies. Return only the questions, one per line.'
        },
        {
          role: 'user',
          content: `Original query: ${query}\nAvailable policies: ${context}\n\nGenerate related questions:`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content.split('\n').filter(q => q.trim()).slice(0, 5);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
};

app.post('/api/ai/policy', async (req, res) => {
  const request_id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`[${request_id}] AI Policy API called`);

  try {
    const { query, mode = 'search' } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        citations: [],
        suggestions: [],
        error: 'Query parameter is required and must be a string',
        request_id,
      });
    }

    console.log(`[${request_id}] Processing query: "${query}" with mode: ${mode}`);

    // Generate embedding for the query
    let embedding;
    try {
      embedding = await generateEmbedding(query);
    } catch (error) {
      console.error(`[${request_id}] Error generating embedding:`, error);
      return res.status(500).json({
        citations: [],
        suggestions: [],
        error: 'Failed to process query. Please try again.',
        request_id,
      });
    }

    // Search for similar policies
    let policies;
    try {
      policies = await searchPoliciesWithEmbedding(embedding, 10);
      console.log(`[${request_id}] Found ${policies.length} matching policies`);
    } catch (error) {
      console.error(`[${request_id}] Error searching policies:`, error);
      return res.status(500).json({
        citations: [],
        suggestions: [],
        error: 'Database search failed. Please try again.',
        request_id,
      });
    }

    if (policies.length === 0) {
      return res.status(200).json({
        citations: [],
        suggestions: [],
        error: 'No relevant policies found for your query. Try rephrasing or using different keywords.',
        request_id,
      });
    }

    // Format citations
    const citations = policies.map(policy => ({
      id: policy.id,
      title: policy.title,
      source: policy.source,
      excerpt: policy.content.substring(0, 200) + '...',
      similarity: policy.similarity || 0,
    }));

    // Handle different modes
    switch (mode) {
      case 'search':
        return res.status(200).json({
          citations,
          suggestions: [],
          request_id,
        });

      case 'summary':
        try {
          const answer = await generateSummary(query, policies);
          return res.status(200).json({
            answer,
            citations,
            suggestions: [],
            request_id,
          });
        } catch (error) {
          console.error(`[${request_id}] Error generating summary:`, error);
          return res.status(500).json({
            citations,
            suggestions: [],
            error: 'Failed to generate summary. Please try again.',
            request_id,
          });
        }

      case 'suggest':
        try {
          const suggestions = await generateSuggestions(query, policies);
          return res.status(200).json({
            citations,
            suggestions,
            request_id,
          });
        } catch (error) {
          console.error(`[${request_id}] Error generating suggestions:`, error);
          return res.status(200).json({
            citations,
            suggestions: [],
            request_id,
          });
        }

      default:
        return res.status(400).json({
          citations: [],
          suggestions: [],
          error: 'Invalid mode. Supported modes: search, summary, suggest',
          request_id,
        });
    }
  } catch (error) {
    console.error(`[${request_id}] Unexpected error:`, error);
    
    // Check for rate limit errors
    if (error instanceof Error && error.message.includes('rate limit')) {
      return res.status(429).json({
        citations: [],
        suggestions: [],
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        request_id,
      });
    }

    return res.status(500).json({
      citations: [],
      suggestions: [],
      error: 'An unexpected error occurred. Please try again.',
      request_id,
    });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});