import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchQuery } from '../../types';
import ReactMarkdown from 'react-markdown';

interface Citation {
  id: number;
  title: string;
  section: string;
  source: string;
  url: string | null;
}

interface SearchResultsProps {
  queryResponse: SearchQuery | null;
  citations: Citation[];
  searchMode: 'summary' | 'steps';
  searchQuery: string;
  isLoading?: boolean;
  error?: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  queryResponse,
  citations,
  searchMode,
  searchQuery,
  isLoading = false,
  error = null
}) => {
  const [expandedCitation, setExpandedCitation] = useState<number | null>(null);
  const [hoveredResponse, setHoveredResponse] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = async (type: 'up' | 'down') => {
    setFeedback(type);
    // TODO: Call feedback API endpoint
    // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ chatId, feedback: type }) });
  };

  const toggleCitation = (id: number) => {
    setExpandedCitation(expandedCitation === id ? null : id);
  };

  // Show error state
  if (error) {
    return (
      <div className="animate-fade-up">
        <div className="max-w-2xl ml-auto bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Search Error</h3>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-2">Please try again or rephrase your question.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state with typing indicator
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* User Question Bubble */}
        {searchQuery && (
          <div className="flex justify-end animate-fade-up">
            <div className="max-w-2xl bg-csdai-navy text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
              <p className="text-sm leading-relaxed">{searchQuery}</p>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        <div className="flex justify-start animate-fade-up">
          <div className="max-w-2xl bg-white border-l-4 border-csdai-sky rounded-lg px-5 py-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-csdai-sky rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-csdai-sky rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-csdai-sky rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-gray-600">Searching policies...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!queryResponse && (!citations || citations.length === 0)) {
    return (
      <div className="text-center py-12 animate-fade-up">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600">
          Try refining your search terms or check the example queries for guidance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Question Bubble */}
      {searchQuery && (
        <div className="flex justify-end animate-fade-up">
          <div className="max-w-2xl bg-csdai-navy text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
            <p className="text-sm leading-relaxed">{searchQuery}</p>
          </div>
        </div>
      )}

      {/* AI Response Card */}
      {queryResponse && (
        <div
          className="flex justify-start animate-fade-up"
          onMouseEnter={() => setHoveredResponse(true)}
          onMouseLeave={() => setHoveredResponse(false)}
        >
          <div className="max-w-3xl w-full bg-white border-l-4 border-csdai-sky rounded-lg px-6 py-5 shadow-sm">
            {/* Response Type Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-csdai-sky bg-csdai-sky/10 px-2 py-1 rounded">
                {searchMode === 'summary' ? 'Summary' : 'Step-by-Step'}
              </span>

              {/* Feedback Buttons - Show on Hover */}
              <div className={`flex items-center space-x-2 transition-opacity duration-200 ${hoveredResponse || feedback ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={() => handleFeedback('up')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === 'up'
                      ? 'bg-green-100 text-green-600'
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback('down')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === 'down'
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-4">
              <ReactMarkdown>{queryResponse.summary}</ReactMarkdown>
            </div>

            {/* Citation Pills */}
            {citations && citations.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Sources ({citations.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {citations.map((citation) => (
                    <div key={citation.id} className="w-full sm:w-auto">
                      <button
                        onClick={() => toggleCitation(citation.id)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-csdai-emerald/10 text-csdai-emerald rounded-full text-xs font-medium hover:bg-csdai-emerald/20 transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        <span>[{citation.id}] {citation.title.slice(0, 30)}{citation.title.length > 30 ? '...' : ''}</span>
                        {expandedCitation === citation.id ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>

                      {/* Expanded Citation Card */}
                      {expandedCitation === citation.id && (
                        <div className="mt-2 p-4 bg-csdai-emerald/5 border border-csdai-emerald/20 rounded-lg animate-fade-up">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900">{citation.title}</h4>
                          </div>
                          {citation.section && (
                            <p className="text-xs text-gray-600 mb-2">
                              <span className="font-medium">Section:</span> {citation.section}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mb-2">
                            <span className="font-medium">Source:</span> {citation.source}
                          </p>
                          {citation.url && (
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs text-csdai-sky hover:text-csdai-sky/80 font-medium"
                            >
                              <span>View full document</span>
                              <span>→</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-csdai-amber">
                <strong>Note:</strong> This is general policy guidance, not legal advice. Verify decisions with your supervisor or legal team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
