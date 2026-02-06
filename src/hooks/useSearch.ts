import { useState, useCallback } from 'react';
import { searchPolicies, getQueryResponse } from '../utils/searchEngine';
import { Policy, SearchQuery } from '../types';

export const useSearch = () => {
  const [results, setResults] = useState<Policy[]>([]);
  const [queryResponse, setQueryResponse] = useState<SearchQuery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback((searchQuery: string, mode: 'summary' | 'steps' = 'summary') => {
    if (!searchQuery.trim()) {
      setResults([]);
      setQueryResponse(null);
      setIsLoading(false);
      return;
    }

    setQuery(searchQuery);
    setIsLoading(true);
    
    // Simulate API call with loading delay
    setTimeout(() => {
      const policies = searchPolicies(searchQuery);
      const response = getQueryResponse(searchQuery, mode);
      
      setResults(policies);
      setQueryResponse(response);
      setIsLoading(false);
    }, 800);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setQueryResponse(null);
    setIsLoading(false);
  };

  return {
    results,
    queryResponse,
    isLoading,
    query,
    search,
    clearSearch
  };
};