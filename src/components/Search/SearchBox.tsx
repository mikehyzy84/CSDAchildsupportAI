import React, { useState } from 'react';
import { Search, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string, mode: 'summary' | 'steps') => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<'summary' | 'steps'>('summary');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), mode);
    }
  };

  const exampleQueries = [
    "What are the California CSDA best practices for child support calculation?",
    "How should interstate cases be managed under UIFSA?",
    "What are the California recommended enforcement strategies?",
    "How do I implement effective California modification procedures?",
    "What California technology standards should we follow?"
  ];

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    onSearch(exampleQuery, mode);
  };

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Search Input */}
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about child support policies... (e.g., 'How do I calculate support for joint custody?')"
            className="w-full h-36 px-5 py-4 pr-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg shadow-sm bg-white transition-shadow hover:shadow-md"
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </div>

        {/* Mode Toggle & Search Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">Response Type:</span>
            <button
              type="button"
              onClick={() => setMode(mode === 'summary' ? 'steps' : 'summary')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            >
              {mode === 'summary' ? (
                <ToggleLeft className="h-5 w-5 text-blue-600" />
              ) : (
                <ToggleRight className="h-5 w-5 text-green-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {mode === 'summary' ? 'Summary' : 'Step-by-Step'}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-8 py-2.5 bg-[#14558f] text-white rounded-lg hover:bg-[#0f4270] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              'Search Policies'
            )}
          </button>
        </div>
      </form>

      {/* Example Queries - Subtle Style */}
      {!query && (
        <div className="mt-10">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Example questions:</h3>
          <div className="space-y-2.5">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="block w-full text-left px-4 py-3 bg-white/50 border border-gray-100 rounded-lg hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all text-gray-600 hover:text-blue-600 text-sm"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span className="leading-relaxed">{example}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;