import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SearchResultsComponent from '../components/Search/SearchResults';
import AIPanel from '../components/Search/AIPanel';
import { useSearch } from '../hooks/useSearch';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const mode = (searchParams.get('mode') as 'summary' | 'steps') || 'summary';
  
  const { citations, queryResponse, isLoading, search, error } = useSearch();
  const [searchMode, setSearchMode] = useState<'summary' | 'steps'>(mode);

  useEffect(() => {
    if (query) {
      search(query, mode);
      setSearchMode(mode);
    }
  }, [query, mode, search]);

  const handleSuggestionClick = (suggestion: string) => {
    search(suggestion, searchMode);
    const newUrl = `/search?q=${encodeURIComponent(suggestion)}&mode=${searchMode}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </Link>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            <span className="font-medium">Query:</span> "{query}"
          </p>
          <p className="text-sm text-gray-500">
            Showing results in {searchMode === 'summary' ? 'summary' : 'step-by-step'} mode
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Search Results */}
        <div className="lg:col-span-2">
          <SearchResultsComponent
            queryResponse={queryResponse}
            citations={citations}
            searchMode={searchMode}
            searchQuery={query}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* AI Panel Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <AIPanel 
              query={query} 
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;