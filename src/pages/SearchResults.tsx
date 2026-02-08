import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import MessageList from '../components/messages/MessageList';
import { useSearch } from '../hooks/useSearch';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Array<{
    id: number;
    title: string;
    section: string;
    source: string;
    url: string | null;
  }>;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const mode = (searchParams.get('mode') as 'summary' | 'steps') || 'summary';

  const { citations, queryResponse, isLoading, search, error } = useSearch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  // Handle search completion
  useEffect(() => {
    if (queryResponse && currentQuery) {
      // Add user message if not already added
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.content !== currentQuery) {
        const newUserMessage: Message = {
          type: 'user',
          content: currentQuery,
          timestamp: new Date(),
        };

        const newAIMessage: Message = {
          type: 'assistant',
          content: queryResponse.summary || 'No response received.',
          timestamp: new Date(),
          citations: citations,
        };

        setMessages((prev) => [...prev, newUserMessage, newAIMessage]);
      }
      setCurrentQuery('');
    }
  }, [queryResponse, citations]);

  // Handle error
  useEffect(() => {
    if (error && currentQuery) {
      const newUserMessage: Message = {
        type: 'user',
        content: currentQuery,
        timestamp: new Date(),
      };

      const errorMessage: Message = {
        type: 'assistant',
        content: `I encountered an error: ${error}. Please try rephrasing your question.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage, errorMessage]);
      setCurrentQuery('');
    }
  }, [error]);

  const handleSearch = (query: string) => {
    if (!query.trim() || isLoading) return;

    setCurrentQuery(query);
    setInputValue('');
    search(query, mode);

    // Update URL
    setSearchParams({ q: query, mode });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  const handleStarterClick = (question: string) => {
    handleSearch(question);
  };

  return (
    <div className="relative min-h-screen bg-slate">
      {/* Messages Container */}
      <div className="pb-32">
        <MessageList messages={messages} onStarterClick={handleStarterClick} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="max-w-[800px] mx-auto px-6">
            <div className="flex justify-start w-full mb-6">
              <div
                className="bg-white rounded-lg p-5 max-w-[85%]"
                style={{
                  borderLeft: '4px solid #0EA5E9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Input Area */}
      <div
        className="fixed bottom-0 right-0 bg-white z-40 lg:left-[280px] left-0"
        style={{
          borderTop: '1px solid #E2E8F0',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <div className="max-w-[800px] mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about child support policy..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-[15px]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-5 py-3 bg-teal text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              Send
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            CSDAI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
