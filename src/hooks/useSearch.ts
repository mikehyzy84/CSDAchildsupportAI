import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SearchQuery } from '../types';

interface Citation {
  id: number;
  title: string;
  section: string;
  source: string;
  url: string | null;
}

interface ChatResponse {
  answer: string;
  citations: Citation[];
  sessionId: string;
}

export const useSearch = () => {
  const { user } = useAuth();
  const [queryResponse, setQueryResponse] = useState<SearchQuery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => {
    // Generate or retrieve session ID
    const stored = sessionStorage.getItem('chat_session_id');
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('chat_session_id', newId);
    return newId;
  });

  const search = useCallback(async (searchQuery: string, mode: 'summary' | 'steps' = 'summary') => {
    if (!searchQuery.trim()) {
      setQueryResponse(null);
      setIsLoading(false);
      return;
    }

    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);

    try {
      // Map mode to responseType
      const responseType = mode === 'summary' ? 'summary' : 'detailed';

      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: searchQuery,
          userEmail: user?.email || 'anonymous@example.com',
          sessionId: sessionId,
          responseType: responseType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data: ChatResponse = await response.json();

      // Transform the response into SearchQuery format
      const searchQueryResponse: SearchQuery = {
        summary: data.answer,
        steps: mode === 'steps' ? data.answer.split('\n').filter(line => line.trim()) : [],
        relevant_policies: data.citations.map(c => c.title),
      };

      setQueryResponse(searchQueryResponse);
      setIsLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, [user, sessionId]);

  const clearSearch = () => {
    setQuery('');
    setQueryResponse(null);
    setIsLoading(false);
    setError(null);
  };

  return {
    queryResponse,
    isLoading,
    query,
    search,
    clearSearch,
    error,
  };
};
