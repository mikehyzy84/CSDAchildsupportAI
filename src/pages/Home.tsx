import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/Search/SearchBox';
import { useSearch } from '../hooks/useSearch';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useSearch();

  const handleSearch = (query: string, mode: 'summary' | 'steps') => {
    // Navigate to SearchResults page - it will handle the API call via useEffect
    navigate(`/search?q=${encodeURIComponent(query)}&mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Hero Section - Simplified */}
        <div className="text-center mb-10">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Search federal and state child support policies, guidelines, and procedures.
            Get intelligent summaries with policy citations to help you provide accurate guidance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-csdai-sky/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Natural language queries return relevant policies with highlighted matches
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-csdai-emerald/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Summaries & Steps</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Choose between quick summaries or detailed step-by-step instructions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-csdai-sky/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Team Annotations</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Add notes and share knowledge with your team for better case management
            </p>
          </div>
        </div>

        {/* Search Interface - Prominent Placement */}
        <div className="flex justify-center mb-16">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-csdai-sky mb-1">50+</div>
            <div className="text-sm text-gray-600">California Counties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-csdai-emerald mb-1">5,000+</div>
            <div className="text-sm text-gray-600">Policy Documents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-csdai-sky mb-1">1,200+</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-csdai-emerald mb-1">24/7</div>
            <div className="text-sm text-gray-600">Access Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
