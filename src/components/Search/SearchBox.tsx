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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your child support policy question... (e.g., 'How do I calculate support for joint custody?')"
            className="w-full h-32 px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Response Type:</span>
            <button
              type="button"
              onClick={() => setMode(mode === 'summary' ? 'steps' : 'summary')}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              {mode === 'summary' ? (
                <ToggleLeft className="h-5 w-5 text-blue-600" />
              ) : (
                <ToggleRight className="h-5 w-5 text-green-600" />
              )}
              <span className="text-sm font-medium">
                {mode === 'summary' ? 'Summary' : 'Step-by-Step Instructions'}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="ma-btn-primary px-8 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Example Queries */}
      {!query && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Example Queries:</h3>
          <div className="space-y-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="block w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-gray-700 hover:text-blue-700"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{example}</span>
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