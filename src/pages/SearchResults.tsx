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
  
  const { results, queryResponse, isLoading, search, error } = useSearch();
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
          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="ma-card p-6">
                <div className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="ma-card p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="h-9 bg-gray-200 rounded w-32"></div>
                      <div className="h-9 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="ma-card p-6 bg-red-50 border-l-4 border-red-400">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Search Error
                  </h3>
                  <p className="text-red-800 mb-4">
                    {error}
                  </p>
                  <p className="text-sm text-red-700">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <SearchResultsComponent
              queryResponse={queryResponse}
              policies={results}
              searchMode={searchMode}
              searchQuery={query}
            />
          )}
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