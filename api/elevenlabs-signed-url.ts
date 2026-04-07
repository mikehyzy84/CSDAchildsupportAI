/**
 * /api/elevenlabs-signed-url — Voice chat session bootstrap (POST)
 *
 * The frontend calls this before starting a voice conversation. It contacts
 * the ElevenLabs API with our server-side credentials and returns a short-lived
 * signed URL that the browser can use to open a WebSocket session — without
 * ever seeing the API key or agent ID.
 *
 * Connects to: ElevenLabs REST API (ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID)
 *
 * Gotchas:
 *  - Runs on the Vercel Edge Runtime (not Node), so no access to Node built-ins.
 *  - Signed URLs expire quickly; the frontend should call this right before
 *    connecting, not ahead of time.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
};

interface SignedUrlResponse {
  signedUrl: string;
}

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (!agentId) {
    return new Response(
      JSON.stringify({ error: 'ELEVENLABS_AGENT_ID not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/conversation/get_signed_url',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get signed URL from ElevenLabs' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data: SignedUrlResponse = await response.json();

    return new Response(JSON.stringify({ signedUrl: data.signedUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
