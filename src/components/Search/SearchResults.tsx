import React from 'react';
import { AlertCircle, ExternalLink, Building } from 'lucide-react';
import { SearchQuery, Policy } from '../../types';
import PolicyCard from './PolicyCard';

interface SearchResultsProps {
  queryResponse: SearchQuery | null;
  policies: Policy[];
  searchMode: 'summary' | 'steps';
  searchQuery: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  queryResponse,
  policies,
  searchMode,
  searchQuery
}) => {
  if (!queryResponse && policies.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600">
          Try refining your search terms or check the example queries for guidance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Query Response */}
      {queryResponse && (
        <div className="ma-card p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {searchMode === 'summary' ? 'Policy Summary' : 'Step-by-Step Instructions'}
              </h2>
              
              {searchMode === 'summary' ? (
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 leading-relaxed">{queryResponse.summary}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queryResponse.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Always consult the full policy documents below for complete details and current procedures.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Results */}
      {policies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Relevant Policies ({policies.length})
            </h2>
            <div className="text-sm text-gray-500">
              Sorted by relevance
            </div>
          </div>
          
          <div className="space-y-4">
            {policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="ma-card p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://childsup.ca.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3 bg-white rounded border hover:border-blue-300 transition-colors duration-200"
          >
            <ExternalLink className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">CA Child Support Services</div>
              <div className="text-sm text-gray-600">Official California DCSS portal</div>
            </div>
          </a>
          
          <a
            href="https://www.acf.hhs.gov/css"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3 bg-white rounded border hover:border-blue-300 transition-colors duration-200"
          >
            <Building className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">Federal OCSE Resources</div>
              <div className="text-sm text-gray-600">Federal guidance and tools</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;